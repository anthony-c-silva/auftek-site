import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/lib/models/Post";

type Props = {
    params: Promise<{ slug: string }>;
};

// 1. GET (Ler Post) - Agora ignora os deletados
export async function GET(request: Request, { params }: Props) {
    try {
        const { slug } = await params;
        await connectDB();

        // FILTRO NOVO: deletedAt: null
        const post = await Post.findOne({ slug, deletedAt: null });

        if (!post) {
            return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

// 2. PUT (Editar) - Mantém igual, mas só edita se não estiver deletado
export async function PUT(request: Request, { params }: Props) {
    try {
        const { slug } = await params;
        await connectDB();
        const body = await request.json();

        const updatedPost = await Post.findOneAndUpdate(
            { slug, deletedAt: null }, // Só edita se estiver ativo
            body,
            { new: true, runValidators: true }
        );

        if (!updatedPost) {
            return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
        }

        return NextResponse.json(updatedPost);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
    }
}

// 3. DELETE (Soft Delete)
export async function DELETE(request: Request, { params }: Props) {
    try {
        const { slug } = await params;
        await connectDB();

        const softDeletedPost = await Post.findOneAndUpdate(
            { slug },
            { deletedAt: new Date() }, // Marca a data/hora atual
            { new: true }
        );

        if (!softDeletedPost) {
            return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
        }

        return NextResponse.json({ message: "Post movido para a lixeira (Soft Delete)" });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao excluir" }, { status: 500 });
    }
}