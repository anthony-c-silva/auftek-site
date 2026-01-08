import { Metadata } from 'next';
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

export default async function BlogPage() {
    await connectDB();

    const rawPosts = await Post.find({
        status: 'published',
        deletedAt: null
    })
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
            <BlogList initialPosts={posts} />
            <Newsletter />
        </div>
    );
}