import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Post from "@/lib/models/Post";
import PostDetail from '@/components/blog/PostDetail';
import Newsletter from '@/components/blog/Newsletter';
import { BlogPost } from '@/types/blog';
import { Metadata } from 'next';

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    await connectDB();

    const post = await Post.findOne({ slug, status: 'published' }).lean() as any;

    if (!post) {
        return { title: "Artigo não encontrado" };
    }

    return {
        title: `${post.title} | Auftek Blog`,
        description: post.excerpt || post.content.substring(0, 160),
        openGraph: {
            title: post.title,
            description: post.excerpt || post.content.substring(0, 160),
            images: [post.coverImage],
            type: 'article',
            authors: [post.author?.name || "Auftek Team"]
        },
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;

    await connectDB();

    const data = await Post.findOne({ slug }).lean() as any;

    if (!data) {
        notFound();
    }

    const normalizedPost: BlogPost = {
        id: data._id.toString(),
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt || "",
        imageUrl: data.coverImage,
        tags: data.tags || [],

        // Mantém a lógica de transformar string em array de parágrafos se necessário
        content: typeof data.content === 'string'
            ? data.content.split('\n').filter((p: string) => p.trim() !== "")
            : data.content,

        date: new Date(data.createdAt).toLocaleDateString('pt-BR'),
        readTime: data.readTime || "5 min",
        category: data.tags?.[0] || "Artigo",

        authorId: data.authorId || data.approvedBy?.toString() || "",

        author: {
            name: data.author?.name || "Equipe Auftek",
            photoUrl: data.author?.photoUrl || "",

            // Dados reais do banco
            bio: data.author?.bio || "Especialista em tecnologia",
            education: data.author?.education || "",

            // Links sociais (agora sem erros)
            socialLinks: data.author?.socialLinks || {}
        }
    };

    // JSON-LD
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": normalizedPost.title,
        "image": normalizedPost.imageUrl,
        "author": {
            "@type": "Person",
            "name": normalizedPost.author.name
        },
        "datePublished": normalizedPost.date,
    };

    return (
        <div className="bg-white animate-fade-in">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <PostDetail
                post={normalizedPost}
            />

            <Newsletter />
        </div>
    );
}