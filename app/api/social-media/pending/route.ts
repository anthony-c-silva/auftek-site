import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SocialMediaPost from "@/lib/models/SocialMediaPost";
import Campaign from "@/lib/models/Campaign";
import User from "@/lib/models/User";
import { getAuthenticatedUser } from "@/lib/auth-server";

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const mineOnly = searchParams.get('mine') === 'true';

    if (user.role !== 'admin' && !mineOnly) {
      return NextResponse.json(
        { error: "Apenas administradores podem acessar todas as publicações pendentes." },
        { status: 403 }
      );
    }

    await connectDB();


    const query: Record<string, unknown> = {
      status: { $in: ['pending', 're-evaluation'] },
      deletedAt: null
    };

    if (user.role !== 'admin' || mineOnly) {
      query.authorId = user._id;
    }

    const posts = await SocialMediaPost.find(query)
      .sort({ submittedAt: -1, createdAt: -1 })
      .lean();

    const enrichedPosts = await Promise.all(
      posts.map(async (post) => {
        const campaign = await Campaign.findById(post.campaignId).lean();
        const author = await User.findById(post.authorId).select('name email photoUrl').lean();

        return {
          ...post,
          campaign: campaign ? {
            _id: campaign._id,
            name: campaign.name,
            theme: campaign.theme
          } : null,
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

  } catch (error: unknown) {
    console.error("Error fetching pending posts:", error);
    return NextResponse.json(
      { error: "Erro ao buscar publicações pendentes." },
      { status: 500 }
    );
  }
}
