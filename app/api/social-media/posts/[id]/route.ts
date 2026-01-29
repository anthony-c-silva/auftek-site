import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SocialMediaPost from "@/lib/models/SocialMediaPost";
import Campaign from "@/lib/models/Campaign";
import { getAuthenticatedUser } from "@/lib/auth-server";
import mongoose from "mongoose";

// GET - Get post details
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
        { error: "ID de publicação inválido." },
        { status: 400 }
      );
    }

    const post = await SocialMediaPost.findOne({
      _id: id,
      deletedAt: null
    }).lean();

    if (!post) {
      return NextResponse.json(
        { error: "Publicação não encontrada." },
        { status: 404 }
      );
    }

    // Check authorization
    if (post.authorId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: "Você não tem permissão para acessar esta publicação." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      post
    });

  } catch (error: any) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Erro ao buscar publicação." },
      { status: 500 }
    );
  }
}

// PATCH - Update post
export async function PATCH(
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
        { error: "ID de publicação inválido." },
        { status: 400 }
      );
    }

    const post = await SocialMediaPost.findOne({
      _id: id,
      deletedAt: null
    });

    if (!post) {
      return NextResponse.json(
        { error: "Publicação não encontrada." },
        { status: 404 }
      );
    }

    // Check authorization
    if (post.authorId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: "Você não tem permissão para editar esta publicação." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { description, status } = body;

    // Only allow updating description and status
    if (description !== undefined) {
      if (!description.trim()) {
        return NextResponse.json(
          { error: "A descrição não pode estar vazia." },
          { status: 400 }
        );
      }
      post.description = description.trim();
    }

    if (status !== undefined) {
      if (status !== 'draft' && status !== 'published') {
        return NextResponse.json(
          { error: "Status inválido. Use 'draft' ou 'published'." },
          { status: 400 }
        );
      }

      // If changing to published and not already published, set publishedAt
      if (status === 'published' && post.status !== 'published') {
        post.publishedAt = new Date();
      }

      post.status = status;
    }

    await post.save();

    return NextResponse.json({
      success: true,
      post: post.toObject()
    });

  } catch (error: any) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar publicação." },
      { status: 500 }
    );
  }
}

// DELETE - Soft delete post
export async function DELETE(
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
        { error: "ID de publicação inválido." },
        { status: 400 }
      );
    }

    const post = await SocialMediaPost.findOne({
      _id: id,
      deletedAt: null
    });

    if (!post) {
      return NextResponse.json(
        { error: "Publicação não encontrada." },
        { status: 404 }
      );
    }

    // Check authorization
    if (post.authorId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: "Você não tem permissão para excluir esta publicação." },
        { status: 403 }
      );
    }

    // Soft delete the post
    post.deletedAt = new Date();
    await post.save();

    return NextResponse.json({
      success: true,
      message: "Publicação excluída com sucesso."
    });

  } catch (error: any) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Erro ao excluir publicação." },
      { status: 500 }
    );
  }
}
