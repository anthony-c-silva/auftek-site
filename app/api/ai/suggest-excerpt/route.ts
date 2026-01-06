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

            // FIX: Chaves do JSON agora estão em Inglês para bater com o código (primary_keyword, etc)
            const strategyPrompt = `
            Você é um Estrategista de SEO Sênior. Analise o texto abaixo.
            Retorne APENAS um objeto JSON válido com as seguintes chaves exatas:
            
            INSTRUCTIONS:
            1. "primary_keyword": O tópico principal em PORTUGUÊS (máx 3 palavras).
            2. "secondary_keywords": Um Array de strings [] com 3 a 5 termos técnicos relacionados.
            3. "user_pain_point": Identifique a dificuldade/dor do usuário (ex.: "Lentidão", "Custo alto"). NÃO descreva a tarefa.
            
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

                // FIX: Fallbacks de segurança caso a IA falhe em algum campo
                if (!strategy.primary_keyword) strategy.primary_keyword = "Tecnologia";
                if (!strategy.user_pain_point) strategy.user_pain_point = "Complexidade";
                if (!Array.isArray(strategy.secondary_keywords)) strategy.secondary_keywords = [strategy.primary_keyword];

                console.log("🔍 [Excerpt V2] Strategy JSON:", JSON.stringify(strategy, null, 2));

            } catch (e) {
                console.error("❌ Erro JSON Excerpt:", e);
                // Objeto Fallback alinhado com as chaves corretas
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
        console.log("✍️ [Excerpt V2] Redigindo Resumo Conciso...");

        const finalPrompt = `
            Atue como um jornalista de tecnologia.
            Escreva um Resumo (Meta Description) curto e completo para um artigo.
            
            ESTRATÉGIA DE CONTEÚDO:
            - Assunto Principal: ${strategy.primary_keyword}
            - Dor do Leitor a resolver: ${strategy.user_pain_point}
            
            REGRAS OBRIGATÓRIAS:
            1. SIMPLIFIQUE TERMOS TÉCNICOS. Seja acessível.
            2. Use frases CURTAS. Máximo 20 palavras por frase.
            3. IMPORTANTE: O texto DEVE ter entre 140 e 155 caracteres.
            4. OBRIGATÓRIO: Termine a frase com PONTO FINAL. Não deixe o pensamento incompleto.
            5. Idioma: Português do Brasil.
            6. NÃO PODE HAVER ASPAS.
            
            TEXTO BASE: """${contentToAnalyze}"""
            
            SAÍDA (Apenas o texto do resumo):
        `;

        const creationCompletion = await openai.chat.completions.create({
            model: "local-model",
            messages: [{ role: "user", content: finalPrompt }],
            temperature: 0.6,
            max_tokens: 250,
        });

        let finalExcerpt = creationCompletion.choices[0]?.message?.content || "";

        // Fallback para modelos que vazam reasoning
        if (!finalExcerpt && (creationCompletion.choices[0]?.message as any)?.reasoning) {
            const match = (creationCompletion.choices[0]?.message as any).reasoning.match(/"([^"]{50,160})"/);
            if (match) finalExcerpt = match[1];
        }

        // =================================================================================
        // FASE 3: LIMPEZA E CORTE INTELIGENTE
        // =================================================================================

        // 1. Limpezas básicas
        finalExcerpt = finalExcerpt.split(/Title Optimization:|Description:|Content:|Optimization:|Explanation:|Resumo:|Meta Description:/i)[0];
        finalExcerpt = finalExcerpt.replace(/^["']/, '').replace(/["']$/, '').trim();

        // Remove prefixos comuns que a IA as vezes coloca
        if (finalExcerpt.toLowerCase().startsWith("resumo:")) finalExcerpt = finalExcerpt.substring(7).trim();

        // 2. CORTE DE SEGURANÇA (PRIORIZA FRASE COMPLETA)
        const MAX_LENGTH = 160; // Aumentei levemente para dar margem ao corte

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
                    finalExcerpt = safeText.substring(0, 150) + "...";
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
        console.error("❌ Erro V2 Excerpt:", error);
        return NextResponse.json({ error: "Erro ao gerar resumo." }, { status: 500 });
    }
}