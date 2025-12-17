"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
    UserPlus, Search, Edit2, Trash2, Shield, User,
    Briefcase, Save, X, Lock, Image as ImageIcon
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";

// Tipo completo unificado
interface UserData {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'author';
    photoUrl?: string;
    education?: string;
    bio?: string;
    socialLinks?: {
        linkedin?: string;
        instagram?: string;
        github?: string;
    };
    createdAt?: string;
}

export function UserManager() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'author'>('all');

    // Estado do Modal (Create/Edit)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Estado do Formulário
    const initialFormState = {
        name: "",
        email: "",
        password: "", // Opcional na edição
        role: "author",
        photoUrl: "",
        education: "",
        bio: "",
        linkedin: "",
        instagram: "",
        github: ""
    };

    const [formData, setFormData] = useState<any>(initialFormState);
    const [editingId, setEditingId] = useState<string | null>(null);

    // --- FETCH ---
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/users");
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Erro ao buscar usuários", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // --- FILTROS ---
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch =
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesRole = roleFilter === 'all' || user.role === roleFilter;

            return matchesSearch && matchesRole;
        });
    }, [users, searchTerm, roleFilter]);

    // --- ACTIONS ---
    const handleOpenCreate = () => {
        setFormData(initialFormState);
        setIsEditing(false);
        setEditingId(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (user: UserData) => {
        setFormData({
            name: user.name,
            email: user.email,
            password: "", // Senha vazia na edição (só preenche se quiser trocar)
            role: user.role,
            photoUrl: user.photoUrl || "",
            education: user.education || "",
            bio: user.bio || "",
            linkedin: user.socialLinks?.linkedin || "",
            instagram: user.socialLinks?.instagram || "",
            github: user.socialLinks?.github || ""
        });
        setIsEditing(true);
        setEditingId(user._id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja remover este usuário?")) return;
        try {
            await fetch(`/api/users/${id}`, { method: 'DELETE' });
            fetchUsers();
        } catch (error) {
            alert("Erro ao deletar");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const payload = {
                ...formData,
                socialLinks: {
                    linkedin: formData.linkedin,
                    instagram: formData.instagram,
                    github: formData.github
                }
            };

            const url = isEditing ? `/api/users/${editingId}` : "/api/users";
            const method = isEditing ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Erro na operação");
            }

            setIsModalOpen(false);
            fetchUsers();
            alert(isEditing ? "Usuário atualizado!" : "Usuário criado!");
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const inputClass = "w-full p-2 border border-slate-300 rounded text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900";    const labelClass = "block text-xs font-bold text-slate-500 uppercase mb-1";

    return (
        <div className="space-y-6">

            {/* --- HEADER & FILTERS --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex gap-2">
                    <button
                        onClick={() => setRoleFilter('all')}
                        className={`px-3 py-1 rounded-full text-xs font-bold ${roleFilter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => setRoleFilter('admin')}
                        className={`px-3 py-1 rounded-full text-xs font-bold ${roleFilter === 'admin' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                    >
                        Admins
                    </button>
                    <button
                        onClick={() => setRoleFilter('author')}
                        className={`px-3 py-1 rounded-full text-xs font-bold ${roleFilter === 'author' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                    >
                        Autores
                    </button>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-2 top-2.5 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar nome ou email..."
                            className="pl-8 p-2 border border-slate-300 rounded text-sm w-full outline-none focus:border-blue-500"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleOpenCreate}
                        className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded text-sm font-bold hover:bg-slate-800 transition shadow-sm"
                    >
                        <UserPlus size={16} /> Novo
                    </button>
                </div>
            </div>

            {/* --- TABLE --- */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                    <tr>
                        <th className="px-6 py-3 font-medium">Usuário</th>
                        <th className="px-6 py-3 font-medium">Acesso / Função</th>
                        <th className="px-6 py-3 font-medium hidden md:table-cell">Perfil</th>
                        <th className="px-6 py-3 font-medium text-right">Ações</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {filteredUsers.length === 0 ? (
                        <tr><td colSpan={4} className="p-8 text-center text-slate-500">Nenhum usuário encontrado.</td></tr>
                    ) : (
                        filteredUsers.map(user => (
                            <tr key={user._id} className="hover:bg-slate-50 group transition">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar src={user.photoUrl} alt={user.name} size={40} />
                                        <div>
                                            <p className="font-bold text-slate-900">{user.name}</p>
                                            <p className="text-xs text-slate-500 hidden sm:block">ID: {user._id.slice(-6)}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col items-start gap-1">
                                        <span className="text-slate-600">{user.email}</span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {user.role}
                                            </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 hidden md:table-cell">
                                    {user.education ? (
                                        <div className="flex items-center gap-1 text-slate-600 text-xs">
                                            <Briefcase size={12}/> {user.education}
                                        </div>
                                    ) : <span className="text-slate-300 text-xs">-</span>}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleOpenEdit(user)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                                            title="Editar"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                                            title="Excluir"
                                        >
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

            {/* --- MODAL DE CRIAÇÃO/EDIÇÃO --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                {isEditing ? <Edit2 size={18}/> : <UserPlus size={18}/>}
                                {isEditing ? "Editar Usuário" : "Novo Usuário"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">

                            {/* Bloco 1: Credenciais */}
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2 text-sm uppercase"><Lock size={14}/> Credenciais de Acesso</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className={labelClass}>Nome Completo <span className="text-red-500">*</span></label>
                                        <input
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({...formData, name: e.target.value})}
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Email <span className="text-red-500">*</span></label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={e => setFormData({...formData, email: e.target.value})}
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>
                                            {isEditing ? "Nova Senha (opcional)" : "Senha Inicial *"}
                                        </label>
                                        <input
                                            type="password"
                                            required={!isEditing}
                                            placeholder={isEditing ? "Manter atual" : ""}
                                            value={formData.password}
                                            onChange={e => setFormData({...formData, password: e.target.value})}
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Função / Permissão</label>
                                        <select
                                            value={formData.role}
                                            onChange={e => setFormData({...formData, role: e.target.value})}
                                            className={inputClass}
                                        >
                                            <option value="author">Autor (Padrão)</option>
                                            <option value="admin">Administrador (Total)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Bloco 2: Perfil Público */}
                            <div className="border-t pt-6">
                                <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2 text-sm uppercase"><User size={14}/> Perfil Público (Author)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className={labelClass}>Foto de Perfil (URL)</label>
                                        <div className="flex gap-2">
                                            <input
                                                placeholder="https://..."
                                                value={formData.photoUrl}
                                                onChange={e => setFormData({...formData, photoUrl: e.target.value})}
                                                className={inputClass}
                                            />
                                            {formData.photoUrl && <Avatar src={formData.photoUrl} alt="Preview" size={38} className="rounded border"/>}
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className={labelClass}>Formação / Cargo</label>
                                        <input
                                            placeholder="Ex: Engenheiro de Software"
                                            value={formData.education}
                                            onChange={e => setFormData({...formData, education: e.target.value})}
                                            className={inputClass}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className={labelClass}>Mini Bio</label>
                                        <textarea
                                            rows={3}
                                            value={formData.bio}
                                            onChange={e => setFormData({...formData, bio: e.target.value})}
                                            className={inputClass}
                                        />
                                    </div>

                                    {/* Redes Sociais */}
                                    <div>
                                        <label className={labelClass}>LinkedIn URL</label>
                                        <input value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Instagram URL</label>
                                        <input value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} className={inputClass} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end pt-4 border-t sticky bottom-0 bg-white pb-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-md flex items-center gap-2"
                                >
                                    {isSaving ? "Salvando..." : <><Save size={18}/> Salvar Usuário</>}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}