import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Campaign from "@/lib/models/Campaign";
import SocialMediaPost from "@/lib/models/SocialMediaPost";
import User from "@/lib/models/User";
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

    // Verify campaign exists (any authenticated user can access)
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

    // Enrich posts with author information
    const enrichedPosts = await Promise.all(
      posts.map(async (post) => {
        const author = await User.findById(post.authorId)
          .select('name email photoUrl')
          .lean();

        return {
          ...post,
          author: author ? {
            _id: author._id,
            name: author.name,
            email: author.email,
            photoUrl: author.photoUrl
          } : null
        };
      })
    );

    return NextResponse.json({
      success: true,
      posts: enrichedPosts
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

    // Verify campaign exists (any authenticated user can add posts - will require approval)
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

    const body = await request.json();
    const {
      context,
      postType,
      generatedImage,
      overlayText,
      description,
      originalImages,
      isCarousel,
      carouselImages,
      carouselOverlayTexts,
      status,
      scheduledAt
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

    if (!description || !description.trim()) {
      return NextResponse.json(
        { error: "A descrição é obrigatória." },
        { status: 400 }
      );
    }

    // Determine final status based on user role and scheduling
    let finalStatus: 'draft' | 'pending' | 'scheduled' | 'published' = 'draft';
    let publishedAt: Date | null = null;
    let submittedAt: Date | null = null;

    if (status === 'published') {
      if (user.role === 'admin') {
        // Admins with scheduling go to scheduled, otherwise publish directly
        if (scheduledAt && new Date(scheduledAt) > new Date()) {
          finalStatus = 'scheduled';
        } else {
          finalStatus = 'published';
          publishedAt = new Date();
        }
      } else {
        // Non-admins submit for approval
        finalStatus = 'pending';
        submittedAt = new Date();
      }
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
      isCarousel: isCarousel || false,
      carouselImages: carouselImages || [],
      carouselOverlayTexts: carouselOverlayTexts || [],
      aspectRatio: '4:5',
      status: finalStatus,
      submittedAt,
      publishedAt,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null
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
