import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Campaign from "@/lib/models/Campaign";
import SocialMediaPost from "@/lib/models/SocialMediaPost";
import { getAuthenticatedUser } from "@/lib/auth-server";

// GET - List all campaigns for authenticated user
export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const query: any = {
      authorId: user._id,
      deletedAt: null
    };

    if (status && (status === 'active' || status === 'archived')) {
      query.status = status;
    }

    const campaigns = await Campaign.find(query)
      .sort({ updatedAt: -1 })
      .lean();

    // Get post count for each campaign
    const campaignsWithCounts = await Promise.all(
      campaigns.map(async (campaign) => {
        const postCount = await SocialMediaPost.countDocuments({
          campaignId: campaign._id,
          deletedAt: null
        });

        return {
          ...campaign,
          postCount
        };
      })
    );

    return NextResponse.json({
      success: true,
      campaigns: campaignsWithCounts
    });

  } catch (error: any) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json(
      { error: "Erro ao buscar campanhas." },
      { status: 500 }
    );
  }
}

// POST - Create new campaign
export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { name, description, theme } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "O nome da campanha é obrigatório." },
        { status: 400 }
      );
    }

    // Check for duplicate campaign name for this user
    const existingCampaign = await Campaign.findOne({
      name: name.trim(),
      authorId: user._id,
      deletedAt: null
    });

    if (existingCampaign) {
      return NextResponse.json(
        { error: "Você já possui uma campanha com este nome." },
        { status: 400 }
      );
    }

    const campaign = await Campaign.create({
      name: name.trim(),
      description: description?.trim() || '',
      theme: theme?.trim() || '',
      authorId: user._id,
      status: 'active'
    });

    return NextResponse.json({
      success: true,
      campaign: {
        ...campaign.toObject(),
        postCount: 0
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error("Error creating campaign:", error);

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Você já possui uma campanha com este nome." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao criar campanha." },
      { status: 500 }
    );
  }
}
