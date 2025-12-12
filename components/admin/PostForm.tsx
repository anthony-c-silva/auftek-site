"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Save, AlertCircle, ChevronDown } from "lucide-react";
import { Author } from "@/types/blog";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/context/AuthContext";

interface PostData {
    title: string;
    slug: string;
    content: string;
    tags: string[];
    coverImage: string;
    author: {
        name: string;
        photoUrl: string;
    };
    writer?: {
        name: string;
        email: string;
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
    const { user } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [authors, setAuthors] = useState<Author[]>([]);

    const [isAuthorMenuOpen, setIsAuthorMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        content: "",
        tags: "",
        coverImage: "",
        authorId: "",
    });

    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsAuthorMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Busca Autores
    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                const res = await fetch("/api/authors");
                if (res.ok) {
                    const data = await res.json();
                    // Normalização simples caso venha do Mongo com _id
                    const normalized = data.map((a: any) => ({ ...a, id: a.id || a._id }));
                    setAuthors(normalized);
                }
            } catch (error) {
                console.error("Erro ao carregar autores:", error);
            }
        };
        fetchAuthors();
    }, []);

    // Popula dados na edição
    useEffect(() => {
        if (initialData) {
            const foundAuthor = authors.find(a => a.name === initialData.author?.name);
            setFormData({
                title: initialData.title || "",
                slug: initialData.slug || "",
                content: initialData.content || "",
                tags: Array.isArray(initialData.tags) ? initialData.tags.join(", ") : "",
                coverImage: initialData.coverImage || "",
                authorId: foundAuthor?.id || "",
            });
        }
    }, [initialData, authors]);

    // Validação
    useEffect(() => {
        const isValid =
            formData.title.trim() !== "" &&
            formData.content.trim() !== "" &&
            formData.authorId !== "";
        setIsFormValid(isValid);
    }, [formData.title, formData.content, formData.authorId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Seleção de Autor
    const handleSelectAuthor = (id: string, e: React.MouseEvent) => {
        // Previne qualquer comportamento padrão ou propagação estranha
        e.preventDefault();
        e.stopPropagation();

        setFormData({ ...formData, authorId: id });
        setIsAuthorMenuOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;
        setLoading(true);

        try {
            const selectedAuthor = authors.find(a => a.id === formData.authorId);

            const payload = {
                title: formData.title,
                content: formData.content,
                coverImage: formData.coverImage || "",
                tags: formData.tags.split(",").map((t) => t.trim()).filter((t) => t !== ""),

                author: {
                    name: selectedAuthor?.name || "Admin Auftek",
                    photoUrl: selectedAuthor?.photoUrl || ""
                },

                writer: {
                    name: user?.name || "Equipe Auftek",
                    email: user?.email || ""
                },

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
        if (onCancel) onCancel();
        else router.back();
    };

    const inputClass = "w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-auftek-blue outline-none text-slate-900 bg-white placeholder:text-slate-500";
    const currentAuthor = authors.find(a => a.id === formData.authorId);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Título da Publicação <span className="text-red-500">*</span>
                </label>
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
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        URL da Imagem de Capa <span className="text-slate-400 font-normal lowercase">(opcional)</span>
                    </label>
                    <input
                        name="coverImage"
                        value={formData.coverImage}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="https://..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
                    <input
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Ex: Energia, IoT, Inovação"
                    />
                </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative z-40">
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                    Autor da Publicação <span className="text-red-500">*</span>
                </label>

                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setIsAuthorMenuOpen(!isAuthorMenuOpen)}
                        className={`w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-auftek-blue ${!formData.authorId ? 'text-slate-500' : 'text-slate-900'}`}
                    >
                        {currentAuthor ? (
                            <div className="flex items-center gap-3">
                                <Avatar
                                    src={currentAuthor.photoUrl}
                                    alt={currentAuthor.name}
                                    size={24}
                                    className="border border-slate-200"
                                />
                                <div className="flex flex-col items-start leading-none">
                                    <span className="text-sm font-medium">{currentAuthor.name}</span>
                                    <span className="text-[10px] text-slate-400">{currentAuthor.education}</span>
                                </div>
                            </div>
                        ) : (
                            "Selecione um autor..."
                        )}
                        <ChevronDown size={16} className="text-slate-400" />
                    </button>

                    {isAuthorMenuOpen && (
                        // AQUI FOI A MUDANÇA: Mudamos de z-10 para z-50
                        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                            {authors.length === 0 ? (
                                <div className="p-3 text-sm text-slate-500 text-center">Nenhum autor cadastrado</div>
                            ) : (
                                authors.map((author) => (
                                    <button
                                        // Garantia de key única
                                        key={author.id}
                                        type="button"
                                        // Passamos 'e' para prevenir default
                                        onClick={(e) => handleSelectAuthor(author.id || "", e)}
                                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition border-b border-slate-50 last:border-none text-left cursor-pointer"
                                    >
                                        <Avatar
                                            src={author.photoUrl}
                                            alt={author.name}
                                            size={32}
                                            className="border border-slate-200"
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{author.name}</p>
                                            <p className="text-xs text-slate-500">{author.education}</p>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    )}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                    O nome e a foto selecionados aparecerão no topo do artigo.
                </p>
            </div>

            <div className="relative z-0">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Conteúdo do Artigo <span className="text-red-500">*</span>
                </label>
                <textarea
                    name="content"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    rows={12}
                    className={`${inputClass} font-mono text-sm`}
                    placeholder="Escreva o texto completo aqui..."
                    required
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 items-center">
                {!isFormValid && (
                    <div className="flex-1 text-amber-600 text-xs flex items-center gap-1">
                        <AlertCircle size={14} /> Preencha Título, Conteúdo e Autor para salvar.
                    </div>
                )}
                <div className="flex gap-3 w-full sm:w-auto ml-auto">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 sm:flex-none px-6 py-3 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading || !isFormValid}
                        className={`
                            flex-1 sm:flex-none px-6 py-3 font-bold rounded-lg flex items-center justify-center gap-2 transition-all
                            ${isFormValid
                            ? "bg-green-600 text-white hover:bg-green-700 shadow-md active:scale-[0.99]"
                            : "bg-slate-200 text-slate-400 cursor-not-allowed"}
                        `}
                    >
                        {loading ? "Salvando..." : <><Save size={18} /> Salvar Publicação</>}
                    </button>
                </div>
            </div>
        </form>
    );
};