"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PostDetail from '@/components/blog/PostDetail';
import Newsletter from '@/components/blog/Newsletter';
import { BlogPost } from '@/types/blog';

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
    const router = useRouter();
    const { slug } = React.use(params);
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`/api/posts/${slug}`);

                if (!response.ok) {
                    throw new Error('Post não encontrado');
                }

                const data = await response.json();

                // Normalização dos dados
                const normalizedPost: BlogPost = {
                    ...data,
                    id: data._id, // Garante compatibilidade de ID
                    slug: data.slug,
                    title: data.title,
                    excerpt: data.excerpt || "",

                    // Fallback para garantir a imagem independente do nome no banco
                    imageUrl: data.coverImage || data.imageUrl || "",

                    tags: data.tags || [],

                    // Garante que content seja string[] (array) para o componente
                    content: typeof data.content === 'string'
                        ? data.content.split('\n').filter((p: string) => p.trim() !== "")
                        : data.content,

                    date: new Date(data.createdAt).toLocaleDateString('pt-BR'),

                    // --- CORREÇÃO: Tempo de Leitura Dinâmico ---
                    readTime: data.readTime || "5 min",

                    category: data.tags?.[0] || "Artigo",

                    author: {
                        name: data.author?.name || "Equipe Auftek",

                        // --- CORREÇÃO: Foto do Autor ---
                        // Prioriza photoUrl (novo padrão), tenta avatar (antigo), ou vazio
                        photoUrl: data.author?.photoUrl || data.author?.avatar || "",

                        // Mantemos propriedades extras caso o PostDetail precise delas
                        avatarUrl: data.author?.photoUrl || data.author?.avatar || "",
                        avatar: data.author?.photoUrl || data.author?.avatar || "",

                        role: data.author?.education || "Autor", // Tenta puxar a educação/cargo
                        bio: data.author?.bio || "Especialista em tecnologia"
                    }
                };

                setPost(normalizedPost);
            } catch (error) {
                console.error("Erro ao buscar post:", error);
                setPost(null);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchPost();
        }

        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-auftek-blue"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Artigo não encontrado</h1>
                <button
                    onClick={() => router.push('/blog')}
                    className="bg-auftek-blue text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
                >
                    Voltar para o Blog
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white animate-fade-in">
            <PostDetail
                post={post}
                onBack={() => router.push('/blog')}
            />
            <Newsletter />
        </div>
    );
};