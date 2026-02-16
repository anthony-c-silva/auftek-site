import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Campaign from "@/lib/models/Campaign";
import SocialMediaPost from "@/lib/models/SocialMediaPost";
import { getAuthenticatedUser } from "@/lib/auth-server";
import mongoose from "mongoose";

// GET - Get campaign details with posts
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

    const campaign = await Campaign.findOne({
      _id: id,
      deletedAt: null
    }).lean();

    if (!campaign) {
      return NextResponse.json(
        { error: "Campanha não encontrada." },
        { status: 404 }
      );
    }

    // Check authorization
    if (campaign.authorId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: "Você não tem permissão para acessar esta campanha." },
        { status: 403 }
      );
    }

    // Get posts for this campaign
    const posts = await SocialMediaPost.find({
      campaignId: id,
      deletedAt: null
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      campaign: {
        ...campaign,
        posts
      }
    });

  } catch (error: any) {
    console.error("Error fetching campaign:", error);
    return NextResponse.json(
      { error: "Erro ao buscar campanha." },
      { status: 500 }
    );
  }
}

// PATCH - Update campaign
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
        { error: "ID de campanha inválido." },
        { status: 400 }
      );
    }

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

    // Check authorization
    if (campaign.authorId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: "Você não tem permissão para editar esta campanha." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description, theme, status } = body;

    // Update fields if provided
    if (name !== undefined) {
      if (!name.trim()) {
        return NextResponse.json(
          { error: "O nome da campanha não pode estar vazio." },
          { status: 400 }
        );
      }

      // Check for duplicate name (excluding current campaign)
      const existingCampaign = await Campaign.findOne({
        name: name.trim(),
        authorId: user._id,
        deletedAt: null,
        _id: { $ne: id }
      });

      if (existingCampaign) {
        return NextResponse.json(
          { error: "Você já possui uma campanha com este nome." },
          { status: 400 }
        );
      }

      campaign.name = name.trim();
    }

    if (description !== undefined) {
      campaign.description = description.trim();
    }

    if (theme !== undefined) {
      campaign.theme = theme.trim();
    }

    if (status !== undefined) {
      if (status !== 'active' && status !== 'archived') {
        return NextResponse.json(
          { error: "Status inválido. Use 'active' ou 'archived'." },
          { status: 400 }
        );
      }
      campaign.status = status;
    }

    await campaign.save();

    return NextResponse.json({
      success: true,
      campaign: campaign.toObject()
    });

  } catch (error: any) {
    console.error("Error updating campaign:", error);

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Você já possui uma campanha com este nome." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao atualizar campanha." },
      { status: 500 }
    );
  }
}

// DELETE - Soft delete campaign
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
        { error: "ID de campanha inválido." },
        { status: 400 }
      );
    }

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

    // Check authorization
    if (campaign.authorId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: "Você não tem permissão para excluir esta campanha." },
        { status: 403 }
      );
    }

    // Soft delete the campaign
    campaign.deletedAt = new Date();
    await campaign.save();

    // Also soft delete all posts in this campaign
    await SocialMediaPost.updateMany(
      { campaignId: id, deletedAt: null },
      { deletedAt: new Date() }
    );

    return NextResponse.json({
      success: true,
      message: "Campanha excluída com sucesso."
    });

  } catch (error: any) {
    console.error("Error deleting campaign:", error);
    return NextResponse.json(
      { error: "Erro ao excluir campanha." },
      { status: 500 }
    );
  }
}
