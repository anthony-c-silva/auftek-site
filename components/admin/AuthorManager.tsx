"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Author } from "@/types/blog";
import { Search, Trash2, Linkedin, BookOpen, User } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";

// Interface auxiliar para tipar o retorno cru do MongoDB
interface APIAuthor extends Author {
    _id: string;
}

export function AuthorManager() {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [formData, setFormData] = useState({
        name: "", photoUrl: "", education: "", linkedin: "", lattes: ""
    });

    const inputClass = "p-2 border border-slate-300 rounded text-sm w-full bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";

    const fetchAuthors = async () => {
        try {
            const res = await fetch("/api/authors");
            if (res.ok) {
                // Tipamos o retorno como APIAuthor[] para acessar o _id legalmente
                const data = await res.json() as APIAuthor[];

                // Normalizamos: Garantimos que 'id' exista copiando '_id'
                const normalizedAuthors: Author[] = data.map((item) => ({
                    ...item,
                    id: item.id || item._id // Prioriza id existente ou usa o do Mongo
                }));

                setAuthors(normalizedAuthors);
            }
        } catch (error) {
            console.error("Erro ao buscar autores", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuthors();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.education) return;

        try {
            const res = await fetch("/api/authors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                // Ao salvar, o backend retorna o objeto criado
                const rawNewAuthor = await res.json() as APIAuthor;

                // Normalizamos ele também antes de adicionar ao estado
                const newAuthor: Author = {
                    ...rawNewAuthor,
                    id: rawNewAuthor.id || rawNewAuthor._id
                };

                setAuthors([newAuthor, ...authors]);
                setFormData({ name: "", photoUrl: "", education: "", linkedin: "", lattes: "" });
            }
        } catch (error) {
            alert("Erro ao salvar autor");
        }
    };

    const handleDelete = async (id?: string) => {
        if (!id) return;
        if (!confirm("Tem certeza que deseja remover este autor?")) return;

        try {
            const res = await fetch(`/api/authors?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                setAuthors(authors.filter(a => a.id !== id));
            }
        } catch (error) { alert("Erro ao deletar"); }
    };

    const filteredAuthors = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return authors.filter(author =>
            author.name.toLowerCase().includes(term) ||
            author.education.toLowerCase().includes(term)
        );
    }, [authors, searchTerm]);

    return (
        <div className="space-y-8">
            {/* Formulário */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="text-sm font-bold text-slate-700 uppercase mb-3 flex items-center gap-2">
                    <User size={16}/> Novo Autor
                </h3>
                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text" placeholder="Nome Completo *" required
                        className={inputClass}
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                    <input
                        type="text" placeholder="Formação *" required
                        className={inputClass}
                        value={formData.education}
                        onChange={e => setFormData({...formData, education: e.target.value})}
                    />
                    <input
                        type="url" placeholder="URL da Foto (opcional)"
                        className={inputClass}
                        value={formData.photoUrl}
                        onChange={e => setFormData({...formData, photoUrl: e.target.value})}
                    />
                    <div className="flex gap-2">
                        <input type="url" placeholder="LinkedIn" className={inputClass}
                               value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} />
                        <input type="url" placeholder="Lattes" className={inputClass}
                               value={formData.lattes} onChange={e => setFormData({...formData, lattes: e.target.value})} />
                    </div>
                    <button type="submit" className="md:col-span-2 bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition shadow-sm active:scale-[0.99]">
                        Cadastrar Autor
                    </button>
                </form>
            </div>

            <hr className="border-slate-200" />

            {/* Lista */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800">Autores Cadastrados ({authors.length})</h3>
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="pl-8 p-2 border border-slate-300 rounded text-sm w-64 bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {loading ? (
                        <p className="text-center py-4 text-slate-500">Carregando autores...</p>
                    ) : filteredAuthors.length === 0 ? (
                        <p className="text-slate-500 text-sm text-center py-4">Nenhum autor encontrado.</p>
                    ) : (
                        filteredAuthors.map((author) => (
                            <div
                                // Como normalizamos no fetch, author.id agora é garantido
                                key={author.id}
                                className="flex items-center gap-4 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition bg-white shadow-sm"
                            >
                                <div className="flex-shrink-0">
                                    <Avatar
                                        src={author.photoUrl}
                                        alt={author.name}
                                        size={48}
                                        className="border border-slate-200"
                                    />
                                </div>

                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-800">{author.name}</h4>
                                    <p className="text-xs text-slate-500">{author.education}</p>
                                    <div className="flex gap-3 mt-1">
                                        {author.linkedin && <a href={author.linkedin} target="_blank" className="text-blue-600 hover:underline text-xs flex items-center gap-1"><Linkedin size={12}/> LinkedIn</a>}
                                        {author.lattes && <a href={author.lattes} target="_blank" className="text-slate-600 hover:underline text-xs flex items-center gap-1"><BookOpen size={12}/> Lattes</a>}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(author.id)}
                                    className="text-red-500 hover:bg-red-50 p-2 rounded-full transition"
                                    title="Remover"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}