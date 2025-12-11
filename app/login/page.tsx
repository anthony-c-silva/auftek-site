"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react"; // Importamos o ícone de email

export default function LoginPage() {
    // 1. Novo estado para o Email
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);

    // Pegamos as funções do contexto
    const { login, isAdmin, isLoading } = useAuth();
    const router = useRouter();

    // Se já for admin, manda para o painel direto
    useEffect(() => {
        if (!isLoading && isAdmin) {
            router.push("/admin");
        }
    }, [isAdmin, isLoading, router]);

    // Enquanto carrega, não mostra nada para não piscar a tela
    if (isLoading || isAdmin) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 2. Chamamos o login passando Email e Senha
        const success = await login(email, password);

        if (!success) {
            setError(true);
            setPassword(""); // Limpa a senha para tentar de novo
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 pt-20">
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-md">

                {/* Ícone de Cadeado no Topo */}
                <div className="flex justify-center mb-6">
                    <div className="bg-auftek-blue/10 p-4 rounded-full">
                        <Lock className="text-auftek-blue" size={32} />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-white text-center mb-2">Acesso Administrativo</h1>
                <p className="text-slate-400 text-center mb-8 text-sm">Entre com suas credenciais de gestão</p>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Campo de E-mail */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="text-slate-500 group-focus-within:text-auftek-blue transition-colors" size={18} />
                        </div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {setEmail(e.target.value); setError(false)}}
                            placeholder="E-mail corporativo"
                            className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-auftek-blue transition-colors"
                            required
                        />
                    </div>

                    {/* Campo de Senha */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="text-slate-500 group-focus-within:text-auftek-blue transition-colors" size={18} />
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {setPassword(e.target.value); setError(false)}}
                            placeholder="Sua senha"
                            className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-auftek-blue transition-colors"
                            required
                        />
                    </div>

                    {/* Mensagem de Erro */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 animate-pulse">
                            <p className="text-red-400 text-sm text-center font-medium">
                                Credenciais inválidas. Verifique e tente novamente.
                            </p>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-auftek-blue text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-900/20 mt-4 active:scale-95 duration-100"
                    >
                        Acessar Painel
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => router.push('/')}
                        className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                    >
                        ← Voltar para o site
                    </button>
                </div>
            </div>
        </div>
    );
}