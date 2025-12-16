// app/api/posts/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/lib/models/Post";
import Author from "@/lib/models/Author"; // Import necessário para o POST
import { getAuthenticatedUser } from "@/lib/auth-server";

// Função helper de Slug (mantenha a sua função generateSlug aqui)
function generateSlug(text: string) {
    return text.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
}

// ... imports (Mantenha os imports e a função generateSlug)

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

        // --- LÓGICA DE VISIBILIDADE CORRIGIDA ---
        if (!isAdmin) {
            // REDATOR RECEBE:
            // 1. Posts Publicados (De qualquer um)
            // OU
            // 2. Posts DELE Próprio (Mesmo que pendentes)
            filter.$or = [
                { status: 'published' },
                { 'writer.email': user.email }
            ];
        }
        // (Admin continua recebendo TUDO, pois o filtro fica vazio)

        const posts = await Post.find(filter).sort({ createdAt: -1 });
        return NextResponse.json(posts);

    } catch (error) {
        console.error("Erro GET Posts:", error);
        return NextResponse.json({ error: "Erro ao buscar posts" }, { status: 500 });
    }
}

// ... (Mantenha o POST igual)

// ... Mantenha o POST igual ao que arrumamos antes ...
export async function POST(request: Request) {
    // ... (seu código do POST corrigido com slug e author)
    // Se precisar que eu repita o POST, me avise, mas pode manter o anterior.
    // Só lembre de manter os imports lá em cima.
    try {
        const user = await getAuthenticatedUser();
        if (!user) return NextResponse.json({ error: "Acesso negado." }, { status: 401 });

        await connectDB();
        const body = await request.json();

        let finalSlug = body.slug;
        if (!finalSlug || finalSlug.trim() === "") {
            if (!body.title) return NextResponse.json({ error: "Título obrigatório." }, { status: 400 });
            finalSlug = generateSlug(body.title);
        }

        let authorData = body.author; 
        if (body.authorId) {
            const dbAuthor = await Author.findById(body.authorId);
            if (!dbAuthor) return NextResponse.json({ error: "Autor não encontrado." }, { status: 404 });
            authorData = { name: dbAuthor.name, photoUrl: dbAuthor.photoUrl || "" };
        }
        if (!authorData || !authorData.name) return NextResponse.json({ error: "Autor obrigatório." }, { status: 400 });

        let postStatus = body.status || 'pending';
        if (user.role !== 'admin') postStatus = 'pending';

        const newPost = await Post.create({
            ...body,
            slug: finalSlug,
            author: authorData,
            status: postStatus,
            writer: { name: user.name, email: user.email },
            approvedBy: postStatus === 'published' ? user.id : null
        });

        return NextResponse.json(newPost, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Erro" }, { status: 500 });
    }
}