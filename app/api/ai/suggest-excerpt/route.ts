// app/api/ai/suggest-excerpt/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getAuthenticatedUser } from "@/lib/auth-server";

export async function POST(request: Request) {
    try {
        // 1. Auth & Validação
        const user = await getAuthenticatedUser();
        if (!user) {
            return NextResponse.json({ error: "Acesso negado." }, { status: 401 });
        }

        const body = await request.json();
        const { content, title } = body;

        if (!content || content.length < 50) {
            return NextResponse.json({ error: "Conteúdo muito curto." }, { status: 400 });
        }

        // 2. Configuração Local (LM Studio)
        const apiKey = process.env.OPENAI_API_KEY || "lm-studio";
        const baseURL = process.env.OPENAI_BASE_URL || "http://127.0.0.1:1234/v1";

        const openai = new OpenAI({ apiKey, baseURL });
        const contentToAnalyze = content.slice(0, 4500);

        console.log(`⚡ [IA Excerpt] Gerando resumo natural via: ${baseURL}`);

        // 3. Prompt Focado em Copywriting (Texto Corrido)
        const prompt = `
    Atue como um Especialista em Copywriting e SEO.
    Escreva uma Meta Description (Resumo) para o Google baseada no texto abaixo.

    CONTEXTO:
    O título do post é: "${title || 'Ainda não definido'}"
    O resumo deve complementar o título, incentivando o clique.

    REGRAS DE ESTILO (CRÍTICO):
    1. JAMAIS use o formato robótico "Tópico: Definição".
    2. Escreva uma frase CORRIDA e NATURAL.
    3. Comece preferencialmente com um verbo de ação (Ex: Descubra, Aprenda, Veja, Entenda).
    4. O texto deve ter "ritmo" de leitura humana.

    EXEMPLOS BONS (Use este estilo):
    - "Descubra como otimizar suas imagens para web e melhore a velocidade do seu site hoje mesmo."
    - "Aprenda o passo a passo definitivo para investir em Bitcoin com segurança e sem taxas abusivas."
    - "Veja as principais diferenças entre Next.js e React e escolha a melhor opção para seu projeto."

    EXEMPLOS RUINS (NÃO FAÇA ISSO):
    - "Otimização de Imagens: Saiba como fazer." (Robótico)
    - "Bitcoin: Um guia de investimento." (Repetitivo)
    - "Resumo: O texto fala sobre React." (Preguiçoso)

    LIMITES TÉCNICOS:
    - Mínimo: 120 caracteres.
    - Máximo: 155 caracteres (Crucial para não ser cortado no Google).
    - Sem aspas.

    TEXTO BASE:
    "${contentToAnalyze}"

    RESUMO PERSUASIVO:
    `;

        // 4. Geração
        const completion = await openai.chat.completions.create({
            model: "local-model",
            messages: [
                { role: "user", content: prompt }
            ],
            temperature: 0.7, // Criatividade moderada para frases fluidas
            max_tokens: 1000, // Espaço para raciocínio (Thinking Models)
        });

        console.log("⚡ [IA Excerpt] Resposta:", JSON.stringify(completion.choices[0], null, 2));

        // 5. Tratamento de Resposta
        let finalExcerpt = completion.choices[0]?.message?.content || "";

        // Fallback para modelos que vazam raciocínio
        if (!finalExcerpt) {
            const reasoning = (completion.choices[0]?.message as any)?.reasoning || "";
            if (reasoning && reasoning.includes('"')) {
                // Tenta pegar a frase mais longa entre aspas que pareça um resumo
                const match = reasoning.match(/"([^"]{80,160})"/);
                if (match) finalExcerpt = match[1];
            }
        }

        if (!finalExcerpt) throw new Error("A IA não gerou o resumo.");

        // Limpeza
        finalExcerpt = finalExcerpt
            .replace(/^["']|["']$/g, '')
            .replace(/^Resumo:\s*/i, '')
            .replace(/^Meta Description:\s*/i, '')
            .trim();

        // 6. Corte de Segurança (Hard Limit SEO)
        // Se a IA se empolgar e passar de 160, cortamos elegantemente.
        if (finalExcerpt.length > 160) {
            let truncated = finalExcerpt.slice(0, 157);
            const lastSpace = truncated.lastIndexOf(' ');
            if (lastSpace > 100) truncated = truncated.slice(0, lastSpace);
            finalExcerpt = truncated + "...";
        }

        return NextResponse.json({
            success: true,
            excerpt: finalExcerpt,
            length: finalExcerpt.length
        });

    } catch (error: any) {
        console.error("❌ Erro IA Excerpt:", error);
        return NextResponse.json(
            { error: "Erro ao gerar resumo." },
            { status: 500 }
        );
    }
}