"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";

interface PostData {
    title: string;
    slug: string;
    content: string;
    tags: string[];
    coverImage: string;
    author: {
        name: string;
        avatar: string;
    };
}

interface PostFormProps {
    initialData?: PostData;
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
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        content: "",
        tags: "",
        coverImage: "",
        authorName: "",
        authorAvatar: "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || "",
                slug: initialData.slug || "",
                content: initialData.content || "",
                // Verifica se é array antes de dar join, para evitar erros
                tags: Array.isArray(initialData.tags) ? initialData.tags.join(", ") : "",
                coverImage: initialData.coverImage || "",
                authorName: initialData.author?.name || "",
                authorAvatar: initialData.author?.avatar || "",
            });
        } else {
            setFormData({
                title: "", slug: "", content: "", tags: "", coverImage: "",
                authorName: "", authorAvatar: "",
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 3. Construção Inteligente do Objeto (Sem 'delete' e sem 'any')
            const payload = {
                title: formData.title,
                content: formData.content,
                coverImage: formData.coverImage,
                tags: formData.tags.split(",").map((t) => t.trim()).filter((t) => t !== ""),
                author: {
                    name: formData.authorName || "Admin Auftek",
                    avatar: formData.authorAvatar || "/images/default-avatar.png"
                },
                // Lógica condicional: Só adiciona a propriedade 'slug' se ela não estiver vazia
                // Se estiver vazia (na criação), ela nem entra no objeto, e a API gera automático.
                ...(formData.slug ? { slug: formData.slug } : {})
            };

            const url = isEditing ? `/api/posts/${formData.slug}` : "/api/posts";
            const method = isEditing ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Erro ao salvar");

            if (onSuccess) {
                onSuccess();
            } else {
                alert(isEditing ? "Post atualizado!" : "Post criado com sucesso!");
                router.push("/admin");
                router.refresh();
            }

        } catch (error) {
            alert("Erro ao salvar post.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            router.back();
        }
    };

    const inputClass = "w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-auftek-blue outline-none text-slate-900 bg-white placeholder:text-slate-400";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Título da Publicação</label>
                <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Ex: O Futuro da Automação Industrial com IA"
                    required
                />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">URL da Imagem de Capa</label>
                    <input
                        name="coverImage"
                        value={formData.coverImage}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="https://... ou /images/minha-foto.png"
                    />
                    <p className="text-xs text-slate-400 mt-1">Recomendado: 800x400px</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
                    <input
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Ex: Energia, IoT, Inovação (separadas por vírgula)"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Conteúdo do Artigo</label>
                <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows={12}
                    className={`${inputClass} font-mono text-sm`}
                    placeholder="Escreva o texto completo aqui. Use Enter para criar novos parágrafos..."
                    required
                />
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Nome do Autor</label>
                    <input
                        name="authorName"
                        value={formData.authorName}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Ex: João Silva"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Avatar do Autor (URL)</label>
                    <input
                        name="authorAvatar"
                        value={formData.authorAvatar}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="https://... (Link da foto de perfil)"
                    />
                </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-white border border-slate-300 text-slate-700 font-bold py-3 rounded-lg hover:bg-slate-50 transition-colors"
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-sm active:scale-[0.99]"
                >
                    {loading ? "Salvando..." : <><Save size={18} /> Salvar Publicação</>}
                </button>
            </div>

        </form>
    );
};