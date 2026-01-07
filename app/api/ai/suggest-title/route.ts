import { NextResponse } from "next/server";
import openai from "@/lib/openai";
import { getAuthenticatedUser } from "@/lib/auth-server";

export async function POST(request: Request) {
    try {
        const user = await getAuthenticatedUser();
        if (!user) return NextResponse.json({ error: "Acesso negado." }, { status: 401 });

        const body = await request.json();
        const { content, strategy: providedStrategy } = body;
        const contentToAnalyze = content ? content.slice(0, 4500) : "";

        let strategy = providedStrategy;

        // =================================================================================
        // FASE 1: O ESTRATEGISTA (JSON Mode Nativo)
        // =================================================================================
        if (!strategy) {
            const analysisPrompt = `
            Analise o texto abaixo para SEO.
            Retorne APENAS um objeto JSON válido com estas chaves:
            1. "primary_keyword": O tópico mais curto possível (máx 3 palavras).
            2. "hook_angle": Estilo em uma palavra (ex: Curiosidade, Alerta, Dica, Futuro).
            
            Texto: "${contentToAnalyze.slice(0, 2000)}"
            `;

            const analysisCompletion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "Você é um especialista em SEO. Retorne JSON." },
                    { role: "user", content: analysisPrompt }
                ],
                temperature: 0.3,
                response_format: { type: "json_object" }
            });

            const rawResponse = analysisCompletion.choices[0]?.message?.content || "{}";

            try {
                const parsedStrategy = JSON.parse(rawResponse);

                strategy = {
                    primary_keyword: parsedStrategy.primary_keyword || "Tecnologia",
                    hook_angle: parsedStrategy.hook_angle || "Novidade"
                };

                if (strategy.primary_keyword && strategy.primary_keyword.split(' ').length > 5) {
                    strategy.primary_keyword = strategy.primary_keyword.split(' ').slice(0, 4).join(' ');
                }

            } catch (e) {
                console.error("Erro Parse JSON OpenAI:", e);
                strategy = { primary_keyword: "Tecnologia", hook_angle: "Novidade" };
            }
        }

        // =================================================================================
        // FASE 2: REDATOR
        // =================================================================================
        const finalPrompt = `
        Aja como Editor de Manchetes de Tecnologia. Escreva UM título para o Google.
        
        ESTRATÉGIA:
        - Foco: "${strategy.primary_keyword}"
        - Ângulo: "${strategy.hook_angle}"
        
        REGRAS:
        1. Use MÁXIMO 8 PALAVRAS.
        2. Seja urgente ou curioso. Nada de títulos acadêmicos.
        3. Idioma: Português do Brasil.
        4. Retorne APENAS o texto do título, sem aspas.
        
        TEXTO BASE:
        """${contentToAnalyze}"""
        `;

        const creationCompletion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: finalPrompt }],
            temperature: 0.7,
            max_tokens: 100,
        });

        let finalTitle = creationCompletion.choices[0]?.message?.content || "";

        finalTitle = finalTitle
            .replace(/^["']|["']$/g, '')
            .replace(/Título:/i, '')
            .trim();

        return NextResponse.json({
            success: true,
            title: finalTitle,
            strategy: strategy
        });

    } catch (error: any) {
        console.error("OpenAI API Error:", error);
        return NextResponse.json({ error: "Erro ao processar com IA." }, { status: 500 });
    }
}