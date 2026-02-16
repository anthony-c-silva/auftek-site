import { Metadata } from 'next';
import { Suspense } from 'react';
import connectDB from "@/lib/mongodb";
import Post from "@/lib/models/Post";
import Hero from '@/components/blog/Hero';
import Newsletter from '@/components/blog/Newsletter';
import BlogList from '@/components/blog/BlogList';
import { BlogPost } from '@/types/blog';

export const revalidate = 60;

export const metadata: Metadata = {
    title: 'Blog | Auftek Tecnologia',
    description: 'Artigos sobre IA, IoT, Eficiência Energética e Inovação Industrial.',
};

function BlogListSkeleton() {
    return (
        <div className="container mx-auto px-4 py-12 text-center text-slate-500">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-4">Carregando artigos...</p>
        </div>
    );
}

export default async function BlogPage() {
    await connectDB();

    const rawPosts = await Post.find({
        status: 'published',
        deletedAt: null
    })
        .select('slug title excerpt coverImage createdAt readTime category tags author authorId')
        .sort({ createdAt: -1 })
        .lean();

    const posts: BlogPost[] = rawPosts.map((item: any) => ({
        id: item._id.toString(),
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt || "",
        content: item.content || "",

        imageUrl: item.coverImage || "",

        date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('pt-BR') : "",
        readTime: item.readTime || "5 min",

        category: (item.category === 'case_study' || item.category === 'general')
            ? item.category
            : 'general',

        tags: item.tags || [],

        author: {
            name: item.author?.name || "Autor Auftek",
            photoUrl: item.author?.photoUrl || "",
        },

        authorId: item.authorId ? item.authorId.toString() : "",
    }));

    return (
        <div className="bg-white min-h-screen animate-fade-in">
            <Hero />
            <Suspense fallback={<BlogListSkeleton />}>
                <BlogList initialPosts={posts} />
            </Suspense>

            <Newsletter />
        </div>
    );
}