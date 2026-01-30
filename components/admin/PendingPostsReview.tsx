"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  Check,
  X,
  Eye,
  User,
  FolderOpen,
  Loader2,
  AlertCircle,
  RefreshCw
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

interface PendingPost {
  _id: string;
  context: string;
  generatedImage: string;
  overlayText: string;
  description: string;
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
  isProcessing: boolean;
}

function PostDetailModal({ post, onClose, onApprove, onReject, isProcessing }: PostDetailModalProps) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Por favor, informe o motivo da rejeição.");
      return;
    }
    await onReject(post._id, rejectionReason);
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

              {/* Description */}
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-2">Descrição</h4>
                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg whitespace-pre-wrap">{post.description}</p>
              </div>
            </div>
          </div>

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
          {showRejectForm ? (
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
          )}
        </div>
      </div>
    </div>
  );
}

export function PendingPostsReview() {
  const [posts, setPosts] = useState<PendingPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<PendingPost | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchPendingPosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/social-media/pending');
      if (!response.ok) {
        throw new Error('Erro ao buscar posts pendentes');
      }
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching pending posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingPosts();
  }, []);

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
        <Check size={48} className="text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-800 mb-2">Nenhum post pendente</h3>
        <p className="text-slate-500 text-sm">
          Todas as publicações foram revisadas. Volte mais tarde para verificar novas submissões.
        </p>
        <button
          onClick={fetchPendingPosts}
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
          <h2 className="text-xl font-bold text-slate-800">Posts Pendentes</h2>
          <p className="text-sm text-slate-500">{posts.length} publicação(ões) aguardando aprovação</p>
        </div>
        <button
          onClick={fetchPendingPosts}
          className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition flex items-center gap-2"
        >
          <RefreshCw size={18} />
          Atualizar
        </button>
      </div>

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
              <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <Clock size={12} />
                Pendente
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
                onClick={() => setSelectedPost(post)}
                className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center justify-center gap-2"
              >
                <Eye size={16} />
                Revisar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
}
