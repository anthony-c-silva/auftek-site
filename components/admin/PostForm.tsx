"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, AlertCircle, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Interface simplificada apenas para o Front
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
    // useAuth apenas para saber se está carregando ou se tem permissão visual
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiMessage, setAiMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [aiExcerptLoading, setAiExcerptLoading] = useState(false);
    const [aiExcerptMessage, setAiExcerptMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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

    // Popula dados na edição
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

    // Validação Simplificada (Sem authorId)
    useEffect(() => {
        const isValid =
            formData.title.trim() !== "" &&
            formData.content.trim() !== "" &&
            formData.coverImage.trim() !== "";
        setIsFormValid(isValid);
    }, [formData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAISuggestion = async () => {
        // Limpar mensagem anterior
        setAiMessage(null);

        // Validar se há conteúdo suficiente
        if (!formData.content || formData.content.trim().length < 100) {
            setAiMessage({
                type: 'error',
                text: 'Escreva pelo menos 100 caracteres no conteúdo para gerar uma sugestão.'
            });
            return;
        }

        setAiLoading(true);

        try {
            const response = await fetch('/api/ai/suggest-title', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: formData.content }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao gerar sugestão');
            }

            // Atualizar o título com a sugestão
            setFormData({ ...formData, title: data.title });
            setAiMessage({
                type: 'success',
                text: '✨ Título gerado com sucesso!'
            });

            // Limpar mensagem de sucesso após 5 segundos
            setTimeout(() => setAiMessage(null), 5000);

        } catch (error: unknown) {
            let errorMessage = 'Erro ao gerar sugestão.';
            if (error instanceof Error) errorMessage = error.message;
            setAiMessage({
                type: 'error',
                text: errorMessage
            });
        } finally {
            setAiLoading(false);
        }
    };

    const handleAIExcerptSuggestion = async () => {
        // Limpar mensagem anterior
        setAiExcerptMessage(null);

        // Validar se há conteúdo suficiente
        if (!formData.content || formData.content.trim().length < 100) {
            setAiExcerptMessage({
                type: 'error',
                text: 'Escreva pelo menos 100 caracteres no conteúdo para gerar uma sugestão.'
            });
            return;
        }

        setAiExcerptLoading(true);

        try {
            const response = await fetch('/api/ai/suggest-excerpt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: formData.content,
                    title: formData.title || undefined
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao gerar sugestão');
            }

            // Atualizar o resumo com a sugestão
            setFormData({ ...formData, excerpt: data.excerpt });
            setAiExcerptMessage({
                type: 'success',
                text: '✨ Resumo gerado com sucesso!'
            });

            // Limpar mensagem de sucesso após 5 segundos
            setTimeout(() => setAiExcerptMessage(null), 5000);

        } catch (error: unknown) {
            let errorMessage = 'Erro ao gerar sugestão.';
            if (error instanceof Error) errorMessage = error.message;
            setAiExcerptMessage({
                type: 'error',
                text: errorMessage
            });
        } finally {
            setAiExcerptLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;
        setLoading(true);

        try {
            // PAYLOAD LIMPO:
            // Não enviamos authorId nem writer.
            // O Backend pega o usuário da sessão (cookie) e preenche esses dados.
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

            if (onSuccess) {
                onSuccess();
            } else {
                router.push("/admin");
                router.refresh();
            }
        } catch (error: unknown) {
            let errorMessage = "Erro desconhecido.";
            if (error instanceof Error) errorMessage = error.message;
            alert(errorMessage);
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
                {/* Mensagem de feedback da IA */}
                {aiMessage && (
                    <div className={`
                        mt-2 px-3 py-2 rounded-lg text-sm flex items-center gap-2
                        ${aiMessage.type === 'success'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }
                    `}>
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
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
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
                {/* Se for Admin, mostra opção de Status */}
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
                {/* Mensagem de feedback da IA */}
                {aiExcerptMessage && (
                    <div className={`
                        mt-2 px-3 py-2 rounded-lg text-sm flex items-center gap-2
                        ${aiExcerptMessage.type === 'success'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }
                    `}>
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