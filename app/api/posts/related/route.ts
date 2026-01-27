// app/api/posts/related/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/lib/models/Post";

export async function POST(request: Request) {
    try {
        await connectDB();
        const { tags, currentId } = await request.json();

        if (!tags || tags.length === 0) {
            return NextResponse.json([]);
        }

        const relatedPosts = await Post.find({
            tags: { $in: tags },
            _id: { $ne: currentId },
            status: 'published',
            deletedAt: null
        })
            .select('title slug coverImage date category author.name')
            .sort({ createdAt: -1 })
            .limit(4);

        return NextResponse.json(relatedPosts);

    } catch (error) {
        console.error("Erro ao buscar posts relacionados:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}