import { NextResponse } from "next/server";
import openai from "@/lib/openai";
import { getAuthenticatedUser } from "@/lib/auth-server";
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
    const { text, context, campaignId, additionalPrompt } = body;

    if (!text) {
      return NextResponse.json({ error: "Texto não fornecido." }, { status: 400 });
    }

    const contextInfo = context || "post profissional";

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

      if (campaign) {
        if (campaign.authorId.toString() === user._id.toString()) {
          if (campaign.theme) {
            campaignContext = `\n\nTEMA DA CAMPANHA: ${campaign.theme}`;
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
            deletedAt: null
          })
            .sort({ createdAt: -1 })
            .limit(3)
            .lean();

          if (previousPosts.length > 0) {
            const postDescriptions = previousPosts
              .reverse()
              .map((post, index) => `${index + 1}. "${post.description}"`)
              .join('\n');

            previousPostsContext = `\n\nDESCRIÇÕES ANTERIORES NESTA CAMPANHA:\n${postDescriptions}\n\nMantenha consistência de tom e mensagem com as descrições anteriores.`;
          }
        }
      }
    }

    const prompt = `
        Você é um especialista em marketing de conteúdo para redes sociais.
        
        TAREFA:
        Crie uma descrição envolvente e otimizada para redes sociais baseada no seguinte texto da imagem:
        
        TEXTO DA IMAGEM:
        "${text}"
        
        CONTEXTO:
        ${contextInfo}${campaignContext}${previousPostsContext}
        ${additionalPrompt ? `\n\nINSTRUÇÕES ESPECÍFICAS DESTA PUBLICAÇÃO:\n${additionalPrompt}` : ''}
        
        
        REQUISITOS OBRIGATÓRIOS:
        1. A descrição deve complementar o texto da imagem
        2. Use hashtags relevantes (3-5 hashtags)
        3. Inclua um call-to-action sutil quando apropriado
        4. Mantenha o tom adequado para o contexto profissional
        5. Otimize para engajamento
        6. Máximo de 280 caracteres para o texto principal
        7. Hashtags em uma linha separada
        8. Seja criativo e envolvente
        9. Nao use emojis
        ${previousPostsContext ? '10. Mantenha consistência de tom e mensagem com as descrições anteriores da campanha' : ''}
        ${campaign?.customPromptText ? `\n        \n        INSTRUÇÕES ADICIONAIS DO USUÁRIO:\n        ${campaign.customPromptText}` : ''}
        
        FORMATO DE RESPOSTA:
        [Descrição principal que complementa "${text}"]
        
        [Hashtags]
        `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em marketing de conteúdo para redes sociais. Crie descrições envolventes e profissionais."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 300,
    });

    const generatedDescription = completion.choices[0]?.message?.content || "";

    return NextResponse.json({
      success: true,
      description: generatedDescription.trim()
    });

  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json(
      { error: "Erro ao gerar descrição." },
      { status: 500 }
    );
  }
}
