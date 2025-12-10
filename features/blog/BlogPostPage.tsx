"use client";

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; // <--- 1. Adicionado useRouter

// Imports
import PostDetail from '../../components/blog/PostDetail';
import Newsletter from '../../components/blog/Newsletter';
import { BLOG_POSTS } from '../../data/mock-blog';

export const BlogPostPage: React.FC = () => {
    const params = useParams();
    const router = useRouter(); // <--- 2. Hook para navegar (voltar)

    // No Next.js, params pode ser undefined inicialmente em alguns casos raros, mas geralmente vem como string
    const id = params?.id;

    // Busca o post correto
    const post = BLOG_POSTS.find(p => p.id === id);

    // Scroll para o topo
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Artigo não encontrado</h1>
                <p className="text-gray-600 mb-8">O conteúdo que você procura pode ter sido removido ou não existe.</p>
                <button
                    onClick={() => router.push('/blog')} // <--- 3. Correção aqui
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
                onBack={() => router.push('/blog')} // <--- 4. Correção aqui
            />
            <Newsletter />
        </div>
    );
};