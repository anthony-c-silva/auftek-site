"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CategoryFilter from '@/components/blog/CategoryFilter';
import PostCard from '@/components/blog/PostCard';
import { CategoryType, BlogPost } from '@/types/blog';

interface BlogListProps {
    initialPosts: BlogPost[];
}

export default function BlogList({ initialPosts }: BlogListProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Inicializa a categoria lendo a URL (se existir), senão 'ALL'
    const initialCategory = searchParams.get('category') as CategoryType || CategoryType.ALL;
    const [selectedCategory, setSelectedCategory] = useState<CategoryType>(initialCategory);

    const [searchQuery, setSearchQuery] = useState('');

    // Sincroniza URL quando a categoria muda (UX melhorada para compartilhamento)
    const handleCategoryChange = (category: CategoryType) => {
        setSelectedCategory(category);

        // Atualiza a URL sem recarregar a página inteira
        const params = new URLSearchParams(searchParams.toString());
        if (category === CategoryType.ALL) {
            params.delete('category');
        } else {
            params.set('category', category);
        }
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const filteredPosts = useMemo(() => {
        return initialPosts.filter(post => {
            // 1. Filtro de Categoria (Estrutural)
            let matchesCategory = false;

            if (selectedCategory === CategoryType.ALL) {
                matchesCategory = true;
            } else {
                // Compara o valor do banco ('general' ou 'case_study') com a aba selecionada
                matchesCategory = post.category === selectedCategory;
            }

            // 2. Filtro de Busca (Texto e Tags)
            const searchLower = searchQuery.toLowerCase();
            const contentText = Array.isArray(post.content) ? post.content.join(" ") : (post.content || "");
            const titleText = post.title || "";

            const matchesSearch =
                titleText.toLowerCase().includes(searchLower) ||
                post.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower)) ||
                contentText.toLowerCase().includes(searchLower);

            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery, initialPosts]);

    const getTitle = () => {
        switch (selectedCategory) {
            case CategoryType.GENERAL: return 'Insights & Artigos';
            case CategoryType.CASE_STUDY: return 'Casos de Sucesso';
            default: return 'Últimas Publicações';
        }
    };

    return (
        <>
            <CategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategoryChange}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {getTitle()}
                    </h2>
                    <span className="text-sm text-gray-500">
                        {filteredPosts.length} resultado(s)
                    </span>
                </div>

                {filteredPosts.length > 0 ? (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {filteredPosts.map((post) => (
                            <PostCard
                                key={post.id || post._id}
                                post={post}
                                featured={false}
                                onClick={() => router.push(`/blog/${post.slug}`)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-500 text-lg">
                            {searchQuery
                                ? `Nenhum resultado para "${searchQuery}" nesta categoria.`
                                : "Nenhuma publicação encontrada aqui ainda."}
                        </p>
                        <button
                            onClick={() => { setSearchQuery(''); handleCategoryChange(CategoryType.ALL) }}
                            className="mt-4 text-auftek-blue font-semibold hover:underline"
                        >
                            Ver tudo
                        </button>
                    </div>
                )}
            </main>
        </>
    );
}