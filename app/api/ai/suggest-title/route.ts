// app/api/ai/suggest-title/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getAuthenticatedUser } from "@/lib/auth-server";

export async function POST(request: Request) {
    try {
        const user = await getAuthenticatedUser();
        if (!user) return NextResponse.json({ error: "Acesso negado." }, { status: 401 });

        const body = await request.json();
        const { content, strategy: providedStrategy } = body;
        const contentToAnalyze = content ? content.slice(0, 4500) : "";

        const apiKey = process.env.OPENAI_API_KEY || "lm-studio";
        const baseURL = process.env.OPENAI_BASE_URL || "http://127.0.0.1:1234/v1";
        const openai = new OpenAI({ apiKey, baseURL });

        let strategy = providedStrategy;

        // =================================================================================
        // FASE 1: O ESTRATEGISTA (Foco em Keyword CURTA)
        // =================================================================================
        if (!strategy) {
            console.log("🔍 [Title V2] Extraindo estratégia...");

            const analysisPrompt = `
        You are an SEO Expert. Analyze the text.
        Return ONLY a valid JSON object.
        
        INSTRUCTIONS:
        1. "primary_keyword": Extract the SHORTEST possible topic (Max 3 words).
        2. "hook_angle": One word style (e.g. Curiosidade, Alerta, Dica, Futuro).
        
        Expected Format:
        {
          "primary_keyword": "Microbiologia IoT", 
          "hook_angle": "Inovação"
        }
        
        TEXT: "${contentToAnalyze.slice(0, 2000)}"
        `;

            const analysisCompletion = await openai.chat.completions.create({
                model: "local-model",
                messages: [{ role: "user", content: analysisPrompt }],
                temperature: 0.1,
                max_tokens: 300,
            });

            const rawResponse = analysisCompletion.choices[0]?.message?.content || "{}";
            console.log("🤖 Raw Response (Fase 1):", rawResponse);

            try {
                // --- PARSER BLINDADO ---
                let cleanJson = rawResponse.replace(/```json|```/g, '');
                // Remove barras invertidas antes de underscores (Correção do erro anterior)
                cleanJson = cleanJson.replace(/\\_/g, '_');

                const firstBrace = cleanJson.indexOf('{');
                const lastBrace = cleanJson.lastIndexOf('}');

                if (firstBrace !== -1 && lastBrace !== -1) {
                    cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);
                }

                strategy = JSON.parse(cleanJson);

                // SEGURANÇA DE TAMANHO: Se a IA extraiu uma keyword gigante, cortamos na marra.
                if (strategy.primary_keyword.split(' ').length > 5) {
                    strategy.primary_keyword = strategy.primary_keyword.split(' ').slice(0, 4).join(' ');
                }

                console.log("✅ JSON Extraído:", JSON.stringify(strategy));

            } catch (e) {
                console.error("❌ Erro JSON:", e);
                strategy = { primary_keyword: "Tecnologia", hook_angle: "Novidade" };
            }
        }

        // =================================================================================
        // FASE 2: REDATOR (Foco em CONCISÃO)
        // =================================================================================
        console.log("✍️ [Title V2] Escrevendo título curto...");

        const finalPrompt = `
    Aja como Editor de Manchetes de Tecnologia (TechCrunch, The Verge).
    Escreva UMA manchete curta para o Google.
    
    ESTRATÉGIA:
    - Foco: "${strategy.primary_keyword}"
    - Ângulo: "${strategy.hook_angle}"
    
    REGRAS DE TAMANHO (CRÍTICO):
    1. Use MÁXIMO 8 PALAVRAS. (Seja breve!)
    2. NÃO escreva títulos de artigos científicos (longos e chatos).
    3. Escreva como notícia urgente ou curiosidade.
    
    Exemplos Bons (Curtos):
    - "Como a IoT revoluciona a análise de leite"
    - "Novo sensor detecta bactérias em tempo real"
    - "O fim dos testes demorados na microbiologia"
    
    Exemplos Ruins (Muito Longos - NÃO FAÇA):
    - "Determinação rápida e simples da contagem bacteriana total no leite cru usando sensor..."
    
    IDIOMA: Português do Brasil.
    
    TEXTO BASE:
    """${contentToAnalyze}"""
    
    TÍTULO CURTO:
    `;

        const creationCompletion = await openai.chat.completions.create({
            model: "local-model",
            messages: [{ role: "user", content: finalPrompt }],
            temperature: 0.7, // Um pouco menor para ele não viajar demais
            max_tokens: 150,
        });

        let finalTitle = creationCompletion.choices[0]?.message?.content || "";

        if (!finalTitle && (creationCompletion.choices[0]?.message as any)?.reasoning) {
            const match = (creationCompletion.choices[0]?.message as any).reasoning.match(/"([^"]{30,70})"/);
            if (match) finalTitle = match[1];
        }

        // =================================================================================
        // FASE 3: LIMPEZA BLINDADA
        // =================================================================================

        finalTitle = finalTitle.split('\n')[0];
        finalTitle = finalTitle.replace(/\s*[\(\[][a-zA-Z0-9\-\s]+[\)\]]$/, '');

        // Remove aspas recursivamente
        finalTitle = finalTitle.trim();
        while (finalTitle.startsWith('"') || finalTitle.startsWith("'") || finalTitle.endsWith('"') || finalTitle.endsWith("'")) {
            finalTitle = finalTitle.replace(/^["']/, '').replace(/["']$/, '').trim();
        }

        finalTitle = finalTitle
            .replace(/Title:/i, '')
            .replace(/Título:/i, '')
            .replace(/\.$/, '')
            .trim();

        return NextResponse.json({
            success: true,
            title: finalTitle,
            strategy: strategy
        });

    } catch (error: any) {
        console.error("❌ Erro Title V2:", error);
        return NextResponse.json({ error: "Erro ao processar." }, { status: 500 });
    }
}