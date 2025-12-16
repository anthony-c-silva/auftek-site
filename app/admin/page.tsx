"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { AdminPostList } from "@/components/admin/AdminPostList";
import { PostForm } from "@/components/admin/PostForm";
import { AuthorManager } from "@/components/admin/AuthorManager";
import { TeamManager } from "@/components/admin/TeamManager";
import { Modal } from "@/components/ui/Modal";
import { Users, PenTool } from "lucide-react";

export default function AdminDashboard() {
    const { isAdmin, user, isLoading } = useAuth(); 
    const router = useRouter();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
    const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        if (!isLoading && !user) router.push("/login");
    }, [user, isLoading, router]);

    if (isLoading || !user) return null;

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4">
            <div className="max-w-7xl mx-auto">

                {/* Cabeçalho */}
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Gerenciar Blog</h1>
                        <p className="text-slate-500 text-sm mt-1">
                            Olá, <b>{user.name}</b> ({user.role === 'admin' ? 'Administrador' : 'Redator'})
                        </p>
                    </div>

                        <div className="flex flex-wrap gap-3">
                            
                            {/* --- MUDANÇA AQUI: Botão Autores agora é protegido --- */}
                            {isAdmin && (
                                <button
                                    onClick={() => setIsAuthorModalOpen(true)}
                                    className="bg-white text-slate-700 border border-slate-300 px-4 py-3 rounded-lg font-bold hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2"
                                >
                                    <PenTool size={18} /> <span className="hidden sm:inline">Gerenciar Autores</span>
                                </button>
                            )}

                            {/* Botão Equipe (Já estava protegido, mantenha assim) */}
                            {isAdmin && (
                                <button
                                    onClick={() => setIsTeamModalOpen(true)}
                                    className="bg-purple-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors shadow-md flex items-center gap-2"
                                >
                                    <Users size={18} /> <span className="hidden sm:inline">Gerenciar Equipe</span>
                                </button>
                            )}

                            {/* Botão Novo Post (Todos veem) */}
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="bg-green-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-md flex items-center gap-2"
                            >
                                + <span className="hidden sm:inline">Novo Post</span>
                            </button>
                        </div>
                </div>

                {/* Lista de Posts */}
                <AdminPostList key={refreshKey} />

                {/* --- MODAIS --- */}

                {/* Modal de Criar Post */}
                <Modal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    title="Criar Nova Publicação"
                >
                    <PostForm
                        isEditing={false}
                        onSuccess={() => { setIsCreateModalOpen(false); setRefreshKey(k => k + 1); }}
                        onCancel={() => setIsCreateModalOpen(false)}
                    />
                </Modal>

                {/* Modal de Equipe (Cadastro + Lista) */}
                {/* Só renderiza se for admin para segurança extra */}
                {isAdmin && (
                    <Modal
                        isOpen={isTeamModalOpen}
                        onClose={() => setIsTeamModalOpen(false)}
                        title="Gestão de Acesso Administrativo"
                    >
                        <TeamManager />
                    </Modal>
                )}

                {/* Modal de Autores */}
                <Modal
                    isOpen={isAuthorModalOpen}
                    onClose={() => setIsAuthorModalOpen(false)}
                    title="Gerenciar Autores e Especialistas"
                >
                    <AuthorManager />
                </Modal>

            </div>
        </div>
    );
}