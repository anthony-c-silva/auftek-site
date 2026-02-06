"use client";

import React from "react";
import { Copy, Check, Save, Send, AlertCircle, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { PostFormat, FORMAT_CONFIG } from "@/lib/format-config";

interface GeneratedPostPreviewProps {
  generatedImage: string;
  overlayText: string;
  description: string;
  originalImages: string[];
  campaign?: { _id: string; tone?: string; name?: string };
  context?: string;
  isAdmin?: boolean;
  editPostId?: string;
  rejectionReason?: string;
  isCarousel?: boolean;
  carouselImages?: string[];
  carouselOverlayTexts?: string[];
  postFormat?: PostFormat;
  onEditComplete?: () => void;
}

export function GeneratedPostPreview({ generatedImage, overlayText, description, originalImages, campaign, context, isAdmin = false, editPostId, rejectionReason, isCarousel, carouselImages, carouselOverlayTexts, postFormat = 'feed', onEditComplete }: GeneratedPostPreviewProps) {
  const [copiedDescription, setCopiedDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  const allSlides = isCarousel && carouselImages && carouselImages.length > 0
    ? [generatedImage, ...carouselImages]
    : [generatedImage];

  const allTexts = isCarousel && carouselOverlayTexts && carouselOverlayTexts.length > 0
    ? [overlayText, ...carouselOverlayTexts]
    : [overlayText];

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    return now.toISOString().slice(0, 16);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedDescription(true);
      setTimeout(() => setCopiedDescription(false), 2000);
    } catch (error) {
      console.error("Erro ao copiar:", error);
    }
  };



  const handleSavePost = async (status: 'draft' | 'published' = 'draft') => {
    if (!campaign) {
      alert('Selecione uma campanha para salvar o post');
      return;
    }

    setIsSaving(true);
    try {
      let response;

      if (editPostId) {
        response = await fetch(`/api/social-media/posts/${editPostId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            generatedImage,
            overlayText,
            description: editedDescription,
            originalImages,
            context: context || 'Post gerado via IA',
            status: 'pending',
            scheduledAt: isScheduled && scheduledAt ? new Date(scheduledAt).toISOString() : null,
            isCarousel: isCarousel || false,
            carouselImages: carouselImages || [],
            carouselOverlayTexts: carouselOverlayTexts || [],
            format: postFormat,
            aspectRatio: FORMAT_CONFIG[postFormat].aspectRatio,
          }),
        });
      } else {
        response = await fetch(`/api/campaigns/${campaign._id}/posts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            context: context || 'Post gerado via IA',
            postType: campaign.tone || 'professional',
            generatedImage,
            overlayText,
            description: editedDescription,
            originalImages,
            format: postFormat,
            aspectRatio: FORMAT_CONFIG[postFormat].aspectRatio,
            status: status,
            scheduledAt: isScheduled && scheduledAt ? new Date(scheduledAt).toISOString() : null,
            isCarousel: isCarousel || false,
            carouselImages: carouselImages || [],
            carouselOverlayTexts: carouselOverlayTexts || [],
          }),
        });
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao salvar post');
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);

      if (editPostId) {
        alert('Post reenviado para aprovação!');
        onEditComplete?.();
      } else if (status === 'draft') {
        alert('Rascunho salvo com sucesso!');
      } else if (isAdmin) {
        alert('Post publicado com sucesso!');
      } else {
        alert('Post enviado para aprovação!');
      }
    } catch (error: unknown) {
      console.error('Erro ao salvar post:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar post';
      alert(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = () => {
    handleSavePost('published');
  };

  return (
    <div className="space-y-6">
      {/* Rejection Reason Banner - shown in edit mode */}
      {editPostId && rejectionReason && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-orange-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-orange-700 mb-1">Motivo da Rejeição Anterior</h4>
              <p className="text-sm text-orange-600">{rejectionReason}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm">{editPostId ? 'Editar' : 'IA'}</span>
          {editPostId ? 'Editar Publicação' : 'Resultados Gerados'}
        </h3>

        {/* Generated Image */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-slate-700">
              {isCarousel ? `Carrossel (${currentSlide + 1}/${allSlides.length})` : 'Imagem Gerada'}
            </h4>
            {isCarousel && (
              <span className="text-xs text-slate-500">
                {currentSlide === 0 ? 'Capa' : `Slide ${currentSlide + 1}`}
              </span>
            )}
          </div>
          {generatedImage ? (
            <div className="relative select-none">
              <img
                src={allSlides[currentSlide]}
                alt={`${currentSlide === 0 ? 'Capa' : `Slide ${currentSlide + 1}`}`}
                className="w-full rounded-lg border-2 border-white shadow-lg pointer-events-none"
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
              <div
                className="absolute inset-0 rounded-lg"
                onContextMenu={(e) => e.preventDefault()}
              />

              {/* Carousel Navigation */}
              {isCarousel && allSlides.length > 1 && (
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
            </div>
          ) : (
            <div className="bg-slate-100 rounded-lg p-8 text-center border-2 border-dashed border-slate-300">
              <p className="text-slate-500 text-sm">Processando imagem...</p>
            </div>
          )}

          {/* Slide text */}
          {isCarousel && allTexts[currentSlide] && (
            <p className="text-sm text-slate-600 mt-2 text-center italic">
              &quot;{allTexts[currentSlide]}&quot;
            </p>
          )}
        </div>

        {/* Editable Description */}
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-slate-700">Descrição para Redes Sociais</h4>
            <button
              onClick={() => copyToClipboard(editedDescription)}
              className="text-slate-500 hover:text-blue-600 transition p-2 hover:bg-blue-50 rounded"
              title="Copiar descrição"
            >
              {copiedDescription ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
            </button>
          </div>
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full text-sm text-slate-700 bg-slate-50 p-4 rounded border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[120px]"
            placeholder="Edite a descrição aqui..."
          />
          <p className="text-xs text-slate-500 mt-2">
            {editedDescription.length} caracteres
          </p>
        </div>

        {/* Scheduling Option */}
        <div className="bg-white rounded-lg p-4 mt-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isScheduled}
              onChange={(e) => setIsScheduled(e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-slate-500" />
              <span className="text-sm font-medium text-slate-700">Agendar publicação</span>
            </div>
          </label>

          {isScheduled && (
            <div className="mt-3 pl-8">
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                min={getMinDateTime()}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-500 mt-1">
                A publicação será publicada automaticamente após aprovação
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {campaign && (
          <div className="mt-4 flex gap-3">
            {/* Save Draft Button */}
            <button
              onClick={() => handleSavePost('draft')}
              disabled={isSaving || saved}
              className="flex-1 px-4 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition disabled:opacity-50 font-medium flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Salvando...
                </>
              ) : saved ? (
                <>
                  <Check size={18} />
                  Salvo!
                </>
              ) : (
                <>
                  <Save size={18} />
                  Salvar Rascunho
                </>
              )}
            </button>

            {/* Publish/Submit Button */}
            <button
              onClick={handlePublish}
              disabled={isSaving || saved}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-medium flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isAdmin ? 'Publicando...' : 'Enviando...'}
                </>
              ) : saved ? (
                <>
                  <Check size={18} />
                  {isAdmin ? 'Publicado!' : 'Enviado!'}
                </>
              ) : (
                <>
                  {isAdmin ? <Check size={18} /> : <Send size={18} />}
                  {isAdmin ? 'Publicar' : 'Enviar para Aprovação'}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
