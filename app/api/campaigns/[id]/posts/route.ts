import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Campaign from "@/lib/models/Campaign";
import SocialMediaPost from "@/lib/models/SocialMediaPost";
import { getAuthenticatedUser } from "@/lib/auth-server";
import mongoose from "mongoose";

// GET - List all posts in a campaign
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "ID de campanha inválido." },
        { status: 400 }
      );
    }

    // Verify campaign exists and user owns it
    const campaign = await Campaign.findOne({
      _id: id,
      deletedAt: null
    });

    if (!campaign) {
      return NextResponse.json(
        { error: "Campanha não encontrada." },
        { status: 404 }
      );
    }

    if (campaign.authorId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: "Você não tem permissão para acessar esta campanha." },
        { status: 403 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const query: any = {
      campaignId: id,
      deletedAt: null
    };

    if (status && (status === 'draft' || status === 'published')) {
      query.status = status;
    }

    const posts = await SocialMediaPost.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      posts
    });

  } catch (error: any) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Erro ao buscar publicações." },
      { status: 500 }
    );
  }
}

// POST - Create new post in campaign
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "ID de campanha inválido." },
        { status: 400 }
      );
    }

    // Verify campaign exists and user owns it
    const campaign = await Campaign.findOne({
      _id: id,
      deletedAt: null
    });

    if (!campaign) {
      return NextResponse.json(
        { error: "Campanha não encontrada." },
        { status: 404 }
      );
    }

    if (campaign.authorId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: "Você não tem permissão para adicionar publicações a esta campanha." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      context,
      postType,
      generatedImage,
      overlayText,
      description,
      originalImages,
      status
    } = body;

    // Validate required fields
    if (!context || !context.trim()) {
      return NextResponse.json(
        { error: "O contexto é obrigatório." },
        { status: 400 }
      );
    }

    if (!generatedImage) {
      return NextResponse.json(
        { error: "A imagem gerada é obrigatória." },
        { status: 400 }
      );
    }

    if (!overlayText || !overlayText.trim()) {
      return NextResponse.json(
        { error: "O texto sobreposto é obrigatório." },
        { status: 400 }
      );
    }

    if (!description || !description.trim()) {
      return NextResponse.json(
        { error: "A descrição é obrigatória." },
        { status: 400 }
      );
    }

    const post = await SocialMediaPost.create({
      campaignId: id,
      authorId: user._id,
      context: context.trim(),
      postType: postType,
      generatedImage,
      overlayText: overlayText.trim(),
      description: description.trim(),
      originalImages: originalImages || [],
      aspectRatio: '4:5',
      status: status === 'published' ? 'published' : 'draft',
      publishedAt: status === 'published' ? new Date() : null
    });

    return NextResponse.json({
      success: true,
      post: post.toObject()
    }, { status: 201 });

  } catch (error: any) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Erro ao criar publicação." },
      { status: 500 }
    );
  }
}
