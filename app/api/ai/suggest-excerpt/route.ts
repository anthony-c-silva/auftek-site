// app/api/ai/suggest-excerpt/route.ts
import { NextResponse } from "next/server";
import openai from "@/lib/openai"; // Usando a instância singleton
import { getAuthenticatedUser } from "@/lib/auth-server";

export async function POST(request: Request) {
    try {
        const user = await getAuthenticatedUser();
        if (!user) return NextResponse.json({ error: "Acesso negado." }, { status: 401 });

        const body = await request.json();
        const { content, strategy: providedStrategy } = body;

        // Validação básica
        if (!content || content.length < 50) {
            return NextResponse.json({ error: "Conteúdo muito curto." }, { status: 400 });
        }

        const contentToAnalyze = content.slice(0, 4500);
        let strategy = providedStrategy;

        // =================================================================================
        // FASE 1: O ESTRATEGISTA (JSON Mode Nativo)
        // =================================================================================
        if (!strategy) {
            const strategyPrompt = `
            Você é um Estrategista de SEO Sênior. Analise o texto abaixo.
            Retorne APENAS um objeto JSON válido com as seguintes chaves:
            
            1. "primary_keyword": O tópico principal em PORTUGUÊS (máx 3 palavras).
            2. "secondary_keywords": Um Array de strings [] com 3 a 5 termos técnicos relacionados.
            3. "user_pain_point": Identifique a dificuldade/dor do usuário (ex.: "Lentidão", "Custo alto").
            
            TEXT: "${contentToAnalyze.slice(0, 2000)}"
            `;

            const strategyCompletion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "Você é um especialista em SEO. Retorne JSON." },
                    { role: "user", content: strategyPrompt }
                ],
                temperature: 0.3,
                response_format: { type: "json_object" }
            });

            const rawResponse = strategyCompletion.choices[0]?.message?.content || "{}";

            try {
                strategy = JSON.parse(rawResponse);

                // Fallbacks de segurança
                if (!strategy.primary_keyword) strategy.primary_keyword = "Tecnologia";
                if (!strategy.user_pain_point) strategy.user_pain_point = "Complexidade";
                if (!Array.isArray(strategy.secondary_keywords)) strategy.secondary_keywords = [strategy.primary_keyword];

            } catch (e) {
                console.error("Erro Parse JSON OpenAI:", e);
                strategy = {
                    primary_keyword: "Artigo Técnico",
                    secondary_keywords: ["Tecnologia", "Inovação"],
                    user_pain_point: "Falta de informação"
                };
            }
        }

        // =================================================================================
        // FASE 2: O REDATOR (JORNALISTA CONCISO)
        // =================================================================================
        const finalPrompt = `
            Atue como um jornalista de tecnologia.
            Escreva um Resumo (Meta Description) curto e completo para um artigo.
            
            ESTRATÉGIA:
            - Assunto: ${strategy.primary_keyword}
            - Dor a resolver: ${strategy.user_pain_point}
            
            REGRAS OBRIGATÓRIAS:
            1. SIMPLIFIQUE TERMOS TÉCNICOS.
            2. Use frases CURTAS.
            3. TAMANHO: O texto DEVE ter entre 130 e 155 caracteres.
            4. OBRIGATÓRIO: Termine a frase com PONTO FINAL.
            5. Idioma: Português do Brasil.
            6. NÃO use aspas.
            
            TEXTO BASE: """${contentToAnalyze}"""
        `;

        const creationCompletion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: finalPrompt }],
            temperature: 0.7,
            max_tokens: 150, // Aumentei um pouco caso ele precise de margem
        });

        let finalExcerpt = creationCompletion.choices[0]?.message?.content || "";

        // =================================================================================
        // FASE 3: LIMPEZA E CORTE INTELIGENTE (Mantido da sua versão original)
        // =================================================================================

        // 1. Limpezas básicas
        finalExcerpt = finalExcerpt
            .replace(/^["']|["']$/g, '') // Remove aspas nas pontas
            .replace(/^Resumo:|^Meta Description:/i, '')
            .trim();

        // 2. CORTE DE SEGURANÇA (PRIORIZA FRASE COMPLETA)
        const MAX_LENGTH = 160;

        if (finalExcerpt.length > MAX_LENGTH) {
            const safeText = finalExcerpt.substring(0, MAX_LENGTH);

            // Procura o ÚLTIMO ponto de finalização de frase dentro do limite seguro.
            const lastPunctuationIndex = Math.max(
                safeText.lastIndexOf('.'),
                safeText.lastIndexOf('!'),
                safeText.lastIndexOf('?')
            );

            if (lastPunctuationIndex !== -1) {
                // Corta exatamente no ponto final encontrado
                finalExcerpt = safeText.substring(0, lastPunctuationIndex + 1);
            } else {
                // Caso extremo: Corta no último espaço e adiciona reticências
                const lastSpace = safeText.lastIndexOf(' ');
                if (lastSpace > 0) {
                    finalExcerpt = safeText.substring(0, lastSpace) + "...";
                } else {
                    finalExcerpt = safeText.substring(0, 145) + "...";
                }
            }
        }

        return NextResponse.json({
            success: true,
            excerpt: finalExcerpt,
            keywords_used: strategy.secondary_keywords || [],
            strategy: strategy
        });

    } catch (error: any) {
        console.error("OpenAI API Error:", error);
        return NextResponse.json({ error: "Erro ao processar com IA." }, { status: 500 });
    }
}