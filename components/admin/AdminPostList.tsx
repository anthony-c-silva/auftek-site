"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Edit, Trash2, Search, UserCircle, CheckCircle, Clock, FileText } from "lucide-react";
import { Modal } from "../ui/Modal";
import { PostForm } from "./PostForm";
import { useAuth } from "@/context/AuthContext";

interface AuthorData { name?: string; photoUrl?: string; }
interface WriterData { name?: string; email?: string; }

export interface PostData {
    _id: string;
    title: string;
    slug: string;
    tags?: string[];
    createdAt: string;
    updatedAt: string;
    author?: AuthorData;
    writer?: WriterData;
    content?: string;
    coverImage?: string;
    readTime?: string;
    status: 'published' | 'pending' | 'draft';
}

export const AdminPostList: React.FC = () => {
    const { isAdmin, user } = useAuth();

    const [posts, setPosts] = useState<PostData[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPost, setEditingPost] = useState<PostData | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Inicia como 'all', mas o useEffect abaixo corrige se for autor
    const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'pending'>('all');

    // --- MUDANÇA 1: Força a aba inicial para 'published' se não for Admin ---
    useEffect(() => {
        if (!loading && !isAdmin && statusFilter === 'all') {
            setStatusFilter('published');
        }
    }, [isAdmin, loading, statusFilter]);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/posts", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) setPosts(data);
            else setPosts([]);
        } catch (error) {
            console.error("Erro", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (slug: string) => {
        if (!confirm("Aprovar e publicar este post?")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/posts/${slug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status: 'published' })
            });
            if (res.ok) { alert("Aprovado!"); fetchPosts(); }
        } catch (error) { console.error(error); }
    };

    const handleDelete = async (slug: string) => {
        if (!confirm("Excluir post?")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/posts/${slug}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) fetchPosts();
        } catch (error) { console.error(error); }
    };

    const handleEditClick = (post: PostData) => setEditingPost(post);
    const handleModalClose = () => setEditingPost(null);
    const handleFormSuccess = () => { setEditingPost(null); fetchPosts(); };

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: '2-digit',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const filteredPosts = useMemo(() => {
        if (!Array.isArray(posts)) return [];
        let result = posts;

        if (statusFilter === 'published') {
            // Filtra posts publicados DO USUÁRIO LOGADO
            result = result.filter(p => p.status === 'published' && p.writer?.email === user?.email);
        } else if (statusFilter === 'pending') {
            // Se for autor, vê só os seus pendentes. Se for admin, vê todos pendentes.
            if (!isAdmin) {
                result = result.filter(p => p.status === 'pending' && p.writer?.email === user?.email);
            } else {
                result = result.filter(p => p.status === 'pending');
            }
        }

        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(post =>
                post.title?.toLowerCase().includes(lowerQuery) ||
                post.writer?.name?.toLowerCase().includes(lowerQuery)
            );
        }
        return result;
    }, [posts, searchQuery, statusFilter, user, isAdmin]);

    if (loading) return <div className="text-center py-10">Carregando...</div>;

    return (
        <>
            <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">

                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full max-w-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Pesquisar..."
                            className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-600 outline-none text-black"
                        />
                    </div>

                    {/* --- MUDANÇA 2: Botão 'Todos' oculto para Autores --- */}
                    <div className="flex bg-slate-200/60 p-1 rounded-lg">
                        {isAdmin && (
                            <button
                                onClick={() => setStatusFilter('all')}
                                className={`px-4 py-1.5 text-sm rounded-md transition ${statusFilter === 'all' ? 'bg-white shadow text-slate-800 font-bold' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Todos
                            </button>
                        )}
                        <button
                            onClick={() => setStatusFilter('published')}
                            className={`px-4 py-1.5 text-sm rounded-md transition ${statusFilter === 'published' ? 'bg-white shadow text-green-600 font-bold' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Minhas Publicações
                        </button>
                        <button
                            onClick={() => setStatusFilter('pending')}
                            className={`px-4 py-1.5 text-sm rounded-md transition ${statusFilter === 'pending' ? 'bg-white shadow text-amber-600 font-bold' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Pendentes
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-4 text-sm font-semibold text-slate-700">Status</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-700">Título</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-700">Redator</th>

                            <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                                {statusFilter === 'published' ? "Aprovado em" : "Data"}
                            </th>

                            <th className="px-6 py-4 text-sm font-semibold text-slate-700 text-right">Ações</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {filteredPosts.map((post) => (
                            <tr key={post._id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    {post.status === 'published' && (
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold flex w-fit items-center gap-1">
                                            <CheckCircle size={12}/> No Ar
                                        </span>
                                    )}
                                    {post.status === 'pending' && (
                                        <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold flex w-fit items-center gap-1">
                                            <Clock size={12}/> Pendente
                                        </span>
                                    )}
                                    {post.status === 'draft' && (
                                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold flex w-fit items-center gap-1">
                                            <FileText size={12}/> Rascunho
                                        </span>
                                    )}
                                </td>

                                <td className="px-6 py-4">
                                    <p className="font-medium text-slate-900 line-clamp-1">{post.title}</p>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-purple-100 p-1.5 rounded-full text-purple-600">
                                            <UserCircle size={16} />
                                        </div>
                                        <span className="text-sm text-slate-900 font-medium">
                                            {post.writer?.name || "—"}
                                        </span>
                                    </div>
                                </td>

                                <td className="px-6 py-4 text-sm text-slate-500">
                                    {statusFilter === 'published'
                                        ? formatDate(post.updatedAt)
                                        : formatDate(post.createdAt)
                                    }
                                </td>

                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        {isAdmin && post.status === 'pending' && (
                                            <button
                                                onClick={() => handleApprove(post.slug)}
                                                className="text-green-600 hover:bg-green-100 p-1.5 rounded transition-colors"
                                                title="Aprovar e Publicar"
                                            >
                                                <CheckCircle size={20} />
                                            </button>
                                        )}
                                        <button onClick={() => handleEditClick(post)} className="text-slate-400 hover:text-amber-500">
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(post.slug)} className="text-slate-400 hover:text-red-500">
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
                        Nenhum post encontrado nesta aba.
                    </div>
                )}
            </div>

            <Modal isOpen={!!editingPost} onClose={handleModalClose} title="Editar Post">
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