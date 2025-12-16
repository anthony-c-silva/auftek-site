"use client"; 

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import CategoryFilter from '@/components/blog/CategoryFilter';
import PostCard from '@/components/blog/PostCard';
import { CategoryType, BlogPost } from '@/types/blog';

interface BlogListProps {
    initialPosts: BlogPost[];
}

export default function BlogList({ initialPosts }: BlogListProps) {
    const router = useRouter();
    
    const [selectedCategory, setSelectedCategory] = useState<CategoryType>(CategoryType.ALL);
    const [searchQuery, setSearchQuery] = useState('');
    const filteredPosts = useMemo(() => {
        return initialPosts.filter(post => {
            let matchesCategory = false;

            if (selectedCategory === CategoryType.ALL) {
                matchesCategory = true;
            } else {
                const normalize = (str: string) =>
                    str ? str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";

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
            const contentText = Array.isArray(post.content) ? post.content.join(" ") : (post.content || "");
            const titleText = post.title || "";

            const matchesSearch =
                titleText.toLowerCase().includes(searchLower) ||
                post.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower)) ||
                contentText.toLowerCase().includes(searchLower);

            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery, initialPosts]);

    return (
        <>
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
                            onClick={() => { setSearchQuery(''); setSelectedCategory(CategoryType.ALL) }}
                            className="mt-4 text-auftek-blue font-semibold hover:underline"
                        >
                            Limpar filtros
                        </button>
                    </div>
                )}
            </main>
        </>
    );
}