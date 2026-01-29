"use client";

import React, { useState } from "react";
import { X, Sparkles } from "lucide-react";

interface CreateCampaignModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const toneOptions = [
  { value: 'professional', label: 'Profissional e Corporativo' },
  { value: 'educational', label: 'Educativo e Didático' },
  { value: 'informational', label: 'Informativo e Objetivo' },
  { value: 'promotional', label: 'Promocional e Persuasivo' },
  { value: 'inspirational', label: 'Inspirador e Motivacional' },
  { value: 'entertaining', label: 'Divertido e Descontraído' },
  { value: 'casual', label: 'Casual e Amigável' },
];

export function CreateCampaignModal({ onClose, onSuccess }: CreateCampaignModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    tone: 'professional',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Por favor, insira um nome para a campanha');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao criar campanha');
      }

      onSuccess();
    } catch (error: any) {
      console.error('Erro ao criar campanha:', error);
      alert(error.message || 'Erro ao criar campanha');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-slate-900">Nova Campanha</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nome */}
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">
              Nome da Campanha *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Lançamento Produto X"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
              disabled={isSubmitting}
            />
          </div>

          {/* Tom/Cunho */}
          <div>
            <label htmlFor="tone" className="block text-sm font-bold text-slate-700 mb-2">
              Cunho/Tom da Campanha *
            </label>
            <select
              id="tone"
              value={formData.tone}
              onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
              disabled={isSubmitting}
            >
              {toneOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-1">
              Define o estilo de comunicação de todas as publicações desta campanha
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Criar Campanha
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
