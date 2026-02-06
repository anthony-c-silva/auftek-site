import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-server";
import genAI, { GEMINI_MODEL } from "@/lib/gemini";
import connectDB from "@/lib/mongodb";
import Campaign from "@/lib/models/Campaign";
import SocialMediaPost from "@/lib/models/SocialMediaPost";
import mongoose from "mongoose";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { ALLOWED_ASPECT_RATIOS, FORMAT_CONFIG, getFormatByAspectRatio } from "@/lib/format-config";

export const maxDuration = 300;

async function loadImageAsBase64(url: string): Promise<{ mimeType: string; data: string } | null> {
  try {
    const fullUrl = url.startsWith('/') ? `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${url}` : url;
    const response = await fetch(fullUrl);
    if (!response.ok) return null;

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = response.headers.get('content-type') || 'image/png';

    return {
      mimeType,
      data: buffer.toString('base64')
    };
  } catch (error) {
    console.error('Erro ao carregar imagem de estilo:', error);
    return null;
  }
}

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

async function overlayLogo(imageBuffer: Buffer): Promise<Buffer> {
  const logoPath = path.join(process.cwd(), 'public', 'styles', 'logo-watermark.svg');
  const logoSvg = fs.readFileSync(logoPath);

  const logoWidth = 150;
  const logoResized = await sharp(logoSvg)
    .resize({ width: logoWidth })
    .png()
    .toBuffer();

  const image = sharp(imageBuffer);
  const { width: imgWidth, height: imgHeight } = await image.metadata();

  if (!imgWidth || !imgHeight) {
    return imageBuffer;
  }

  const logoMeta = await sharp(logoResized).metadata();
  const logoHeight = logoMeta.height || 56;

  const left = Math.round((imgWidth - logoWidth) / 2);
  const top = imgHeight - logoHeight - 30;

  return image
    .composite([{
      input: logoResized,
      left,
      top,
    }])
    .png()
    .toBuffer();
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 401 });
    }

    const body = await request.json();
    const { context, campaignId, additionalPrompt, isCarousel, carouselCount, styleTemplate, aspectRatio: requestedAspectRatio } = body;

    const aspectRatio = ALLOWED_ASPECT_RATIOS.includes(requestedAspectRatio) ? requestedAspectRatio : '4:5';
    const postFormat = getFormatByAspectRatio(aspectRatio);
    const formatCfg = FORMAT_CONFIG[postFormat];

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

    const formatDescription = formatCfg.formatDescription;

    // Carregar imagens de estilo se template foi selecionado
    let styleContext = "";
    let styleCoverPart: { inlineData: { mimeType: string; data: string } } | null = null;
    const styleSlideParts: { inlineData: { mimeType: string; data: string } }[] = [];

    if (styleTemplate?.images) {
      // Carregar imagem de capa do estilo
      if (styleTemplate.images.cover) {
        const coverData = await loadImageAsBase64(styleTemplate.images.cover);
        if (coverData) {
          styleCoverPart = { inlineData: coverData };
        }
      }

      // Carregar imagens de slides do estilo
      if (styleTemplate.images.slides && styleTemplate.images.slides.length > 0) {
        for (const slideUrl of styleTemplate.images.slides) {
          const slideData = await loadImageAsBase64(slideUrl);
          if (slideData) {
            styleSlideParts.push({ inlineData: slideData });
          }
        }
      }

      styleContext = `
        ESTILO VISUAL DE REFERÊNCIA:
        Você receberá imagens de referência do estilo "${styleTemplate.name}".
        IMPORTANTE: Analise cuidadosamente estas imagens de referência e REPRODUZA o mesmo estilo visual:
        - Mesma paleta de cores
        - Mesmo estilo de tipografia (fonte, peso, tamanho relativo)
        - Mesma composição e layout
        - Mesmos elementos decorativos e efeitos visuais
        - Mesmo tratamento de fundo e gradientes
        A imagem gerada DEVE parecer parte da mesma série/campanha das imagens de referência.
      `;
    }

    //prompt da imagem principal
    const imagePrompt = `
        Crie uma imagem profissional para redes sociais.
        ${styleContext}
        TEXTO PARA SOBREPOR NA IMAGEM:
        "${overlayText}"

        CONTEXTO:
        ${context}${campaignContext}${previousPostsContext}
        ${additionalPrompt ? `\n\nINSTRUÇÕES ESPECÍFICAS DESTA PUBLICAÇÃO:\n${additionalPrompt}` : ''}

        FORMATO:
        ${formatDescription}
        IMPORTANTE: ${formatCfg.promptAspectNote}

        REQUISITOS OBRIGATÓRIOS:
        1. Crie uma composição visual atraente baseada no contexto fornecido
        2. Adicione o texto "${overlayText}" de forma DESTACADA e LEGÍVEL NO CENTRO DA IMAGEM (centralizado vertical e horizontalmente), palavras não podem quebrar linhas
        3. Use tipografia moderna, profissional e em negrito
        4. O texto não deve ter cores que contrastem tanto com o fundo
        5. Layout otimizado para ${formatDescription} com proporção exata ${aspectRatio}
        6. Design limpo, moderno e profissional
        7. O texto deve estar CLARAMENTE VISÍVEL e ser o elemento principal
        8. Use efeitos de sombra ou contorno no texto para melhorar a legibilidade
        9. NÃO inclua nenhum logo, marca d'água ou branding na imagem. O logo será adicionado automaticamente.
        10. MUITO IMPORTANTE: Os 15% inferiores da imagem DEVEM ficar LIVRES de texto, elementos importantes ou informações. Essa área será reservada para o logo da empresa. O texto NUNCA deve descer até a parte inferior da imagem.
        11. NÃO inclua setas, indicadores de navegação ou elementos de UI (como setas para "deslizar" ou "scroll"). A imagem deve ser apenas o conteúdo visual.
        ${previousPostsContext ? '12. Mantenha consistência visual com as publicações anteriores da campanha' : ''}
        ${campaign?.customPromptImage ? `\n        INSTRUÇÕES ADICIONAIS DE DESIGN DO USUÁRIO:\n        ${campaign.customPromptImage}` : ''}
        ${styleCoverPart ? '\n        IMAGEM DE REFERÊNCIA DE ESTILO: A primeira imagem após o prompt é o estilo visual a ser seguido.' : ''}
        `;

    const imageResult = await genAI.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        { text: imagePrompt },
        ...(styleCoverPart ? [styleCoverPart] : []),
      ],
      config: {
        responseModalities: ["TEXT", "IMAGE"],
        imageConfig: {
          aspectRatio,
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
    const coverRawBuffer = Buffer.from(coverBase64Data, 'base64');
    const coverBuffer = await overlayLogo(coverRawBuffer);

    const coverUrl = await uploadToKingHost(coverBuffer, 'image/png', `social-media-${Date.now()}.png`);

    // Carousel generation
    if (isCarousel && carouselCount && carouselCount > 1) {
      const slideCount = Math.min(Math.max(carouselCount - 1, 1), 9);

      //prompt para os textos se carrossel
      const splitResult = await genAI.models.generateContent({
        model: GEMINI_MODEL,
        contents: `
          Você é um comunicador criando conteúdo para um carrossel do Instagram.

          CONTEXTO DO ASSUNTO:
          ${context}${campaignContext}
          ${additionalPrompt ? `\nINSTRUÇÕES ADICIONAIS:\n${additionalPrompt}` : ''}

          TÍTULO DA CAPA:
          "${overlayText}"

          TAREFA:
          Crie exatamente ${slideCount} textos para os slides do carrossel.
          Escreva como se estivesse CONVERSANDO com alguém sobre o assunto.
          Cada slide deve fluir naturalmente, como uma explicação amigável.

          ESTILO DE ESCRITA:
          - Tom conversacional e acolhedor
          - Como se você estivesse explicando para um amigo
          - Frases naturais, não tópicos ou bullet points
          - Pode usar expressões como "Sabia que...", "O interessante é que...", "Na prática..."
          - Entre 15-25 palavras por slide
          - Cada slide aborda um aspecto diferente do tema

          REGRAS:
          - Exatamente ${slideCount} textos
          - Separe cada texto com a marca |||
          - Em português do Brasil
          - Não use formato de tópico/explicação
          - Não comece todos da mesma forma

          EXEMPLO BOM (tema: benefícios da automação industrial):
          Sabia que sensores inteligentes conseguem prever falhas antes mesmo delas acontecerem? Isso evita paradas inesperadas na produção.|||Com a automação cuidando das tarefas repetitivas, as equipes podem focar no que realmente importa: criar e inovar.|||O mais impressionante é a redução de desperdício. Algumas empresas já economizam até 30% em matéria-prima.

          EXEMPLO RUIM:
          Monitoramento: sensores detectam falhas|||Produtividade: automação libera equipes|||Economia: reduz desperdício em 30%

          Retorne APENAS os textos separados por |||.
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
            const slideStyleContext = styleSlideParts.length > 0 ? `
              ESTILO VISUAL DE REFERÊNCIA PARA SLIDES:
              Você receberá ${styleSlideParts.length} imagem(ns) de referência de estilo para slides.
              IMPORTANTE: Analise estas imagens e REPRODUZA EXATAMENTE o mesmo estilo visual:
              - Mesma paleta de cores de fundo
              - Mesmo estilo de tipografia
              - Mesma composição e layout
              - Mesmos elementos decorativos
              O slide gerado DEVE parecer parte da mesma série das imagens de referência.
            ` : '';

            const slidePrompt = `
              Crie uma imagem profissional para um slide de carrossel do Instagram.
              ${slideStyleContext}
              TEXTO PARA SOBREPOR NA IMAGEM:
              "${slideText}"

              CONTEXTO:
              ${context}${campaignContext}

              FORMATO:
              Proporção ${aspectRatio} (${formatCfg.formatDescription})

              ${styleSlideParts.length > 0 ? 'As primeiras imagens são REFERÊNCIAS DE ESTILO - siga este estilo visual exatamente.' : ''}

              REQUISITOS PARA O SLIDE:
              1. FUNDO: Cor sólida ou gradiente sutil das cores da CAPA. Sem fotos no fundo.
              2. TEXTO: Legível, bem distribuído, pode ocupar 2-4 linhas. Fonte da mesma família da capa. Posicione o texto NO CENTRO DA IMAGEM (centralizado vertical e horizontalmente).
              3. CORES: Consistentes com a capa (mesmas cores de texto).
              4. COMPOSIÇÃO: Espaço negativo amplo. O texto é o elemento principal.
              5. LEGIBILIDADE: Sombra sutil no texto se necessário para contraste.
              6. NÃO inclua nenhum logo, marca d'água ou branding na imagem. O logo será adicionado automaticamente.
              7. MUITO IMPORTANTE: Os 15% inferiores da imagem DEVEM ficar LIVRES de texto ou elementos importantes. Essa área será reservada para o logo da empresa.
              8. NÃO inclua setas, indicadores de navegação ou elementos de UI (como setas para "deslizar" ou "scroll"). A imagem deve ser apenas o conteúdo visual.
              ${campaign?.customPromptImage ? `\nINSTRUÇÕES DE DESIGN:\n${campaign.customPromptImage}` : ''}
            `;

            const slideResult = await genAI.models.generateContent({
              model: GEMINI_MODEL,
              contents: [
                { text: slidePrompt },
                ...styleSlideParts,
                {
                  inlineData: {
                    mimeType: coverMimeType,
                    data: coverBase64Data
                  }
                },
              ],
              config: {
                responseModalities: ["TEXT", "IMAGE"],
                imageConfig: {
                  aspectRatio,
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

            const slideRawBuffer = Buffer.from(slideImageBase64, 'base64');
            const slideBuffer = await overlayLogo(slideRawBuffer);
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