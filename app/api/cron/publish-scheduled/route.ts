import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SocialMediaPost from "@/lib/models/SocialMediaPost";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const now = new Date();

    const result = await SocialMediaPost.updateMany(
      {
        status: "scheduled",
        scheduledAt: { $lte: now },
        deletedAt: null,
      },
      {
        $set: {
          status: "published",
          publishedAt: now,
        },
      }
    );

    return NextResponse.json({
      success: true,
      publishedCount: result.modifiedCount,
      timestamp: now.toISOString(),
    });
  } catch (error: unknown) {
    console.error("Cron publish-scheduled error:", error);
    return NextResponse.json(
      { error: "Failed to publish scheduled posts" },
      { status: 500 }
    );
  }
}
