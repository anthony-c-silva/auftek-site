"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, AlertCircle, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

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

    // Estados da IA (Loading e Mensagens)
    const [aiLoading, setAiLoading] = useState(false);
    const [aiMessage, setAiMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [aiExcerptLoading, setAiExcerptLoading] = useState(false);
    const [aiExcerptMessage, setAiExcerptMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Estados de Cache da IA (Estratégia JSON)
    // Isso guarda a análise do texto para não precisar ler tudo de novo se o usuário clicar em "Gerar" novamente.
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
        const isValid =
            formData.title.trim() !== "" &&
            formData.content.trim() !== "" &&
            formData.coverImage.trim() !== "";
        setIsFormValid(isValid);
    }, [formData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // LÓGICA DE INVALIDAÇÃO DE CACHE
        // Se o usuário mudou o texto, a estratégia antiga não serve mais. Limpamos para forçar nova análise.
        if (name === 'content') {
            if (titleStrategy) setTitleStrategy(null);
            if (excerptStrategy) setExcerptStrategy(null);
        }
    };

    // --- INTEGRAÇÃO V2: TÍTULO (COM CACHE) ---
    const handleAISuggestion = async () => {
        setAiMessage(null);

        if (!formData.content || formData.content.trim().length < 100) {
            setAiMessage({ type: 'error', text: 'Escreva pelo menos 100 caracteres no conteúdo.' });
            return;
        }

        setAiLoading(true);

        try {
            // Envia o conteúdo E a estratégia cacheada (se existir)
            const response = await fetch('/api/ai/suggest-title', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: formData.content,
                    strategy: titleStrategy // Envia null na primeira vez, e o JSON na segunda
                }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Erro ao gerar sugestão');

            setFormData(prev => ({ ...prev, title: data.title }));

            // Salva a estratégia retornada para usar na próxima vez (cache)
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

        if (!formData.content || formData.content.trim().length < 100) {
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
                    strategy: excerptStrategy // Envia o cache se existir
                }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Erro ao gerar sugestão');

            // Atualiza APENAS o Resumo (Excerpt)
            setFormData(prev => ({
                ...prev,
                excerpt: data.excerpt
            }));

            // Salva o cache da estratégia (para uso interno ou futuro)
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
                        disabled={aiLoading || formData.content.trim().length < 100}
                        className={`
                            flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all
                            ${aiLoading || formData.content.trim().length < 100
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

            {/* Grid de Configurações */}
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        URL da Imagem de Capa <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="coverImage"
                        value={formData.coverImage}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="https://..."
                        required
                    />
                </div>
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
                        disabled={aiExcerptLoading || formData.content.trim().length < 100}
                        className={`
                            flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all
                            ${aiExcerptLoading || formData.content.trim().length < 100
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

            {/* Conteúdo */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Conteúdo <span className="text-red-500">*</span>
                </label>
                <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows={15}
                    className={`${inputClass} font-mono text-sm`}
                    placeholder="Escreva seu artigo aqui..."
                    required
                />
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading || !isFormValid}
                    className={`
                        px-6 py-2 rounded-lg flex items-center gap-2 text-white font-medium
                        ${isFormValid ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-300 cursor-not-allowed"}
                    `}
                >
                    {loading ? "Salvando..." : <><Save size={18} /> Salvar Publicação</>}
                </button>
            </div>
        </form>
    );
};