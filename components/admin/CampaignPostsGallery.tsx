"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar, MessageSquare, ArrowLeft, Clock, Check, AlertCircle, Send, RefreshCw, User } from "lucide-react";

interface Author {
  _id: string;
  name: string;
  email: string;
  photoUrl?: string;
}

interface Post {
  _id: string;
  generatedImage: string;
  overlayText: string;
  description: string;
  context: string;
  postType?: string;
  originalImages?: string[];
  status: 'draft' | 'pending' | 'published' | 're-evaluation' | 'rejected';
  rejectionReason?: string;
  author?: Author | null;
  createdAt: string;
}

interface CampaignPostsGalleryProps {
  campaignId: string;
  campaignName: string;
  onClose: () => void;
}

export function CampaignPostsGallery({ campaignId, campaignName, onClose }: CampaignPostsGalleryProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [campaignId]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/campaigns/${campaignId}/posts`);

      if (!response.ok) {
        throw new Error('Erro ao buscar posts');
      }

      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
      alert('Erro ao carregar publicações da campanha');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
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

  const getStatusBadge = (status: Post['status']) => {
    const statusConfig = {
      draft: { label: 'Rascunho', color: 'bg-slate-500', icon: null },
      pending: { label: 'Pendente', color: 'bg-yellow-500', icon: Clock },
      published: { label: 'Publicado', color: 'bg-green-500', icon: Check },
      're-evaluation': { label: 'Em Revisão', color: 'bg-orange-500', icon: RefreshCw },
      rejected: { label: 'Rejeitado', color: 'bg-red-500', icon: AlertCircle }
    };
    const config = statusConfig[status] || statusConfig.draft;
    const IconComponent = config.icon;
    return (
      <span className={`${config.color} text-white text-xs px-2 py-1 rounded-full flex items-center gap-1`}>
        {IconComponent && <IconComponent size={12} />}
        {config.label}
      </span>
    );
  };

  const handleResubmit = async (postId: string) => {
    try {
      const response = await fetch(`/api/social-media/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'pending' })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao reenviar post');
      }

      // Update local state
      setPosts(posts.map(p =>
        p._id === postId ? { ...p, status: 'pending', rejectionReason: '' } : p
      ));
      setSelectedPost(null);
      alert('Post reenviado para aprovação!');
    } catch (error) {
      console.error('Erro ao reenviar:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao reenviar post';
      alert(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded transition"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-white">{campaignName}</h2>
              <p className="text-blue-100 text-sm">
                {posts.length} {posts.length === 1 ? 'publicação' : 'publicações'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-600">Carregando publicações...</p>
              </div>
            </div>
          ) : posts.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <MessageSquare size={64} className="text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">Nenhuma publicação ainda</h3>
                <p className="text-slate-600">
                  Crie sua primeira publicação nesta campanha!
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {posts.map((post) => (
                <button
                  key={post._id}
                  onClick={() => setSelectedPost(post)}
                  className="group relative aspect-[4/5] rounded-lg overflow-hidden border-2 border-slate-200 hover:border-blue-500 transition-all hover:shadow-lg"
                >
                  <img
                    src={post.generatedImage}
                    alt={post.overlayText}
                    className="w-full h-full object-cover"
                  />
                  {/* Status Badge */}
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(post.status)}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-sm font-medium line-clamp-2">
                        {post.overlayText}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Detalhes da Publicação</h3>
              <button
                onClick={() => setSelectedPost(null)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Image */}
              <div className="rounded-lg overflow-hidden border border-slate-200">
                <img
                  src={selectedPost.generatedImage}
                  alt={selectedPost.overlayText}
                  className="w-full"
                />
              </div>

              {/* Overlay Text */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Texto da Imagem
                </label>
                <p className="text-slate-900 text-lg font-medium">
                  {selectedPost.overlayText}
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Descrição
                </label>
                <p className="text-slate-900 whitespace-pre-wrap">
                  {selectedPost.description}
                </p>
              </div>

              {/* Context */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Contexto
                </label>
                <p className="text-slate-600 text-sm">
                  {selectedPost.context}
                </p>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    Cunho/Tom
                  </label>
                  <p className="text-slate-900 text-sm">
                    {getPostTypeLabel(selectedPost.postType)}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    Data de Criação
                  </label>
                  <div className="flex items-center gap-1 text-slate-900 text-sm">
                    <Calendar size={14} />
                    {formatDate(selectedPost.createdAt)}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    Publicado por
                  </label>
                  <div className="flex items-center gap-2">
                    {selectedPost.author?.photoUrl ? (
                      <img
                        src={selectedPost.author.photoUrl}
                        alt={selectedPost.author.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                        <User size={14} className="text-slate-500" />
                      </div>
                    )}
                    <p className="text-slate-900 text-sm truncate">
                      {selectedPost.author?.name || 'Desconhecido'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Original Images */}
              {selectedPost.originalImages && selectedPost.originalImages.length > 0 && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Imagens Originais ({selectedPost.originalImages.length})
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedPost.originalImages.map((img, idx) => (
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

              {/* Status Section */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      Status
                    </label>
                    {getStatusBadge(selectedPost.status)}
                  </div>
                </div>

                {/* Rejection Reason */}
                {selectedPost.status === 'rejected' && selectedPost.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-red-700 mb-1">Motivo da Rejeição</p>
                        <p className="text-sm text-red-600">{selectedPost.rejectionReason}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Resubmit Button */}
                {(selectedPost.status === 'rejected' || selectedPost.status === 're-evaluation') && (
                  <button
                    onClick={() => handleResubmit(selectedPost._id)}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
                  >
                    <Send size={18} />
                    Reenviar para Aprovação
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
