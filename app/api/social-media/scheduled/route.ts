import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SocialMediaPost from "@/lib/models/SocialMediaPost";
import Campaign from "@/lib/models/Campaign";
import User from "@/lib/models/User";
import { getAuthenticatedUser } from "@/lib/auth-server";
import mongoose from "mongoose";

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const search = searchParams.get('search')?.trim() || '';

    await connectDB();

    const skip = (page - 1) * limit;

    const baseMatch: Record<string, unknown> = {
      status: 'scheduled',
      deletedAt: null
    };

    if (search) {
      const pipeline: mongoose.PipelineStage[] = [
        { $match: baseMatch },
        {
          $lookup: {
            from: 'users',
            localField: 'authorId',
            foreignField: '_id',
            as: 'authorData',
            pipeline: [
              { $match: { deletedAt: null } },
              { $project: { _id: 1, name: 1, email: 1, photoUrl: 1 } }
            ]
          }
        },
        {
          $lookup: {
            from: 'campaigns',
            localField: 'campaignId',
            foreignField: '_id',
            as: 'campaignData',
            pipeline: [
              { $match: { deletedAt: null } },
              { $project: { _id: 1, name: 1, theme: 1 } }
            ]
          }
        },
        {
          $addFields: {
            author: { $arrayElemAt: ['$authorData', 0] },
            campaign: { $arrayElemAt: ['$campaignData', 0] }
          }
        },
        {
          $match: {
            $or: [
              { overlayText: { $regex: search, $options: 'i' } },
              { 'author.name': { $regex: search, $options: 'i' } }
            ]
          }
        },
        { $project: { authorData: 0, campaignData: 0 } }
      ];

      const countPipeline: mongoose.PipelineStage[] = [...pipeline, { $count: 'total' }];
      const countResult = await SocialMediaPost.aggregate(countPipeline);
      const total = countResult[0]?.total || 0;

      pipeline.push(
        { $sort: { scheduledAt: 1 } },
        { $skip: skip },
        { $limit: limit }
      );

      const posts = await SocialMediaPost.aggregate(pipeline);

      return NextResponse.json({
        success: true,
        posts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1
        }
      });
    }

    const [posts, total] = await Promise.all([
      SocialMediaPost.find(baseMatch)
        .sort({ scheduledAt: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      SocialMediaPost.countDocuments(baseMatch)
    ]);

    const authorIds = [...new Set(posts.map(p => p.authorId.toString()))];
    const campaignIds = [...new Set(posts.map(p => p.campaignId.toString()))];

    const [authors, campaigns] = await Promise.all([
      User.find({ _id: { $in: authorIds }, deletedAt: null })
        .select('_id name email photoUrl')
        .lean(),
      Campaign.find({ _id: { $in: campaignIds }, deletedAt: null })
        .select('_id name theme')
        .lean()
    ]);

    const authorMap = new Map(authors.map(a => [a._id.toString(), a]));
    const campaignMap = new Map(campaigns.map(c => [c._id.toString(), c]));

    const enrichedPosts = posts.map(post => ({
      ...post,
      author: authorMap.get(post.authorId.toString()) || null,
      campaign: campaignMap.get(post.campaignId.toString()) || null
    }));

    return NextResponse.json({
      success: true,
      posts: enrichedPosts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    });

  } catch (error: unknown) {
    console.error("Error fetching scheduled posts:", error);
    return NextResponse.json(
      { error: "Erro ao buscar publicações agendadas." },
      { status: 500 }
    );
  }
}
