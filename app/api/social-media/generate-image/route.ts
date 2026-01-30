import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-server";
import genAI from "@/lib/gemini";
import connectDB from "@/lib/mongodb";
import Campaign from "@/lib/models/Campaign";
import SocialMediaPost from "@/lib/models/SocialMediaPost";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 401 });
    }

    const body = await request.json();
    const { images, context, campaignId, additionalPrompt } = body;

    if (!images || images.length === 0) {
      return NextResponse.json({ error: "Nenhuma imagem fornecida." }, { status: 400 });
    }

    if (!context) {
      return NextResponse.json({ error: "Contexto não fornecido." }, { status: 400 });
    }

    // Fetch campaign context if campaignId is provided
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

      // Fetch campaign
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

      // Check authorization
      if (campaign.authorId.toString() !== user._id.toString()) {
        return NextResponse.json(
          { error: "Você não tem permissão para acessar esta campanha." },
          { status: 403 }
        );
      }

      // Build campaign context
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

      // Fetch last 3 posts from this campaign for context continuity
      const previousPosts = await SocialMediaPost.find({
        campaignId: campaignId,
        deletedAt: null
      })
        .sort({ createdAt: -1 })
        .limit(3)
        .lean();

      if (previousPosts.length > 0) {
        const postSummaries = previousPosts
          .reverse() // Show oldest to newest
          .map((post, index) => `${index + 1}. Texto: "${post.overlayText}" | Contexto: ${post.context}`)
          .join('\n');

        previousPostsContext = `\n\nPUBLICAÇÕES ANTERIORES NESTA CAMPANHA:\n${postSummaries}\n\nMantenha consistência de tom e tema com as publicações anteriores.`;
      }
    }

    const aspectRatio = "4:5";

    const textModel = genAI.getGenerativeModel({ model: "gemini-3-pro-image-preview" });

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

    const textResult = await textModel.generateContent(textPrompt);
    const textResponse = await textResult.response;
    const overlayText = textResponse.text().trim().replace(/^["']|["']$/g, '');

    const imageModel = genAI.getGenerativeModel({
      model: "gemini-3-pro-image-preview"
    });

    // Process images - download URLs and convert to base64
    const imageParts = await Promise.all(images.map(async (img: string) => {
      let base64Data: string;
      let mimeType: string;

      // Check if it's already base64 or a URL
      if (img.startsWith('data:')) {
        base64Data = img.replace(/^data:image\/\w+;base64,/, "");
        const mimeMatch = img.match(/^data:(image\/\w+);base64,/);
        mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
      } else {
        // It's a URL - download and convert to base64
        const imageResponse = await fetch(img);
        if (!imageResponse.ok) {
          throw new Error(`Erro ao baixar imagem: ${img}`);
        }

        const arrayBuffer = await imageResponse.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        base64Data = buffer.toString('base64');

        // Determine mime type from response or URL
        const contentType = imageResponse.headers.get('content-type');
        mimeType = contentType || 'image/png';
      }

      return {
        inline_data: {
          mime_type: mimeType,
          data: base64Data
        }
      };
    }));

    const formatDescription = "formato retrato 4:5 (ideal para feed de Instagram)";

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
        2. Adicione o texto "${overlayText}" de forma DESTACADA e LEGÍVEL sobre a imagem
        3. Use tipografia moderna, profissional e em negrito
        4. O texto deve ter cores que contrastem bem com o fundo
        5. Layout otimizado para ${formatDescription} com proporção exata 4:5
        6. Design limpo, moderno e profissional
        7. O texto deve estar CLARAMENTE VISÍVEL e ser o elemento principal
        8. Use efeitos de sombra ou contorno no texto para melhorar a legibilidade
        ${previousPostsContext ? '9. Mantenha consistência visual com as publicações anteriores da campanha' : ''}
        ${campaign?.customPromptImage ? `\n        \n        INSTRUÇÕES ADICIONAIS DE DESIGN DO USUÁRIO:\n        ${campaign.customPromptImage}` : ''}
        `;

    const parts = [
      { text: imagePrompt },
      ...imageParts
    ];


    const imageResult = await imageModel.generateContent({
      contents: [{
        role: "user",
        parts: parts
      }],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: "2K"  // Options: "1K", "2K", "4K"
        }
      }
    } as any);

    const imageResponse = await imageResult.response;

    let generatedImageBase64 = "";

    if (imageResponse.candidates && imageResponse.candidates.length > 0) {
      for (const part of imageResponse.candidates[0].content.parts) {
        if (part.inlineData) {
          generatedImageBase64 = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!generatedImageBase64) {
      throw new Error("Nenhuma imagem foi gerada pela IA");
    }

    // Convert base64 to blob and upload to KingHost
    const base64Data = generatedImageBase64.split(',')[1];
    const mimeType = generatedImageBase64.match(/data:([^;]+);/)?.[1] || 'image/png';
    const buffer = Buffer.from(base64Data, 'base64');

    // Create a File-like object for upload
    const blob = new Blob([buffer], { type: mimeType });
    const fileName = `social-media-${Date.now()}.png`;
    const file = new File([blob], fileName, { type: mimeType });

    // Upload to KingHost
    const uploadUrl = process.env.KINGHOST_UPLOAD_URL;
    const apiSecret = process.env.KINGHOST_API_SECRET;

    if (!uploadUrl || !apiSecret) {
      throw new Error('Configuração de upload ausente');
    }

    const formDataToSend = new FormData();
    formDataToSend.append('file', file);
    formDataToSend.append('token', apiSecret);
    formDataToSend.append('folder', 'social-media');

    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      body: formDataToSend,
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

    return NextResponse.json({
      success: true,
      generatedImage: uploadResult.url, // Return KingHost URL instead of base64
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