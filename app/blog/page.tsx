"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Imports com Alias
import Hero from '@/components/blog/Hero';
import CategoryFilter from '@/components/blog/CategoryFilter';
import PostCard from '@/components/blog/PostCard';
import Newsletter from '@/components/blog/Newsletter';
import { CategoryType, BlogPost } from '@/types/blog'; // Importamos o tipo correto

export default function BlogPage() {
    const router = useRouter();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedCategory, setSelectedCategory] = useState<CategoryType>(CategoryType.ALL);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('/api/posts');
                const data = await response.json();

                // 2. NORMALIZAÇÃO IMEDIATA:
                // Transformamos os dados brutos do banco (data) no formato BlogPost aqui.
                // Isso limpa o código lá embaixo no return.
                const normalizedPosts: BlogPost[] = data.map((item: any) => ({
                    id: item._id,
                    slug: item.slug,
                    title: item.title,
                    // Gera o resumo se não existir
                    excerpt: item.content ? item.content.substring(0, 150) + "..." : "",
                    content: item.content, // Mantemos string para a busca funcionar
                    imageUrl: item.coverImage,
                    date: new Date(item.createdAt).toLocaleDateString('pt-BR'),
                    readTime: "5 min",
                    category: item.tags?.[0] || "Geral",
                    tags: item.tags || [],
                    author: {
                        name: item.author?.name || "Autor Auftek",
                        // Mapeia para o novo campo 'avatar' e garante string vazia no fallback
                        avatar: item.author?.avatar || "",
                        role: "Colaborador",
                        bio: "Especialista em tecnologia"
                    }
                }));

                setPosts(normalizedPosts);
            } catch (error) {
                console.error("Erro ao buscar posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            let matchesCategory = false;

            if (selectedCategory === CategoryType.ALL) {
                matchesCategory = true;
            } else {
                const normalize = (str: string) =>
                    str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

                const targetCategory = normalize(selectedCategory);

                matchesCategory = post.tags?.some((tag: string) => {
                    const normTag = normalize(tag);
                    if (targetCategory.includes("iot")) {
                        return normTag.includes("iot") || normTag.includes("ia") || normTag.includes("inteligencia");
                    }
                    return normTag.includes(targetCategory);
                });
            }

            const searchLower = searchQuery.toLowerCase();

            // Verificação segura de conteúdo (pode ser string ou array, dependendo da normalização)
            const contentText = Array.isArray(post.content) ? post.content.join(" ") : post.content;

            const matchesSearch =
                post.title?.toLowerCase().includes(searchLower) ||
                post.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower)) ||
                (contentText && contentText.toLowerCase().includes(searchLower));

            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery, posts]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-auftek-blue"></div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen animate-fade-in">
            <Hero />

            <CategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {selectedCategory === CategoryType.ALL ? 'Últimas Publicações' : selectedCategory}
                    </h2>
                    <span className="text-sm text-gray-500">
                        {filteredPosts.length} artigo(s) encontrado(s)
                    </span>
                </div>

                {filteredPosts.length > 0 ? (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {/* 3. RENDERIZAÇÃO LIMPA: Como já normalizamos antes, passamos o objeto direto */}
                        {filteredPosts.map((post) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                featured={false}
                                onClick={() => router.push(`/blog/${post.slug}`)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-500 text-lg">Nenhum artigo encontrado.</p>
                        <button
                            onClick={() => {setSearchQuery(''); setSelectedCategory(CategoryType.ALL)}}
                            className="mt-4 text-auftek-blue font-semibold hover:underline"
                        >
                            Limpar filtros
                        </button>
                    </div>
                )}
            </main>

            <Newsletter />
        </div>
    );
};