import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/lib/models/Post";
import { getAuthenticatedUser } from "@/lib/auth-server";

function generateSlug(text: string) {
    return text.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
}

export async function GET(request: Request) {
    try {
        await connectDB();
        const user = await getAuthenticatedUser();
        const { searchParams } = new URL(request.url);
        const statusParam = searchParams.get('status');

        // 1. Visitante (Público)
        if (!user) {
            return NextResponse.json(await Post.find({
                deletedAt: null,
                status: 'published'
            }).sort({ createdAt: -1 }));
        }

        // 2. Filtros base
        const isAdmin = user.role === 'admin';
        let filter: any = { deletedAt: null };

        if (statusParam) {
            filter.status = statusParam;
        }

        // 3. Restrições de Visibilidade
        if (!isAdmin) {
            if (statusParam) {
                // Filtra pelos posts DO USUÁRIO usando o novo campo authorId
                filter.authorId = user._id;
            } else {
                // Feed Misto: Públicos OU Meus
                filter.$or = [
                    { status: 'published' },
                    { authorId: user._id }
                ];
            }
        }

        const posts = await Post.find(filter).sort({ createdAt: -1 });
        return NextResponse.json(posts);

    } catch (error) {
        console.error("Erro GET Posts:", error);
        return NextResponse.json({ error: "Erro ao buscar posts" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const user = await getAuthenticatedUser();
        if (!user) return NextResponse.json({ error: "Acesso negado." }, { status: 401 });

        await connectDB();
        const body = await request.json();

        // 1. Gera Slug
        let finalSlug = body.slug;
        if (!finalSlug || finalSlug.trim() === "") {
            if (!body.title) return NextResponse.json({ error: "Título obrigatório." }, { status: 400 });
            finalSlug = generateSlug(body.title);
        }

        // 2. Monta Autor (Snapshot para exibição rápida no frontend)
        const authorData = {
            name: user.name,
            photoUrl: user.photoUrl || "",
            bio: user.bio || "",
            education: user.education || "",
            socialLinks: user.socialLinks || {}
        };

        // 3. Define Status Seguro
        let postStatus = 'pending';
        if (user.role === 'admin') {
            postStatus = body.status || 'published';
        } else {
            postStatus = body.status === 'draft' ? 'draft' : 'pending';
        }

        const newPost = await Post.create({
            ...body,
            slug: finalSlug,

            // ========================================================
            // A CORREÇÃO ESTÁ AQUI:
            // Injetamos o ID do usuário logado no campo obrigatório
            // ========================================================
            authorId: user._id,

            author: authorData, // Snapshot visual
            status: postStatus,
            writer: { name: user.name, email: user.email }, // Mantido apenas se tiver legado usando isso
            approvedBy: postStatus === 'published' ? user._id : null,

            pendingChanges: undefined,
            rejectionReason: undefined
        });

        return NextResponse.json(newPost, { status: 201 });

    } catch (error: any) {
        console.error("Erro ao criar post:", error);
        // Tratamento para slug duplicado
        if (error.code === 11000) {
            return NextResponse.json({ error: "Já existe um post com este título/slug." }, { status: 400 });
        }
        return NextResponse.json({ error: error.message || "Erro interno" }, { status: 500 });
    }
}