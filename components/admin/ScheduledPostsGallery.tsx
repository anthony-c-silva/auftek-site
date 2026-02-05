"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Calendar,
  Clock,
  X,
  User,
  FolderOpen,
  Loader2,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Layers
} from "lucide-react";
import { PostDetailModal, PostForModal } from "./PostDetailModal";

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

interface ScheduledPost {
  _id: string;
  generatedImage: string;
  overlayText: string;
  description: string;
  context: string;
  scheduledAt: string;
  createdAt: string;
  author: Author | null;
  campaign: Campaign | null;
  approvedBy?: string;
}

export function ScheduledPostsGallery() {
  const [posts, setPosts] = useState<PostForModal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<PostForModal | null>(null);
  const postsPerPage = 20;
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery]);

  const fetchScheduledPosts = useCallback(async (page: number, search: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: postsPerPage.toString(),
      });
      if (search.trim()) {
        params.set('search', search.trim());
      }

      const response = await fetch(`/api/social-media/scheduled?${params.toString()}`);
      if (!response.ok) throw new Error('Erro ao buscar posts agendados');

      const data = await response.json();
      if (data.success) {
        setPosts(data.posts || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalPosts(data.pagination?.total || 0);
      }
    } catch (error) {
      console.error('Error fetching scheduled posts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [postsPerPage]);

  useEffect(() => {
    fetchScheduledPosts(currentPage, debouncedSearch);
  }, [currentPage, debouncedSearch, fetchScheduledPosts]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDelete = async (postId: string) => {
    const post = posts.find(p => p._id === postId);
    if (!post || !post.scheduledAt) return;

    const scheduledDate = new Date(post.scheduledAt).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    if (!confirm(`Este post está agendado para ${scheduledDate}.\n\nAo excluir, o agendamento será cancelado. Deseja continuar?`)) {
      return;
    }

    setDeletingPostId(postId);
    try {
      const response = await fetch(`/api/social-media/posts/${postId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erro ao excluir post');

      setPosts(posts.filter(p => p._id !== postId));
      setSelectedPost(null);
      setTotalPosts(prev => prev - 1);
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Erro ao excluir post agendado');
    } finally {
      setDeletingPostId(null);
    }
  };

  const formatScheduledDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    let countdown = '';
    if (diff > 0) {
      if (days > 0) {
        countdown = `em ${days}d ${hours % 24}h`;
      } else if (hours > 0) {
        countdown = `em ${hours}h`;
      } else {
        const minutes = Math.floor(diff / (1000 * 60));
        countdown = `em ${minutes}min`;
      }
    }

    return {
      date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      countdown
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (posts.length === 0 && !debouncedSearch && totalPosts === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
        <Calendar size={48} className="text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-800 mb-2">
          Nenhuma publicação agendada
        </h3>
        <p className="text-slate-500 text-sm">
          Posts aprovados com agendamento aparecerão aqui.
        </p>
        <button
          onClick={() => fetchScheduledPosts(currentPage, debouncedSearch)}
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
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Publicações Agendadas</h2>
          <p className="text-sm text-slate-500">
            {debouncedSearch
              ? `${posts.length} de ${totalPosts} publicação(ões)`
              : `${totalPosts} publicação(ões) agendada(s)`
            }
          </p>
        </div>
        <button
          onClick={() => fetchScheduledPosts(currentPage, debouncedSearch)}
          className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition flex items-center gap-2"
        >
          <RefreshCw size={18} />
          Atualizar
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por autor ou título..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {posts.length === 0 && debouncedSearch && !isLoading && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center mb-6">
          <Search size={32} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">Nenhum resultado encontrado</p>
          <p className="text-slate-400 text-sm mt-1">Tente buscar por outro autor ou título</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {posts.map((post) => {
          const scheduled = formatScheduledDate(post.scheduledAt || post.createdAt);
          return (
            <div
              key={post._id}
              onClick={() => setSelectedPost(post)}
              className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition group cursor-pointer"
            >
              <div className="aspect-square relative">
                <img
                  src={post.generatedImage}
                  alt={post.overlayText || "Post agendado"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Clock size={12} />
                  {scheduled.countdown || 'Agendado'}
                </div>
                {post.isCarousel && (
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Layers size={12} />
                    {1 + (post.carouselImages?.length || 0)}
                  </div>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(post._id); }}
                  disabled={deletingPostId === post._id}
                  className="absolute top-2 left-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-700 disabled:opacity-50"
                  title="Excluir post agendado"
                >
                  {deletingPostId === post._id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>
              </div>

              <div className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <User size={14} className="text-slate-400" />
                  <span className="text-xs font-medium text-slate-600 truncate">
                    {post.author?.name || 'Autor'}
                  </span>
                </div>

                {post.overlayText && (
                  <p className="text-sm font-medium text-slate-800 line-clamp-1 mb-1">
                    {post.overlayText}
                  </p>
                )}

                <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
                  <FolderOpen size={12} />
                  <span className="truncate">{post.campaign?.name || 'Campanha'}</span>
                </div>

                <div className="bg-purple-50 rounded p-2 flex items-center gap-2">
                  <Calendar size={14} className="text-purple-600" />
                  <div>
                    <p className="text-xs font-medium text-purple-700">{scheduled.date}</p>
                    <p className="text-xs text-purple-600">{scheduled.time}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                if (page === 1 || page === totalPages) return true;
                if (Math.abs(page - currentPage) <= 1) return true;
                return false;
              })
              .map((page, index, arr) => {
                const showEllipsisBefore = index > 0 && page - arr[index - 1] > 1;
                return (
                  <React.Fragment key={page}>
                    {showEllipsisBefore && (
                      <span className="px-2 text-slate-400">...</span>
                    )}
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`min-w-[36px] h-9 rounded-lg font-medium text-sm transition ${currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                );
              })
            }
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
