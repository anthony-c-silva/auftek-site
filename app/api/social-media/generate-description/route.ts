import { NextResponse } from "next/server";
import openai from "@/lib/openai";
import { getAuthenticatedUser } from "@/lib/auth-server";

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 401 });
    }

    const body = await request.json();
    const { text, context } = body;

    if (!text) {
      return NextResponse.json({ error: "Texto não fornecido." }, { status: 400 });
    }

    const contextInfo = context || "post profissional";

    const prompt = `
        Você é um especialista em marketing de conteúdo para redes sociais.
        
        TAREFA:
        Crie uma descrição envolvente e otimizada para redes sociais baseada no seguinte texto da imagem:
        
        TEXTO DA IMAGEM:
        "${text}"
        
        CONTEXTO:
        ${contextInfo}
        
        REQUISITOS:
        1. A descrição deve complementar o texto da imagem
        2. Use hashtags relevantes (3-5 hashtags)
        3. Inclua um call-to-action sutil quando apropriado
        4. Mantenha o tom adequado para o contexto profissional
        5. Otimize para engajamento
        6. Máximo de 280 caracteres para o texto principal
        7. Hashtags em uma linha separada
        8. Seja criativo e envolvente
        9. Nao use emojis
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
