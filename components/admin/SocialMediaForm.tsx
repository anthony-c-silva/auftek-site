"use client";

import React, { useState } from "react";
import { Upload, X, Loader2, Sparkles, Image as ImageIcon } from "lucide-react";

type ImageMode = 'static' | 'ai' | null;

interface SocialMediaFormProps {
  onGenerate: (data: { images: string[]; text: string; context: string; additionalPrompt?: string }) => void;
  onStaticPost?: (data: { image: string; context: string; description?: string }) => void;
  isGenerating: boolean;
  campaign?: { _id: string; name: string; theme?: string; tone?: string };
}

export function SocialMediaForm({ onGenerate, onStaticPost, isGenerating, campaign }: SocialMediaFormProps) {
  const [imageMode, setImageMode] = useState<ImageMode>(null);
  const [images, setImages] = useState<string[]>([]);
  const [context, setContext] = useState("");
  const [additionalPrompt, setAdditionalPrompt] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedImages: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Upload to KingHost
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'social-media');

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Erro ao fazer upload da imagem');
        }

        const result = await response.json();
        if (result.url) {
          uploadedImages.push(result.url);
        }
      }

      setImages([...images, ...uploadedImages]);
      setUploading(false);
    } catch (error) {
      console.error("Erro ao processar imagens:", error);
      alert("Erro ao fazer upload das imagens");
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageMode) {
      alert("Por favor, selecione o tipo de publicação.");
      return;
    }

    if (imageMode === 'static') {
      if (images.length === 0 || !context.trim()) {
        alert("Por favor, adicione uma imagem e descreva o contexto.");
        return;
      }
      onStaticPost?.({
        image: images[0],
        context,
        description: additionalPrompt.trim() || undefined
      });
    } else {
      if (images.length === 0 || !context.trim()) {
        alert("Por favor, adicione pelo menos uma imagem e descreva o contexto.");
        return;
      }
      onGenerate({ images, text: "", context, additionalPrompt: additionalPrompt.trim() || undefined });
    }
  };

  const handleReset = () => {
    setImages([]);
    setContext("");
    setAdditionalPrompt("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Mode Toggle */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">
          Tipo de Publicação
        </label>
        <div className="bg-slate-100 p-1 rounded-lg flex">
          <button
            type="button"
            onClick={() => setImageMode('static')}
            className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition flex items-center justify-center gap-2 ${imageMode === 'static'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <ImageIcon size={18} />
            Imagem Pronta
          </button>
          <button
            type="button"
            onClick={() => setImageMode('ai')}
            className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition flex items-center justify-center gap-2 ${imageMode === 'ai'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <Sparkles size={18} />
            Gerar com IA
          </button>
        </div>
        {!imageMode && (
          <p className="text-xs text-amber-600 mt-2">
            Selecione o tipo de publicação para continuar
          </p>
        )}
      </div>

      {/* Image Upload Section - Only enabled after mode selection */}
      <div className={!imageMode ? 'opacity-50 pointer-events-none' : ''}>
        <label className="block text-sm font-bold text-slate-700 mb-2">
          {imageMode === 'static' ? 'Imagem' : 'Imagens'}
        </label>

        {/* Upload Area */}
        <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${!imageMode ? 'border-slate-200 bg-slate-50' : 'border-slate-300 hover:border-blue-400'
          }`}>
          <input
            type="file"
            id="image-upload"
            multiple={imageMode === 'ai'}
            accept="image/*"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
            disabled={!imageMode || uploading || isGenerating}
          />
          <label
            htmlFor="image-upload"
            className={`flex flex-col items-center gap-2 ${!imageMode ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {uploading ? (
              <>
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                <p className="text-sm text-slate-600">Fazendo upload...</p>
              </>
            ) : !imageMode ? (
              <>
                <Upload className="w-12 h-12 text-slate-300" />
                <p className="text-sm text-slate-400">
                  Selecione o tipo de publicação acima
                </p>
              </>
            ) : (
              <>
                <Upload className="w-12 h-12 text-slate-400" />
                <p className="text-sm text-slate-600">
                  {imageMode === 'static'
                    ? 'Clique para fazer upload da imagem'
                    : 'Clique para fazer upload ou arraste imagens aqui'
                  }
                </p>
                <p className="text-xs text-slate-400">
                  {imageMode === 'static'
                    ? 'Selecione uma imagem pronta'
                    : 'Suporta múltiplas imagens'
                  }
                </p>
              </>
            )}
          </label>
        </div>

        {/* Image Preview Grid */}
        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={img}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-slate-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Campaign Info */}
      {campaign && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-bold text-blue-900 mb-2">Campanha Selecionada</h3>
          <p className="text-sm text-blue-800 font-medium mb-1">{campaign.name}</p>
          {campaign.theme && (
            <p className="text-xs text-blue-700 mb-1">
              <span className="font-medium">Tema:</span> {campaign.theme}
            </p>
          )}
          {campaign.tone && (
            <p className="text-xs text-blue-700">
              <span className="font-medium">Tom:</span> {campaign.tone}
            </p>
          )}
        </div>
      )}

      {/* Context Input */}
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
          rows={8}
          disabled={isGenerating}
        />
        <p className="text-xs text-slate-500 mt-1">
          {imageMode === 'ai'
            ? 'A IA irá gerar automaticamente um texto curto para a imagem baseado neste contexto. Formato: 4:5 (Feed do Instagram)'
            : 'Descreva o contexto da publicação. A IA irá gerar a descrição baseada neste texto.'
          }
        </p>
      </div>

      {/* Additional Prompt (Optional) - Only show for AI mode */}
      {
        imageMode === 'ai' && (
          <div>
            <label htmlFor="additionalPrompt" className="block text-sm font-bold text-slate-700 mb-2">
              Instruções Adicionais para IA
            </label>
            <textarea
              id="additionalPrompt"
              value={additionalPrompt}
              onChange={(e) => setAdditionalPrompt(e.target.value)}
              placeholder="Ex: Use cores quentes, foque em elementos de verão, tom mais descontraído..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-slate-900 placeholder:text-slate-400"
              rows={3}
              disabled={isGenerating}
            />
            <p className="text-xs text-slate-500 mt-1">
              {campaign
                ? 'Estas instruções complementam os prompts da campanha para esta publicação específica.'
                : 'Forneça instruções específicas para a IA sobre estilo, tom ou elementos visuais desejados.'
              }
            </p>
          </div>
        )
      }

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isGenerating || uploading || images.length === 0 || !context.trim()}
          className={`flex-1 text-white px-6 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-bold flex items-center justify-center gap-2 ${imageMode === 'static' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              {imageMode === 'ai' ? 'Gerando...' : 'Processando...'}
            </>
          ) : imageMode === 'ai' ? (
            <>
              <Sparkles size={20} />
              Gerar com IA
            </>
          ) : (
            <>
              <ImageIcon size={20} />
              Criar Publicação
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={isGenerating || uploading}
          className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed font-bold"
        >
          Limpar
        </button>
      </div>
    </form >
  );
}
