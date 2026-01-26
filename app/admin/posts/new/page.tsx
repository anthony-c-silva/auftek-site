"use client";
import React from "react";
import { PostForm } from "@/components/admin/PostForm";
import { useAuth } from "@/context/AuthContext";

export default function NewPostPage() {
    const { isAdmin, isLoading } = useAuth();
    if (isLoading) return null;
    if (!isAdmin) return <div className="p-10 text-center">Acesso negado.</div>;

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-slate-800 mb-6">Criar Nova Publicação</h1>
                <PostForm />
            </div>
        </div>
    );
}