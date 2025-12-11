"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { AdminPostList } from "@/components/admin/AdminPostList";
import { PostForm } from "@/components/admin/PostForm";
import { RegisterForm } from "@/components/admin/RegisterForm"; // <--- Import Novo
import { Modal } from "@/components/ui/Modal";
import { UserPlus } from "lucide-react"; // <--- Ícone Novo

export default function AdminDashboard() {
    const { isAdmin, isLoading } = useAuth();
    const router = useRouter();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false); // <--- Estado Novo
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        if (!isLoading && !isAdmin) router.push("/login");
    }, [isAdmin, isLoading, router]);

    if (isLoading || !isAdmin) return null;

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4">
            <div className="max-w-7xl mx-auto">

                {/* Cabeçalho */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Gerenciar Blog</h1>
                        <p className="text-slate-500 mt-1">Painel administrativo Auftek</p>
                    </div>

                    <div className="flex gap-3">
                        {/* Botão Novo Usuário */}
                        <button
                            onClick={() => setIsUserModalOpen(true)}
                            className="bg-purple-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors shadow-md flex items-center gap-2"
                        >
                            <UserPlus size={18} /> <span className="hidden sm:inline">Novo Admin</span>
                        </button>

                        {/* Botão Novo Post */}
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-green-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-md flex items-center gap-2"
                        >
                            + <span className="hidden sm:inline">Novo Post</span>
                        </button>
                    </div>
                </div>

                <AdminPostList key={refreshKey} />

                {/* Modal de Post */}
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

                {/* Modal de Usuário (Novo) */}
                <Modal
                    isOpen={isUserModalOpen}
                    onClose={() => setIsUserModalOpen(false)}
                    title="Cadastrar Novo Administrador"
                >
                    <RegisterForm
                        onSuccess={() => setIsUserModalOpen(false)}
                        onCancel={() => setIsUserModalOpen(false)}
                    />
                </Modal>

            </div>
        </div>
    );
}