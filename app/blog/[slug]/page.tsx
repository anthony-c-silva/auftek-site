import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Post from "@/lib/models/Post";
import PostDetail from '@/components/blog/PostDetail';
import Newsletter from '@/components/blog/Newsletter';
import { BlogPost } from '@/types/blog';
import { Metadata } from 'next';
import { cache } from 'react';

export const revalidate = 60;

export const dynamicParams = true;

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

const getPost = cache(async (slug: string) => {
    try {
        await connectDB();
        return await Post.findOne({
            slug,
            deletedAt: null
        }).lean().exec();
    } catch (error) {
        console.error('Error fetching post:', error);
        return null;
    }
});

const stripHtml = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, '');
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    try {
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
    } catch (error) {
        console.error('Error generating metadata:', error);
        return { title: "Auftek Blog" };
    }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    try {
        const { slug } = await params;
        const data = await getPost(slug) as any;

        if (!data) {
            notFound();
        }

        const normalizeCategory = (cat: string): 'general' | 'case_study' => {
            if (cat === 'case_study') return 'case_study';
            return 'general';
        };

        const normalizedPost: BlogPost = {
            _id: data._id.toString(),
            id: data._id.toString(),
            slug: data.slug,
            title: data.title,
            excerpt: data.excerpt || "",
            imageUrl: data.coverImage,
            tags: data.tags || [],
            content: data.content,
            date: new Date(data.createdAt).toLocaleDateString('pt-BR'),
            readTime: data.readTime || "5 min",
            category: normalizeCategory(data.category || 'general'),
            authorId: data.authorId || "",
            writer: {
                name: data.writer?.name || "",
                email: data.writer?.email || ""
            },
            author: {
                name: data.author?.name || "Equipe Auftek",
                photoUrl: data.author?.photoUrl || "",
                bio: data.author?.bio || "Especialista em tecnologia",
                education: data.author?.education || "",
                socialLinks: data.author?.socialLinks || {}
            }
        };

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
            "description": data.excerpt || stripHtml(data.content).substring(0, 160)
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
    } catch (error) {
        console.error('Error rendering blog post:', error);
        notFound();
    }
}