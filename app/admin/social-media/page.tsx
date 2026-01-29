"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Share2, FolderPlus, FolderOpen, Plus } from "lucide-react";
import { SocialMediaForm } from "@/components/admin/SocialMediaForm";
import { GeneratedPostPreview } from "@/components/admin/GeneratedPostPreview";
import { CampaignList } from "@/components/admin/CampaignList";
import { CreateCampaignModal } from "@/components/admin/CreateCampaignModal";

type ViewMode = 'create-post' | 'campaigns';

export default function SocialMediaPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('create-post');
  const [showCreateCampaignModal, setShowCreateCampaignModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{
    generatedImage: string;
    overlayText: string;
    description: string;
    originalImages: string[];
    context: string;
  } | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  const handleGenerate = async (data: { images: string[]; text: string; context: string; additionalPrompt?: string }) => {
    setIsGenerating(true);
    setGeneratedContent(null);

    try {
      // Generate merged image with text overlay using Gemini
      const imageResponse = await fetch("/api/social-media/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: data.images,
          context: data.context,
          campaignId: selectedCampaign?._id || undefined,
          additionalPrompt: data.additionalPrompt,
        }),
      });

      if (!imageResponse.ok) {
        const errorData = await imageResponse.json();
        throw new Error(errorData.error || "Erro ao gerar imagem");
      }

      const imageResult = await imageResponse.json();

      // Generate description with OpenAI
      const descriptionResponse = await fetch("/api/social-media/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: imageResult.overlayText,
          context: data.context,
          campaignId: selectedCampaign?._id || undefined,
          additionalPrompt: data.additionalPrompt,
        }),
      });

      if (!descriptionResponse.ok) {
        throw new Error("Erro ao gerar descrição");
      }

      const descriptionResult = await descriptionResponse.json();

      setGeneratedContent({
        generatedImage: imageResult.generatedImage,
        overlayText: imageResult.overlayText,
        description: descriptionResult.description,
        originalImages: data.images,
        context: data.context,
      });

    } catch (error: any) {
      console.error("Erro na geração:", error);
      alert(error.message || "Erro ao gerar conteúdo");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCampaignSelect = (campaign: any) => {
    setSelectedCampaign(campaign);
    setViewMode('create-post');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/admin")}
              className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Share2 size={20} className="text-white" />
              </div>
              <span className="font-bold text-slate-800 text-lg tracking-tight">
                Redes Sociais
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-bold text-slate-700 leading-tight">
                {user.name}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {user.role === "admin" ? "Administrador" : "Autor"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Menu */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('create-post')}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition border-b-2 ${viewMode === 'create-post'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
            >
              <Plus size={18} />
              Criar Post
            </button>
            <button
              onClick={() => setViewMode('campaigns')}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition border-b-2 ${viewMode === 'campaigns'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
            >
              <FolderOpen size={18} />
              Campanhas
            </button>
            {viewMode === 'campaigns' && (
              <button
                onClick={() => setShowCreateCampaignModal(true)}
                className="ml-auto flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
              >
                <FolderPlus size={18} />
                Nova Campanha
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'create-post' ? (
          <>
            {!selectedCampaign ? (
              /* Campaign Selection Required */
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
                  <FolderOpen size={64} className="text-slate-300 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Selecione uma Campanha
                  </h2>
                  <p className="text-slate-600 mb-6">
                    Para criar uma publicação, você precisa primeiro selecionar ou criar uma campanha.
                    A campanha define o tema e o tom das suas publicações.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => setViewMode('campaigns')}
                      className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition font-medium flex items-center gap-2"
                    >
                      <FolderOpen size={20} />
                      Ver Campanhas
                    </button>
                    <button
                      onClick={() => setShowCreateCampaignModal(true)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
                    >
                      <FolderPlus size={20} />
                      Nova Campanha
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Post Creation Form */
              <>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-slate-900">
                    {selectedCampaign ? `Publicar em: ${selectedCampaign.name}` : 'Publicar em Redes Sociais'}
                  </h1>
                  <p className="text-slate-500 text-sm mt-1">
                    {selectedCampaign
                      ? `Criando post para a campanha "${selectedCampaign.name}". A IA manterá consistência com posts anteriores.`
                      : 'Faça upload de imagens e descreva o contexto. A IA irá mesclar as imagens e gerar texto automaticamente.'
                    }
                  </p>
                  {selectedCampaign && (
                    <button
                      onClick={() => setSelectedCampaign(null)}
                      className="text-sm text-blue-600 hover:text-blue-700 mt-2"
                    >
                      ← Voltar para post avulso
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Form Section */}
                  <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">
                      Criar Novo Post
                    </h2>
                    <SocialMediaForm
                      onGenerate={handleGenerate}
                      isGenerating={isGenerating}
                      campaign={selectedCampaign}
                    />
                  </div>

                  {/* Preview Section */}
                  <div>
                    {generatedContent ? (
                      <GeneratedPostPreview
                        generatedImage={generatedContent.generatedImage}
                        overlayText={generatedContent.overlayText}
                        description={generatedContent.description}
                        originalImages={generatedContent.originalImages}
                        campaign={selectedCampaign}
                        context={generatedContent.context}
                      />
                    ) : (
                      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
                        <Share2 size={48} className="text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-400 text-sm">
                          Os resultados gerados pela IA aparecerão aqui
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <CampaignList onSelectCampaign={handleCampaignSelect} />
        )}
      </main>

      {/* Create Campaign Modal */}
      {showCreateCampaignModal && (
        <CreateCampaignModal
          onClose={() => setShowCreateCampaignModal(false)}
          onSuccess={() => {
            setShowCreateCampaignModal(false);
            // Refresh campaign list
          }}
        />
      )}
    </div>
  );
}
