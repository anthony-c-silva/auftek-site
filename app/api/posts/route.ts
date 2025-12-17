// app/api/posts/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/lib/models/Post";
// REMOVIDO: import Author from "@/lib/models/Author"; (Não existe mais)
import { getAuthenticatedUser } from "@/lib/auth-server";

function generateSlug(text: string) {
    return text.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
}

export async function GET(request: Request) {
    try {
        await connectDB();
        const user = await getAuthenticatedUser();

        // Visitante não logado (Site Público)
        if (!user) {
            const publicPosts = await Post.find({
                deletedAt: null,
                status: 'published'
            }).sort({ createdAt: -1 });
            return NextResponse.json(publicPosts);
        }

        const isAdmin = user.role === 'admin';
        let filter: any = { deletedAt: null };

        if (!isAdmin) {
            // O Autor vê:
            // 1. Posts Publicados (De todos)
            // 2. Seus próprios posts (mesmo rascunho/pendente)
            filter.$or = [
                { status: 'published' },
                { 'writer.email': user.email }
            ];
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
        // 1. Identifica quem está logado
        const user = await getAuthenticatedUser();
        if (!user) return NextResponse.json({ error: "Acesso negado." }, { status: 401 });

        await connectDB();
        const body = await request.json();

        // 2. Gera Slug se necessário
        let finalSlug = body.slug;
        if (!finalSlug || finalSlug.trim() === "") {
            if (!body.title) return NextResponse.json({ error: "Título obrigatório." }, { status: 400 });
            finalSlug = generateSlug(body.title);
        }

        // 3. MUDANÇA PRINCIPAL: Monta o Autor baseado no Usuário Logado
        // Não buscamos mais Author.findById. O user já tem os dados.
        const authorData = {
            name: user.name,
            photoUrl: user.photoUrl || "",
            bio: user.bio || "",
            education: user.education || "",
            socialLinks: user.socialLinks || {}
        };

        // 4. Define Status (Admin publica direto, Autor vai para pendente)
        let postStatus = body.status || 'pending';
        if (user.role !== 'admin') postStatus = 'pending';

        // 5. Cria o Post
        const newPost = await Post.create({
            ...body,
            slug: finalSlug,
            author: authorData, // Salva o snapshot do perfil atual
            status: postStatus,
            writer: { name: user.name, email: user.email }, // Mantemos para controle interno
            approvedBy: postStatus === 'published' ? user._id : null
        });

        return NextResponse.json(newPost, { status: 201 });
    } catch (error: any) {
        console.error("Erro ao criar post:", error);
        // Tratamento para erro de slug duplicado (código 11000 do Mongo)
        if (error.code === 11000) {
            return NextResponse.json({ error: "Já existe um post com este título/slug." }, { status: 400 });
        }
        return NextResponse.json({ error: error.message || "Erro interno" }, { status: 500 });
    }
}