import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SocialMediaPost from "@/lib/models/SocialMediaPost";
import User from "@/lib/models/User";
import Campaign from "@/lib/models/Campaign";
import { getAuthenticatedUser } from "@/lib/auth-server";
import mongoose from "mongoose";

// GET - Fetch published posts with pagination and search
export async function GET(request: Request) {
    try {
        const user = await getAuthenticatedUser();
        if (!user) {
            return NextResponse.json({ error: "Acesso negado." }, { status: 401 });
        }

        await connectDB();

        // Parse query parameters
        const { searchParams } = new URL(request.url);
        const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
        const search = searchParams.get('search')?.trim() || '';

        const skip = (page - 1) * limit;

        // Build base match conditions
        const baseMatch: Record<string, unknown> = {
            status: 'published',
            deletedAt: null
        };

        // If search is provided, we need to use aggregation with lookup to search author names
        if (search) {
            // Use aggregation pipeline for efficient search across posts and authors
            const pipeline: mongoose.PipelineStage[] = [
                // Stage 1: Match published posts
                { $match: baseMatch },
                // Stage 2: Lookup author information
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
                // Stage 3: Lookup campaign information
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
                // Stage 4: Unwind lookups (convert arrays to objects)
                {
                    $addFields: {
                        author: { $arrayElemAt: ['$authorData', 0] },
                        campaign: { $arrayElemAt: ['$campaignData', 0] }
                    }
                },
                // Stage 5: Filter by search query (overlayText or author name)
                {
                    $match: {
                        $or: [
                            { overlayText: { $regex: search, $options: 'i' } },
                            { 'author.name': { $regex: search, $options: 'i' } }
                        ]
                    }
                },
                // Stage 6: Remove temporary lookup arrays
                {
                    $project: {
                        authorData: 0,
                        campaignData: 0
                    }
                }
            ];

            // Get total count for pagination (before skip/limit)
            const countPipeline: mongoose.PipelineStage[] = [...pipeline, { $count: 'total' }];
            const countResult = await SocialMediaPost.aggregate(countPipeline);
            const total = countResult[0]?.total || 0;

            // Add sorting and pagination
            pipeline.push(
                { $sort: { publishedAt: -1, createdAt: -1 } },
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

        // Without search: Use simpler query with better performance
        const [posts, total] = await Promise.all([
            SocialMediaPost.find(baseMatch)
                .sort({ publishedAt: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            SocialMediaPost.countDocuments(baseMatch)
        ]);

        // Fetch related authors and campaigns
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

        // Create lookup maps
        const authorMap = new Map(authors.map(a => [a._id.toString(), a]));
        const campaignMap = new Map(campaigns.map(c => [c._id.toString(), c]));

        // Enrich posts with author and campaign data
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
        console.error("Error fetching published posts:", error);
        return NextResponse.json(
            { error: "Erro ao buscar publicações aprovadas." },
            { status: 500 }
        );
    }
}