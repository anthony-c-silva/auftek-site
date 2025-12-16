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

// 1. GERAÇÃO DE METADADOS (SEO)
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    await connectDB();
    
    // Busca o post
    const post = await Post.findOne({ slug, status: 'published' });

    if (!post) {
        return { title: "Artigo não encontrado" };
    }

    return {
        title: `${post.title} | Auftek Blog`,
        description: post.excerpt || post.content.substring(0, 160),
        openGraph: {
            title: post.title,
            description: post.excerpt || post.content.substring(0, 160),
            // CORREÇÃO: Usamos post.coverImage (definido no Model)
            images: [post.coverImage], 
            type: 'article',
            authors: [post.author?.name || "Auftek Team"]
        },
    };
}

// 2. PÁGINA (SERVER COMPONENT)
export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;

    await connectDB();

    const data = await Post.findOne({ slug }).populate('author').lean();

    if (!data) {
        notFound();
    }

    // --- NORMALIZAÇÃO DOS DADOS ---
    const normalizedPost: BlogPost = {
        // @ts-ignore: _id vem do Mongoose
        id: data._id.toString(),
        // @ts-ignore
        slug: data.slug,
        // @ts-ignore
        title: data.title,
        
        // @ts-ignore: Agora o excerpt existe na interface, mas como usamos .lean(), o TS pode reclamar
        excerpt: data.excerpt || "",

        // --- CORREÇÃO AQUI ---
        // O Frontend espera 'imageUrl', mas o Banco entrega 'coverImage'.
        // Removemos 'data.imageUrl' porque ele não existe na interface IPost.
        // @ts-ignore
        imageUrl: data.coverImage, 
        
        // @ts-ignore
        tags: data.tags || [],

        // @ts-ignore
        content: typeof data.content === 'string'
            // @ts-ignore
            ? data.content.split('\n').filter((p: string) => p.trim() !== "")
            // @ts-ignore
            : data.content,

        // @ts-ignore
        date: new Date(data.createdAt).toLocaleDateString('pt-BR'),
        // @ts-ignore
        readTime: data.readTime || "5 min",
        // @ts-ignore
        category: data.tags?.[0] || "Artigo",

        author: {
            // @ts-ignore
            name: data.author?.name || "Equipe Auftek",
            // @ts-ignore
            photoUrl: data.author?.photoUrl || "",
            // @ts-ignore
            avatarUrl: data.author?.photoUrl || "",
            // @ts-ignore
            avatar: data.author?.photoUrl || "",
            
            // Tenta pegar education ou bio se existirem, senão fallback
            // @ts-ignore
            role: "Autor", 
            // @ts-ignore
            bio: "Especialista em tecnologia"
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