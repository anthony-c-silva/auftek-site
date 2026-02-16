import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Tag from "@/lib/models/Tag";
import { getAuthenticatedUser } from "@/lib/auth-server";
import { slugify } from "@/lib/utils/slugify";

export async function GET() {
    try {
        await connectDB();
        const tags = await Tag.find({}).sort({ name: 1 });
        return NextResponse.json(tags, {
            headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' }
        });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar tags" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const currentUser = await getAuthenticatedUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
        }

        const { name } = await request.json();

        if (!name) return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });

        await connectDB();

        const slug = slugify(name);

        const exists = await Tag.findOne({ slug });
        if (exists) {
            return NextResponse.json({ error: "Tag já existe" }, { status: 400 });
        }

        const newTag = await Tag.create({
            name,
            slug
        });

        return NextResponse.json(newTag, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao criar tag" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const currentUser = await getAuthenticatedUser();
        if (!currentUser || currentUser.role !== 'admin') {
            return NextResponse.json({ error: "Apenas admins podem deletar tags" }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });

        await connectDB();
        await Tag.findByIdAndDelete(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao deletar" }, { status: 500 });
    }
}