"use client";

import React, { useState, useEffect } from "react";
import { X, Check, Palette } from "lucide-react";

export interface StyleTemplate {
  id: string;
  name: string;
  preview: string;
  images: {
    cover: string;
    slides: string[];
  };
}

interface StylesData {
  styles: StyleTemplate[];
  util: {
    assets: string[];
    catchphrases: string[];
  };
}

interface StyleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (style: StyleTemplate | null) => void;
  selectedStyle: StyleTemplate | null;
}

export function StyleSelectionModal({
  isOpen,
  onClose,
  onSelect,
  selectedStyle
}: StyleSelectionModalProps) {
  const [styles, setStyles] = useState<StyleTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewStyle, setPreviewStyle] = useState<StyleTemplate | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchStyles();
    }
  }, [isOpen]);

  const fetchStyles = async () => {
    try {
      const response = await fetch('/styles/styles.json');
      const data: StylesData = await response.json();
      setStyles(data.styles);
    } catch (error) {
      console.error('Erro ao carregar estilos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (style: StyleTemplate) => {
    onSelect(style);
    onClose();
  };

  const handleClearSelection = () => {
    onSelect(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Palette className="text-blue-600" size={24} />
            <div>
              <h2 className="text-lg font-bold text-slate-900">Selecionar Estilo</h2>
              <p className="text-sm text-slate-500">Escolha um template visual para sua publicação (opcional)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {styles.map((style) => (
                <div
                  key={style.id}
                  className={`relative group cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                    selectedStyle?.id === style.id
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                  onClick={() => setPreviewStyle(style)}
                >
                  {/* Preview Image */}
                  <div className="aspect-[4/5] relative">
                    <img
                      src={style.preview}
                      alt={style.name}
                      className="w-full h-full object-cover"
                    />
                    {selectedStyle?.id === style.id && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white p-1.5 rounded-full">
                        <Check size={16} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Info */}
                  <div className="p-4 bg-white">
                    <h3 className="font-bold text-slate-900">{style.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {style.images.slides.length} exemplo(s) de slide
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(style);
                      }}
                      className={`mt-3 w-full py-2 rounded-lg text-sm font-medium transition ${
                        selectedStyle?.id === style.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    >
                      {selectedStyle?.id === style.id ? 'Selecionado' : 'Selecionar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Preview Modal */}
          {previewStyle && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4" onClick={() => setPreviewStyle(null)}>
              <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">{previewStyle.name} - Exemplos</h3>
                  <button
                    onClick={() => setPreviewStyle(null)}
                    className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[70vh]">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-2">Capa</p>
                      <img
                        src={previewStyle.images.cover}
                        alt="Capa"
                        className="w-full rounded-lg border border-slate-200"
                      />
                    </div>
                    {previewStyle.images.slides.map((slide, index) => (
                      <div key={index}>
                        <p className="text-xs font-medium text-slate-500 mb-2">Slide {index + 1}</p>
                        <img
                          src={slide}
                          alt={`Slide ${index + 1}`}
                          className="w-full rounded-lg border border-slate-200"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => {
                        handleSelect(previewStyle);
                        setPreviewStyle(null);
                      }}
                      className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                      Usar este estilo
                    </button>
                    <button
                      onClick={() => setPreviewStyle(null)}
                      className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-4 flex justify-between items-center bg-slate-50">
          {selectedStyle ? (
            <button
              onClick={handleClearSelection}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Remover seleção
            </button>
          ) : (
            <span className="text-sm text-slate-500">Nenhum estilo selecionado</span>
          )}
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
