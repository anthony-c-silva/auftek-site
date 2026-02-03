"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Clock,
  Check,
  X,
  Eye,
  User,
  FolderOpen,
  Loader2,
  AlertCircle,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { PostDetailModal, PostForModal } from "./PostDetailModal";

interface PendingPostsReviewProps {
  onEditPost?: (post: PostForModal) => void;
}

export function PendingPostsReview({ onEditPost }: PendingPostsReviewProps) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostForModal[]>([]);
  const [selectedPost, setSelectedPost] = useState<PostForModal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const postsPerPage = 20;

  // Debounce timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce search input
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

  const fetchPendingPosts = useCallback(async (page: number, search: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: postsPerPage.toString(),
      });

      if (user?.role !== 'admin') {
        params.set('mine', 'true');
      }

      if (search.trim()) {
        params.set('search', search.trim());
      }

      const response = await fetch(`/api/social-media/pending?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar posts pendentes');
      }
      const data = await response.json();
      setPosts(data.posts || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalPosts(data.pagination?.total || 0);
    } catch (error) {
      console.error('Error fetching pending posts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.role, postsPerPage]);

  useEffect(() => {
    if (user) {
      fetchPendingPosts(currentPage, debouncedSearch);
    }
  }, [currentPage, debouncedSearch, fetchPendingPosts, user]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleApprove = async (postId: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch(`/api/social-media/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'published' })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao aprovar post');
      }

      setPosts(posts.filter(p => p._id !== postId));
      setSelectedPost(null);
      alert('Post aprovado com sucesso!');
    } catch (error) {
      console.error('Error approving post:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao aprovar post';
      alert(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (postId: string, reason: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch(`/api/social-media/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'rejected',
          rejectionReason: reason
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao rejeitar post');
      }

      setPosts(posts.filter(p => p._id !== postId));
      setSelectedPost(null);
      alert('Post enviado para revisão. O autor será notificado.');
    } catch (error) {
      console.error('Error rejecting post:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao rejeitar post';
      alert(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResubmit = async (postId: string, newDescription: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch(`/api/social-media/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: newDescription,
          status: 'pending'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao reenviar post');
      }

      setPosts(posts.filter(p => p._id !== postId));
      setSelectedPost(null);
      alert('Post reenviado para aprovação!');
    } catch (error) {
      console.error('Error resubmitting post:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao reenviar post';
      alert(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    if (status === 're-evaluation') {
      return (
        <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <RefreshCw size={12} />
          Em Revisão
        </span>
      );
    }
    return (
      <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
        <Clock size={12} />
        Pendente
      </span>
    );
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
        <Check size={48} className="text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-800 mb-2">Nenhum post pendente</h3>
        <p className="text-slate-500 text-sm">
          {user?.role === 'admin'
            ? 'Todas as publicações foram revisadas. Volte mais tarde para verificar novas submissões.'
            : 'Você não tem publicações pendentes de aprovação no momento.'
          }
        </p>
        <button
          onClick={() => fetchPendingPosts(currentPage, debouncedSearch)}
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
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            {user?.role === 'admin' ? 'Publicações para Revisão' : 'Minhas Publicações Pendentes'}
          </h2>
          <p className="text-sm text-slate-500">
            {debouncedSearch
              ? `${posts.length} de ${totalPosts} publicação(ões)`
              : `${totalPosts} publicação(ões) ${user?.role === 'admin' ? 'aguardando revisão' : 'pendente(s)'}`
            }
          </p>
        </div>
        <button
          onClick={() => fetchPendingPosts(currentPage, debouncedSearch)}
          className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition flex items-center gap-2"
        >
          <RefreshCw size={18} />
          Atualizar
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por autor ou título do post..."
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

      {/* No Results Message */}
      {posts.length === 0 && debouncedSearch && !isLoading && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center mb-6">
          <Search size={32} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">Nenhum resultado encontrado</p>
          <p className="text-slate-400 text-sm mt-1">
            Tente buscar por outro autor ou título
          </p>
        </div>
      )}

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
              <div className="absolute top-2 right-2">
                {getStatusBadge(post.status)}
              </div>
              {/* Rejection indicator */}
              {post.rejectionReason && (
                <div className="absolute bottom-2 left-2 right-2 bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded flex items-center gap-1">
                  <AlertCircle size={12} />
                  Revisão necessária
                </div>
              )}
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
                <span className="truncate flex items-center gap-1">
                  <FolderOpen size={12} />
                  {post.campaign?.name || 'Sem campanha'}
                </span>
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
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
          onApprove={handleApprove}
          onReject={handleReject}
          onResubmit={handleResubmit}
          onEdit={onEditPost ? (post) => {
            setSelectedPost(null);
            onEditPost(post);
          } : undefined}
          isProcessing={isProcessing}
          isAdmin={user?.role === 'admin'}
        />
      )}
    </div>
  );
}
