"use client";

import React from "react";
import { Copy, Download, Check, Save, Send, AlertCircle } from "lucide-react";
import { useState } from "react";

interface GeneratedPostPreviewProps {
  generatedImage: string;
  overlayText: string;
  description: string;
  originalImages: string[];
  campaign?: { _id: string; tone?: string; name?: string };
  context?: string;
  isAdmin?: boolean;
  // Edit mode props
  editPostId?: string;
  rejectionReason?: string;
  onEditComplete?: () => void;
}

export function GeneratedPostPreview({ generatedImage, overlayText, description, originalImages, campaign, context, isAdmin = false, editPostId, rejectionReason, onEditComplete }: GeneratedPostPreviewProps) {
  const [copiedDescription, setCopiedDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedDescription(true);
      setTimeout(() => setCopiedDescription(false), 2000);
    } catch (error) {
      console.error("Erro ao copiar:", error);
    }
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `social-media-${Date.now()}.png`;
    link.click();
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
        // Edit mode - update existing post
        response = await fetch(`/api/social-media/posts/${editPostId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            generatedImage,
            overlayText,
            description: editedDescription,
            originalImages,
            context: context || 'Post gerado via IA',
            status: 'pending', // Always go to pending when resubmitting
          }),
        });
      } else {
        // Create mode - create new post
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
            aspectRatio: '4:5',
            status: status,
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
            <AlertCircle size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-orange-700 mb-1">Motivo da Rejeição Anterior</h4>
              <p className="text-sm text-orange-600">{rejectionReason}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm">{editPostId ? 'Editar' : 'IA'}</span>
          {editPostId ? 'Editar Publicação' : 'Resultados Gerados'}
        </h3>

        {/* Generated Image */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-slate-700">Imagem Gerada</h4>
            {generatedImage && (
              <button
                onClick={downloadImage}
                className="text-slate-500 hover:text-blue-600 transition p-2 hover:bg-blue-50 rounded flex items-center gap-1"
                title="Baixar imagem"
              >
                <Download size={18} />
                <span className="text-xs">Baixar</span>
              </button>
            )}
          </div>
          {generatedImage ? (
            <div className="relative">
              <img
                src={generatedImage}
                alt="Imagem gerada"
                className="w-full rounded-lg border-2 border-white shadow-lg"
              />
            </div>
          ) : (
            <div className="bg-slate-100 rounded-lg p-8 text-center border-2 border-dashed border-slate-300">
              <p className="text-slate-500 text-sm">Processando imagem...</p>
            </div>
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
