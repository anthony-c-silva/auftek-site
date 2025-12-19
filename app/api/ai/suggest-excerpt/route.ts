// app/api/ai/suggest-excerpt/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getAuthenticatedUser } from "@/lib/auth-server";

export async function POST(request: Request) {
    try {
        const user = await getAuthenticatedUser();
        if (!user) return NextResponse.json({ error: "Acesso negado." }, { status: 401 });

        const body = await request.json();
        const { content, title, strategy: providedStrategy } = body;

        // Validação básica
        if (!content || content.length < 50) {
            return NextResponse.json({ error: "Conteúdo muito curto." }, { status: 400 });
        }

        const apiKey = process.env.OPENAI_API_KEY || "lm-studio";
        const baseURL = process.env.OPENAI_BASE_URL || "http://127.0.0.1:1234/v1";
        const openai = new OpenAI({ apiKey, baseURL });

        const contentToAnalyze = content.slice(0, 4500);
        let strategy = providedStrategy;

        // =================================================================================
        // FASE 1: O ESTRATEGISTA
        // =================================================================================
        if (!strategy) {
            console.log("🧠 [Excerpt V2] Calculando estratégia...");

            const strategyPrompt = `
        You are an SEO Strategist. Analyze the text.
        Return ONLY a valid JSON object.
        
        INSTRUCTIONS:
        1. "primary_keyword": Main topic.
        2. "secondary_keywords": Array of 3 to 5 related technical terms (for Tags).
        3. "user_pain_point": Identify the NEGATIVE difficulty (e.g., "Slowness", "Imprecision"). DO NOT describe the task.
        
        TEXT: "${contentToAnalyze.slice(0, 2000)}"
        `;

            const strategyCompletion = await openai.chat.completions.create({
                model: "local-model",
                messages: [{ role: "user", content: strategyPrompt }],
                temperature: 0.1,
                max_tokens: 400,
            });

            const rawResponse = strategyCompletion.choices[0]?.message?.content || "{}";

            try {
                let cleanJson = rawResponse.replace(/```json|```/g, '');
                cleanJson = cleanJson.replace(/\\_/g, '_');

                const firstBrace = cleanJson.indexOf('{');
                const lastBrace = cleanJson.lastIndexOf('}');

                if (firstBrace !== -1 && lastBrace !== -1) {
                    cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);
                }

                strategy = JSON.parse(cleanJson);

                // LOG SOLICITADO: Imprime o JSON extraído
                console.log("🔍 [Excerpt V2] Strategy JSON:", JSON.stringify(strategy, null, 2));

            } catch (e) {
                console.error("❌ Erro JSON Excerpt:", e);
                strategy = {
                    primary_keyword: "Tecnologia",
                    secondary_keywords: [],
                    user_pain_point: "Processos manuais"
                };
            }
        }

        // =================================================================================
        // FASE 2: O REDATOR (JORNALISTA CONCISO)
        // =================================================================================
        console.log("✍️ [Excerpt V2] Redigindo Resumo Conciso...");

        const finalPrompt = `
            Atue como um jornalista de tecnologia.
            Escreva um Resumo (Meta Description) curto e completo.
            
            ESTRATÉGIA:
            - Assunto: ${strategy.primary_keyword}
            - Problema: ${strategy.user_pain_point}
            
            REGRAS OBRIGATÓRIAS:
            1. SIMPLIFIQUE TERMOS TÉCNICOS LONGOS. (Ex: Em vez de "Sensor Elétrico de Ressonância...", use "Novo Sensor" ou "Tecnologia RFD").
            2. Use frases CURTAS. Máximo 20 palavras por frase.
            3. OBRIGATÓRIO: Termine a frase com PONTO FINAL. Não deixe o pensamento incompleto.
            4. LIMITE: Máximo 140 caracteres.
            5. Idioma: Português do Brasil.
            
            TEXTO BASE: """${contentToAnalyze}"""
            
            SAÍDA (Apenas o texto):
    `;

        const creationCompletion = await openai.chat.completions.create({
            model: "local-model",
            messages: [{ role: "user", content: finalPrompt }],
            temperature: 0.6,
            max_tokens: 200,
        });

        let finalExcerpt = creationCompletion.choices[0]?.message?.content || "";

        if (!finalExcerpt && (creationCompletion.choices[0]?.message as any)?.reasoning) {
            const match = (creationCompletion.choices[0]?.message as any).reasoning.match(/"([^"]{50,160})"/);
            if (match) finalExcerpt = match[1];
        }

        // =================================================================================
        // FASE 3: LIMPEZA E CORTE INTELIGENTE
        // =================================================================================

        // 1. Limpezas básicas
        finalExcerpt = finalExcerpt.split(/Title Optimization:|Description:|Content:|Optimization:|Explanation:/i)[0];
        finalExcerpt = finalExcerpt.split('\n')[0];

        finalExcerpt = finalExcerpt.trim();
        while (finalExcerpt.startsWith('"') || finalExcerpt.startsWith("'") || finalExcerpt.endsWith('"') || finalExcerpt.endsWith("'")) {
            finalExcerpt = finalExcerpt.replace(/^["']/, '').replace(/["']$/, '').trim();
        }
        finalExcerpt = finalExcerpt.replace(/^Resumo:\s*/i, '').replace(/^Meta Description:\s*/i, '').trim();

        // 2. CORTE DE SEGURANÇA (PRIORIZA FRASE COMPLETA)
        const MAX_LENGTH = 155;

        if (finalExcerpt.length > MAX_LENGTH) {
            const safeText = finalExcerpt.substring(0, MAX_LENGTH);

            // Procura o ÚLTIMO ponto de finalização de frase dentro do limite seguro.
            // Isso garante que pegamos o máximo de texto possível que seja uma frase completa.
            const lastPunctuationIndex = Math.max(
                safeText.lastIndexOf('.'),
                safeText.lastIndexOf('!'),
                safeText.lastIndexOf('?')
            );

            if (lastPunctuationIndex !== -1) {
                // Corta exatamente no ponto final encontrado
                finalExcerpt = safeText.substring(0, lastPunctuationIndex + 1);
            } else {
                // Caso extremo: A IA gerou uma frase gigante sem pontuação nos primeiros 155 chars.
                // Cortamos no último espaço para não quebrar a palavra e adicionamos reticências.
                const lastSpace = safeText.lastIndexOf(' ');
                if (lastSpace > 0) {
                    finalExcerpt = safeText.substring(0, lastSpace) + "...";
                } else {
                    finalExcerpt = safeText + "...";
                }
            }
        }

        const keywordsForTags = Array.isArray(strategy.secondary_keywords)
            ? strategy.secondary_keywords
            : [strategy.primary_keyword];

        return NextResponse.json({
            success: true,
            excerpt: finalExcerpt,
            keywords_used: keywordsForTags,
            strategy: strategy
        });

    } catch (error: any) {
        console.error("❌ Erro V2 Excerpt:", error);
        return NextResponse.json({ error: "Erro ao gerar resumo." }, { status: 500 });
    }
}