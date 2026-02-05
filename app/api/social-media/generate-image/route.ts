import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-server";
import genAI, { GEMINI_MODEL } from "@/lib/gemini";
import connectDB from "@/lib/mongodb";
import Campaign from "@/lib/models/Campaign";
import SocialMediaPost from "@/lib/models/SocialMediaPost";
import mongoose from "mongoose";

export const maxDuration = 300;

async function uploadToKingHost(buffer: Buffer, mimeType: string, fileName: string): Promise<string> {
  const uploadUrl = process.env.KINGHOST_UPLOAD_URL;
  const apiSecret = process.env.KINGHOST_API_SECRET;

  if (!uploadUrl || !apiSecret) {
    throw new Error('Configuração de upload ausente');
  }

  const uint8 = new Uint8Array(buffer);
  const blob = new Blob([uint8], { type: mimeType });
  const file = new File([blob], fileName, { type: mimeType });

  const formData = new FormData();
  formData.append('file', file);
  formData.append('token', apiSecret);
  formData.append('folder', 'social-media');

  const uploadResponse = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  });

  if (!uploadResponse.ok) {
    const errorText = await uploadResponse.text();
    console.error("Erro KingHost:", errorText);
    throw new Error(`Falha ao fazer upload: ${uploadResponse.statusText}`);
  }

  const uploadResult = await uploadResponse.json();

  if (!uploadResult.url) {
    throw new Error('URL da imagem não foi retornada pelo servidor');
  }

  return uploadResult.url;
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 401 });
    }

    const body = await request.json();
    const { images, context, campaignId, additionalPrompt, isCarousel, carouselCount } = body;

    if (!images || images.length === 0) {
      return NextResponse.json({ error: "Nenhuma imagem fornecida." }, { status: 400 });
    }

    if (!context) {
      return NextResponse.json({ error: "Contexto não fornecido." }, { status: 400 });
    }

    let campaignContext = "";
    let previousPostsContext = "";
    let campaign: any = null;

    if (campaignId) {
      await connectDB();

      if (!mongoose.Types.ObjectId.isValid(campaignId)) {
        return NextResponse.json(
          { error: "ID de campanha inválido." },
          { status: 400 }
        );
      }

      campaign = await Campaign.findOne({
        _id: campaignId,
        deletedAt: null
      }).lean();

      if (!campaign) {
        return NextResponse.json(
          { error: "Campanha não encontrada." },
          { status: 404 }
        );
      }

      if (campaign.theme) {
        campaignContext = `\n\nTEMA DA CAMPANHA:\n${campaign.theme}`;
      }

      if (campaign.tone) {
        const toneDescriptions: Record<string, string> = {
          educational: 'educativo e didático',
          informational: 'informativo e objetivo',
          promotional: 'promocional e persuasivo',
          inspirational: 'inspirador e motivacional',
          entertaining: 'divertido e descontraído',
          professional: 'profissional e corporativo',
          casual: 'casual e amigável'
        };

        const toneDesc = toneDescriptions[campaign.tone] || campaign.tone;
        campaignContext += `\nTOM/CUNHO: ${toneDesc.toUpperCase()}`;
      }

      const previousPosts = await SocialMediaPost.find({
        campaignId: campaignId,
        deletedAt: null,
        status: { $in: ['published', 'pending'] }
      })
        .sort({ createdAt: -1 })
        .limit(3)
        .lean();

      if (previousPosts.length > 0) {
        const postSummaries = previousPosts
          .reverse()
          .map((post, index) => {
            const parts = [];
            if (post.overlayText) parts.push(`Texto: "${post.overlayText}"`);
            if (post.description) parts.push(`Descrição: "${post.description.substring(0, 100)}..."`);
            if (post.context) parts.push(`Contexto: ${post.context}`);
            return `${index + 1}. ${parts.join(' | ')}`;
          })
          .join('\n');

        previousPostsContext = `\n\nPUBLICAÇÕES ANTERIORES NESTA CAMPANHA:\n${postSummaries}\n\nMantenha consistência de tom, estilo visual e mensagem com as publicações anteriores.`;
      }
    }

    //prompt do texto da imagem principal
    const textPrompt = `
        Você é um especialista em marketing de redes sociais.
        
        CONTEXTO DA PUBLICAÇÃO:
        ${context}${campaignContext}${previousPostsContext}
        ${additionalPrompt ? `\n\nINSTRUÇÕES ESPECÍFICAS DESTA PUBLICAÇÃO:\n${additionalPrompt}` : ''}
        
        TAREFA:
        Crie um texto MUITO CURTO (máximo 5-7 palavras) e impactante para sobrepor em uma imagem de rede social.
        O texto deve ser direto, chamativo e relacionado ao contexto fornecido.
        ${previousPostsContext ? 'Mantenha consistência com as publicações anteriores da campanha.' : ''}
        
        REGRAS OBRIGATÓRIAS:
        - Máximo 7 palavras
        - Sem pontuação no final
        - Linguagem direta e impactante
        - Em português do Brasil
        - Centro da tela
        ${campaignId && campaign?.customPromptText ? `\n        INSTRUÇÕES ADICIONAIS DO USUÁRIO:\n        ${campaign.customPromptText}` : ''}
        
        EXEMPLOS:
        - "Inovação que transforma o futuro"
        - "Tecnologia ao seu alcance"
        - "O futuro começa agora"
        
        Retorne APENAS o texto, sem aspas ou explicações.
        `;

    const textResult = await genAI.models.generateContent({
      model: GEMINI_MODEL,
      contents: textPrompt,
    });
    const overlayText = (textResult.text || "").trim().replace(/^["']|["']$/g, '');

    const imageParts = await Promise.all(images.map(async (img: string) => {
      let base64Data: string;
      let mimeType: string;

      if (img.startsWith('data:')) {
        base64Data = img.replace(/^data:image\/\w+;base64,/, "");
        const mimeMatch = img.match(/^data:(image\/\w+);base64,/);
        mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
      } else {
        const imageResponse = await fetch(img);
        if (!imageResponse.ok) {
          throw new Error(`Erro ao baixar imagem: ${img}`);
        }

        const arrayBuffer = await imageResponse.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        base64Data = buffer.toString('base64');

        const contentType = imageResponse.headers.get('content-type');
        mimeType = contentType || 'image/png';
      }

      return {
        inlineData: {
          mimeType: mimeType,
          data: base64Data
        }
      };
    }));

    const formatDescription = "formato retrato 4:5 (ideal para feed de Instagram)";

    //prompt da imagem principal
    const imagePrompt = `
        Crie uma imagem profissional para redes sociais mesclando as imagens fornecidas de forma criativa e harmoniosa.
        
        TEXTO PARA SOBREPOR NA IMAGEM:
        "${overlayText}"
        
        CONTEXTO:
        ${context}${campaignContext}${previousPostsContext}
        ${additionalPrompt ? `\n\nINSTRUÇÕES ESPECÍFICAS DESTA PUBLICAÇÃO:\n${additionalPrompt}` : ''}
        
        FORMATO:
        ${formatDescription}
        IMPORTANTE: A imagem DEVE ter proporção 4:5 (retrato vertical para Instagram).
        
        REQUISITOS OBRIGATÓRIOS:
        1. Mescle todas as imagens fornecidas em uma composição única e atraente
        2. Adicione o texto "${overlayText}" de forma DESTACADA e LEGÍVEL NO CENTRO DA IMAGEM, palavras não podem quebrar linhas
        3. Use tipografia moderna, profissional e em negrito
        4. O texto não deve ter cores que contrastem tanto com o fundo
        5. Layout otimizado para ${formatDescription} com proporção exata 4:5
        6. Design limpo, moderno e profissional
        7. O texto deve estar CLARAMENTE VISÍVEL e ser o elemento principal
        8. Use efeitos de sombra ou contorno no texto para melhorar a legibilidade
        ${previousPostsContext ? '9. Mantenha consistência visual com as publicações anteriores da campanha' : ''}
        ${campaign?.customPromptImage ? `\n        \n        INSTRUÇÕES ADICIONAIS DE DESIGN DO USUÁRIO:\n        ${campaign.customPromptImage}` : ''}
        `;

    const imageResult = await genAI.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        { text: imagePrompt },
        ...imageParts
      ],
      config: {
        responseModalities: ["TEXT", "IMAGE"],
        imageConfig: {
          aspectRatio: "4:5",
          imageSize: "1K"
        }
      }
    });

    let generatedImageBase64 = "";

    if (imageResult.candidates && imageResult.candidates.length > 0) {
      for (const part of imageResult.candidates[0].content?.parts || []) {
        if (part.inlineData) {
          generatedImageBase64 = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!generatedImageBase64) {
      throw new Error("Nenhuma imagem foi gerada pela IA");
    }

    const coverBase64Data = generatedImageBase64.split(',')[1];
    const coverMimeType = generatedImageBase64.match(/data:([^;]+);/)?.[1] || 'image/png';
    const coverBuffer = Buffer.from(coverBase64Data, 'base64');

    const coverUrl = await uploadToKingHost(coverBuffer, coverMimeType, `social-media-${Date.now()}.png`);

    // Carousel generation
    if (isCarousel && carouselCount && carouselCount > 1) {
      const slideCount = Math.min(Math.max(carouselCount - 1, 1), 9);

      //prompt para os textos se carrossel
      const splitResult = await genAI.models.generateContent({
        model: GEMINI_MODEL,
        contents: `
          Você é um professor especialista criando conteúdo educativo para um carrossel do Instagram.

          CONTEXTO DO ASSUNTO:
          ${context}${campaignContext}
          ${additionalPrompt ? `\nINSTRUÇÕES ADICIONAIS:\n${additionalPrompt}` : ''}

          TÍTULO DA CAPA:
          "${overlayText}"

          TAREFA:
          Crie exatamente ${slideCount} textos descritivos para os slides de conteúdo do carrossel.
          Cada slide deve ENSINAR algo específico sobre o assunto, como um mini-parágrafo informativo.
          Pense como se estivesse escrevendo uma legenda educativa para o Instagram.

          REGRAS OBRIGATÓRIAS:
          - Exatamente ${slideCount} textos
          - Cada texto deve ter entre 15 e 30 palavras (2-3 frases curtas)
          - Separe cada texto com a marca |||
          - Seja DESCRITIVO e EXPLICATIVO - não use frases genéricas ou vagas
          - Cada slide deve trazer um ponto diferente e complementar ao anterior
          - NÃO comece com o nome do tema (ex: NÃO faça "Microbiologia é...", "A IA pode...")
          - Comece direto com o conteúdo, variando a forma de iniciar cada texto
          - Em português do Brasil
          - Tom educativo e acessível

          EXEMPLO BOM (tema: benefícios da automação industrial):
          Sensores inteligentes monitoram a produção em tempo real, identificando falhas antes que causem paradas e prejuízos na linha.|||Ao substituir processos manuais repetitivos, as equipes focam em tarefas estratégicas que exigem criatividade e tomada de decisão.|||O controle preciso de cada etapa reduz o desperdício de matéria-prima em até 30%, otimizando custos e sustentabilidade.

          EXEMPLO RUIM:
          Automação industrial: sensores|||Automação: reduz processos manuais|||Benefícios: reduz desperdício

          Retorne APENAS os textos separados por |||, sem explicações extras.
        `,
      });

      const contentPoints = (splitResult.text || "")
        .trim()
        .split('|||')
        .map(part => part.trim().replace(/^[-•*\d.)\s]+/, '').trim())
        .filter(part => part.length > 0)
        .slice(0, slideCount);

      // Preencher com textos genéricos se necessário
      while (contentPoints.length < slideCount) {
        contentPoints.push(`Saiba mais sobre ${overlayText}`);
      }

      const carouselImages: string[] = [];
      const carouselOverlayTexts: string[] = [];
      const warnings: string[] = [];

      for (let i = 0; i < contentPoints.length; i++) {
        const slideText = contentPoints[i];
        let slideSuccess = false;

        for (let attempt = 0; attempt < 2 && !slideSuccess; attempt++) {
          try {
            //prompt para imagens se carrossel
            const slidePrompt = `
              Crie uma imagem profissional para um slide de carrossel do Instagram.why io

              TEXTO PARA SOBREPOR NA IMAGEM:
              "${slideText}"

              CONTEXTO:
              ${context}${campaignContext}

              FORMATO:
              Proporção 4:5 (retrato vertical para Instagram)

              IMAGENS FORNECIDAS:
              - Você receberá imagens, como fotos e logos para gerar uma mescla dessas imagens.
              - Caso mandado a logo da empresa AUFTEK, sempre será marca d'agua e deve estar alinhada no centro
              - A primeira imagem do carrossel é a capa e aparecerá a mescla das imagens com um texto na frente de título.
              - Demais imagens do carrossel seguirão um padrão.

              REQUISITOS OBRIGATÓRIOS PARA SLIDES DE CONTEÚDO (PÓS-CAPA):
              1. ESTILO: Minimalista, focado em legibilidade (Swiss Style).
              2. FUNDO: Estritamente cor sólida ou gradiente sutil, extraído das cores principais da CAPA fornecida. PROIBIDO o uso de fotos ou texturas complexas no fundo.
              3. TIPOGRAFIA: Use exatamente a mesma família tipográfica da capa. O texto deve ser grande e centralizado.
              4. CORES DO TEXTO: Se o texto da capa for branco, use branco. Se for preto, use preto. Mantenha 100% de consistência.
              5. ELEMENTOS VISUAIS: Use as imagens fornecidas apenas como pequenos ícones de apoio ou a logo como marca d'água centralizada e sutil.
              6. COMPOSIÇÃO: Espaço negativo amplo. O texto não deve encostar nas bordas.
              7. Use efeitos sutis de sombra apenas se necessário para garantir contraste absoluto com o fundo sólido.
              8. Use efeitos sutis de sombra apenas se necessário para garantir contraste absoluto com o fundo sólido.
              9. Não use fotos de fundo - apenas cores sólidas, ou padrões simples
              10. Inclua os logos/elementos fornecidos como marca d'água sutil
              11. USE O MESMO ESTILO (COR, CONTORNO) DE LETRA PARA TODOS OS PAINEIS
              ${campaign?.customPromptImage ? `\nINSTRUÇÕES DE DESIGN:\n${campaign.customPromptImage}` : ''}
            `;

            const slideResult = await genAI.models.generateContent({
              model: GEMINI_MODEL,
              contents: [
                { text: slidePrompt },
                {
                  inlineData: {
                    mimeType: coverMimeType,
                    data: coverBase64Data
                  }
                },
                ...imageParts
              ],
              config: {
                responseModalities: ["TEXT", "IMAGE"],
                imageConfig: {
                  aspectRatio: "4:5",
                  imageSize: "1K"
                }
              }
            });

            let slideImageBase64 = "";
            if (slideResult.candidates && slideResult.candidates.length > 0) {
              for (const part of slideResult.candidates[0].content?.parts || []) {
                if (part.inlineData) {
                  slideImageBase64 = part.inlineData.data || "";
                  break;
                }
              }
            }

            if (!slideImageBase64) {
              throw new Error(`Slide ${i + 2}: nenhuma imagem gerada`);
            }

            const slideBuffer = Buffer.from(slideImageBase64, 'base64');
            const slideUrl = await uploadToKingHost(slideBuffer, 'image/png', `social-media-carousel-${Date.now()}-${i + 2}.png`);

            carouselImages.push(slideUrl);
            carouselOverlayTexts.push(slideText);
            slideSuccess = true;
          } catch (slideError: unknown) {
            const errorMsg = slideError instanceof Error ? slideError.message : String(slideError);
            console.error(`Erro ao gerar slide ${i + 2} (tentativa ${attempt + 1}):`, errorMsg);
            if (attempt === 1) {
              warnings.push(`Slide ${i + 2} não pôde ser gerado`);
            }
          }
        }
      }

      return NextResponse.json({
        success: true,
        generatedImage: coverUrl,
        overlayText: overlayText,
        isCarousel: true,
        carouselImages,
        carouselOverlayTexts,
        message: warnings.length > 0
          ? `Carrossel gerado com ${carouselImages.length + 1} de ${carouselCount} slides. ${warnings.join('. ')}`
          : `Carrossel com ${carouselImages.length + 1} slides gerado com sucesso!`
      });
    }

    return NextResponse.json({
      success: true,
      generatedImage: coverUrl,
      overlayText: overlayText,
      message: "Imagem gerada e enviada com sucesso!"
    });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao processar com Gemini API." },
      { status: 500 }
    );
  }
}