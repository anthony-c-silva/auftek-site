"use client";

import React, { useState, useEffect, useMemo } from "react";
import { UserPlus, Save, Mail, Key, Trash2, X, AlertTriangle, Shield, Search, Calendar } from "lucide-react";

interface AdminUser {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
}

export function TeamManager() {
    // --- ESTADOS GERAIS ---
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // --- ESTADOS DO CADASTRO ---
    const [registerData, setRegisterData] = useState({ name: "", email: "", password: "" });
    const [isRegistering, setIsRegistering] = useState(false);

    // --- ESTADOS DA EDIÇÃO ---
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [actionType, setActionType] = useState<'email' | 'password' | null>(null);
    const [editInputValue, setEditInputValue] = useState("");
    const [isSavingEdit, setIsSavingEdit] = useState(false);

    // Classes CSS Padronizadas
    const inputClass = "p-2 border border-slate-300 rounded text-sm w-full bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all";

    // 1. CARREGAR USUÁRIOS (COM DIAGNÓSTICO DE ERRO)
    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token"); // Recupera o token

            // --- ÁREA DE DEBUG (F12 > Console) ---
            console.log("=== DEBUG AUTH ===");
            console.log("1. Token encontrado:", token);

            if (!token) {
                console.warn("ALERTA: Usuário sem token (provavelmente deslogado).");
                setUsers([]); // Zera a lista para não quebrar
                setLoading(false);
                return;
            }

            const res = await fetch("/api/users", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Envia o token
                }
            });

            console.log("2. Status da API:", res.status);

            if (res.status === 401 || res.status === 403) {
                console.error("ERRO DE PERMISSÃO: Token inválido ou expirado.");
                // Opcional: alert("Sessão expirada.");
                setUsers([]);
                setLoading(false);
                return;
            }

            const data = await res.json();
            console.log("3. Dados recebidos:", data);

            // SEGURANÇA CRÍTICA: Verifica se é array antes de salvar
            if (Array.isArray(data)) {
                setUsers(data);
            } else {
                console.error("ERRO CRÍTICO: API não retornou uma lista. Retornou:", data);
                setUsers([]); // Fallback para array vazio
            }
        } catch (error) {
            console.error("Erro fatal ao buscar usuários", error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // 2. LÓGICA DE FILTRO (Blindada contra erros)
    const filteredUsers = useMemo(() => {
        if (!Array.isArray(users)) return []; // Proteção extra

        const term = searchTerm.toLowerCase();
        return users.filter(user =>
            user.name?.toLowerCase().includes(term) ||
            user.email?.toLowerCase().includes(term)
        );
    }, [users, searchTerm]);

    // 3. LÓGICA DE CADASTRO
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsRegistering(true);
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                alert("Erro: Você não está logado.");
                return;
            }

            const res = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(registerData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Erro ao criar");
            }

            alert("Novo admin cadastrado!");
            setRegisterData({ name: "", email: "", password: "" });
            fetchUsers();
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert("Ocorreu um erro desconhecido ao cadastrar.");
            }
        } finally {
            setIsRegistering(false);
        }
    };

    // 4. LÓGICA DE EDIÇÃO/EXCLUSÃO
    const handleDelete = async (userId: string) => {
        if (!confirm("Tem certeza que deseja remover este administrador?")) return;
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) fetchUsers();
            else alert("Erro ao remover usuário.");
        } catch (error) {
            console.error("Erro ao deletar:", error);
        }
    };

    const openEdit = (user: AdminUser, type: 'email' | 'password') => {
        setEditingUser(user);
        setActionType(type);
        setEditInputValue(type === 'email' ? user.email : "");
    };

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser || !actionType) return;
        setIsSavingEdit(true);

        try {
            const token = localStorage.getItem("token");
            const payload = actionType === 'email' ? { email: editInputValue } : { password: editInputValue };

            const res = await fetch(`/api/users/${editingUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Erro ao atualizar");
            }

            alert("Atualizado com sucesso!");
            setEditingUser(null);
            fetchUsers();
        } catch (error) {
            console.error(error);
            if (error instanceof Error) alert(error.message);
            else alert("Erro ao atualizar dados.");
        } finally {
            setIsSavingEdit(false);
        }
    };

    return (
        <div className="space-y-8 relative">

            {/* --- PARTE 1: FORMULÁRIO DE CADASTRO --- */}
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <h3 className="text-sm font-bold text-purple-900 uppercase mb-3 flex items-center gap-2">
                    <UserPlus size={16}/> Novo Administrador
                </h3>
                <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        required
                        placeholder="Nome Completo"
                        className={inputClass}
                        value={registerData.name}
                        onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                    />
                    <input
                        type="email"
                        required
                        placeholder="E-mail de Acesso"
                        className={inputClass}
                        value={registerData.email}
                        onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                    />
                    <input
                        type="password"
                        required
                        placeholder="Senha Inicial"
                        className={`${inputClass} md:col-span-2`}
                        value={registerData.password}
                        onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                    />

                    <button
                        type="submit"
                        disabled={isRegistering}
                        className="md:col-span-2 bg-purple-600 text-white py-2 rounded font-bold hover:bg-purple-700 transition shadow-sm active:scale-[0.99] flex justify-center items-center gap-2"
                    >
                        {isRegistering ? "Criando..." : <><Save size={16}/> Criar Acesso</>}
                    </button>
                </form>
            </div>

            <hr className="border-slate-200" />

            {/* --- PARTE 2: LISTA COM PESQUISA E DATA --- */}
            <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Shield size={18} className="text-slate-600"/> Equipe Atual ({filteredUsers.length})
                    </h3>

                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-2 top-2.5 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar membro..."
                            className="pl-8 p-2 border border-slate-300 rounded text-sm w-full sm:w-64 bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? <p className="text-slate-500 text-center py-4">Carregando...</p> : (
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                            <tr>
                                <th className="px-4 py-3 font-medium">Nome / E-mail</th>
                                <th className="px-4 py-3 font-medium hidden sm:table-cell">Cadastro</th>
                                <th className="px-4 py-3 font-medium text-right">Ações</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                                        Nenhum usuário encontrado.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-slate-50 group bg-white">
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-slate-900">{user.name}</p>
                                            <p className="text-xs text-slate-500">{user.email}</p>
                                        </td>

                                        <td className="px-4 py-3 text-slate-500 text-xs hidden sm:table-cell">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={12} className="text-slate-400" />
                                                {user.createdAt
                                                    ? new Date(user.createdAt).toLocaleDateString('pt-BR')
                                                    : "-"}
                                            </div>
                                        </td>

                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEdit(user, 'email')} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Alterar Email">
                                                    <Mail size={16} />
                                                </button>
                                                <button onClick={() => openEdit(user, 'password')} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded" title="Alterar Senha">
                                                    <Key size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(user._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Remover">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* --- MINI MODAL DE EDIÇÃO --- */}
            {editingUser && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex items-center justify-center animate-fade-in rounded-lg">
                    <form onSubmit={handleSaveEdit} className="bg-white border border-slate-200 shadow-xl rounded-xl p-6 w-full max-w-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                {actionType === 'email' ? <Mail size={18} /> : <Key size={18} />}
                                {actionType === 'email' ? "Alterar E-mail" : "Redefinir Senha"}
                            </h4>
                            <button type="button" onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="mb-4">
                            <p className="text-xs text-slate-500 mb-2">Usuário: <b>{editingUser.name}</b></p>
                            <input
                                type={actionType === 'email' ? 'email' : 'text'}
                                value={editInputValue}
                                onChange={(e) => setEditInputValue(e.target.value)}
                                placeholder={actionType === 'email' ? "Novo e-mail" : "Nova senha"}
                                className={inputClass}
                                autoFocus
                                required
                            />
                            {actionType === 'password' && (
                                <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1">
                                    <AlertTriangle size={10} /> O usuário será desconectado.
                                </p>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button type="button" onClick={() => setEditingUser(null)} className="flex-1 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg">
                                Cancelar
                            </button>
                            <button type="submit" disabled={isSavingEdit} className="flex-1 py-2 text-sm bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
                                {isSavingEdit ? "Salvando..." : "Salvar"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}