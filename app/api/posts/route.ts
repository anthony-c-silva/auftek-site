import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/lib/models/Post";
import Author from "@/lib/models/Author";
import { slugify } from "@/lib/utils/slugify";
import { getAuthenticatedUser } from "@/lib/auth-server";

// Interface para tipar o corpo da requisição (evita any)
interface CreatePostBody {
    title: string;
    content: string;
    coverImage: string;
    tags: string[];
    readTime?: string;
    slug?: string;
    authorId: string;
}

export async function GET() {
    try {
        await connectDB();
        const posts = await Post.find({ deletedAt: null }).sort({ createdAt: -1 });
        return NextResponse.json(posts);
    } catch (error: unknown) {
        console.error("Erro GET:", error);
        return NextResponse.json({ error: "Erro ao buscar posts" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        // 1. SEGURANÇA
        const user = await getAuthenticatedUser();
        if (!user) {
            return NextResponse.json(
                { error: "Acesso negado. Token inválido ou ausente." },
                { status: 401 }
            );
        }

        await connectDB();

        // Tipagem segura da requisição
        const body = await request.json() as CreatePostBody;

        // 2. VALIDAÇÃO DE AUTOR
        if (!body.authorId) {
            return NextResponse.json(
                { error: "É obrigatório selecionar um Autor válido." },
                { status: 400 }
            );
        }

        const registeredAuthor = await Author.findById(body.authorId);
        if (!registeredAuthor) {
            return NextResponse.json(
                { error: "Autor não encontrado no banco de dados." },
                { status: 400 }
            );
        }

        // 3. SLUG
        const slug = body.slug || slugify(body.title);

        const existingPost = await Post.findOne({ slug });
        if (existingPost) {
            return NextResponse.json(
                { error: "Já existe um post com este título/slug." },
                { status: 400 }
            );
        }


        const newPost = await Post.create({
            title: body.title,
            content: body.content,
            coverImage: body.coverImage,
            tags: body.tags,
            readTime: body.readTime,
            slug,
            createdAt: new Date(),

            author: {
                name: registeredAuthor.name,
                photoUrl: registeredAuthor.photoUrl || "", // Fallback para string vazia se undefined
            },

            writer: {
                name: user.name,
                email: user.email
            }
        });

        return NextResponse.json(newPost, { status: 201 });

    } catch (error: unknown) {
        let errorMessage = "Erro interno ao criar post.";

        if (error instanceof Error) {
            console.error("Erro POST:", error.message);
            errorMessage = error.message;
        } else {
            console.error("Erro desconhecido POST:", error);
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}