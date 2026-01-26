"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Edit, Trash2, Search, UserCircle, CheckCircle, Clock, FileText, RefreshCw, XCircle, AlertTriangle, Eye } from "lucide-react";
import { Modal } from "../ui/Modal";
import { PostForm } from "./PostForm";
import { useAuth } from "@/context/AuthContext";
import { PostComparisonModal } from "./PostComparisonModal";

interface AuthorData { name?: string; photoUrl?: string; }
interface WriterData { name?: string; email?: string; photoUrl?: string; }

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
    status: 'published' | 'pending' | 'draft' | 're-evaluation' | 'rejected';
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
    const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'pending'>('all');

    const [editingPost, setEditingPost] = useState<PostData | null>(null);
    const [reviewingPost, setReviewingPost] = useState<PostData | null>(null);

    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [postToReject, setPostToReject] = useState<string | null>(null);
    const [rejectionReasonText, setRejectionReasonText] = useState("");

    const [viewReason, setViewReason] = useState<string | null>(null);

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

    const openRejectModal = (slug: string) => {
        setPostToReject(slug);
        setRejectionReasonText("");
        setRejectModalOpen(true);
    };

    const handleConfirmReject = async () => {
        if (!postToReject || !rejectionReasonText.trim()) {
            alert("Por favor, informe o motivo da recusa.");
            return;
        }
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/posts/${postToReject}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    status: 're-evaluation',
                    rejectionReason: rejectionReasonText
                })
            });
            if (res.ok) {
                alert("Solicitação de ajustes enviada ao autor."); // Mensagem mais adequada
                setRejectModalOpen(false);
                setPostToReject(null);
                fetchPosts();
            }
        } catch (error) { console.error(error); }
    };
    // ----------------------------------------------------------------

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
        } catch (error) { alert("Erro ao aprovar."); }
    };

    const handleComparisonReject = async (slug: string, reason: string) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/posts/${slug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    status: 're-evaluation',
                    rejectionReason: reason
                })
            });
            if (res.ok) {
                alert("Alterações rejeitadas. O autor deverá revisar.");
                setReviewingPost(null);
                fetchPosts();
            }
        } catch (error) { console.error(error); }
    };
    // ---------------------------------------------------------

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

    const handleEditClick = (post: PostData) => setEditingPost(post);
    const handleModalClose = () => setEditingPost(null);
    const handleFormSuccess = () => { setEditingPost(null); fetchPosts(); };
    const handleReviewClick = (post: PostData) => setReviewingPost(post);

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
            result = result.filter(p => p.status === 'published' && p.writer?.email === user?.email);
        } else if (statusFilter === 'pending') {
            const isPendingOrReview = (p: PostData) => {
                // Inclui 're-evaluation' no filtro de pendentes para o admin ver
                if (['pending', 're-evaluation', 'rejected'].includes(p.status)) return true;
                if (p.status === 'published' && p.rejectionReason) return true;
                return false;
            };

            if (!isAdmin) {
                result = result.filter(p => isPendingOrReview(p) && p.writer?.email === user?.email);
            } else {
                result = result.filter(p => isPendingOrReview(p));
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
                            <button onClick={() => setStatusFilter('all')} className={`px-4 py-1.5 text-sm rounded-md transition ${statusFilter === 'all' ? 'bg-white shadow text-slate-800 font-bold' : 'text-slate-500 hover:text-slate-700'}`}>Todos</button>
                        )}
                        <button onClick={() => setStatusFilter('published')} className={`px-4 py-1.5 text-sm rounded-md transition ${statusFilter === 'published' ? 'bg-white shadow text-green-600 font-bold' : 'text-slate-500 hover:text-slate-700'}`}>Publicados</button>
                        <button onClick={() => setStatusFilter('pending')} className={`px-4 py-1.5 text-sm rounded-md transition ${statusFilter === 'pending' ? 'bg-white shadow text-amber-600 font-bold' : 'text-slate-500 hover:text-slate-700'}`}>Pendentes / Revisão</button>
                    </div>
                </div>

                <div className="overflow-x-auto bg-transparent">
                    <table className="w-full text-left border-collapse bg-transparent">
                        <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-4 text-sm font-semibold text-slate-700">Status</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-700">Título</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-700">Redator</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-700">Data</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-700 text-right">Ações</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {filteredPosts.map((post) => (
                            <tr key={post._id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    {post.rejectionReason ? (
                                        <button
                                            onClick={() => setViewReason(post.rejectionReason || "")}
                                            className="group flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-full text-xs font-bold transition-all w-fit cursor-pointer border border-transparent hover:border-red-300"
                                            title="Clique para ler o motivo da recusa"
                                        >
                                            <XCircle size={14} />
                                            {/* Ajustei o texto para refletir melhor o estado */}
                                            {post.status === 'published' ? 'Edição Recusada' : 'Ajustes Solicitados'}
                                            <Eye size={12} className="opacity-50 group-hover:opacity-100 transition-opacity ml-1" />
                                        </button>
                                    ) : (
                                        <>
                                            {post.status === 'published' && <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold flex w-fit items-center gap-1"><CheckCircle size={12} /> No Ar</span>}
                                            {post.status === 'pending' && <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold flex w-fit items-center gap-1"><Clock size={12} /> Novo</span>}
                                            {post.status === 're-evaluation' && <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold flex w-fit items-center gap-1"><RefreshCw size={12} /> Reavaliação</span>}
                                            {post.status === 'rejected' && <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold flex w-fit items-center gap-1"><XCircle size={12} /> Recusado</span>}
                                            {post.status === 'draft' && <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold flex w-fit items-center gap-1"><FileText size={12} /> Rascunho</span>}
                                        </>
                                    )}
                                </td>

                                <td className="px-6 py-4">
                                    <Link href={`/blog/${post.slug}`} target="_blank" className="font-medium text-slate-900 hover:text-blue-600 transition-colors line-clamp-1 cursor-pointer">
                                        {post.title}
                                    </Link>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-purple-100 p-1.5 rounded-full text-purple-600">
                                            <UserCircle size={16} />
                                        </div>
                                        <span className="text-sm text-slate-900 font-medium line-clamp-1">{post.writer?.name || "Desconhecido"}</span>
                                    </div>
                                </td>

                                <td className="px-6 py-4 text-sm text-slate-500">
                                    {statusFilter === 'published' ? formatDate(post.updatedAt) : formatDate(post.createdAt)}
                                </td>

                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {isAdmin && (post.status === 'pending' || post.status === 're-evaluation') ? (
                                            <>
                                                {post.status === 'pending' && (
                                                    <>
                                                        <button onClick={() => handleDirectApprove(post.slug)} className="text-green-600 hover:bg-green-100 p-2 rounded transition-colors" title="Aprovar Publicação">
                                                            <CheckCircle size={20} />
                                                        </button>
                                                        <button onClick={() => openRejectModal(post.slug)} className="text-red-500 hover:bg-red-100 p-2 rounded transition-colors" title="Negar Publicação">
                                                            <XCircle size={20} />
                                                        </button>
                                                    </>
                                                )}
                                                {post.status === 're-evaluation' && (
                                                    <button onClick={() => handleReviewClick(post)} className="text-blue-600 hover:bg-blue-100 p-2 rounded transition-colors" title="Revisar Alterações">
                                                        <RefreshCw size={20} />
                                                    </button>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => handleEditClick(post)} className={`p-2 rounded transition-colors ${post.rejectionReason ? 'text-amber-600 hover:bg-amber-100 animate-pulse' : 'text-slate-400 hover:text-amber-500'}`} title={post.rejectionReason ? "Corrigir e Reenviar" : "Editar Conteúdo"}>
                                                    <Edit size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(post.slug)} className="text-slate-400 hover:text-red-500 p-2 rounded transition-colors" title="Excluir">
                                                    <Trash2 size={18} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {filteredPosts.length === 0 && (
                    <div className="text-center py-12 text-slate-500">Nenhum post encontrado nesta categoria.</div>
                )}
            </div>

            <Modal isOpen={!!editingPost} onClose={handleModalClose} title="Editar Post">
                {editingPost && (
                    <PostForm initialData={editingPost} isEditing={true} onSuccess={handleFormSuccess} onCancel={handleModalClose} />
                )}
            </Modal>

            {reviewingPost && (
                <PostComparisonModal isOpen={!!reviewingPost} post={reviewingPost} onClose={() => setReviewingPost(null)} onApprove={handleConfirmApproval} onReject={handleComparisonReject} />
            )}

            {rejectModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-slate-200 animate-fade-in-up">
                        <div className="flex items-center gap-3 text-red-600 mb-4">
                            <AlertTriangle size={24} />
                            <h3 className="text-lg font-bold">Motivo da Recusa</h3>
                        </div>
                        <p className="text-slate-600 text-sm mb-3">
                            Explique por que esta publicação não pode ser aprovada no momento.
                        </p>
                        <textarea
                            value={rejectionReasonText}
                            onChange={(e) => setRejectionReasonText(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none min-h-[100px] mb-4 text-slate-800"
                            placeholder="Ex: O texto contém erros..."
                        />
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setRejectModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium">Cancelar</button>
                            <button onClick={handleConfirmReject} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-red-500/20">Enviar Solicitação</button>
                        </div>
                    </div>
                </div>
            )}

            {viewReason && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-white p-2 rounded-full shadow-sm text-red-600">
                                    <AlertTriangle size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-red-900">Motivo da Recusa</h3>
                            </div>
                            <button onClick={() => setViewReason(null)} className="text-red-400 hover:text-red-700 transition-colors">
                                <XCircle size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                                {viewReason}
                            </div>
                            <p className="mt-4 text-xs text-slate-400 text-center">
                                Edite o post para corrigir os problemas apontados e reenvie para aprovação.
                            </p>
                        </div>

                        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={() => setViewReason(null)}
                                className="px-5 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-900 transition-colors"
                            >
                                Entendi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};