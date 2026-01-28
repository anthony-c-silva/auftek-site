"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Share2 } from "lucide-react";
import { SocialMediaForm } from "@/components/admin/SocialMediaForm";
import { GeneratedPostPreview } from "@/components/admin/GeneratedPostPreview";

export default function SocialMediaPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{
    generatedImage: string;
    overlayText: string;
    description: string;
    originalImages: string[];
  } | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  const handleGenerate = async (data: { images: string[]; text: string; context: string }) => {
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
          text: imageResult.overlayText, // Use the generated text for description
          context: data.context,
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
      });

    } catch (error: any) {
      console.error("Erro na geração:", error);
      alert(error.message || "Erro ao gerar conteúdo");
    } finally {
      setIsGenerating(false);
    }
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Publicar em Redes Sociais
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Faça upload de imagens e descreva o contexto. A IA irá mesclar as imagens e gerar texto automaticamente.
          </p>
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
      </main>
    </div>
  );
}
