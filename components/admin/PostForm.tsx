"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
    Save, AlertCircle, Sparkles, Plus, X,
    Tag as TagIcon, UploadCloud, Trash2, Layout, FileText
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import RichTextEditor from "@/components/RichTextEditor";
import { TagManager, TagData } from "@/components/admin/TagManager";
import { ImageCropModal } from "@/components/admin/ImageCropModal";

type AIStrategy = Record<string, unknown>;

interface AISuggestionResponse {
    title?: string;
    excerpt?: string;
    strategy?: AIStrategy;
    error?: string;
}

interface ApiErrorResponse {
    error?: string;
}

export interface PostData {
    _id?: string;
    title: string;
    slug?: string;
    content?: string;
    tags?: string[];
    coverImage?: string;
    excerpt?: string;
    status?: string;
    category?: 'general' | 'case_study';
}

interface PostFormProps {
    initialData?: PostData | null;
    isEditing?: boolean;
    onSuccess?: () => void;
    onCancel?: () => void;
}

interface FormState {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    tags: string[];
    coverImage: string;
    status: string;
    category: 'general' | 'case_study';
}

export const PostForm: React.FC<PostFormProps> = ({
                                                      initialData,
                                                      isEditing = false,
                                                      onSuccess,
                                                      onCancel
                                                  }) => {
    const { user } = useAuth();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [cropFile, setCropFile] = useState<File | null>(null);

    // AI States
    const [aiLoading, setAiLoading] = useState(false);
    const [aiMessage, setAiMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [aiExcerptLoading, setAiExcerptLoading] = useState(false);
    const [aiExcerptMessage, setAiExcerptMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // AI Cache
    const [titleStrategy, setTitleStrategy] = useState<AIStrategy | null>(null);
    const [excerptStrategy, setExcerptStrategy] = useState<AIStrategy | null>(null);

    // Tag Manager States
    const [availableTags, setAvailableTags] = useState<TagData[]>([]);
    const [showTagManager, setShowTagManager] = useState(false);

    const [formData, setFormData] = useState<FormState>({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        tags: [],
        coverImage: "",
        status: "pending",
        category: "general"
    });

    const [isFormValid, setIsFormValid] = useState(false);

    // Inicialização dos dados do formulário quando initialData muda
    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || "",
                slug: initialData.slug || "",
                excerpt: initialData.excerpt || "",
                content: initialData.content || "",
                tags: Array.isArray(initialData.tags) ? initialData.tags : [],
                coverImage: initialData.coverImage || "",
                status: initialData.status || "pending",
                category: initialData.category || "general"
            });
        }
    }, [initialData?._id]);

    // Define status padrão para admin em novos posts
    useEffect(() => {
        if (!initialData && user?.role === 'admin') {
            setFormData(prev => ({ ...prev, status: 'published' }));
        }
    }, [initialData, user?.role]);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const res = await fetch("/api/tags");
                if (res.ok) {
                    const data = await res.json() as TagData[];
                    setAvailableTags(data);
                }
            } catch (error) {
                console.error("Error fetching tags:", error);
            }
        };
        fetchTags();
    }, []);

    useEffect(() => {
        const isValid =
            formData.title.trim() !== "" &&
            formData.content.trim() !== "" &&
            formData.content !== "<p></p>" &&
            formData.coverImage.trim() !== "";
        setIsFormValid(isValid);
    }, [formData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'content') {
            if (titleStrategy) setTitleStrategy(null);
            if (excerptStrategy) setExcerptStrategy(null);
        }
    };

    const handleContentChange = (htmlContent: string) => {
        setFormData(prev => ({ ...prev, content: htmlContent }));
        if (titleStrategy) setTitleStrategy(null);
        if (excerptStrategy) setExcerptStrategy(null);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCropFile(file);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleCropConfirm = async (croppedFile: File) => {
        setCropFile(null);
        setIsUploading(true);
        const uploadData = new FormData();
        uploadData.append("file", croppedFile);
        uploadData.append("folder", "publication");

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: uploadData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            setFormData(prev => ({ ...prev, coverImage: data.url }));
        } catch (error) {
            console.error("Upload error:", error);
            alert("Error uploading image.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleCropCancel = () => {
        setCropFile(null);
    };

    const handleAddTag = (tagName: string) => {
        if (tagName && !formData.tags.includes(tagName)) {
            setFormData(prev => ({ ...prev, tags: [...prev.tags, tagName] }));
        }
    };

    const handleRemoveTag = (tagName: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(t => t !== tagName)
        }));
    };

    const handleTagCreatedInModal = (newTag: TagData) => {
        setAvailableTags(prev => {
            if (prev.some(t => t.name === newTag.name)) return prev;
            return [...prev, newTag];
        });
        handleAddTag(newTag.name);
    };

    const handleAISuggestion = async () => {
        setAiMessage(null);
        const cleanContent = formData.content.replace(/<[^>]*>?/gm, '');
        if (!cleanContent || cleanContent.length < 100) {
            setAiMessage({ type: 'error', text: 'Escreva mais conteúdo antes de gerar o título.' });
            return;
        }
        setAiLoading(true);
        try {
            const response = await fetch('/api/ai/suggest-title', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: formData.content, strategy: titleStrategy }),
            });
            const data = await response.json() as AISuggestionResponse;
            if (data.title) setFormData(prev => ({ ...prev, title: data.title! }));
            if (data.strategy) setTitleStrategy(data.strategy);
            setAiMessage({ type: 'success', text: '✨ Título gerado!' });
        } catch (error: any) {
            setAiMessage({ type: 'error', text: 'Erro ao gerar.' });
        } finally {
            setAiLoading(false);
        }
    };

    const handleAIExcerptSuggestion = async () => {
        setAiExcerptMessage(null);
        const cleanContent = formData.content.replace(/<[^>]*>?/gm, '');
        if (!cleanContent || cleanContent.length < 100) {
            setAiExcerptMessage({ type: 'error', text: 'Escreva mais conteúdo antes de gerar o resumo.' });
            return;
        }
        setAiExcerptLoading(true);
        try {
            const response = await fetch('/api/ai/suggest-excerpt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: formData.content, title: formData.title, strategy: excerptStrategy }),
            });
            const data = await response.json() as AISuggestionResponse;
            if (data.excerpt) setFormData(prev => ({ ...prev, excerpt: data.excerpt! }));
            if (data.strategy) setExcerptStrategy(data.strategy);
            setAiExcerptMessage({ type: 'success', text: '✨ Resumo gerado!' });
        } catch (error: any) {
            setAiExcerptMessage({ type: 'error', text: 'Erro ao gerar.' });
        } finally {
            setAiExcerptLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;
        setLoading(true);

        try {
            const payload = {
                title: formData.title,
                content: formData.content,
                coverImage: formData.coverImage,
                excerpt: formData.excerpt,
                status: formData.status,
                tags: formData.tags,
                category: formData.category,
                ...(formData.slug ? { slug: formData.slug } : {})
            };

            const url = isEditing ? `/api/posts/${formData.slug}` : "/api/posts";
            const method = isEditing ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json() as ApiErrorResponse;
                throw new Error(errorData.error || "Error saving");
            }

            if (onSuccess) onSuccess();
            else {
                router.push("/admin");
                router.refresh();
            }
        } catch (error: any) {
            alert(error.message || "Unknown error.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (onCancel) onCancel();
        else router.back();
    };

    const inputClass = "w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-auftek-blue outline-none text-slate-900 bg-white placeholder:text-slate-500";

    return (
        <>
            <div className="relative pb-24">
                <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">

                    {/* --- SEÇÃO 1: CONFIGURAÇÃO VISUAL --- */}
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                        <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                            <Layout size={16} /> Configuração Visual
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Imagem de Capa */}
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-slate-700">
                                    Imagem de Capa <span className="text-red-500">*</span>
                                </label>

                                {!formData.coverImage ? (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`
                                    border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors h-48 bg-white
                                    ${isUploading ? 'bg-slate-50 border-slate-300' : 'border-slate-300 hover:border-purple-500 hover:bg-purple-50'}
                                `}
                                    >
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={isUploading}
                                        />
                                        {isUploading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-2"></div>
                                                <span className="text-sm text-slate-500">Enviando...</span>
                                            </>
                                        ) : (
                                            <>
                                                <UploadCloud size={32} className="text-slate-400 mb-2" />
                                                <span className="text-sm font-medium text-slate-700">Clique para selecionar</span>
                                                <span className="text-xs text-slate-400 mt-1">Formatos: JPG, PNG, WEBP</span>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="relative w-full h-48 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shadow-sm group">
                                        <img
                                            src={formData.coverImage}
                                            alt="Preview da capa"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, coverImage: "" }))}
                                                className="bg-white text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition flex items-center gap-2 font-medium"
                                                title="Remover imagem"
                                            >
                                                <Trash2 size={18} /> Alterar Capa
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Tags */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Tags do Artigo</label>
                                    <div className="border border-slate-300 rounded-lg p-3 bg-white space-y-3 min-h-[140px] h-48 flex flex-col">
                                        <div className="flex gap-2">
                                            <select
                                                className="flex-1 p-2 border border-slate-200 rounded text-sm bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-purple-500"
                                                onChange={(e) => {
                                                    if (e.target.value) {
                                                        handleAddTag(e.target.value);
                                                        e.target.value = "";
                                                    }
                                                }}
                                            >
                                                <option value="">Selecione uma tag...</option>
                                                {availableTags
                                                    .filter(t => !formData.tags.includes(t.name))
                                                    .map(tag => (
                                                        <option key={tag._id} value={tag.name}>
                                                            {tag.name}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                            {user?.role === 'admin' && (
                                                <button
                                                    type="button"
                                                    onClick={() => setShowTagManager(true)}
                                                    className="bg-purple-100 text-purple-700 px-3 py-2 rounded-md hover:bg-purple-200 transition flex items-center gap-2 text-sm font-bold border border-purple-200 whitespace-nowrap"
                                                >
                                                    <Plus size={16} /> Nova
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-2 overflow-y-auto content-start flex-1">
                                            {formData.tags.length === 0 && (
                                                <span className="text-xs text-slate-400 italic w-full text-center mt-4">Nenhuma tag selecionada.</span>
                                            )}
                                            {formData.tags.map(tagName => (
                                                <span key={tagName} className="flex items-center gap-1 px-2 py-1 rounded text-xs font-bold border bg-slate-100 text-slate-700 border-slate-200 animate-fade-in h-fit">
                                                <TagIcon size={10} className="opacity-50" />
                                                    {tagName}
                                                    <button type="button" onClick={() => handleRemoveTag(tagName)} className="hover:text-red-600 ml-1 p-0.5 rounded-full hover:bg-black/5 transition">
                                                    <X size={12} />
                                                </button>
                                            </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status e Categoria */}
                        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-200">
                            <input
                                type="checkbox"
                                id="isCaseStudy"
                                checked={formData.category === 'case_study'}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    category: e.target.checked ? 'case_study' : 'general'
                                }))}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 cursor-pointer"
                            />
                            <label htmlFor="isCaseStudy" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                                É um Relato de Caso (Case Study)?
                            </label>
                        </div>
                    </div>

                    {/* --- SEÇÃO 2: REDAÇÃO --- */}
                    <div>
                        <label className="block text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <FileText size={20} className="text-purple-600"/>
                            Conteúdo da Publicação
                        </label>
                        <div className="min-h-[400px]">
                            <RichTextEditor
                                value={formData.content}
                                onChange={handleContentChange}
                            />
                        </div>
                    </div>

                    {/* --- SEÇÃO 3: FINALIZAÇÃO (IA) --- */}
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-6">
                        <div className="flex items-center gap-2 text-purple-800 font-bold uppercase text-xs tracking-wider mb-2">
                            <Sparkles size={14} /> Finalização
                        </div>

                        {/* Título */}
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-sm font-medium text-slate-700">
                                    Título do Artigo <span className="text-red-500">*</span>
                                </label>

                                <button
                                    type="button"
                                    onClick={handleAISuggestion}
                                    disabled={aiLoading}
                                    className={`
                                flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all
                                ${aiLoading
                                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-sm hover:shadow-md'
                                    }
                            `}
                                >
                                    <Sparkles size={16} className={aiLoading ? 'animate-spin' : ''} />
                                    {aiLoading ? 'Gerando...' : 'Sugestão IA'}
                                </button>
                            </div>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="Escreva seu texto primeiro, depois clique em Sugestão IA..."
                                required
                            />
                            {aiMessage && (
                                <div className={`mt-2 px-3 py-2 rounded-lg text-sm flex items-center gap-2 animate-fade-in ${aiMessage.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                    {aiMessage.type === 'error' && <AlertCircle size={16} />}
                                    {aiMessage.text}
                                </div>
                            )}
                        </div>

                        {/* Resumo */}
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-sm font-medium text-slate-700">Resumo (Excerpt)</label>

                                {/* BOTÃO IA (ESTILO RESTAURADO) */}
                                <button
                                    type="button"
                                    onClick={handleAIExcerptSuggestion}
                                    disabled={aiExcerptLoading}
                                    className={`
                                flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all
                                ${aiExcerptLoading
                                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-sm hover:shadow-md'
                                    }
                            `}
                                >
                                    <Sparkles size={16} className={aiExcerptLoading ? 'animate-spin' : ''} />
                                    {aiExcerptLoading ? 'Gerando...' : 'Sugestão IA'}
                                </button>
                            </div>
                            <textarea
                                name="excerpt"
                                value={formData.excerpt}
                                onChange={handleChange}
                                rows={3}
                                className={inputClass}
                                placeholder="Breve descrição automática para cards..."
                            />
                            {aiExcerptMessage && (
                                <div className={`mt-2 px-3 py-2 rounded-lg text-sm flex items-center gap-2 animate-fade-in ${aiExcerptMessage.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                    {aiExcerptMessage.type === 'error' && <AlertCircle size={16} />}
                                    {aiExcerptMessage.text}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- BOTÕES FIXOS (STICKY) --- */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] py-4">
                        <div className="max-w-5xl mx-auto flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors bg-white font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !isFormValid}
                                className={`
                            px-6 py-2 rounded-lg flex items-center gap-2 text-white font-bold transition-all shadow-md
                            ${isFormValid ? "bg-blue-600 hover:bg-blue-700 hover:scale-105" : "bg-slate-300 cursor-not-allowed"}
                        `}
                            >
                                {loading ? "Salvando..." : <><Save size={18} /> Salvar Publicação</>}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {showTagManager && (
                <TagManager
                    isModal={true}
                    onClose={() => setShowTagManager(false)}
                    onTagCreated={handleTagCreatedInModal}
                />
            )}

            {cropFile && (
                <ImageCropModal
                    file={cropFile}
                    onCrop={handleCropConfirm}
                    onCancel={handleCropCancel}
                    aspectRatio={16 / 9}
                    aspectLabel="16:9"
                />
            )}
        </>
    );
};