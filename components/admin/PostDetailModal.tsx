"use client";

import React, { useState } from "react";
import {
  X,
  Calendar,
  Clock,
  Check,
  AlertCircle,
  RefreshCw,
  User,
  FolderOpen,
  Send,
  Download,
  Copy,
  Loader2,
  ChevronLeft,
  ChevronRight
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

export interface PostForModal {
  _id: string;
  generatedImage: string;
  overlayText: string;
  description: string;
  context: string;
  postType?: string;
  originalImages?: string[];
  isCarousel?: boolean;
  carouselImages?: string[];
  carouselOverlayTexts?: string[];
  status: 'draft' | 'pending' | 'scheduled' | 'published' | 're-evaluation' | 'rejected';
  rejectionReason?: string;
  scheduledAt?: string;
  publishedAt?: string;
  createdAt: string;
  author?: Author | null;
  campaign?: Campaign | null;
}

interface PostDetailModalProps {
  post: PostForModal;
  onClose: () => void;
  onApprove?: (postId: string) => Promise<void>;
  onReject?: (postId: string, reason: string) => Promise<void>;
  onResubmit?: (postId: string, description: string) => Promise<void>;
  onDelete?: (postId: string) => Promise<void>;
  onEdit?: (post: PostForModal) => void;
  isProcessing?: boolean;
  isAdmin?: boolean;
}

export function PostDetailModal({
  post,
  onClose,
  onApprove,
  onReject,
  onResubmit,
  onDelete,
  onEdit,
  isProcessing = false,
  isAdmin = false
}: PostDetailModalProps) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [editedDescription, setEditedDescription] = useState(post.description);
  const [showEditDescription, setShowEditDescription] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const allSlides = post.isCarousel && post.carouselImages && post.carouselImages.length > 0
    ? [post.generatedImage, ...post.carouselImages]
    : [post.generatedImage];

  const allTexts = post.isCarousel && post.carouselOverlayTexts && post.carouselOverlayTexts.length > 0
    ? [post.overlayText, ...post.carouselOverlayTexts]
    : [post.overlayText];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
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

  const handleCopyDescription = async () => {
    await navigator.clipboard.writeText(post.description);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = allSlides[currentSlide];
    link.download = `post-${post._id}${post.isCarousel ? `-slide-${currentSlide + 1}` : ''}.png`;
    link.click();
  };

  const handleApprove = async () => {
    if (onApprove) await onApprove(post._id);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Por favor, informe o motivo da rejeição.');
      return;
    }
    if (onReject) await onReject(post._id, rejectionReason.trim());
  };

  const handleResubmit = async () => {
    if (onResubmit) await onResubmit(post._id, editedDescription);
  };

  const canApproveReject = isAdmin && (post.status === 'pending' || post.status === 're-evaluation') && onApprove && onReject;
  const canResubmit = (post.status === 'rejected' || post.status === 're-evaluation') && onResubmit;
  const canEdit = (post.status === 're-evaluation' || post.status === 'rejected') && !isAdmin && onEdit;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-slate-900">Detalhes da Publicação</h3>
            {getStatusBadge(post.status)}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Image with actions */}
          <div className={`relative rounded-lg overflow-hidden border border-slate-200 ${post.status !== 'published' ? 'select-none' : ''}`}>
            {post.isCarousel && allSlides.length > 1 && (
              <div className="absolute top-3 left-3 z-10 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                {currentSlide + 1}/{allSlides.length}
              </div>
            )}
            <img
              src={allSlides[currentSlide]}
              alt={allTexts[currentSlide] || "Post preview"}
              className={`w-full ${post.status !== 'published' ? 'pointer-events-none' : ''}`}
              onContextMenu={post.status !== 'published' ? (e) => e.preventDefault() : undefined}
              onDragStart={post.status !== 'published' ? (e) => e.preventDefault() : undefined}
            />
            {post.status !== 'published' && (
              <div
                className="absolute inset-0"
                onContextMenu={(e) => e.preventDefault()}
              />
            )}

            {/* Carousel Navigation */}
            {post.isCarousel && allSlides.length > 1 && (
              <>
                {currentSlide > 0 && (
                  <button
                    onClick={() => setCurrentSlide(currentSlide - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 hover:bg-white rounded-full shadow-md transition z-10"
                  >
                    <ChevronLeft size={20} className="text-slate-700" />
                  </button>
                )}
                {currentSlide < allSlides.length - 1 && (
                  <button
                    onClick={() => setCurrentSlide(currentSlide + 1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 hover:bg-white rounded-full shadow-md transition z-10"
                  >
                    <ChevronRight size={20} className="text-slate-700" />
                  </button>
                )}

                {/* Dot Indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {allSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`w-2 h-2 rounded-full transition ${idx === currentSlide ? 'bg-white shadow-sm scale-125' : 'bg-white/60'}`}
                    />
                  ))}
                </div>
              </>
            )}

            <div className="absolute top-3 right-3 flex gap-2">
              {post.status === 'published' ? (
                <button
                  onClick={handleDownload}
                  className="p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition"
                  title="Baixar imagem"
                >
                  <Download size={16} className="text-slate-600" />
                </button>
              ) : (
                <div
                  className="p-2 bg-white/60 rounded-full shadow-md cursor-not-allowed"
                  title="Download disponível apenas para publicações aprovadas"
                >
                  <Download size={16} className="text-slate-400" />
                </div>
              )}
            </div>
          </div>

          {/* Author & Campaign Info */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-3">
            {post.author && (
              <div className="flex items-center gap-3">
                {post.author.photoUrl ? (
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
                  <p className="text-sm font-medium text-slate-700">{post.author.name}</p>
                  <p className="text-xs text-slate-500">{post.author.email}</p>
                </div>
              </div>
            )}

            {post.campaign && (
              <div className="flex items-center gap-3">
                <FolderOpen size={18} className="text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-700">{post.campaign.name}</p>
                  {post.campaign.theme && (
                    <p className="text-xs text-slate-500">{post.campaign.theme}</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-slate-400" />
              <p className="text-sm text-slate-600">Criado em {formatDate(post.createdAt)}</p>
            </div>

            {post.scheduledAt && (
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-purple-500" />
                <p className="text-sm text-purple-600 font-medium">
                  Agendado para {formatDate(post.scheduledAt)}
                </p>
              </div>
            )}

            {post.publishedAt && (
              <div className="flex items-center gap-3">
                <Check size={18} className="text-green-500" />
                <p className="text-sm text-green-600">Publicado em {formatDate(post.publishedAt)}</p>
              </div>
            )}
          </div>

          {/* Overlay Text */}
          {post.overlayText && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Texto da Imagem</label>
              <p className="text-slate-900 text-lg font-medium">{post.overlayText}</p>
            </div>
          )}

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-slate-700">Descrição</label>
              <button
                onClick={handleCopyDescription}
                className="text-slate-400 hover:text-blue-600 p-1.5 hover:bg-blue-50 rounded transition"
                title="Copiar descrição"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
            </div>
            {showEditDescription && canResubmit ? (
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[120px]"
              />
            ) : (
              <p className="text-slate-900 whitespace-pre-wrap bg-slate-50 p-3 rounded-lg">
                {post.description}
              </p>
            )}
          </div>

          {/* Context */}
          {post.context && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Contexto</label>
              <p className="text-slate-600 text-sm bg-slate-50 p-3 rounded-lg">{post.context}</p>
            </div>
          )}

          {/* Post Type */}
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-500">Cunho/Tom:</span>
            <span className="text-slate-700 font-medium">{getPostTypeLabel(post.postType)}</span>
          </div>

          {/* Original Images */}
          {post.originalImages && post.originalImages.length > 0 && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Imagens Originais ({post.originalImages.length})
              </label>
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

          {/* Rejection Reason Display */}
          {post.rejectionReason && (post.status === 'rejected' || post.status === 're-evaluation') && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle size={18} className="text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-orange-700 mb-1">Motivo da Revisão</p>
                  <p className="text-sm text-orange-600">{post.rejectionReason}</p>
                </div>
              </div>
            </div>
          )}

          {/* Rejection Form (for admin) */}
          {showRejectForm && canApproveReject && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
              <label className="block text-sm font-bold text-red-700">Motivo da Rejeição</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Descreva o motivo da rejeição ou o que precisa ser corrigido..."
                className="w-full p-3 border border-red-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none min-h-[80px]"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleReject}
                  disabled={isProcessing || !rejectionReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 font-medium flex items-center justify-center gap-2"
                >
                  {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <AlertCircle size={16} />}
                  Confirmar Rejeição
                </button>
                <button
                  onClick={() => setShowRejectForm(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {(canApproveReject || canResubmit || canEdit || onDelete) && (
          <div className="border-t border-slate-200 p-4 bg-slate-50 space-y-3">
            {/* Admin Approve/Reject */}
            {canApproveReject && !showRejectForm && (
              <div className="flex gap-3">
                <button
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-medium flex items-center justify-center gap-2"
                >
                  {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                  Aprovar
                </button>
                <button
                  onClick={() => setShowRejectForm(true)}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50 font-medium flex items-center justify-center gap-2"
                >
                  <RefreshCw size={18} />
                  Solicitar Revisão
                </button>
              </div>
            )}

            {/* Author Edit & Resubmit */}
            {canEdit && (
              <button
                onClick={() => onEdit?.(post)}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} />
                Corrigir a publicação
              </button>
            )}

            {canResubmit && !canEdit && (
              <div className="space-y-2">
                {!showEditDescription && (
                  <button
                    onClick={() => setShowEditDescription(true)}
                    className="w-full px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium text-sm"
                  >
                    Editar descrição antes de reenviar
                  </button>
                )}
                <button
                  onClick={handleResubmit}
                  disabled={isProcessing}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium flex items-center justify-center gap-2"
                >
                  {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  Reenviar para Aprovação
                </button>
              </div>
            )}

            {/* Delete */}
            {onDelete && (
              <button
                onClick={() => onDelete(post._id)}
                disabled={isProcessing}
                className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition font-medium text-sm"
              >
                Excluir Publicação
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
