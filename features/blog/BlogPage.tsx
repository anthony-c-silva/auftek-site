"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import Hero from '../../components/blog/Hero';
import CategoryFilter from '../../components/blog/CategoryFilter';
import PostCard from '../../components/blog/PostCard';
import Newsletter from '../../components/blog/Newsletter';
import { BLOG_POSTS } from '../../data/mock-blog';
import { CategoryType } from '../../types/blog';

export const BlogPage: React.FC = () => {
    const router = useRouter(); // <--- 4. Instancia o router
    const [selectedCategory, setSelectedCategory] = useState<CategoryType>(CategoryType.ALL);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPosts = useMemo(() => {
        return BLOG_POSTS.filter(post => {
            const matchesCategory = selectedCategory === CategoryType.ALL || post.category === selectedCategory;

            const searchLower = searchQuery.toLowerCase();
            const matchesSearch =
                post.title.toLowerCase().includes(searchLower) ||
                post.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
                post.excerpt.toLowerCase().includes(searchLower);

            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    return (
        <div className="bg-white min-h-screen animate-fade-in">
            {/* Removi o <SEO /> daqui. No Next App Router, metadata fica no page.tsx pai */}

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
                                key={post.id}
                                post={post}
                                featured={false}
                                onClick={(p) => router.push(`/blog/${p.id}`)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-500 text-lg">Nenhum artigo encontrado para sua busca.</p>
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