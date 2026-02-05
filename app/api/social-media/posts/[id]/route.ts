import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SocialMediaPost from "@/lib/models/SocialMediaPost";
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

    if (!isAdmin && !isAuthor) {
      return NextResponse.json(
        { error: "Você não tem permissão para editar esta publicação." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { description, status, rejectionReason, generatedImage, overlayText, originalImages, context, scheduledAt, isCarousel, carouselImages, carouselOverlayTexts } = body;

    if (generatedImage !== undefined) {
      post.generatedImage = generatedImage;
    }
    if (overlayText !== undefined) {
      post.overlayText = overlayText;
    }
    if (originalImages !== undefined) {
      post.originalImages = originalImages;
    }
    if (context !== undefined) {
      post.context = context;
    }
    if (isCarousel !== undefined) {
      post.isCarousel = isCarousel;
    }
    if (carouselImages !== undefined) {
      post.carouselImages = carouselImages;
    }
    if (carouselOverlayTexts !== undefined) {
      post.carouselOverlayTexts = carouselOverlayTexts;
    }

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
      const validStatuses = ['draft', 'pending', 'scheduled', 'published', 're-evaluation', 'rejected'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: "Status inválido." },
          { status: 400 }
        );
      }

      if (isAdmin) {
        if (status === 'published' && (post.status === 'pending' || post.status === 'scheduled')) {
          const effectiveScheduledAt = scheduledAt ? new Date(scheduledAt) : post.scheduledAt;

          if (effectiveScheduledAt && new Date(effectiveScheduledAt) > new Date()) {
            post.status = 'scheduled';
            post.scheduledAt = new Date(effectiveScheduledAt);
            post.approvedBy = user._id;
            post.rejectionReason = '';
          } else {
            post.status = 'published';
            post.publishedAt = new Date();
            post.scheduledAt = null;
            post.approvedBy = user._id;
            post.rejectionReason = '';
          }
        }
        else if (status === 'rejected') {
          if (!rejectionReason || !rejectionReason.trim()) {
            return NextResponse.json(
              { error: "O motivo da rejeição é obrigatório." },
              { status: 400 }
            );
          }
          post.status = 're-evaluation';
          post.rejectionReason = rejectionReason.trim();
          post.approvedBy = undefined;
        }
        else {
          post.status = status;
          if (status === 'published' && !post.publishedAt) {
            post.publishedAt = new Date();
            post.approvedBy = user._id;
          }
        }
      }
      else if (isAuthor) {
        if (status === 'pending' && (post.status === 'rejected' || post.status === 're-evaluation' || post.status === 'draft')) {
          post.status = 'pending';
          post.submittedAt = new Date();
          post.rejectionReason = '';
          if (scheduledAt) {
            post.scheduledAt = new Date(scheduledAt);
          }
        }
        else if (status === 'published') {
          post.status = 'pending';
          post.submittedAt = new Date();
          if (scheduledAt) {
            post.scheduledAt = new Date(scheduledAt);
          }
        }
        else if (status === 'draft') {
          post.status = 'draft';
        }
        else {
          return NextResponse.json(
            { error: "Você não tem permissão para definir este status." },
            { status: 403 }
          );
        }
      }
    } else if (scheduledAt !== undefined && isAuthor) {
      post.scheduledAt = scheduledAt ? new Date(scheduledAt) : null;
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

    if (post.authorId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: "Você não tem permissão para excluir esta publicação." },
        { status: 403 }
      );
    }

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
