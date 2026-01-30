"use client";

import React, { useState, useEffect } from "react";
import { FolderOpen, Trash2, Archive, ArchiveRestore, Loader2, Eye } from "lucide-react";
import { CampaignPostsGallery } from "./CampaignPostsGallery";
import { useAuth } from "@/context/AuthContext";

interface Campaign {
  _id: string;
  name: string;
  description?: string;
  theme?: string;
  tone?: string;
  status: 'active' | 'archived';
  postCount: number;
  createdAt: string;
  updatedAt: string;
}

interface CampaignListProps {
  onSelectCampaign: (campaign: Campaign) => void;
}

export function CampaignList({ onSelectCampaign }: CampaignListProps) {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingCampaign, setViewingCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/campaigns?status=active');
      if (!response.ok) throw new Error('Erro ao buscar campanhas');

      const data = await response.json();
      setCampaigns(data.campaigns || []);
    } catch (error) {
      console.error('Erro ao buscar campanhas:', error);
      alert('Erro ao carregar campanhas');
    } finally {
      setIsLoading(false);
    }
  };


  const handleArchive = async (campaignId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'archived' : 'active';

    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Erro ao atualizar campanha');

      fetchCampaigns();
    } catch (error) {
      console.error('Erro ao arquivar campanha:', error);
      alert('Erro ao atualizar campanha');
    }
  };

  const handleDelete = async (campaignId: string, campaignName: string) => {
    if (!confirm(`Tem certeza que deseja excluir a campanha "${campaignName}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao excluir campanha');

      fetchCampaigns();
    } catch (error) {
      console.error('Erro ao excluir campanha:', error);
      alert('Erro ao excluir campanha');
    }
  };

  const getToneBadge = (tone?: string) => {
    const toneLabels: Record<string, string> = {
      professional: 'Profissional',
      educational: 'Educativo',
      informational: 'Informativo',
      promotional: 'Promocional',
      inspirational: 'Inspirador',
      entertaining: 'Divertido',
      casual: 'Casual',
    };

    return tone ? toneLabels[tone] || tone : 'Não definido';
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
    const typeLabels: Record<string, string> = {
      promotional: 'Promocional',
      educational: 'Educativo',
      informative: 'Informativo',
      entertainment: 'Entretenimento',
    };
    return type ? typeLabels[type] || type : 'Não definido';
  };

  if (isLoading) {
    return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
    );
  }

  return (
      <div>
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Minhas Campanhas</h1>
            <p className="text-slate-500 text-sm mt-1">
              Gerencie suas campanhas de redes sociais
            </p>
          </div>

        </div>

        {/* Campaigns Grid */}
        {campaigns.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
              <FolderOpen size={48} className="text-slate-300 mx-auto mb-4" />
              <p className="text-slate-400 text-sm">
                Nenhuma campanha criada ainda. Clique em "Nova Campanha" para começar!
              </p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                  <div
                      key={campaign._id}
                      className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition group"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 text-lg mb-1">
                          {campaign.name}
                        </h3>
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                      {getToneBadge(campaign.tone)}
                    </span>
                      </div>
                    </div>

                    {/* Description */}
                    {campaign.description && (
                        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                          {campaign.description}
                        </p>
                    )}

                    {/* Theme */}
                    {campaign.theme && (
                        <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                          <p className="text-xs font-medium text-slate-500 mb-1">Tema:</p>
                          <p className="text-sm text-slate-700 line-clamp-2">{campaign.theme}</p>
                        </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-4 pb-4 border-b border-slate-200">
                      <span>{campaign.postCount} {campaign.postCount === 1 ? 'post' : 'posts'}</span>
                      <span>•</span>
                      <span>{campaign.status === 'active' ? 'Ativa' : 'Arquivada'}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                          onClick={() => setViewingCampaign(campaign)}
                          className="flex-1 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition text-sm font-medium flex items-center justify-center gap-2"
                          title="Ver publicações desta campanha"
                      >
                        <Eye size={16} />
                        Ver Posts ({campaign.postCount})
                      </button>
                      <button
                          onClick={() => onSelectCampaign(campaign)}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                      >
                        Criar Post
                      </button>
                      <button
                          onClick={() => handleArchive(campaign._id, campaign.status)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title={campaign.status === 'active' ? 'Arquivar' : 'Desarquivar'}
                      >
                        {campaign.status === 'active' ? (
                            <Archive size={18} />
                        ) : (
                            <ArchiveRestore size={18} />
                        )}
                      </button>
                      <button
                          onClick={() => handleDelete(campaign._id, campaign.name)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
              ))}
            </div>
        )
        }

        {/* Campaign Posts Gallery Modal */}
        {viewingCampaign && (
            <CampaignPostsGallery
                campaignId={viewingCampaign._id}
                campaignName={viewingCampaign.name}
                onClose={() => setViewingCampaign(null)}
            />
        )}

      </div>
  );
}
