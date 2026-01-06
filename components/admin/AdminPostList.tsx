"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Edit, Trash2, Search, UserCircle, CheckCircle, Clock, FileText, RefreshCw, XCircle } from "lucide-react";
import { Modal } from "../ui/Modal";
import { PostForm } from "./PostForm";
import { useAuth } from "@/context/AuthContext";
import { PostComparisonModal } from "./PostComparisonModal";

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
    excerpt?: string;
    readTime?: string;

    // Status atualizados
    status: 'published' | 'pending' | 'draft' | 're-evaluation' | 'rejected';

    // Objeto de mudanças pendentes (necessário para o Modal de Comparação)
    pendingChanges?: {
        title?: string;
        content?: string;
        excerpt?: string;
        coverImage?: string;
        tags?: string[];
        slug?: string;
    };

    rejectionReason?: string;
}

export const AdminPostList: React.FC = () => {
    const { isAdmin, user } = useAuth();

    const [posts, setPosts] = useState<PostData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Controle de Filtros
    const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'pending'>('all');

    // Controle de Modais
    const [editingPost, setEditingPost] = useState<PostData | null>(null);
    const [reviewingPost, setReviewingPost] = useState<PostData | null>(null);

    // Força aba inicial baseada no papel do usuário
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
            console.error("Erro ao buscar posts", error);
        } finally {
            setLoading(false);
        }
    };

    // --- AÇÕES ---

    const handleDirectApprove = async (slug: string) => {
        if (!confirm("Aprovar e publicar este post?")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/posts/${slug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status: 'published' })
            });
            if (res.ok) {
                alert("Post publicado com sucesso!");
                fetchPosts();
            }
        } catch (error) { console.error(error); }
    };

    const handleConfirmApproval = async (slug: string) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/posts/${slug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status: 'published' })
            });

            if (res.ok) {
                alert("Alterações aprovadas e publicadas!");
                setReviewingPost(null);
                fetchPosts();
            }
        } catch (error) {
            console.error("Erro na aprovação:", error);
            alert("Erro ao aprovar.");
        }
    };

    const handleReject = async (slug: string, reason: string) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/posts/${slug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status: 'rejected', rejectionReason: reason })
            });

            if (res.ok) {
                alert("Alterações rejeitadas/Post recusado.");
                setReviewingPost(null);
                fetchPosts();
            }
        } catch (error) { console.error(error); }
    };

    const handleDelete = async (slug: string) => {
        if (!confirm("Tem certeza que deseja excluir este post?")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/posts/${slug}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) fetchPosts();
        } catch (error) { console.error(error); }
    };

    // --- UI HELPERS ---

    const handleEditClick = (post: PostData) => setEditingPost(post);
    const handleModalClose = () => setEditingPost(null);
    const handleFormSuccess = () => { setEditingPost(null); fetchPosts(); };

    const handleReviewClick = (post: PostData) => {
        setReviewingPost(post);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: '2-digit',
            hour: '2-digit', minute: '2-digit'
        });
    };

    // --- FILTRAGEM ---

    const filteredPosts = useMemo(() => {
        if (!Array.isArray(posts)) return [];
        let result = posts;

        // 1. Filtro por Aba (Status)
        if (statusFilter === 'published') {
            result = result.filter(p => p.status === 'published' && p.writer?.email === user?.email);
        } else if (statusFilter === 'pending') {

            // CORREÇÃO: Função auxiliar para identificar tudo que precisa de atenção
            const isPendingOrReview = (p: PostData) => {
                // Estados pendentes normais
                if (['pending', 're-evaluation', 'rejected'].includes(p.status)) return true;

                // IMPORTANTE: Edições recusadas de posts publicados.
                // Eles estão "published" para não cair do site, mas têm "rejectionReason"
                if (p.status === 'published' && p.rejectionReason) return true;

                return false;
            };

            if (!isAdmin) {
                // Autores só veem os seus
                result = result.filter(p => isPendingOrReview(p) && p.writer?.email === user?.email);
            } else {
                // Admin vê tudo
                result = result.filter(p => isPendingOrReview(p));
            }
        }

        // 2. Filtro de Busca (Texto)
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(post =>
                post.title?.toLowerCase().includes(lowerQuery) ||
                post.writer?.name?.toLowerCase().includes(lowerQuery)
            );
        }
        return result;
    }, [posts, searchQuery, statusFilter, user, isAdmin]);

    if (loading) return <div className="text-center py-10">Carregando painel...</div>;

    return (
        <>
            <div className="rounded-xl shadow border border-slate-200 overflow-hidden bg-white">

                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full max-w-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Pesquisar título ou autor..."
                            className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-600 outline-none text-black"
                        />
                    </div>

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
                            Publicados
                        </button>
                        <button
                            onClick={() => setStatusFilter('pending')}
                            className={`px-4 py-1.5 text-sm rounded-md transition ${statusFilter === 'pending' ? 'bg-white shadow text-amber-600 font-bold' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Pendentes / Revisão
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto bg-transparent">
                    <table className="w-full text-left border-collapse bg-transparent">
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
                                {/* COLUNA STATUS - Lógica ajustada para priorizar a Recusa */}
                                <td className="px-6 py-4">
                                    {post.rejectionReason ? (
                                        <div className="flex flex-col gap-1">
                                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold flex w-fit items-center gap-1">
                                                <XCircle size={12} /> {post.status === 'published' ? 'Edição Recusada' : 'Recusado'}
                                            </span>
                                            <span className="text-[10px] text-red-600 max-w-[150px] leading-tight block truncate" title={post.rejectionReason}>
                                                {post.rejectionReason}
                                            </span>
                                        </div>
                                    ) : (
                                        <>
                                            {post.status === 'published' && (
                                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold flex w-fit items-center gap-1">
                                                    <CheckCircle size={12} /> No Ar
                                                </span>
                                            )}
                                            {post.status === 'pending' && (
                                                <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold flex w-fit items-center gap-1">
                                                    <Clock size={12} /> Novo
                                                </span>
                                            )}
                                            {post.status === 're-evaluation' && (
                                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold flex w-fit items-center gap-1">
                                                    <RefreshCw size={12} /> Reavaliação
                                                </span>
                                            )}
                                            {/* Fallback para rejected antigo sem reason */}
                                            {post.status === 'rejected' && !post.rejectionReason && (
                                                <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold flex w-fit items-center gap-1">
                                                    <XCircle size={12} /> Recusado
                                                </span>
                                            )}
                                            {post.status === 'draft' && (
                                                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold flex w-fit items-center gap-1">
                                                    <FileText size={12} /> Rascunho
                                                </span>
                                            )}
                                        </>
                                    )}
                                </td>

                                <td className="px-6 py-4">
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-medium text-slate-900 hover:text-blue-600 transition-colors line-clamp-1 cursor-pointer"
                                    >
                                        {post.title}
                                    </Link>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-purple-100 p-1.5 rounded-full text-purple-600">
                                            <UserCircle size={16} />
                                        </div>
                                        <div className="flex flex-col">
                                                <span className="text-sm text-slate-900 font-medium line-clamp-1">
                                                    {post.writer?.name || "Desconhecido"}
                                                </span>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-4 text-sm text-slate-500">
                                    {statusFilter === 'published'
                                        ? formatDate(post.updatedAt)
                                        : formatDate(post.createdAt)
                                    }
                                </td>

                                {/* COLUNA AÇÕES */}
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">

                                        {/* ADMIN: Botões de aprovação somem se estiver recusado */}
                                        {isAdmin && !post.rejectionReason && (
                                            <>
                                                {post.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleDirectApprove(post.slug)}
                                                        className="text-green-600 hover:bg-green-100 p-2 rounded transition-colors"
                                                        title="Aprovar Publicação"
                                                    >
                                                        <CheckCircle size={20} />
                                                    </button>
                                                )}

                                                {post.status === 're-evaluation' && (
                                                    <button
                                                        onClick={() => handleReviewClick(post)}
                                                        className="text-blue-600 hover:bg-blue-100 p-2 rounded transition-colors"
                                                        title="Revisar Alterações"
                                                    >
                                                        <RefreshCw size={20} />
                                                    </button>
                                                )}
                                            </>
                                        )}

                                        {/* EDITAR: Destaque visual se tiver recusa para incentivar a correção */}
                                        <button
                                            onClick={() => handleEditClick(post)}
                                            className={`p-2 rounded transition-colors ${post.rejectionReason ? 'text-amber-600 hover:bg-amber-100 animate-pulse' : 'text-slate-400 hover:text-amber-500'}`}
                                            title={post.rejectionReason ? "Corrigir e Reenviar" : "Editar Conteúdo"}
                                        >
                                            <Edit size={18} />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(post.slug)}
                                            className="text-slate-400 hover:text-red-500 p-2 rounded transition-colors"
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
                        Nenhum post encontrado nesta categoria.
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

            {reviewingPost && (
                <PostComparisonModal
                    isOpen={!!reviewingPost}
                    post={reviewingPost}
                    onClose={() => setReviewingPost(null)}
                    onApprove={handleConfirmApproval}
                    onReject={handleReject}
                />
            )}
        </>
    );
};