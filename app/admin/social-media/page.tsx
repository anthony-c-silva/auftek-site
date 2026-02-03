"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Share2, FolderPlus, FolderOpen, ClipboardCheck } from "lucide-react";
import { SocialMediaForm } from "@/components/admin/SocialMediaForm";
import { GeneratedPostPreview } from "@/components/admin/GeneratedPostPreview";
import { CampaignList } from "@/components/admin/CampaignList";
import { CreateCampaignModal } from "@/components/admin/CreateCampaignModal";
import { PublishedPostsGallery } from "@/components/admin/PublishedPostsGallery";
import { PendingPostsReview } from "@/components/admin/PendingPostsReview";
import { ScheduledPostsGallery } from "@/components/admin/ScheduledPostsGallery";

type ViewMode = 'campaigns' | 'approvals';
type ApprovalSubView = 'all' | 'pending' | 'scheduled';

// Type for post being edited
interface EditingPost {
  _id: string;
  generatedImage: string;
  overlayText: string;
  description: string;
  context: string;
  rejectionReason?: string;
  campaign: { _id: string; name: string; theme?: string } | null;
}

export default function SocialMediaPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('campaigns');
  const [approvalSubView, setApprovalSubView] = useState<ApprovalSubView>('pending');
  const [showCreateCampaignModal, setShowCreateCampaignModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<{ _id: string; name: string; theme?: string; tone?: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{
    generatedImage: string;
    overlayText: string;
    description: string;
    originalImages: string[];
    context: string;
  } | null>(null);
  // State for editing a post from re-evaluation
  const [editingPost, setEditingPost] = useState<EditingPost | null>(null);

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

    } catch (error: unknown) {
      console.error("Erro na geração:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro ao gerar conteúdo";
      alert(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handler for static image posts (no AI image generation)
  const handleStaticPost = async (data: { image: string; context: string; description?: string }) => {
    setIsGenerating(true);
    setGeneratedContent(null);

    try {
      // Generate description with OpenAI (only description, no image generation)
      const descriptionResponse = await fetch("/api/social-media/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: data.context, // Use context as the text for description
          context: data.context,
          campaignId: selectedCampaign?._id || undefined,
        }),
      });

      if (!descriptionResponse.ok) {
        throw new Error("Erro ao gerar descrição");
      }

      const descriptionResult = await descriptionResponse.json();

      setGeneratedContent({
        generatedImage: data.image,
        overlayText: "",
        description: descriptionResult.description,
        originalImages: [data.image],
        context: data.context,
      });

    } catch (error: unknown) {
      console.error("Erro ao processar imagem:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro ao processar publicação";
      alert(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCampaignSelect = (campaign: any) => {
    setSelectedCampaign(campaign);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Menu */}
      <div className="bg-white border-b border-slate-200 mt-16 md:mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setViewMode('campaigns'); setSelectedCampaign(null); }}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition border-b-2 ${viewMode === 'campaigns'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
            >
              <FolderOpen size={18} />
              Campanhas
            </button>
            {/* Approvals tab - visible for all users */}
            <button
              onClick={() => setViewMode('approvals')}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition border-b-2 ${viewMode === 'approvals'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
            >
              <ClipboardCheck size={18} />
              Publicações
            </button>
            {viewMode === 'campaigns' && !selectedCampaign && (
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
        {viewMode === 'campaigns' ? (
          <>
            {selectedCampaign ? (
              /* Post Creation Form - when campaign is selected */
              <>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-slate-900">
                    {editingPost ? 'Editar Publicação' : `Publicar em: ${selectedCampaign.name}`}
                  </h1>
                  <p className="text-slate-500 text-sm mt-1">
                    {editingPost
                      ? 'Edite a publicação rejeitada.'
                      : `Criando post para a campanha "${selectedCampaign.name}". A IA manterá consistência com posts anteriores.`
                    }
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCampaign(null);
                      setEditingPost(null);
                      setGeneratedContent(null);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 mt-2"
                  >
                    {editingPost ? '← Cancelar edição' : '← Voltar para campanhas'}
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Form Section */}
                  <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">
                      Criar Novo Post
                    </h2>
                    <SocialMediaForm
                      onGenerate={handleGenerate}
                      onStaticPost={handleStaticPost}
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
                        isAdmin={user.role === 'admin'}
                        editPostId={editingPost?._id}
                        rejectionReason={editingPost?.rejectionReason}
                        onEditComplete={() => {
                          // Clear editing state and go back to pending posts
                          setEditingPost(null);
                          setGeneratedContent(null);
                          setSelectedCampaign(null);
                          setViewMode('approvals');
                          setApprovalSubView('pending');
                        }}
                      />
                    ) : isGenerating ? (
                      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-slate-600 font-medium mb-2">Gerando publicação...</p>
                        <p className="text-slate-400 text-sm">
                          A IA está criando a imagem e descrição
                        </p>
                      </div>
                    ) : (
                      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
                        <Share2 size={48} className="text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-400 text-sm">
                          Os resultados aparecerão aqui
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              /* Campaign List - when no campaign is selected */
              <CampaignList onSelectCampaign={handleCampaignSelect} />
            )}
          </>
        ) : viewMode === 'approvals' ? (
          <>
            {/* Sub-tabs for Approvals */}
            <div className="mb-6">
              <div className="border-b border-slate-200">
                <div className="flex gap-4">
                  <button
                    onClick={() => setApprovalSubView('pending')}
                    className={`px-4 py-2 font-medium text-sm transition border-b-2 -mb-px ${approvalSubView === 'pending'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    {user.role === 'admin' ? 'Pendentes' : 'Minhas Pendentes'}
                  </button>
                  <button
                    onClick={() => setApprovalSubView('scheduled')}
                    className={`px-4 py-2 font-medium text-sm transition border-b-2 -mb-px ${approvalSubView === 'scheduled'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    Agendadas
                  </button>
                  <button
                    onClick={() => setApprovalSubView('all')}
                    className={`px-4 py-2 font-medium text-sm transition border-b-2 -mb-px ${approvalSubView === 'all'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    Todas Aprovadas
                  </button>
                </div>
              </div>
            </div>

            {approvalSubView === 'pending' ? (
              <PendingPostsReview onEditPost={(post) => {
                setEditingPost({
                  _id: post._id,
                  generatedImage: post.generatedImage,
                  overlayText: post.overlayText,
                  description: post.description,
                  context: post.context,
                  rejectionReason: post.rejectionReason,
                  campaign: post.campaign ?? null,
                });
                if (post.campaign) {
                  setSelectedCampaign(post.campaign);
                }
                setGeneratedContent({
                  generatedImage: post.generatedImage,
                  overlayText: post.overlayText,
                  description: post.description,
                  originalImages: [],
                  context: post.context,
                });
                setViewMode('campaigns');
              }} />
            ) : approvalSubView === 'scheduled' ? (
              <ScheduledPostsGallery />
            ) : (
              <PublishedPostsGallery />
            )}
          </>
        ) : null}
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
