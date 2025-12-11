"use client";

import React, { useEffect, useState } from "react";
import { Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { Modal } from "../ui/Modal";         // <--- Import Modal
import { PostForm } from "./PostForm";       // <--- Import Form

export const AdminPostList: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Estado para controlar qual post está sendo editado (null = nenhum)
    const [editingPost, setEditingPost] = useState<any | null>(null);

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
            if (res.ok) {
                fetchPosts();
            } else {
                alert("Erro ao excluir.");
            }
        } catch (error) {
            console.error("Erro", error);
        }
    };

    // Funções para controlar o Modal
    const handleEditClick = (post: any) => {
        setEditingPost(post); // Isso abre o modal automaticamente
    };

    const handleModalClose = () => {
        setEditingPost(null); // Isso fecha o modal
    };

    const handleFormSuccess = () => {
        setEditingPost(null); // Fecha modal
        fetchPosts();         // Atualiza a tabela com os dados novos
    };

    if (loading) return <div className="text-center py-10">Carregando posts...</div>;

    return (
        <>
            <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-4 text-sm font-semibold text-slate-700">Título</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-700">Categoria</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-700">Data</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-700 text-right">Ações</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {posts.map((post) => (
                            <tr key={post._id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="font-medium text-slate-900">{post.title}</p>
                                    <p className="text-xs text-slate-500">/{post.slug}</p>
                                </td>
                                <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {post.tags?.[0] || "Geral"}
                        </span>
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

                                        {/* Botão de Editar agora abre o Modal */}
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

                {posts.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        Nenhum post encontrado.
                    </div>
                )}
            </div>

            {/* --- O MODAL FICA AQUI --- */}
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