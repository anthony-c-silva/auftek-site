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

interface PendingPost {
  _id: string;
  context: string;
  generatedImage: string;
  overlayText: string;
  description: string;
  status: 'pending' | 're-evaluation';
  rejectionReason?: string;
  submittedAt: string;
  createdAt: string;
  campaign: Campaign | null;
  author: Author | null;
}

interface PostDetailModalProps {
  post: PendingPost;
  onClose: () => void;
  onApprove: (postId: string) => Promise<void>;
  onReject: (postId: string, reason: string) => Promise<void>;
  onResubmit: (postId: string, description: string) => Promise<void>;
  isProcessing: boolean;
  isAdmin: boolean;
}

function PostDetailModal({ post, onClose, onApprove, onReject, onResubmit, isProcessing, isAdmin }: PostDetailModalProps) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [isEditing, setIsEditing] = useState(post.status === 're-evaluation' && !isAdmin);
  const [editedDescription, setEditedDescription] = useState(post.description);

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Por favor, informe o motivo da rejeição.");
      return;
    }
    await onReject(post._id, rejectionReason);
  };

  const handleResubmit = async () => {
    if (!editedDescription.trim()) {
      alert("A descrição não pode estar vazia.");
      return;
    }
    await onResubmit(post._id, editedDescription);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-slate-200 p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Revisar Publicação</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full"
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
                  <User size={18} className="text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">{post.author?.name || 'Autor desconhecido'}</p>
                    <p className="text-xs text-slate-500">{post.author?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FolderOpen size={18} className="text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">{post.campaign?.name || 'Campanha não encontrada'}</p>
                    {post.campaign?.theme && (
                      <p className="text-xs text-slate-500">{post.campaign.theme}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-slate-400" />
                  <p className="text-sm text-slate-600">
                    Enviado em {new Date(post.submittedAt || post.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {/* Context */}
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-2">Contexto</h4>
                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">{post.context}</p>
              </div>

              {/* Overlay Text */}
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-2">Texto da Imagem</h4>
                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">{post.overlayText}</p>
              </div>

              {/* Description - editable for author when in re-evaluation */}
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-2">
                  Descrição {isEditing && <span className="text-blue-600 font-normal">(Editável)</span>}
                </h4>
                {isEditing ? (
                  <textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="w-full text-sm text-slate-700 bg-white p-3 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[120px]"
                    placeholder="Edite a descrição..."
                  />
                ) : (
                  <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg whitespace-pre-wrap">{post.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Previous Rejection Reason - shown when post is in re-evaluation */}
          {post.status === 're-evaluation' && post.rejectionReason && (
            <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="text-sm font-bold text-orange-700 mb-2 flex items-center gap-2">
                <RefreshCw size={18} />
                Post em Reavaliação - Motivo da Rejeição Anterior
              </h4>
              <p className="text-sm text-orange-600">{post.rejectionReason}</p>
            </div>
          )}

          {/* Rejection Form */}
          {showRejectForm && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="text-sm font-bold text-red-700 mb-2 flex items-center gap-2">
                <AlertCircle size={18} />
                Motivo da Rejeição
              </h4>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Descreva o motivo da rejeição para que o autor possa corrigir..."
                className="w-full text-sm text-slate-700 bg-white p-3 rounded border border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none min-h-[100px]"
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-200 p-4 flex gap-3 justify-end bg-slate-50">
          {isAdmin ? (
            showRejectForm ? (
              <>
                <button
                  onClick={() => setShowRejectForm(false)}
                  disabled={isProcessing}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleReject}
                  disabled={isProcessing || !rejectionReason.trim()}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Rejeitando...
                    </>
                  ) : (
                    <>
                      <X size={18} />
                      Confirmar Rejeição
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowRejectForm(true)}
                  disabled={isProcessing}
                  className="px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium flex items-center gap-2"
                >
                  <X size={18} />
                  Rejeitar
                </button>
                <button
                  onClick={() => onApprove(post._id)}
                  disabled={isProcessing}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Aprovando...
                    </>
                  ) : (
                    <>
                      <Check size={18} />
                      Aprovar e Publicar
                    </>
                  )}
                </button>
              </>
            )
          ) : (
            // Non-admin view - show edit/resubmit for re-evaluation, or just close
            post.status === 're-evaluation' ? (
              <>
                <button
                  onClick={onClose}
                  disabled={isProcessing}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleResubmit}
                  disabled={isProcessing || !editedDescription.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Reenviando...
                    </>
                  ) : (
                    <>
                      <RefreshCw size={18} />
                      Reenviar para Aprovação
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition font-medium"
              >
                Fechar
              </button>
            )
          )}
        </div>
      </div>
    </div>
  )
}

interface PendingPostsReviewProps {
  onEditPost?: (post: PendingPost) => void;
}

export function PendingPostsReview({ onEditPost }: PendingPostsReviewProps) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PendingPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<PendingPost | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const isAdmin = user?.role === 'admin';

  // Search and pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
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

  // Fetch posts when page or debounced search changes
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

      // Remove from list and close modal
      setPosts(posts.filter(p => p._id !== postId));
      setSelectedPost(null);
      alert('Post aprovado e publicado com sucesso!');
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

      // Remove from list and close modal
      setPosts(posts.filter(p => p._id !== postId));
      setSelectedPost(null);
      alert('Post rejeitado. O autor será notificado.');
    } catch (error) {
      console.error('Error rejecting post:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao rejeitar post';
      alert(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handler for author resubmitting after editing
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

      // Remove from list and close modal
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  // Only show empty state when there are no posts AND no active search
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
            {user?.role === 'admin' ? 'Posts Pendentes' : 'Minhas Publicações Pendentes'}
          </h2>
          <p className="text-sm text-slate-500">
            {debouncedSearch
              ? `${posts.length} de ${totalPosts} publicação(ões)`
              : `${totalPosts} publicação(ões) aguardando aprovação`
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition"
          >
            {/* Thumbnail */}
            <div className="aspect-square relative">
              <img
                src={post.generatedImage}
                alt="Post preview"
                className="w-full h-full object-cover"
              />
              <div className={`absolute top-2 right-2 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 ${post.status === 're-evaluation' ? 'bg-orange-500' : 'bg-yellow-500'}`}>
                {post.status === 're-evaluation' ? <RefreshCw size={12} /> : <Clock size={12} />}
                {post.status === 're-evaluation' ? 'Reavaliação' : 'Pendente'}
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                  <User size={14} className="text-slate-500" />
                </div>
                <span className="text-sm font-medium text-slate-700 truncate">
                  {post.author?.name || 'Autor'}
                </span>
              </div>

              <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                {post.context}
              </p>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{post.campaign?.name || 'Sem campanha'}</span>
                <span>
                  {new Date(post.submittedAt || post.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>

              <button
                onClick={() => {
                  // For non-admin with re-evaluation posts, go to full edit if onEditPost is provided
                  if (!isAdmin && post.status === 're-evaluation' && onEditPost) {
                    onEditPost(post);
                  } else {
                    setSelectedPost(post);
                  }
                }}
                className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center justify-center gap-2"
              >
                <Eye size={16} />
                {!isAdmin && post.status === 're-evaluation' && onEditPost ? 'Editar e Reenviar' : 'Revisar'}
              </button>
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

          {/* Page Numbers */}
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
          isProcessing={isProcessing}
          isAdmin={user?.role === 'admin'}
        />
      )}
    </div>
  );
}
