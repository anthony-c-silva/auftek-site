"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, AlertCircle, Sparkles, Image as ImageIcon, Plus, X, Tag as TagIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import RichTextEditor from "@/components/RichTextEditor";
import { TagManager, TagData } from "@/components/admin/TagManager";

// --- Interfaces e Tipos ---

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
    readTime?: string;
    excerpt?: string;
    status?: string;
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
    tags: string[]; // Mudamos de string para string[]
    coverImage: string;
    readTime: string;
    status: string;
}

export const PostForm: React.FC<PostFormProps> = ({
                                                      initialData,
                                                      isEditing = false,
                                                      onSuccess,
                                                      onCancel
                                                  }) => {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Estados da IA (Originais)
    const [aiLoading, setAiLoading] = useState(false);
    const [aiMessage, setAiMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [aiExcerptLoading, setAiExcerptLoading] = useState(false);
    const [aiExcerptMessage, setAiExcerptMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Cache da IA
    const [titleStrategy, setTitleStrategy] = useState<AIStrategy | null>(null);
    const [excerptStrategy, setExcerptStrategy] = useState<AIStrategy | null>(null);

    // --- NOVOS ESTADOS PARA O TAG MANAGER ---
    const [availableTags, setAvailableTags] = useState<TagData[]>([]);
    const [showTagManager, setShowTagManager] = useState(false);

    const [formData, setFormData] = useState<FormState>({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        tags: [], // Inicializa como array vazio
        coverImage: "",
        readTime: "",
        status: "pending"
    });

    const [isFormValid, setIsFormValid] = useState(false);

    // Carregar dados iniciais
    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || "",
                slug: initialData.slug || "",
                excerpt: initialData.excerpt || "",
                content: initialData.content || "",
                // Garante que tags seja array
                tags: Array.isArray(initialData.tags) ? initialData.tags : [],
                coverImage: initialData.coverImage || "",
                readTime: initialData.readTime || "",
                status: initialData.status || "pending"
            });
        }
    }, [initialData]);

    // Buscar Tags da API
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const res = await fetch("/api/tags");
                if (res.ok) {
                    const data = await res.json() as TagData[];
                    setAvailableTags(data);
                }
            } catch (error) {
                console.error("Erro ao buscar tags:", error);
            }
        };
        fetchTags();
    }, []);

    // Validação
    useEffect(() => {
        const isValid =
            formData.title.trim() !== "" &&
            formData.content.trim() !== "" &&
            formData.content !== "<p></p>" &&
            formData.coverImage.trim() !== "";
        setIsFormValid(isValid);
    }, [formData]);

    // Handlers Genéricos
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

    // --- HANDLERS ESPECÍFICOS PARA TAGS ---
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

    // Handlers de IA (Mantidos originais)
    const handleAISuggestion = async () => {
        setAiMessage(null);
        const cleanContent = formData.content.replace(/<[^>]*>?/gm, '');
        if (!cleanContent || cleanContent.length < 100) {
            setAiMessage({ type: 'error', text: 'Escreva pelo menos 100 caracteres no conteúdo.' });
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
            if (!response.ok) throw new Error(data.error || 'Erro ao gerar sugestão');
            if (data.title) setFormData(prev => ({ ...prev, title: data.title! }));
            if (data.strategy) setTitleStrategy(data.strategy);
            setAiMessage({ type: 'success', text: '✨ Título gerado!' });
            setTimeout(() => setAiMessage(null), 5000);
        } catch (error: any) {
            setAiMessage({ type: 'error', text: error.message || 'Erro ao gerar sugestão.' });
        } finally {
            setAiLoading(false);
        }
    };

    const handleAIExcerptSuggestion = async () => {
        setAiExcerptMessage(null);
        const cleanContent = formData.content.replace(/<[^>]*>?/gm, '');
        if (!cleanContent || cleanContent.length < 100) {
            setAiExcerptMessage({ type: 'error', text: 'Escreva pelo menos 100 caracteres no conteúdo.' });
            return;
        }
        setAiExcerptLoading(true);
        try {
            const response = await fetch('/api/ai/suggest-excerpt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: formData.content, title: formData.title || undefined, strategy: excerptStrategy }),
            });
            const data = await response.json() as AISuggestionResponse;
            if (!response.ok) throw new Error(data.error || 'Erro ao gerar sugestão');
            if (data.excerpt) setFormData(prev => ({ ...prev, excerpt: data.excerpt! }));
            if (data.strategy) setExcerptStrategy(data.strategy);
            setAiExcerptMessage({ type: 'success', text: '✨ Resumo gerado!' });
            setTimeout(() => setAiExcerptMessage(null), 5000);
        } catch (error: any) {
            setAiExcerptMessage({ type: 'error', text: error.message || 'Erro ao gerar sugestão.' });
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
                readTime: formData.readTime,
                excerpt: formData.excerpt,
                status: formData.status,
                tags: formData.tags, // Envia o array diretamente
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
                throw new Error(errorData.error || "Erro ao salvar");
            }

            if (onSuccess) onSuccess();
            else {
                router.push("/admin");
                router.refresh();
            }
        } catch (error: any) {
            alert(error.message || "Erro desconhecido.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (onCancel) onCancel();
        else router.back();
    };

    const inputClass = "w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-auftek-blue outline-none text-slate-900 bg-white placeholder:text-slate-500";

    // --- RENDERIZAÇÃO ---
    // Envolvemos tudo em <> para separar o Form do TagManager (Correção do erro de hidratação)
    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto pb-10">
                {/* Título */}
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm font-medium text-slate-700">
                            Título da Publicação <span className="text-red-500">*</span>
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
                        placeholder="Ex: Inovação em Biotecnologia"
                        required
                    />
                    {aiMessage && (
                        <div className={`mt-2 px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${aiMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                            {aiMessage.type === 'error' && <AlertCircle size={16} />}
                            {aiMessage.text}
                        </div>
                    )}
                </div>

                {/* Grid: Capa e Tags */}
                <div className="grid md:grid-cols-2 gap-6">

                    {/* Imagem de Capa */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-slate-700">
                            URL da Imagem de Capa <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <ImageIcon size={18} />
                            </div>
                            <input
                                name="coverImage"
                                value={formData.coverImage}
                                onChange={handleChange}
                                className={`${inputClass} pl-10`}
                                placeholder="https://exemplo.com/imagem.jpg"
                                required
                            />
                        </div>

                        {formData.coverImage && (
                            <div className="relative w-full h-48 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                                <img
                                    src={formData.coverImage}
                                    alt="Preview da capa"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-slate-700">Tags</label>
                        <div className="border border-slate-300 rounded-lg p-3 bg-white space-y-3 min-h-[140px]">
                            <div className="flex gap-2">
                                <select
                                    // CORREÇÃO AQUI: Mudança de text-slate-400 para text-slate-700
                                    className="flex-1 p-2 border border-slate-200 rounded text-sm bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-purple-500"
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            handleAddTag(e.target.value);
                                            e.target.value = "";
                                        }
                                    }}
                                >
                                    <option value="">Selecione...</option>
                                    {availableTags
                                        .filter(t => !formData.tags.includes(t.name))
                                        .map(tag => (
                                            <option key={tag._id} value={tag.name}>
                                                {tag.name}
                                            </option>
                                        ))
                                    }
                                </select>

                                {/* CORREÇÃO AQUI: Apenas UM botão condicional */}
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

                            <div className="flex flex-wrap gap-2">
                                {formData.tags.length === 0 && (
                                    <span className="text-xs text-slate-400 italic">Nenhuma tag selecionada.</span>
                                )}

                                {formData.tags.map(tagName => (
                                    <span
                                        key={tagName}
                                        className="flex items-center gap-1 px-2 py-1 rounded text-xs font-bold border bg-slate-100 text-slate-700 border-slate-200 animate-fade-in"
                                    >
                                        <TagIcon size={10} className="opacity-50" />
                                        {tagName}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tagName)}
                                            className="hover:text-red-600 ml-1 p-0.5 rounded-full hover:bg-black/5 transition"
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            Selecione da lista {user?.role === 'admin' ? "ou crie novas tags" : ""}.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tempo de Leitura</label>
                        <input
                            name="readTime"
                            value={formData.readTime}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="Ex: 5 min"
                        />
                    </div>
                    {user?.role === 'admin' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className={inputClass}
                            >
                                <option value="pending">Pendente</option>
                                <option value="draft">Rascunho</option>
                                <option value="published">Publicado</option>
                            </select>
                        </div>
                    )}
                </div>

                {/* --- SEÇÃO DE RESUMO (SUBTÍTULO) ORIGINAL RESTAURADA --- */}
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm font-medium text-slate-700">Resumo (Excerpt)</label>
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
                        rows={2}
                        className={inputClass}
                        placeholder="Breve descrição que aparecerá nos cards..."
                    />
                    {aiExcerptMessage && (
                        <div className={`mt-2 px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${aiExcerptMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                            {aiExcerptMessage.type === 'error' && <AlertCircle size={16} />}
                            {aiExcerptMessage.text}
                        </div>
                    )}
                </div>

                {/* Conteúdo com Rich Text Editor */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Conteúdo <span className="text-red-500">*</span>
                    </label>

                    <RichTextEditor
                        value={formData.content}
                        onChange={handleContentChange}
                    />

                    <p className="text-xs text-slate-500 mt-1">
                        Selecione o texto para formatar. Use o botão de imagem para inserir via URL.
                    </p>
                </div>

                {/* Botões de Ação */}
                <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading || !isFormValid}
                        className={`
                        px-6 py-2 rounded-lg flex items-center gap-2 text-white font-medium transition-all
                        ${isFormValid ? "bg-blue-600 hover:bg-blue-700 shadow-md" : "bg-slate-300 cursor-not-allowed"}
                    `}
                    >
                        {loading ? "Salvando..." : <><Save size={18} /> Salvar Publicação</>}
                    </button>
                </div>
            </form>

            {/* MODAL MOVIDO PARA FORA DO FORMULÁRIO (CORREÇÃO DE ERRO) */}
            {showTagManager && (
                <TagManager
                    isModal={true}
                    onClose={() => setShowTagManager(false)}
                    onTagCreated={handleTagCreatedInModal}
                />
            )}
        </>
    );
};