"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Edit, Trash2, Eye, Search, X, UserCircle } from "lucide-react";
import Link from "next/link";
import { Modal } from "../ui/Modal";
import { PostForm } from "./PostForm";
import { Avatar } from "../ui/Avatar";

export const AdminPostList: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPost, setEditingPost] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch("/api/posts");
            const data = await res.json();
            setPosts(data);
        } catch (error) {
            console.error("Erro ao buscar posts", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (slug: string) => {
        if (!confirm("Tem certeza que deseja excluir este post?")) return;
        try {
            const res = await fetch(`/api/posts/${slug}`, { method: "DELETE" });
            if (res.ok) fetchPosts();
            else alert("Erro ao excluir.");
        } catch (error) { console.error("Erro", error); }
    };

    const handleEditClick = (post: any) => setEditingPost(post);
    const handleModalClose = () => setEditingPost(null);
    const handleFormSuccess = () => { setEditingPost(null); fetchPosts(); };

    const filteredPosts = useMemo(() => {
        if (!searchQuery) return posts;
        const lowerQuery = searchQuery.toLowerCase();
        return posts.filter(post =>
            post.title.toLowerCase().includes(lowerQuery) ||
            post.tags?.some((tag: string) => tag.toLowerCase().includes(lowerQuery)) ||
            post.slug.toLowerCase().includes(lowerQuery) ||
            post.author?.name?.toLowerCase().includes(lowerQuery) ||
            post.writer?.name?.toLowerCase().includes(lowerQuery)
        );
    }, [posts, searchQuery]);

    if (loading) return <div className="text-center py-10 text-slate-500">Carregando posts...</div>;

    return (
        <>
            <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center gap-4">
                    <div className="relative w-full max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Pesquisar por título, autor, redator..."
                            className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-auftek-blue focus:border-transparent outline-none bg-white text-slate-700"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                        {filteredPosts.length} post(s)
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-4 text-sm font-semibold text-slate-700">Título</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-700">Redator (Equipe)</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-700">Autor (Especialista)</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-700">Data</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-700 text-right">Ações</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {filteredPosts.map((post) => (
                            <tr key={post._id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="font-medium text-slate-900 line-clamp-1">{post.title}</p>
                                    <div className="flex gap-1 mt-1">
                                        {post.tags?.slice(0, 2).map((tag: string) => (
                                            <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </td>

                                {/* COLUNA REDATOR (CORRIGIDA) */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-purple-100 p-1.5 rounded-full text-purple-600">
                                            <UserCircle size={16} />
                                        </div>
                                        <span className="text-sm text-slate-700 font-medium">
                                            {/* Prioridade: Nome > Email > Traço */}
                                            {post.writer?.name || post.writer?.email || "—"}
                                        </span>
                                    </div>
                                </td>

                                {/* COLUNA AUTOR */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Avatar
                                            src={post.author?.avatar}
                                            alt={post.author?.name || "Especialista"}
                                            size={24}
                                            className="border border-slate-200"
                                        />
                                        <span className="text-sm text-slate-600">
                                            {post.author?.name || "Especialista"}
                                        </span>
                                    </div>
                                </td>

                                <td className="px-6 py-4 text-sm text-slate-500">
                                    {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            target="_blank"
                                            className="text-slate-400 hover:text-auftek-blue transition-colors"
                                            title="Ver no site"
                                        >
                                            <Eye size={18} />
                                        </Link>
                                        <button
                                            onClick={() => handleEditClick(post)}
                                            className="text-slate-400 hover:text-amber-500 transition-colors"
                                            title="Editar"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(post.slug)}
                                            className="text-slate-400 hover:text-red-500 transition-colors"
                                            title="Excluir"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {filteredPosts.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        {searchQuery ? "Nenhum post encontrado para esta busca." : "Nenhum post encontrado."}
                    </div>
                )}
            </div>

            <Modal
                isOpen={!!editingPost}
                onClose={handleModalClose}
                title={editingPost ? `Editando: ${editingPost.title}` : "Editar Post"}
            >
                {editingPost && (
                    <PostForm
                        initialData={editingPost}
                        isEditing={true}
                        onSuccess={handleFormSuccess}
                        onCancel={handleModalClose}
                    />
                )}
            </Modal>
        </>
    );
};