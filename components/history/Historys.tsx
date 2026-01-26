import React from "react";
import connectDB from "@/lib/mongodb";
import Post from "@/lib/models/Post";
import { HistorysList, Story } from "./HistorysList";
import { unstable_noStore as noStore } from "next/cache";

export const Historys = async () => {
  noStore();

  await connectDB();

  const rawStories = await Post.find({
    category: 'case_study',
    status: 'published',
    deletedAt: null
  })
      .sort({ createdAt: -1 })
      .limit(2)
      .select('title excerpt coverImage tags slug')
      .lean();

  const stories: Story[] = rawStories.map((post: any) => ({
    id: post._id.toString(),
    title: post.title,
    description: post.excerpt || "",
    image: post.coverImage || "",
    slug: post.slug,
    category: (post.tags && post.tags.length > 0) ? post.tags[0] : "Case de Sucesso"
  }));

  return <HistorysList stories={stories} />;
};