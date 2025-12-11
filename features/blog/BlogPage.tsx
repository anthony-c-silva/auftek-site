"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Imports visuais
import Hero from '../../components/blog/Hero';
import CategoryFilter from '../../components/blog/CategoryFilter';
import PostCard from '../../components/blog/PostCard';
import Newsletter from '../../components/blog/Newsletter';
import { CategoryType } from '../../types/blog';

export const BlogPage: React.FC = () => {
    const router = useRouter();

    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedCategory, setSelectedCategory] = useState<CategoryType>(CategoryType.ALL);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('/api/posts');
                const data = await response.json();
                setPosts(data);
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
            // --- LÓGICA DE CATEGORIA ---
            let matchesCategory = false;

            if (selectedCategory === CategoryType.ALL) {
                matchesCategory = true;
            } else {
                // Normaliza texto (remove acentos e deixa minúsculo) para comparar
                // Ex: "Energia" vira "energia", "IoT & IA" vira "iot & ia"
                const normalize = (str: string) =>
                    str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

                const targetCategory = normalize(selectedCategory);

                // Verifica se ALGUMA tag do post contém a palavra chave da categoria
                matchesCategory = post.tags?.some((tag: string) => {
                    const normTag = normalize(tag);

                    // Caso Especial: Se o filtro for "IoT & IA", aceita tags como "iot", "ia", "inteligencia"
                    if (targetCategory.includes("iot")) {
                        return normTag.includes("iot") || normTag.includes("ia") || normTag.includes("inteligencia");
                    }

                    // Caso Padrão: Verifica se a tag contém o nome da categoria (ex: tag "Energia Solar" passa no filtro "Energia")
                    return normTag.includes(targetCategory);
                });
            }

            // --- LÓGICA DE BUSCA (Mantida) ---
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch =
                post.title?.toLowerCase().includes(searchLower) ||
                post.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower)) ||
                post.content?.toLowerCase().includes(searchLower);

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
                        {filteredPosts.map((post) => (
                            <PostCard
                                key={post._id}
                                post={{
                                    ...post,
                                    id: post._id,
                                    // 1. CORREÇÃO DA CAPA: De 'coverImage' (Banco) para 'imageUrl' (Componente)
                                    imageUrl: post.coverImage,

                                    // 2. CORREÇÃO DO AUTOR: De 'avatar' para 'avatarUrl'
                                    author: {
                                        name: post.author?.name || "Autor Auftek",
                                        avatarUrl: post.author?.avatar || "/images/default-avatar.png", // Fallback
                                        role: "Colaborador",
                                        bio: "Especialista em tecnologia"
                                    },

                                    // Formatação de dados auxiliares
                                    excerpt: post.content ? post.content.substring(0, 150) + "..." : "",
                                    date: new Date(post.createdAt).toLocaleDateString('pt-BR'),
                                    readTime: "5 min",
                                    category: post.tags?.[0] || "Geral"
                                }}
                                featured={false}
                                onClick={() => router.push(`/blog/${post.slug}`)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-500 text-lg">Nenhum artigo encontrado.</p>
                        {posts.length === 0 && (
                            <p className="text-sm text-red-400 mt-2">
                                (Seu banco de dados parece vazio. Use a rota /api/seed para criar um post de teste)
                            </p>
                        )}
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