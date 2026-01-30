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

// PATCH - Update post (includes approval/rejection workflow)
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

    const isAdmin = user.role === 'admin';
    const isAuthor = post.authorId.toString() === user._id.toString();

    // Check authorization - admins can update any post, authors can update their own
    if (!isAdmin && !isAuthor) {
      return NextResponse.json(
        { error: "Você não tem permissão para editar esta publicação." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { description, status, rejectionReason } = body;

    // Update description if provided
    if (description !== undefined) {
      if (!description.trim()) {
        return NextResponse.json(
          { error: "A descrição não pode estar vazia." },
          { status: 400 }
        );
      }
      post.description = description.trim();
    }

    // Handle status changes
    if (status !== undefined) {
      const validStatuses = ['draft', 'pending', 'published', 're-evaluation', 'rejected'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: "Status inválido." },
          { status: 400 }
        );
      }

      // --- ADMIN ACTIONS ---
      if (isAdmin) {
        // Admin approving a pending post
        if (status === 'published' && post.status === 'pending') {
          post.status = 'published';
          post.publishedAt = new Date();
          post.approvedBy = user._id;
          post.rejectionReason = '';
        }
        // Admin rejecting a post
        else if (status === 'rejected') {
          if (!rejectionReason || !rejectionReason.trim()) {
            return NextResponse.json(
              { error: "O motivo da rejeição é obrigatório." },
              { status: 400 }
            );
          }
          post.status = 'rejected';
          post.rejectionReason = rejectionReason.trim();
          post.approvedBy = undefined;
        }
        // Admin can set any status directly
        else {
          post.status = status;
          if (status === 'published' && !post.publishedAt) {
            post.publishedAt = new Date();
            post.approvedBy = user._id;
          }
        }
      }
      // --- AUTHOR ACTIONS ---
      else if (isAuthor) {
        // Author resubmitting after rejection
        if (status === 'pending' && (post.status === 'rejected' || post.status === 're-evaluation' || post.status === 'draft')) {
          post.status = 'pending';
          post.submittedAt = new Date();
          post.rejectionReason = '';
        }
        // Author trying to publish directly - redirect to pending
        else if (status === 'published') {
          post.status = 'pending';
          post.submittedAt = new Date();
        }
        // Author can save as draft
        else if (status === 'draft') {
          post.status = 'draft';
        }
        // Author cannot set other statuses
        else {
          return NextResponse.json(
            { error: "Você não tem permissão para definir este status." },
            { status: 403 }
          );
        }
      }
    }

    await post.save();

    return NextResponse.json({
      success: true,
      post: post.toObject()
    });

  } catch (error: unknown) {
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
