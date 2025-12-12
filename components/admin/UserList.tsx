"use client";

import React, { useEffect, useState } from "react";
import { User, Mail, Key, Trash2, X, Save, AlertTriangle } from "lucide-react";

interface AdminUser {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
}

export const UserList: React.FC = () => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [actionType, setActionType] = useState<'email' | 'password' | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/users");
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.error("Erro ao buscar usuários", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // --- AÇÕES ---

    const handleDelete = async (userId: string) => {
        if (!confirm("Tem certeza que deseja remover este administrador? Ele perderá o acesso imediatamente.")) return;

        try {
            const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
            if (res.ok) fetchUsers();
            else alert("Erro ao excluir");
        } catch (error) {
            console.error(error);
        }
    };

    const openEdit = (user: AdminUser, type: 'email' | 'password') => {
        setEditingUser(user);
        setActionType(type);
        setInputValue(type === 'email' ? user.email : "");
    };

    const closeEdit = () => {
        setEditingUser(null);
        setActionType(null);
        setInputValue("");
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser || !actionType) return;
        setActionLoading(true);

        try {
            const payload = actionType === 'email' ? { email: inputValue } : { password: inputValue };

            const res = await fetch(`/api/users/${editingUser._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Erro ao atualizar");

            alert(`${actionType === 'email' ? 'E-mail' : 'Senha'} atualizado(a) com sucesso!`);
            closeEdit();
            fetchUsers();

        } catch (error) {
            // 5. Tratamento de erro tipado (sem 'any')
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert("Ocorreu um erro desconhecido.");
            }
        } finally {
            setActionLoading(false);
        }
    };


    if (loading) return <div className="p-8 text-center text-slate-500">Carregando equipe...</div>;

    return (
        <div className="relative">

            {/* Cabeçalho */}
            <div className="flex items-center gap-3 mb-6 p-1">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                    <User size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Equipe Administrativa</h3>
                    <p className="text-sm text-slate-500">Gerencie quem tem acesso ao painel.</p>
                </div>
            </div>

            {/* Tabela */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                    <tr>
                        <th className="px-4 py-3 font-medium">Nome</th>
                        <th className="px-4 py-3 font-medium">E-mail</th>
                        <th className="px-4 py-3 font-medium text-right">Ações</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {users.map((user) => (
                        <tr key={user._id} className="hover:bg-slate-50 group">
                            <td className="px-4 py-3 font-medium text-slate-900">{user.name}</td>
                            <td className="px-4 py-3 text-slate-600">{user.email}</td>
                            <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">

                                    {/* Botão Trocar Email */}
                                    <button
                                        onClick={() => openEdit(user, 'email')}
                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                        title="Alterar E-mail"
                                    >
                                        <Mail size={16} />
                                    </button>

                                    {/* Botão Trocar Senha */}
                                    <button
                                        onClick={() => openEdit(user, 'password')}
                                        className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"
                                        title="Redefinir Senha"
                                    >
                                        <Key size={16} />
                                    </button>

                                    {/* Botão Excluir */}
                                    <button
                                        onClick={() => handleDelete(user._id)}
                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                        title="Remover Acesso"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* --- MINI MODAL DE EDIÇÃO --- */}
            {editingUser && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center animate-fade-in">
                    <form onSubmit={handleSave} className="bg-white border border-slate-200 shadow-xl rounded-xl p-6 w-full max-w-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                {actionType === 'email' ? <Mail size={18} /> : <Key size={18} />}
                                {actionType === 'email' ? "Alterar E-mail" : "Redefinir Senha"}
                            </h4>
                            <button type="button" onClick={closeEdit} className="text-slate-400 hover:text-slate-600">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="mb-4">
                            <p className="text-xs text-slate-500 mb-2">
                                Usuário: <span className="font-medium text-slate-700">{editingUser.name}</span>
                            </p>
                            <input
                                type={actionType === 'email' ? 'email' : 'text'}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={actionType === 'email' ? "Novo e-mail" : "Nova senha"}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-auftek-blue outline-none"
                                autoFocus
                                required
                            />
                            {actionType === 'password' && (
                                <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1">
                                    <AlertTriangle size={10} /> Essa ação desconectará o usuário se ele estiver logado.
                                </p>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={closeEdit}
                                className="flex-1 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg border border-transparent"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={actionLoading}
                                className="flex-1 py-2 text-sm bg-auftek-blue text-white font-bold rounded-lg hover:bg-blue-700 flex justify-center items-center gap-2"
                            >
                                {actionLoading ? "Salvando..." : <><Save size={14} /> Salvar</>}
                            </button>
                        </div>
                    </form>
                </div>
            )}

        </div>
    );
};