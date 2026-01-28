import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-server";
import genAI from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 401 });
    }

    const body = await request.json();
    const { images, context } = body;

    if (!images || images.length === 0) {
      return NextResponse.json({ error: "Nenhuma imagem fornecida." }, { status: 400 });
    }

    if (!context) {
      return NextResponse.json({ error: "Contexto não fornecido." }, { status: 400 });
    }

    const aspectRatio = "4:5";

    const textModel = genAI.getGenerativeModel({ model: "gemini-3-pro-image-preview" });

    const textPrompt = `
        Você é um especialista em marketing de redes sociais.
        
        CONTEXTO DA PUBLICAÇÃO:
        ${context}
        
        TAREFA:
        Crie um texto MUITO CURTO (máximo 5-7 palavras) e impactante para sobrepor em uma imagem de rede social.
        O texto deve ser direto, chamativo e relacionado ao contexto fornecido.
        
        REGRAS:
        - Máximo 7 palavras
        - Sem pontuação no final
        - Linguagem direta e impactante
        - Em português do Brasil
        - Centro da tela
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

    const imageParts = images.map((img: string) => {
      const base64Data = img.replace(/^data:image\/\w+;base64,/, "");
      const mimeMatch = img.match(/^data:(image\/\w+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";

      return {
        inline_data: {
          mime_type: mimeType,
          data: base64Data
        }
      };
    });

    const formatDescription = "formato retrato 4:5 (ideal para feed de Instagram)";

    const imagePrompt = `
        Crie uma imagem profissional para redes sociais mesclando as imagens fornecidas de forma criativa e harmoniosa.
        
        TEXTO PARA SOBREPOR NA IMAGEM:
        "${overlayText}"
        
        CONTEXTO:
        ${context}
        
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

    return NextResponse.json({
      success: true,
      generatedImage: generatedImageBase64,
      overlayText: overlayText,
      message: "Imagem gerada com sucesso!"
    });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
        { error: error.message || "Erro ao processar com Gemini API." },
        { status: 500 }
    );
  }
}