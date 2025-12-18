"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
    LayoutDashboard,
    LogOut,
    PlusCircle,
    Users,
    Settings // Ícone opcional para representar gestão
} from "lucide-react";

// Componentes
import { AdminPostList } from "@/components/admin/AdminPostList";
import { UserManager } from "@/components/admin/UserManager";
import { PostForm } from "@/components/admin/PostForm";
import { Modal } from "@/components/ui/Modal";

export default function AdminDashboard() {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();

    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [postRefreshKey, setPostRefreshKey] = useState(0);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) return null;

    const isAdmin = user.role === 'admin';

    const handlePostSuccess = () => {
        setIsPostModalOpen(false);
        setPostRefreshKey(prev => prev + 1);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">

            {/* Header / Navbar (Agora mais limpo) */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                        <LayoutDashboard size={20} className="text-white" />
                    </div>
                    <span className="font-bold text-slate-800 text-lg tracking-tight">Auftek Painel</span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-sm font-bold text-slate-700 leading-tight">{user.name}</span>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                            {isAdmin ? "Administrador" : "Autor"}
                        </span>
                    </div>
                    <div className="h-8 w-px bg-slate-200 mx-2" />
                    <button
                        onClick={logout}
                        className="text-slate-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors"
                        title="Sair"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            {/* Conteúdo Principal */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Gerenciamento de Publicações</h1>
                        <p className="text-slate-500 text-sm">Crie, edite e modere o conteúdo do blog.</p>
                    </div>

                    {/* GRUPO DE AÇÕES */}
                    <div className="flex gap-3 w-full md:w-auto">

                        {/* Botão de Equipe (Movido para cá) */}
                        {isAdmin && (
                            <button
                                onClick={() => setIsTeamModalOpen(true)}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-bold hover:bg-slate-50 hover:text-blue-600 transition shadow-sm active:scale-[0.98]"
                            >
                                <Users size={18} />
                                <span className="hidden sm:inline">Gerenciar Equipe</span>
                                <span className="inline sm:hidden">Equipe</span>
                            </button>
                        )}

                        {/* Botão de Nova Publicação */}
                        <button
                            onClick={() => setIsPostModalOpen(true)}
                            className="flex-1 md:flex-none bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200 active:scale-[0.98] font-bold flex items-center justify-center gap-2"
                        >
                            <PlusCircle size={20} />
                            <span>Nova Publicação</span>
                        </button>
                    </div>
                </div>

                {/* Lista de Posts */}
                <div className="bg-transparent">
                    <AdminPostList key={postRefreshKey} />
                </div>

            </main>

            {/* --- MODAL 1: EQUIPE (ADMIN) --- */}
            {isAdmin && (
                <Modal
                    isOpen={isTeamModalOpen}
                    onClose={() => setIsTeamModalOpen(false)}
                    title="Gestão de Usuários e Permissões"
                    size="xl"
                >
                    <UserManager />
                </Modal>
            )}

            {/* --- MODAL 2: NOVA POSTAGEM --- */}
            <Modal
                isOpen={isPostModalOpen}
                onClose={() => setIsPostModalOpen(false)}
                title="Criar Nova Publicação"
                size="xl"
            >
                <PostForm
                    onSuccess={handlePostSuccess}
                    onCancel={() => setIsPostModalOpen(false)}
                />
            </Modal>

        </div>
    );
}