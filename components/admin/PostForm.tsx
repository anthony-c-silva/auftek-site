"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, AlertCircle, Sparkles, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import RichTextEditor from "@/components/RichTextEditor";

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

export const PostForm: React.FC<PostFormProps> = ({
                                                      initialData,
                                                      isEditing = false,
                                                      onSuccess,
                                                      onCancel
                                                  }) => {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Estados da IA
    const [aiLoading, setAiLoading] = useState(false);
    const [aiMessage, setAiMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [aiExcerptLoading, setAiExcerptLoading] = useState(false);
    const [aiExcerptMessage, setAiExcerptMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Cache da IA
    const [titleStrategy, setTitleStrategy] = useState<any>(null);
    const [excerptStrategy, setExcerptStrategy] = useState<any>(null);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        tags: "",
        coverImage: "",
        readTime: "",
        status: "pending"
    });

    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || "",
                slug: initialData.slug || "",
                excerpt: initialData.excerpt || "",
                content: initialData.content || "",
                tags: Array.isArray(initialData.tags) ? initialData.tags.join(", ") : "",
                coverImage: initialData.coverImage || "",
                readTime: initialData.readTime || "",
                status: initialData.status || "pending"
            });
        }
    }, [initialData]);

    useEffect(() => {
        // Validação básica (agora considerando que content pode ter tags HTML)
        const isValid =
            formData.title.trim() !== "" &&
            formData.content.trim() !== "" &&
            formData.content !== "<p></p>" && // Verifica vazio do TipTap
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

    // Handler específico para o RichTextEditor
    const handleContentChange = (htmlContent: string) => {
        setFormData(prev => ({ ...prev, content: htmlContent }));

        // Invalida cache da IA pois o conteúdo mudou
        if (titleStrategy) setTitleStrategy(null);
        if (excerptStrategy) setExcerptStrategy(null);
    };

    const handleAISuggestion = async () => {
        setAiMessage(null);

        // Remove tags HTML básicas para contar caracteres reais
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
                body: JSON.stringify({
                    content: formData.content, // Envia HTML mesmo, a IA entende
                    strategy: titleStrategy
                }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Erro ao gerar sugestão');

            setFormData(prev => ({ ...prev, title: data.title }));

            if (data.strategy) {
                setTitleStrategy(data.strategy);
            }

            setAiMessage({ type: 'success', text: '✨ Título estratégico gerado!' });
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
                body: JSON.stringify({
                    content: formData.content,
                    title: formData.title || undefined,
                    strategy: excerptStrategy
                }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Erro ao gerar sugestão');

            setFormData(prev => ({
                ...prev,
                excerpt: data.excerpt
            }));

            if (data.strategy) {
                setExcerptStrategy(data.strategy);
            }

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
                tags: formData.tags.split(",").map((t) => t.trim()).filter((t) => t !== ""),
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
                const errorData = await res.json() as { error?: string };
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

    return (
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
                    <div className={`mt-2 px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                        aiMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                        {aiMessage.type === 'error' && <AlertCircle size={16} />}
                        {aiMessage.text}
                    </div>
                )}
            </div>

            {/* Grid: Capa e Tags */}
            <div className="grid md:grid-cols-2 gap-6">

                {/* Imagem de Capa com Preview */}
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

                    {/* Preview Area */}
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
                            {/* Fallback fica atrás da imagem */}
                            <div className="absolute inset-0 flex items-center justify-center text-slate-400 -z-10 bg-slate-50">
                                <span className="text-sm">Link inválido ou imagem indisponível</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Tags */}
                <div>
                    <div className="flex justify-between">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
                    </div>
                    <input
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Separe por vírgulas..."
                    />
                    <p className="text-xs text-slate-500 mt-2">
                        Dica: As tags ajudam na busca interna do blog.
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

            {/* Resumo / Excerpt */}
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
                    <div className={`mt-2 px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                        aiExcerptMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
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

                {/* Substituição: Textarea -> TipTap Editor */}
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
    );
};