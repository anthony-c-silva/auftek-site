"use client";
import React, { useState, useEffect } from "react";
import { Tag as TagIcon, Plus, X, Trash2 } from "lucide-react";

export interface TagData {
    _id: string;
    name: string;
    slug: string;
    // color: string; // Removido
}

interface TagManagerProps {
    onTagCreated?: (newTag: TagData) => void;
    isModal?: boolean;
    onClose?: () => void;
}

export function TagManager({ onTagCreated, isModal = false, onClose }: TagManagerProps) {
    const [tags, setTags] = useState<TagData[]>([]);
    const [newName, setNewName] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchTags = async () => {
        try {
            const res = await fetch("/api/tags");
            if (res.ok) setTags(await res.json());
        } catch (error) {
            console.error("Erro ao carregar tags", error);
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;

        setLoading(true);
        try {
            // Enviamos apenas o nome, o backend vai ignorar a cor ou usar default
            const res = await fetch("/api/tags", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName }),
            });

            if (res.ok) {
                const createdTag = await res.json();
                setNewName("");
                fetchTags(); // Atualiza lista local

                if (onTagCreated) {
                    onTagCreated(createdTag);
                }
            } else {
                alert("Erro: Tag possivelmente duplicada ou inválida");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remover esta tag do sistema?")) return;
        try {
            await fetch(`/api/tags?id=${id}`, { method: "DELETE" });
            setTags(tags.filter(t => t._id !== id));
        } catch (error) {
            alert("Erro ao deletar");
        }
    };

    const renderContent = () => (
        <div className="p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <TagIcon size={18} /> Gerenciar Tags
            </h3>

            {/* Formulário Simplificado */}
            <form onSubmit={handleAdd} className="flex gap-2 mb-6 p-4 bg-slate-50 rounded-lg border border-slate-100 items-end">
                <div className="flex-1">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Nova Tag</label>
                    <input
                        type="text"
                        placeholder="Ex: Inovação"
                        className="w-full p-2 border border-slate-300 text-slate-800 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                    />
                </div>

                <button
                    disabled={loading || !newName}
                    type="submit"
                    className="bg-slate-900 text-white px-4 py-2 rounded text-sm font-bold hover:bg-slate-800 transition flex items-center gap-2 disabled:opacity-50 h-[38px]"
                >
                    <Plus size={16} /> Adicionar
                </button>
            </form>

            {/* Lista de Tags */}
            <div className="border-t pt-4">
                <label className="text-xs font-bold text-slate-400 uppercase mb-3 block">Tags Cadastradas</label>
                <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                    {tags.length === 0 ? (
                        <p className="text-slate-400 text-sm italic w-full text-center py-4">Nenhuma tag encontrada.</p>
                    ) : (
                        tags.map(tag => (
                            <div
                                key={tag._id}
                                className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border bg-slate-100 text-slate-700 border-slate-200 group"
                            >
                                {tag.name}
                                <button
                                    onClick={() => handleDelete(tag._id)}
                                    className="hover:bg-black/10 rounded-full p-0.5 transition opacity-60 hover:opacity-100"
                                    title="Excluir tag permanentemente"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );

    if (isModal) {
        return (
            <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative border border-slate-200">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition z-10 p-1 hover:bg-slate-100 rounded-full"
                    >
                        <X size={20} />
                    </button>
                    {renderContent()}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
            {renderContent()}
        </div>
    );
}