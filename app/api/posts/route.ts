import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import connectDB from "@/lib/mongodb";
import Post from "@/lib/models/Post";
import { getAuthenticatedUser } from "@/lib/auth-server";
import {calculateReadingTime} from "@/lib/utils/readingTime";

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


        if (!user) {
            const publicFilter: any = {
                deletedAt: null,
                status: 'published'
            };

            if (categoryParam) {
                publicFilter.category = categoryParam;
            }

            const posts = await Post.find(publicFilter).sort({ createdAt: -1 });
            return NextResponse.json(posts, {
                headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' }
            });
        }

        const isAdmin = user.role === 'admin';
        const filter: any = { deletedAt: null };


        if (statusParam) {
            filter.status = statusParam;
        }

        if (categoryParam) {
            filter.category = categoryParam;
        }

        if (!isAdmin) {
            if (statusParam) {
                filter.authorId = user._id;
            } else {
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
        const calculatedTime = calculateReadingTime(body.content || "");

        let finalSlug = body.slug;
        if (!finalSlug || finalSlug.trim() === "") {
            if (!body.title) return NextResponse.json({ error: "Título obrigatório." }, { status: 400 });
            finalSlug = generateSlug(body.title);
        }

        const authorData = {
            name: user.name,
            photoUrl: user.photoUrl || "",
            bio: user.bio || "",
            education: user.education || "",
            socialLinks: user.socialLinks || {}
        };

        let postStatus = 'pending';
        if (user.role === 'admin') {
            postStatus = body.status === 'draft' ? 'draft' : 'published';
        } else {
            postStatus = body.status === 'draft' ? 'draft' : 'pending';
        }

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
            rejectionReason: undefined,
            readTime: `${calculatedTime} min`
        });

        revalidatePath('/blog');
        return NextResponse.json(newPost, { status: 201 });

    } catch (error: any) {
        console.error("Erro ao criar post:", error);
        if (error.code === 11000) {
            return NextResponse.json({ error: "Já existe um post com este título/slug." }, { status: 400 });
        }
        return NextResponse.json({ error: error.message || "Erro interno" }, { status: 500 });
    }
}