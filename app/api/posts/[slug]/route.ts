import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/lib/models/Post";
import { getAuthenticatedUser } from "@/lib/auth-server";

type Props = {
    params: Promise<{ slug: string }>;
};

// 1. GET (Ler Post) - Público
export async function GET(request: Request, { params }: Props) {
    try {
        const { slug } = await params;
        await connectDB();

        const post = await Post.findOne({ slug, deletedAt: null });

        if (!post) {
            return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error: unknown) {
        console.error("Erro GET [slug]:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

// 2. PUT (Editar) - Protegido
export async function PUT(request: Request, { params }: Props) {
    try {
        // SEGURANÇA: Verifica login
        const user = await getAuthenticatedUser();
        if (!user) {
            return NextResponse.json(
                { error: "Acesso negado. Token inválido ou ausente." },
                { status: 401 }
            );
        }

        const { slug } = await params;
        await connectDB();

        const body = await request.json();

        if ('writer' in body) delete body.writer;
        if ('createdAt' in body) delete body.createdAt;


        const updatedPost = await Post.findOneAndUpdate(
            { slug, deletedAt: null },
            body,
            { new: true, runValidators: true }
        );

        if (!updatedPost) {
            return NextResponse.json({ error: "Post não encontrado ou excluído." }, { status: 404 });
        }

        return NextResponse.json(updatedPost);
    } catch (error: unknown) {
        console.error("Erro PUT [slug]:", error);
        return NextResponse.json({ error: "Erro ao atualizar post" }, { status: 500 });
    }
}

// 3. DELETE (Soft Delete) - Protegido
export async function DELETE(request: Request, { params }: Props) {
    try {
        // SEGURANÇA: Verifica login
        const user = await getAuthenticatedUser();
        if (!user) {
            return NextResponse.json(
                { error: "Acesso negado. Token inválido ou ausente." },
                { status: 401 }
            );
        }

        const { slug } = await params;
        await connectDB();

        const softDeletedPost = await Post.findOneAndUpdate(
            { slug, deletedAt: null }, // Garante que não deletamos o que já está deletado
            { deletedAt: new Date() },
            { new: true }
        );

        if (!softDeletedPost) {
            return NextResponse.json({ error: "Post não encontrado." }, { status: 404 });
        }

        return NextResponse.json({ message: "Post movido para a lixeira com sucesso." });
    } catch (error: unknown) {
        console.error("Erro DELETE [slug]:", error);
        return NextResponse.json({ error: "Erro ao excluir post" }, { status: 500 });
    }
}