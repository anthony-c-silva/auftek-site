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
        const categoryParam = searchParams.get('category');

        // ==========================================================
        // 1. Visitante (Público)
        // ==========================================================
        if (!user) {
            const publicFilter: any = {
                deletedAt: null,
                status: 'published'
            };

            // Se o visitante clicou na aba "Cases", filtramos aqui
            if (categoryParam) {
                publicFilter.category = categoryParam;
            }

            return NextResponse.json(await Post.find(publicFilter).sort({ createdAt: -1 }));
        }

        // ==========================================================
        // 2. Usuário Logado (Admin ou Autor)
        // ==========================================================
        const isAdmin = user.role === 'admin';
        let filter: any = { deletedAt: null };

        // Filtro de Status (ex: Painel Admin vendo pendentes)
        if (statusParam) {
            filter.status = statusParam;
        }

        // Filtro de Categoria (ex: Painel filtrando só Cases)
        if (categoryParam) {
            filter.category = categoryParam; // <--- NOVO: Aplica o filtro
        }

        // Restrições de Visibilidade (Quem vê o quê)
        if (!isAdmin) {
            if (statusParam) {
                // Se pediu status específico, vê apenas os SEUS posts naquele status
                filter.authorId = user._id;
            } else {
                // Feed Misto: Tudo que é público OU tudo que é meu (mesmo rascunho)
                // Nota: O filtro de categoria acima (filter.category) continua valendo para ambas as condições
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

        // 2. Monta Autor (Snapshot)
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

        // 4. Valida Categoria (NOVO)
        // Garante que só entra 'general' ou 'case_study'. Se vier lixo, vira 'general'.
        const validCategories = ['general', 'case_study'];
        const finalCategory = validCategories.includes(body.category) ? body.category : 'general';

        const newPost = await Post.create({
            ...body,
            slug: finalSlug,
            authorId: user._id,
            author: authorData,
            status: postStatus,
            category: finalCategory,
            writer: { name: user.name, email: user.email },
            approvedBy: postStatus === 'published' ? user._id : null,
            pendingChanges: undefined,
            rejectionReason: undefined
        });

        return NextResponse.json(newPost, { status: 201 });

    } catch (error: any) {
        console.error("Erro ao criar post:", error);
        if (error.code === 11000) {
            return NextResponse.json({ error: "Já existe um post com este título/slug." }, { status: 400 });
        }
        return NextResponse.json({ error: error.message || "Erro interno" }, { status: 500 });
    }
}