"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PostDetail from '../../components/blog/PostDetail';
import Newsletter from '../../components/blog/Newsletter';

interface BlogPostPageProps {
    slug: string;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug }) => {
    const router = useRouter();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                // Chama a API que acabamos de criar no Passo 1
                const response = await fetch(`/api/posts/${slug}`);

                if (!response.ok) {
                    throw new Error('Post não encontrado');
                }

                const data = await response.json();

                // --- NORMALIZAÇÃO DOS DADOS ---
                // Converte o formato do Banco (String) para o formato do Componente (Array)
                const normalizedPost = {
                    ...data,
                    id: data._id,
                    imageUrl: data.coverImage, // Corrige a imagem de capa

                    // CORREÇÃO CRÍTICA: Transforma o texto string em array de parágrafos
                    // Se não fizer isso, o site quebra no .map
                    content: typeof data.content === 'string'
                        ? data.content.split('\n').filter((p: string) => p.trim() !== "")
                        : data.content,

                    date: new Date(data.createdAt).toLocaleDateString('pt-BR'),
                    readTime: "5 min",
                    category: data.tags?.[0] || "Artigo",
                    author: {
                        name: data.author?.name || "Equipe Auftek",
                        avatarUrl: data.author?.avatar || "/images/default-avatar.png",
                        role: "Autor",
                        bio: "Especialista em tecnologia"
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