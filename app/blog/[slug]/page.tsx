import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Post from "@/lib/models/Post";
import PostDetail from '@/components/blog/PostDetail';
import Newsletter from '@/components/blog/Newsletter';
import { BlogPost } from '@/types/blog';
import { Metadata } from 'next';
import { cache } from 'react';

// Configuração ISR: Atualiza o cache a cada 60 segundos se houver novos acessos
export const revalidate = 60;

// Permite que posts criados DEPOIS do build sejam gerados na hora (e depois cacheados)
export const dynamicParams = true;

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    await connectDB();

    // Busca apenas os slugs dos posts PUBLICADOS para pré-renderizar
    const posts = await Post.find({
        status: 'published',
        deletedAt: null
    }, 'slug').lean();

    return posts.map((post: any) => ({
        slug: post.slug,
    }));
}

// Cache da requisição de dados (evita duplicidade no Metadata + Page)
const getPost = cache(async (slug: string) => {
    await connectDB();
    return Post.findOne({ slug, deletedAt: null }).lean();
});

const stripHtml = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, '');
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPost(slug) as any;

    if (!post) {
        return { title: "Publicação não encontrada" };
    }

    const description = post.excerpt || stripHtml(post.content).substring(0, 160) + "...";
    const publishedTime = new Date(post.createdAt).toISOString();
    const modifiedTime = new Date(post.updatedAt || post.createdAt).toISOString();

    return {
        title: `${post.title} | Auftek Blog`,
        description: description,
        alternates: {
            canonical: `/blog/${slug}`,
        },
        openGraph: {
            title: post.title,
            description: description,
            url: `/blog/${slug}`,
            type: 'article',
            publishedTime: publishedTime,
            modifiedTime: modifiedTime,
            images: [
                {
                    url: post.coverImage,
                    alt: post.title,
                }
            ],
            authors: [post.author?.name || "Auftek Team"]
        },
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;

    const data = await getPost(slug) as any;

    if (!data) {
        notFound();
    }

    // Normalização dos dados
    const normalizedPost: BlogPost = {
        id: data._id.toString(),
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt || "",
        imageUrl: data.coverImage,
        tags: data.tags || [],
        content: typeof data.content === 'string'
            ? data.content.split('\n').filter((p: string) => p.trim() !== "")
            : data.content,
        date: new Date(data.createdAt).toLocaleDateString('pt-BR'),
        readTime: data.readTime || "5 min",
        category: data.tags?.[0] || "Artigo",
        authorId: data.authorId || "",
        author: {
            name: data.author?.name || "Equipe Auftek",
            photoUrl: data.author?.photoUrl || "",
            bio: data.author?.bio || "Especialista em tecnologia",
            education: data.author?.education || "",
            socialLinks: data.author?.socialLinks || {}
        }
    };

    // JSON-LD
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": normalizedPost.title,
        "image": [normalizedPost.imageUrl],
        "datePublished": new Date(data.createdAt).toISOString(),
        "dateModified": new Date(data.updatedAt || data.createdAt).toISOString(),
        "author": {
            "@type": "Person",
            "name": normalizedPost.author.name
        },
        "publisher": {
            "@type": "Organization",
            "name": "Auftek",
            "logo": {
                "@type": "ImageObject",
                "url": "https://auftek.com/logo.png"
            }
        },
        "description": data.excerpt || stripHtml(typeof data.content === 'string' ? data.content : '').substring(0, 160)
    };

    return (
        <div className="bg-white animate-fade-in">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <PostDetail post={normalizedPost} />
            <Newsletter />
        </div>
    );
}