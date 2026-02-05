"use client";

import React, { useState, useEffect } from "react";
import { X, MessageSquare, ArrowLeft, Clock, Check, AlertCircle, RefreshCw, Calendar } from "lucide-react";
import { PostDetailModal, PostForModal } from "./PostDetailModal";
import { useAuth } from "@/context/AuthContext";

interface CampaignPostsGalleryProps {
  campaignId: string;
  campaignName: string;
  onClose: () => void;
  onEditPost?: (post: PostForModal) => void;
}

export function CampaignPostsGallery({ campaignId, campaignName, onClose, onEditPost }: CampaignPostsGalleryProps) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostForModal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<PostForModal | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const getStatusBadge = (status: PostForModal['status']) => {
    const config = {
      draft: { label: 'Rascunho', color: 'bg-slate-500', icon: null },
      pending: { label: 'Pendente', color: 'bg-yellow-500', icon: Clock },
      scheduled: { label: 'Agendado', color: 'bg-purple-500', icon: Calendar },
      published: { label: 'Publicado', color: 'bg-green-500', icon: Check },
      're-evaluation': { label: 'Em Revisão', color: 'bg-orange-500', icon: RefreshCw },
      rejected: { label: 'Rejeitado', color: 'bg-red-500', icon: AlertCircle }
    }[status] || { label: status, color: 'bg-slate-500', icon: null };

    const IconComponent = config.icon;
    return (
      <span className={`${config.color} text-white text-xs px-2 py-1 rounded-full flex items-center gap-1`}>
        {IconComponent && <IconComponent size={12} />}
        {config.label}
      </span>
    );
  };

  const handleResubmit = async (postId: string) => {
    setIsProcessing(true);
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

      setPosts(posts.map(p =>
        p._id === postId ? { ...p, status: 'pending' as const, rejectionReason: '' } : p
      ));
      setSelectedPost(null);
      alert('Post reenviado para aprovação!');
    } catch (error) {
      console.error('Erro ao reenviar:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao reenviar post';
      alert(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta publicação?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/social-media/posts/${postId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao excluir publicação');
      }

      setPosts(posts.filter(p => p._id !== postId));
      setSelectedPost(null);
    } catch (error) {
      console.error('Error deleting post:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir publicação';
      alert(errorMessage);
    } finally {
      setIsDeleting(false);
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
        <PostDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onResubmit={handleResubmit}
          onDelete={user?.role === 'admin' ? handleDelete : undefined}
          onEdit={onEditPost ? (post) => {
            setSelectedPost(null);
            onClose();
            onEditPost(post);
          } : undefined}
          isProcessing={isProcessing || isDeleting}
          isAdmin={user?.role === 'admin'}
        />
      )}
    </div>
  );
}
