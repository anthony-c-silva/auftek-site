import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Author from "@/lib/models/Author";
import { getAuthenticatedUser } from "@/lib/auth-server";

// 1. GET - Listar Autores
// (Mantemos aberto para Redatores poderem selecionar no select)
export async function GET() {
    try {
        await connectDB();
        // Opcional: Pode verificar se está logado, mas não precisa ser Admin
        const authors = await Author.find({}).sort({ name: 1 });
        return NextResponse.json(authors);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar autores" }, { status: 500 });
    }
}

// 2. POST - Criar Autor (AGORA PROTEGIDO)
export async function POST(request: Request) {
    try {
        const user = await getAuthenticatedUser();

        // Verifica se logou
        if (!user) {
            return NextResponse.json({ error: "Acesso negado." }, { status: 401 });
        }

        // --- TRAVA DE SEGURANÇA ---
        // Se não for Admin, nega acesso (403 Forbidden)
        if (user.role !== 'admin') {
            return NextResponse.json(
                { error: "Permissão insuficiente. Apenas admins criam autores." }, 
                { status: 403 }
            );
        }
        // ---------------------------

        await connectDB();
        const body = await request.json();

        if (!body.name) {
            return NextResponse.json({ error: "Nome do autor é obrigatório" }, { status: 400 });
        }

        const newAuthor = await Author.create(body);
        return NextResponse.json(newAuthor, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erro ao criar autor" }, { status: 500 });
    }
}