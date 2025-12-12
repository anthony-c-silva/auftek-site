// app/api/authors/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb"; // Sua função de conexão
import Author from "@/lib/models/Author"; // O modelo que acabamos de criar

// LISTAR TODOS OS AUTORES
export async function GET() {
    try {
        await connectDB();
        // Busca todos e ordena pelos mais recentes
        const authors = await Author.find({}).sort({ createdAt: -1 });
        return NextResponse.json(authors);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar autores" }, { status: 500 });
    }
}

// CRIAR NOVO AUTOR
export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        // Validação básica
        if (!body.name || !body.education) {
            return NextResponse.json(
                { error: "Nome e Formação são obrigatórios" },
                { status: 400 }
            );
        }

        // Cria no banco de dados real
        const newAuthor = await Author.create({
            name: body.name,
            photoUrl: body.photoUrl || "",
            education: body.education,
            linkedin: body.linkedin || "",
            lattes: body.lattes || ""
        });

        return NextResponse.json(newAuthor, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao criar autor" }, { status: 500 });
    }
}

// DELETAR AUTOR
export async function DELETE(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "ID necessário" }, { status: 400 });
        }

        await Author.findByIdAndDelete(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao deletar" }, { status: 500 });
    }
}