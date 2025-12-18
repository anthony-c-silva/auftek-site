// app/api/ai/suggest-title/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getAuthenticatedUser } from "@/lib/auth-server";

export async function POST(request: Request) {
    try {
        const user = await getAuthenticatedUser();
        if (!user) return NextResponse.json({ error: "Acesso negado." }, { status: 401 });

        const body = await request.json();
        const { content } = body;

        const contentToAnalyze = content ? content.slice(0, 4500) : "";

        const apiKey = process.env.OPENAI_API_KEY || "lm-studio";
        const baseURL = process.env.OPENAI_BASE_URL || "http://127.0.0.1:1234/v1";

        const openai = new OpenAI({ apiKey, baseURL });

        console.log(`⚡ [IA] Analisando texto com: ${baseURL}`);

        const finalPrompt = `
    Aja como um Redator Sênior de SEO.
    Sua tarefa é escrever um título de alta conversão (CTR) para o texto abaixo.

    PASSO 1: ANALISE o texto e extraia a "Entidade Principal".
    PASSO 2: Crie o título seguindo a fórmula: [Entidade Principal] + [Benefício ou Curiosidade].

    EXEMPLOS:
    - "Ferrari 296 GTB: Tudo sobre o novo motor híbrido V6"
    - "Jejum Intermitente: Guia completo para iniciantes"
    - "Next.js 14: As 5 novidades que mudam o desenvolvimento web"

    REGRAS OBRIGATÓRIAS:
    1. Retorne APENAS o título final. Não coloque o pensamento ou raciocínio na resposta final.
    2. Sem aspas.
    3. Use entre 40 e 65 caracteres.

    TEXTO DO USUÁRIO:
    "${contentToAnalyze}"

    TÍTULO OTIMIZADO:
    `;

        const completion = await openai.chat.completions.create({
            model: "local-model",
            messages: [
                { role: "user", content: finalPrompt }
            ],
            temperature: 0.6,
            // AUMENTADO DE 80 PARA 1000
            // Modelos "Thinking" (DeepSeek/QwQ) precisam de muitos tokens para pensar antes de responder.
            // Se for pouco, ele corta o pensamento e devolve content vazio.
            max_tokens: 1000,
        });

        console.log("⚡ [IA] Resposta Bruta:", JSON.stringify(completion.choices[0], null, 2));

        // Fallback: Alguns modelos colocam a resposta no 'content', outros vazam no 'reasoning' se falharem.
        // Mas com 1000 tokens, o 'content' deve vir preenchido corretamente.
        let finalTitle = completion.choices[0]?.message?.content || "";

        if (!finalTitle) {
            // Tenta salvar o dia pegando algo do reasoning se o content vier vazio (Raro com max_tokens alto)
            const reasoning = (completion.choices[0]?.message as any)?.reasoning || "";
            if (reasoning && reasoning.includes('"')) {
                // Tenta achar algo entre aspas no pensamento
                const match = reasoning.match(/"([^"]{10,70})"/);
                if (match) finalTitle = match[1];
            }
        }

        if (!finalTitle) {
            throw new Error("A IA pensou demais e não retornou o título final.");
        }

        // Limpeza
        finalTitle = finalTitle
            .replace(/^["']|["']$/g, '')
            .replace(/^Título:\s*/i, '')
            .replace(/\n/g, ' ') // Remove quebras de linha se houver
            .trim();

        return NextResponse.json({ success: true, title: finalTitle });

    } catch (error: any) {
        console.error("❌ Erro IA Local:", error);
        return NextResponse.json(
            { error: "Erro ao processar sugestão." },
            { status: 500 }
        );
    }
}