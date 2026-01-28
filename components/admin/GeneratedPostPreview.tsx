"use client";

import React from "react";
import { Copy, Download, Check } from "lucide-react";
import { useState } from "react";

interface GeneratedPostPreviewProps {
  generatedImage: string;
  overlayText: string;
  description: string;
  originalImages: string[];
}

export function GeneratedPostPreview({ generatedImage, overlayText, description, originalImages }: GeneratedPostPreviewProps) {
  const [copiedDescription, setCopiedDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description);

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

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm">IA</span>
          Resultados Gerados
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
      </div>
    </div>
  );
}
