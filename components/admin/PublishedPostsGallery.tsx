"use client";

import React, { useState, useEffect } from "react";
import {
    X,
    Calendar,
    Check,
    Loader2,
    User,
    FolderOpen,
    RefreshCw,
    CheckCircle
} from "lucide-react";

interface Author {
    _id: string;
    name: string;
    email: string;
    photoUrl?: string;
}

interface Campaign {
    _id: string;
    name: string;
    theme?: string;
}

interface PublishedPost {
    _id: string;
    generatedImage: string;
    overlayText: string;
    description: string;
    context: string;
    postType?: 'educational' | 'informational' | 'promotional' | 'inspirational' | 'entertaining' | 'professional' | 'casual';
    originalImages?: string[];
    aspectRatio: string;
    publishedAt: string;
    createdAt: string;
    author: Author | null;
    campaign: Campaign | null;
    approvedBy?: string;
}

interface PostDetailModalProps {
    post: PublishedPost;
    onClose: () => void;
}

function PostDetailModal({ post, onClose }: PostDetailModalProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getPostTypeLabel = (type?: string) => {
        const types: Record<string, string> = {
            professional: 'Profissional',
            educational: 'Educativo',
            informational: 'Informativo',
            promotional: 'Promocional',
            inspirational: 'Inspirador',
            entertaining: 'Divertido',
            casual: 'Casual'
        };
        return type ? types[type] || type : 'Não especificado';
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="border-b border-slate-200 p-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-800">Detalhes da Publicação</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Image */}
                        <div>
                            <img
                                src={post.generatedImage}
                                alt="Post preview"
                                className="w-full rounded-lg border border-slate-200"
                            />
                        </div>

                        {/* Details */}
                        <div className="space-y-4">
                            {/* Author & Campaign Info */}
                            <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                                <div className="flex items-center gap-3">
                                    {post.author?.photoUrl ? (
                                        <img
                                            src={post.author.photoUrl}
                                            alt={post.author.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                                            <User size={20} className="text-slate-500" />
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm font-medium text-slate-700">
                                            {post.author?.name || 'Autor desconhecido'}
                                        </p>
                                        <p className="text-xs text-slate-500">{post.author?.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <FolderOpen size={18} className="text-slate-400" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-700">
                                            {post.campaign?.name || 'Campanha não encontrada'}
                                        </p>
                                        {post.campaign?.theme && (
                                            <p className="text-xs text-slate-500">{post.campaign.theme}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Calendar size={18} className="text-slate-400" />
                                    <div>
                                        <p className="text-xs text-slate-500">Publicado em</p>
                                        <p className="text-sm font-medium text-slate-700">
                                            {formatDate(post.publishedAt || post.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                                    <CheckCircle size={18} className="text-green-600" />
                                    <span className="text-sm font-medium text-green-700">Publicado</span>
                                </div>
                            </div>

                            {/* Post Type */}
                            {post.postType && (
                                <div>
                                    <h4 className="text-sm font-bold text-slate-700 mb-2">Cunho/Tom</h4>
                                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                                        {getPostTypeLabel(post.postType)}
                                    </p>
                                </div>
                            )}

                            {/* Context */}
                            <div>
                                <h4 className="text-sm font-bold text-slate-700 mb-2">Contexto</h4>
                                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                                    {post.context}
                                </p>
                            </div>

                            {/* Overlay Text */}
                            {post.overlayText && (
                                <div>
                                    <h4 className="text-sm font-bold text-slate-700 mb-2">Texto da Imagem</h4>
                                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                                        {post.overlayText}
                                    </p>
                                </div>
                            )}

                            {/* Description */}
                            <div>
                                <h4 className="text-sm font-bold text-slate-700 mb-2">Descrição</h4>
                                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg whitespace-pre-wrap">
                                    {post.description}
                                </p>
                            </div>

                            {/* Original Images */}
                            {post.originalImages && post.originalImages.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-bold text-slate-700 mb-2">
                                        Imagens Originais ({post.originalImages.length})
                                    </h4>
                                    <div className="grid grid-cols-3 gap-2">
                                        {post.originalImages.map((img, idx) => (
                                            <img
                                                key={idx}
                                                src={img}
                                                alt={`Original ${idx + 1}`}
                                                className="w-full aspect-square object-cover rounded border border-slate-200"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-slate-200 p-4 bg-slate-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition font-medium"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}

export function PublishedPostsGallery() {
    const [posts, setPosts] = useState<PublishedPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState<PublishedPost | null>(null);

    const fetchPublishedPosts = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/social-media/published');
            if (!response.ok) {
                throw new Error('Erro ao buscar publicações aprovadas');
            }
            const data = await response.json();
            setPosts(data.posts || []);
        } catch (error) {
            console.error('Error fetching published posts:', error);
            alert('Erro ao carregar publicações aprovadas');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPublishedPosts();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 size={32} className="animate-spin text-blue-600" />
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
                <CheckCircle size={48} className="text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                    Nenhuma publicação aprovada
                </h3>
                <p className="text-slate-500 text-sm">
                    Quando posts forem aprovados, eles aparecerão aqui.
                </p>
                <button
                    onClick={fetchPublishedPosts}
                    className="mt-4 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition flex items-center gap-2 mx-auto"
                >
                    <RefreshCw size={18} />
                    Atualizar
                </button>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Publicações Aprovadas</h2>
                    <p className="text-sm text-slate-500">
                        {posts.length} publicação(ões) aprovada(s)
                    </p>
                </div>
                <button
                    onClick={fetchPublishedPosts}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition flex items-center gap-2"
                >
                    <RefreshCw size={18} />
                    Atualizar
                </button>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {posts.map((post) => (
                    <div
                        key={post._id}
                        className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition cursor-pointer"
                        onClick={() => setSelectedPost(post)}
                    >
                        {/* Thumbnail */}
                        <div className="aspect-[4/5] relative">
                            <img
                                src={post.generatedImage}
                                alt="Post preview"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                <Check size={12} />
                                Publicado
                            </div>
                        </div>

                        {/* Info */}
                        <div className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                                {post.author?.photoUrl ? (
                                    <img
                                        src={post.author.photoUrl}
                                        alt={post.author.name}
                                        className="w-6 h-6 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                                        <User size={14} className="text-slate-500" />
                                    </div>
                                )}
                                <span className="text-sm font-medium text-slate-700 truncate">
                  {post.author?.name || 'Autor'}
                </span>
                            </div>

                            <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                                {post.overlayText || post.context}
                            </p>

                            <div className="flex items-center justify-between text-xs text-slate-400">
                                <span className="truncate">{post.campaign?.name || 'Sem campanha'}</span>
                                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                                    {formatDate(post.publishedAt || post.createdAt)}
                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detail Modal */}
            {selectedPost && (
                <PostDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />
            )}
        </div>
    );
}