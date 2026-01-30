import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SocialMediaPost from "@/lib/models/SocialMediaPost";
import User from "@/lib/models/User";
import Campaign from "@/lib/models/Campaign";
import { getAuthenticatedUser } from "@/lib/auth-server";

// GET - Fetch all published posts
export async function GET(request: Request) {
    try {
        const user = await getAuthenticatedUser();
        if (!user) {
            return NextResponse.json({ error: "Acesso negado." }, { status: 401 });
        }

        await connectDB();

        // Fetch all published posts (not soft deleted)
        const posts = await SocialMediaPost.find({
            status: 'published',
            deletedAt: null
        })
            .sort({ publishedAt: -1, createdAt: -1 }) // Most recent first
            .lean();

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
            total: enrichedPosts.length
        });

    } catch (error: unknown) {
        console.error("Error fetching published posts:", error);
        return NextResponse.json(
            { error: "Erro ao buscar publicações aprovadas." },
            { status: 500 }
        );
    }
}