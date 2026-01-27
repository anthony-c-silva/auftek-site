"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

// Interface atualizada: removemos o campo 'author'
interface RelatedPost {
    _id: string;
    title: string;
    slug: string;
    coverImage: string;
}

interface RelatedPostsProps {
    currentId?: string;
    tags: string[];
}

export const RelatedPosts: React.FC<RelatedPostsProps> = ({ currentId, tags }) => {
    const [posts, setPosts] = useState<RelatedPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelated = async () => {
            if (!tags || tags.length === 0 || !currentId) {
                setLoading(false);
                return;
            }

            try {
                // Certifique-se de que a sua API (/api/posts/related) não está mais
                // populando o campo 'author' se você quiser economizar banda,
                // embora não afete o frontend se ele vier e não for usado.
                const res = await fetch('/api/posts/related', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tags, currentId })
                });
                if (res.ok) {
                    const data = await res.json();
                    setPosts(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchRelated();
    }, [currentId, tags]);

    if (loading || (!loading && posts.length === 0)) return null;

    return (
        <div className="space-y-6 animate-fade-in">
            <h3 className="text-lg font-bold text-slate-800 border-l-4 border-blue-600 pl-3">
                Relacionados
            </h3>

            <div className="flex flex-col gap-8">
                {posts.map(post => (
                    // Mudança de layout: agora é flex-col para empilhar imagem e título
                    <Link href={`/blog/${post.slug}`} key={post._id} className="group flex flex-col gap-3">

                        {/* Imagem Grande em destaque */}
                        {/* aspect-[16/9] dá a proporção de vídeo (retangular).
                            Pode mudar para aspect-[4/3] se preferir um pouco mais alta. */}
                        <div className="relative w-full aspect-[16/9] flex-shrink-0 rounded-xl overflow-hidden bg-slate-100 shadow-sm">
                            <img
                                src={post.coverImage}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        {/* Título abaixo da imagem */}
                        <div className="flex-1 min-w-0">
                            {/* Aumentei para text-lg e ajustei o line-height */}
                            <h4 className="text-lg font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-3">
                                {post.title}
                            </h4>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};