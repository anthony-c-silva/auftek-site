import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/lib/models/Post";
import { slugify } from "@/lib/utils/slugify";

export async function GET() {
    try {
        await connectDB();

        // FILTRO NOVO: Traz apenas onde deletedAt é null
        const posts = await Post.find({ deletedAt: null }).sort({ createdAt: -1 });

        return NextResponse.json(posts);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar posts" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const slug = body.slug || slugify(body.title);
        const newPost = await Post.create({ ...body, slug });
        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao criar" }, { status: 500 });
    }
}