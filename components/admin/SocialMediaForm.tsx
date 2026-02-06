"use client";

import React, { useState, useMemo } from "react";
import { Upload, X, Loader2, Sparkles, Image as ImageIcon, Palette, GripVertical, Star, Plus, Minus } from "lucide-react";
import { Reorder } from "framer-motion";
import { StyleSelectionModal, StyleTemplate } from "./StyleSelectionModal";
import { ImageCropModal } from "./ImageCropModal";
import { PostFormat, FORMAT_CONFIG } from "@/lib/format-config";

interface GalleryItem {
  id: string;
  url: string;
  overlayText: string;
  type: "ai" | "uploaded";
}

interface SocialMediaFormProps {
  onCompose: (data: {
    timeline: GalleryItem[];
    context: string;
    originalUploadedImages: string[];
  }) => void;
  isComposing: boolean;
  campaign?: { _id: string; name: string; theme?: string; tone?: string };
  postFormat?: PostFormat;
}

export function SocialMediaForm({ onCompose, isComposing, campaign, postFormat = 'feed' }: SocialMediaFormProps) {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [timelineIds, setTimelineIds] = useState<string[]>([]);
  const [context, setContext] = useState("");
  const [additionalPrompt, setAdditionalPrompt] = useState("");
  const [aiImageCount, setAiImageCount] = useState(3);
  const [selectedStyle, setSelectedStyle] = useState<StyleTemplate | null>(null);
  const [isStyleModalOpen, setIsStyleModalOpen] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [cropQueue, setCropQueue] = useState<File[]>([]);
  const [currentCropFile, setCurrentCropFile] = useState<File | null>(null);

  const timelineItems = useMemo(() => {
    return timelineIds
      .map((id) => gallery.find((g) => g.id === id))
      .filter((item): item is GalleryItem => item !== undefined);
  }, [timelineIds, gallery]);

  const timelineIdSet = useMemo(() => new Set(timelineIds), [timelineIds]);

  // Gerar imagens com IA
  const handleGenerateAI = async () => {
    if (!context.trim()) return;
    if (!campaign) {
      alert("Selecione uma campanha primeiro.");
      return;
    }

    setIsGeneratingAI(true);
    try {
      const count = aiImageCount;
      const response = await fetch("/api/social-media/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context,
          campaignId: campaign._id,
          additionalPrompt: additionalPrompt.trim() || undefined,
          isCarousel: count > 1,
          carouselCount: count,
          styleTemplate: selectedStyle || undefined,
          aspectRatio: FORMAT_CONFIG[postFormat].aspectRatio,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao gerar imagem");
      }

      const result = await response.json();

      // Achatar response em GalleryItems
      const newItems: GalleryItem[] = [];

      if (result.generatedImage) {
        newItems.push({
          id: crypto.randomUUID(),
          url: result.generatedImage,
          overlayText: result.overlayText || "",
          type: "ai",
        });
      }

      if (result.carouselImages && result.carouselImages.length > 0) {
        result.carouselImages.forEach((url: string, i: number) => {
          newItems.push({
            id: crypto.randomUUID(),
            url,
            overlayText: result.carouselOverlayTexts?.[i] || "",
            type: "ai",
          });
        });
      }

      setGallery((prev) => [...prev, ...newItems]);

      // Se timeline vazia, auto-preencher
      if (timelineIds.length === 0) {
        setTimelineIds(newItems.map((item) => item.id));
      }
    } catch (error: unknown) {
      console.error("Erro na geração IA:", error);
      const msg = error instanceof Error ? error.message : "Erro ao gerar imagens";
      alert(msg);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Upload de fotos — inicia fila de crop
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    setCropQueue(fileArray.slice(1));
    setCurrentCropFile(fileArray[0]);
  };

  const uploadCroppedFile = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "social-media");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erro ao fazer upload da imagem");

      const result = await response.json();
      if (result.url) {
        setGallery((prev) => [
          ...prev,
          { id: crypto.randomUUID(), url: result.url, overlayText: "", type: "uploaded" },
        ]);
      }
    } catch (error) {
      console.error("Erro ao processar imagem:", error);
      alert("Erro ao fazer upload da imagem");
    } finally {
      setIsUploading(false);
    }
  };

  const advanceCropQueue = () => {
    if (cropQueue.length > 0) {
      const [next, ...rest] = cropQueue;
      setCurrentCropFile(next);
      setCropQueue(rest);
    } else {
      setCurrentCropFile(null);
    }
  };

  const handleCropConfirm = async (croppedFile: File) => {
    await uploadCroppedFile(croppedFile);
    advanceCropQueue();
  };

  const handleCropCancel = () => {
    advanceCropQueue();
  };

  const toggleTimeline = (id: string) => {
    setTimelineIds((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  const removeFromTimeline = (id: string) => {
    setTimelineIds((prev) => prev.filter((tid) => tid !== id));
  };

  const removeFromGallery = (id: string) => {
    setGallery((prev) => prev.filter((g) => g.id !== id));
    setTimelineIds((prev) => prev.filter((tid) => tid !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (timelineIds.length === 0) {
      alert("Adicione pelo menos uma imagem à composição.");
      return;
    }
    if (!context.trim()) {
      alert("Descreva o contexto da publicação.");
      return;
    }

    const originalUploadedImages = gallery
      .filter((g) => g.type === "uploaded")
      .map((g) => g.url);

    onCompose({ timeline: timelineItems, context, originalUploadedImages });
  };

  const handleReset = () => {
    setGallery([]);
    setTimelineIds([]);
    setContext("");
    setAdditionalPrompt("");
    setAiImageCount(3);
    setSelectedStyle(null);
  };

  const isDisabled = isComposing || isGeneratingAI || isUploading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Contexto da Publicação */}
      <div>
        <label htmlFor="context" className="block text-sm font-bold text-slate-700 mb-2">
          Contexto da Publicação
        </label>
        <textarea
          id="context"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Descreva o contexto da publicação. Ex: Lançamento de novo produto, evento corporativo, conquista da empresa..."
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-slate-900 placeholder:text-slate-400"
          rows={5}
          disabled={isDisabled}
        />
      </div>

      {/* 2. Ferramentas: Gerar com IA + Upload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 2a. Gerar com IA */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3">
          <h3 className="text-sm font-bold text-purple-800 flex items-center gap-2">
            <Sparkles size={16} />
            Gerar com IA
          </h3>

          {/* Estilo */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-purple-700 font-medium">Template de Estilo</span>
            <button
              type="button"
              onClick={() => setIsStyleModalOpen(true)}
              disabled={isDisabled}
              className="text-xs text-purple-600 hover:text-purple-800 font-medium disabled:opacity-50"
            >
              {selectedStyle ? selectedStyle.name : "Selecionar"}
            </button>
          </div>

          {selectedStyle && (
            <div className="flex items-center gap-2 p-2 bg-white rounded border border-purple-200">
              <img
                src={selectedStyle.preview}
                alt={selectedStyle.name}
                className="w-10 h-12 object-cover rounded"
              />
              <span className="text-xs text-purple-800 flex-1">{selectedStyle.name}</span>
              <button
                type="button"
                onClick={() => setSelectedStyle(null)}
                className="p-1 text-purple-400 hover:text-red-500 rounded transition"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Quantidade */}
          <div>
            <label className="text-xs text-purple-700 font-medium block mb-1">Quantidade de imagens</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAiImageCount((c) => Math.max(1, c - 1))}
                disabled={isDisabled || aiImageCount <= 1}
                className="p-1.5 rounded border border-purple-300 text-purple-700 hover:bg-purple-100 disabled:opacity-40 transition"
              >
                <Minus size={14} />
              </button>
              <span className="text-sm font-bold text-purple-900 w-6 text-center">{aiImageCount}</span>
              <button
                type="button"
                onClick={() => setAiImageCount((c) => Math.min(10, c + 1))}
                disabled={isDisabled || aiImageCount >= 10}
                className="p-1.5 rounded border border-purple-300 text-purple-700 hover:bg-purple-100 disabled:opacity-40 transition"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Instruções */}
          <div>
            <label className="text-xs text-purple-700 font-medium block mb-1">Instruções adicionais</label>
            <textarea
              value={additionalPrompt}
              onChange={(e) => setAdditionalPrompt(e.target.value)}
              placeholder="Cores, estilo, elementos visuais..."
              className="w-full px-3 py-2 border border-purple-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
              rows={2}
              disabled={isDisabled}
            />
          </div>

          {/* Botão Gerar */}
          <button
            type="button"
            onClick={handleGenerateAI}
            disabled={isDisabled || !context.trim()}
            className="w-full px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2 text-sm"
          >
            {isGeneratingAI ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Gerando {aiImageCount} imagem(ns)...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Gerar {aiImageCount} imagem(ns)
              </>
            )}
          </button>
        </div>

        {/* 2b. Upload de Fotos */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
          <h3 className="text-sm font-bold text-green-800 flex items-center gap-2">
            <ImageIcon size={16} />
            Upload de Fotos
          </h3>

          <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center hover:border-green-400 transition">
            <input
              type="file"
              id="image-upload"
              multiple
              accept="image/*"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
              disabled={isDisabled}
            />
            <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2">
              {isUploading ? (
                <>
                  <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
                  <p className="text-xs text-green-700">Fazendo upload...</p>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-green-400" />
                  <p className="text-xs text-green-700">Clique ou arraste fotos</p>
                  <p className="text-xs text-green-500">Suporta múltiplas imagens</p>
                </>
              )}
            </label>
          </div>
        </div>
      </div>

      {/* 3. Banco de Imagens */}
      {gallery.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-slate-700 mb-2">
            Banco de Imagens ({gallery.length})
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {gallery.map((item) => {
              const isInTimeline = timelineIdSet.has(item.id);
              return (
                <div
                  key={item.id}
                  className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition ${
                    isInTimeline
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  onClick={() => toggleTimeline(item.id)}
                >
                  <img
                    src={item.url}
                    alt="Imagem"
                    className="w-full object-cover"
                    style={{ aspectRatio: FORMAT_CONFIG[postFormat].cssAspect }}
                  />

                  {/* Badge tipo */}
                  <span
                    className={`absolute top-1.5 left-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      item.type === "ai"
                        ? "bg-purple-600 text-white"
                        : "bg-green-600 text-white"
                    }`}
                  >
                    {item.type === "ai" ? "IA" : "Foto"}
                  </span>

                  {/* Check se na timeline */}
                  {isInTimeline && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}

                  {/* Botão remover do banco */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromGallery(item.id);
                    }}
                    className="absolute bottom-1.5 right-1.5 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>

                  {/* Overlay text truncado */}
                  {item.overlayText && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                      <p className="text-[10px] text-white truncate">{item.overlayText}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Composição (Timeline) */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-2">
          Composição ({timelineItems.length} {timelineItems.length === 1 ? "imagem" : "imagens"})
        </h3>

        {timelineItems.length > 0 ? (
          <div className="bg-slate-100 rounded-lg p-3 overflow-x-auto">
            <Reorder.Group
              axis="x"
              values={timelineIds}
              onReorder={setTimelineIds}
              className="flex gap-3"
            >
              {timelineIds.map((id, idx) => {
                const item = gallery.find((g) => g.id === id);
                if (!item) return null;
                return (
                  <Reorder.Item
                    key={id}
                    value={id}
                    className="relative shrink-0 cursor-grab active:cursor-grabbing"
                  >
                    <div className="w-24 rounded-lg overflow-hidden border-2 border-white shadow-md bg-white">
                      <div className="relative">
                        <img
                          src={item.url}
                          alt={idx === 0 ? "Capa" : `Slide ${idx + 1}`}
                          className="w-full object-cover"
                          style={{ aspectRatio: FORMAT_CONFIG[postFormat].cssAspect }}
                          draggable={false}
                        />

                        {/* Label Capa */}
                        {idx === 0 && (
                          <div className="absolute top-1 left-1 flex items-center gap-0.5 bg-yellow-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                            <Star size={8} fill="white" />
                            Capa
                          </div>
                        )}

                        {/* Número do slide */}
                        {idx > 0 && (
                          <div className="absolute top-1 left-1 bg-slate-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                            {idx + 1}
                          </div>
                        )}

                        {/* Overlay text */}
                        {item.overlayText && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1 py-0.5">
                            <p className="text-[8px] text-white truncate">{item.overlayText}</p>
                          </div>
                        )}
                      </div>

                      {/* Barra inferior: drag handle + remover */}
                      <div className="flex items-center justify-between px-1.5 py-1">
                        <GripVertical size={12} className="text-slate-400" />
                        <button
                          type="button"
                          onClick={() => removeFromTimeline(id)}
                          className="p-0.5 text-slate-400 hover:text-red-500 transition"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>
          </div>
        ) : (
          <div className="bg-slate-100 rounded-lg p-6 text-center border-2 border-dashed border-slate-300">
            <p className="text-sm text-slate-400">
              Selecione imagens do banco acima para montar a publicação
            </p>
          </div>
        )}

        {timelineItems.length > 1 && (
          <p className="text-xs text-blue-600 mt-1.5 font-medium">
            Carrossel: 1 capa + {timelineItems.length - 1} slide(s)
          </p>
        )}
      </div>

      {/* Style Selection Modal */}
      <StyleSelectionModal
        isOpen={isStyleModalOpen}
        onClose={() => setIsStyleModalOpen(false)}
        onSelect={setSelectedStyle}
        selectedStyle={selectedStyle}
      />

      {/* Crop Modal */}
      {currentCropFile && (
        <ImageCropModal
          file={currentCropFile}
          onCrop={handleCropConfirm}
          onCancel={handleCropCancel}
          aspectRatio={FORMAT_CONFIG[postFormat].cropAspect}
          aspectLabel={FORMAT_CONFIG[postFormat].label}
        />
      )}

      {/* Botões de ação */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isDisabled || timelineIds.length === 0 || !context.trim()}
          className="flex-1 text-white px-6 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-bold flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          {isComposing ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Preparando...
            </>
          ) : (
            <>
              <Palette size={20} />
              Criar Publicação
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={isDisabled}
          className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed font-bold"
        >
          Limpar
        </button>
      </div>
    </form>
  );
}
