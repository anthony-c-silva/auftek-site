import React from "react";
import connectDB from "@/lib/mongodb";
import Post from "@/lib/models/Post";
import { HistorysList, Story } from "./HistorysList";

// Componente Servidor (Async)
export const Historys = async () => {
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

  // 2. Transforma os dados para o formato que o componente visual espera
  const stories: Story[] = rawStories.map((post: any) => ({
    id: post._id.toString(),
    title: post.title,
    description: post.excerpt || "",
    image: post.coverImage || "",
    slug: post.slug,
    // Usa a primeira tag como categoria visual, ou um fallback
    category: (post.tags && post.tags.length > 0) ? post.tags[0] : "Case de Sucesso"
  }));

  // 3. Renderiza o componente Cliente passando os dados
  return <HistorysList stories={stories} />;
};