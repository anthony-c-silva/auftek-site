import React from "react";
import { BlogPostPage } from "../../../features/blog/BlogPostPage";
import connectDB from "@/lib/mongodb";
import Post from "@/lib/models/Post";
import { Metadata } from "next";

// 1. MUDANÇA: params agora é uma Promise no Next.js 15
type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    // 2. MUDANÇA: Precisamos dar 'await' no params antes de usar
    const { slug } = await params;

    await connectDB();
    const post = await Post.findOne({ slug });

    if (!post) {
        return {
            title: "Artigo não encontrado | Auftek",
        };
    }

    return {
        title: `${post.title} | Blog Auftek`,
        description: post.content.substring(0, 160),
        openGraph: {
            title: post.title,
            description: post.content.substring(0, 160),
            images: [post.coverImage || "/images/BioAiLabIllustration.png"],
        },
    };
}

// 3. MUDANÇA: O componente Page deve ser async para dar await no params
export default async function Page({ params }: Props) {
    const { slug } = await params;

    // Agora passamos a string slug resolvida
    return <BlogPostPage slug={slug} />;
}