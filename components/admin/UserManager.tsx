"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
    UserPlus, Search, Edit2, Trash2, User,
    Briefcase, Save, X, Lock, Github, BookOpen, Linkedin, Instagram, Check,
    UploadCloud, Loader2, Eye, EyeOff, AlertCircle
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";

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
        lattes?: string;
    };
    createdAt?: string;
}

export function UserManager() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'author'>('all');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

    // Estados para controle de senha e visualização
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const initialFormState = {
        name: "",
        email: "",
        password: "",
        role: "author",
        photoUrl: "",
        education: "",
        bio: "",
        linkedin: "",
        instagram: "",
        github: "",
        lattes: "",
    };

    const [formData, setFormData] = useState<any>(initialFormState);
    const [editingId, setEditingId] = useState<string | null>(null);

    // --- Lógica de Força da Senha ---
    const getStrength = (pass: string) => {
        const criteria = {
            length: pass.length >= 8,
            hasUpper: /[A-Z]/.test(pass),
            hasLower: /[a-z]/.test(pass),
            hasNumber: /[0-9]/.test(pass),
            hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(pass)
        };
        const score = Object.values(criteria).filter(Boolean).length;
        return { criteria, score };
    };

    const passwordStrength = useMemo(() => {
        return getStrength(formData.password);
    }, [formData.password]);

    // Verifica validade geral (Senha forte + Confirmação igual)
    const isPasswordValid = () => {
        // Se estiver editando e o campo senha estiver vazio, é válido (mantém a antiga)
        if (isEditing && formData.password === "") return true;

        // Se estiver criando ou editando (com texto no campo):
        const isStrong = passwordStrength.score === 5; // Exige todos os critérios
        const isMatch = formData.password === confirmPassword;

        return isStrong && isMatch;
    };
    // -------------------------------

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

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch =
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesRole = roleFilter === 'all' || user.role === roleFilter;

            return matchesSearch && matchesRole;
        });
    }, [users, searchTerm, roleFilter]);

    const handleOpenCreate = () => {
        setFormData(initialFormState);
        setConfirmPassword(""); // Reseta confirmação
        setShowPassword(false);
        setShowConfirmPassword(false);
        setIsEditing(false);
        setEditingId(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (user: UserData) => {
        setFormData({
            name: user.name,
            email: user.email,
            password: "",
            role: user.role,
            photoUrl: user.photoUrl || "",
            education: user.education || "",
            bio: user.bio || "",
            linkedin: user.socialLinks?.linkedin || "",
            instagram: user.socialLinks?.instagram || "",
            github: user.socialLinks?.github || "",
            lattes: user.socialLinks?.lattes || ""
        });
        setConfirmPassword(""); // Reseta confirmação
        setShowPassword(false);
        setShowConfirmPassword(false);
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

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingPhoto(true);
        const uploadData = new FormData();
        uploadData.append("file", file);
        uploadData.append("folder", "profile");

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: uploadData,
            });

            if (!res.ok) throw new Error("Erro no upload");

            const data = await res.json();
            setFormData((prev: any) => ({ ...prev, photoUrl: data.url }));
        } catch (error) {
            console.error(error);
            alert("Erro ao enviar foto. Verifique a conexão.");
        } finally {
            setIsUploadingPhoto(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isPasswordValid()) {
            alert("Verifique os requisitos da senha e a confirmação.");
            return;
        }

        setIsSaving(true);

        try {
            const payload = {
                ...formData,
                socialLinks: {
                    linkedin: formData.linkedin,
                    instagram: formData.instagram,
                    github: formData.github,
                    lattes: formData.lattes
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

    const inputClass = "w-full p-2 border border-slate-300 rounded text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900";
    const labelClass = "block text-xs font-bold text-slate-500 uppercase mb-1";

    const getBarColor = () => {
        const s = passwordStrength.score;
        if (s <= 1) return "bg-red-500";
        if (s <= 2) return "bg-orange-500";
        if (s <= 3) return "bg-yellow-500";
        if (s <= 4) return "bg-blue-500";
        return "bg-green-500";
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex gap-2">
                    <button onClick={() => setRoleFilter('all')} className={`px-3 py-1 rounded-full text-xs font-bold ${roleFilter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}>Todos</button>
                    <button onClick={() => setRoleFilter('admin')} className={`px-3 py-1 rounded-full text-xs font-bold ${roleFilter === 'admin' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'}`}>Admins</button>
                    <button onClick={() => setRoleFilter('author')} className={`px-3 py-1 rounded-full text-xs font-bold ${roleFilter === 'author' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>Autores</button>
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
                    <button onClick={handleOpenCreate} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded text-sm font-bold hover:bg-slate-800 transition shadow-sm">
                        <UserPlus size={16} /> Novo
                    </button>
                </div>
            </div>

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
                                        <button onClick={() => handleOpenEdit(user)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full" title="Editar"><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete(user._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full" title="Excluir"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

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

                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2 text-sm uppercase"><Lock size={14}/> Credenciais de Acesso</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className={labelClass}>Nome Completo <span className="text-red-500">*</span></label>
                                        <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Email <span className="text-red-500">*</span></label>
                                        <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Função / Permissão</label>
                                        <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className={inputClass}>
                                            <option value="author">Autor (Padrão)</option>
                                            <option value="admin">Administrador (Total)</option>
                                        </select>
                                    </div>

                                    {/* --- BLOCO DE SENHA COM CONFIRMAÇÃO --- */}
                                    <div className="md:col-span-1">
                                        <label className={labelClass}>{isEditing ? "Nova Senha (opcional)" : <>Senha <span className="text-red-500">*</span></>}</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                required={!isEditing}
                                                placeholder={isEditing ? "Manter atual" : "Digite uma senha"}
                                                value={formData.password}
                                                onChange={e => setFormData({...formData, password: e.target.value})}
                                                className={`${inputClass} pr-10`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                                            >
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="md:col-span-1">
                                        <label className={labelClass}>{isEditing && !formData.password ? "Confirmar (opcional)" : <>Confirmar Senha <span className="text-red-500">*</span></>}</label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                required={!isEditing || formData.password.length > 0}
                                                placeholder="Repita a senha"
                                                value={confirmPassword}
                                                onChange={e => setConfirmPassword(e.target.value)}
                                                disabled={isEditing && formData.password === ""}
                                                className={`${inputClass} pr-10 ${confirmPassword && formData.password !== confirmPassword ? 'border-red-400 bg-red-50' : ''}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                                                disabled={isEditing && formData.password === ""}
                                            >
                                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Feedback Visual de Força e Erro */}
                                    {formData.password && (
                                        <div className="md:col-span-2 space-y-2 animate-fade-in bg-white p-3 rounded border border-slate-200">
                                            <div className="flex justify-between items-end mb-1">
                                                <span className="text-xs font-bold text-slate-500 uppercase">Requisitos de Segurança</span>
                                                <span className="text-xs text-slate-400">{passwordStrength.score}/5</span>
                                            </div>

                                            {/* Barra de Força */}
                                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div className={`h-full transition-all duration-500 ${getBarColor()}`} style={{ width: `${(passwordStrength.score / 5) * 100}%` }} />
                                            </div>

                                            {/* Lista de Critérios */}
                                            <div className="grid grid-cols-2 gap-2 mt-2">
                                                <div className={`text-[10px] flex items-center gap-1 ${passwordStrength.criteria.length ? 'text-green-600' : 'text-slate-400'}`}>
                                                    {passwordStrength.criteria.length ? <Check size={10} /> : <div className="w-2 h-2 bg-slate-200 rounded-full"/>} 8+ caracteres
                                                </div>
                                                <div className={`text-[10px] flex items-center gap-1 ${passwordStrength.criteria.hasUpper ? 'text-green-600' : 'text-slate-400'}`}>
                                                    {passwordStrength.criteria.hasUpper ? <Check size={10} /> : <div className="w-2 h-2 bg-slate-200 rounded-full"/>} Maiúscula
                                                </div>
                                                <div className={`text-[10px] flex items-center gap-1 ${passwordStrength.criteria.hasNumber ? 'text-green-600' : 'text-slate-400'}`}>
                                                    {passwordStrength.criteria.hasNumber ? <Check size={10} /> : <div className="w-2 h-2 bg-slate-200 rounded-full"/>} Número
                                                </div>
                                                <div className={`text-[10px] flex items-center gap-1 ${passwordStrength.criteria.hasSpecial ? 'text-green-600' : 'text-slate-400'}`}>
                                                    {passwordStrength.criteria.hasSpecial ? <Check size={10} /> : <div className="w-2 h-2 bg-slate-200 rounded-full"/>} Especial (!@#)
                                                </div>
                                            </div>

                                            {/* Erro de não coincidência */}
                                            {confirmPassword && formData.password !== confirmPassword && (
                                                <p className="text-red-500 text-xs mt-2 flex items-center gap-1 font-bold pt-2 border-t border-slate-100">
                                                    <AlertCircle size={12} /> As senhas não conferem.
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2 text-sm uppercase"><User size={14}/> Perfil Público</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <div className="md:col-span-2">
                                        <label className={labelClass}>Foto de Perfil</label>
                                        <div className="flex items-center gap-4">
                                            <div className="relative group w-16 h-16 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0">
                                                {formData.photoUrl ? (
                                                    <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-8 h-8 text-slate-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                                )}
                                                {isUploadingPhoto && (
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <label className={`cursor-pointer inline-flex items-center gap-2 bg-white border border-slate-300 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition shadow-sm ${isUploadingPhoto ? 'opacity-50 pointer-events-none' : ''}`}>
                                                    <UploadCloud size={16} />
                                                    {formData.photoUrl ? "Alterar Foto" : "Enviar Foto"}
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={handlePhotoUpload}
                                                        disabled={isUploadingPhoto}
                                                    />
                                                </label>
                                                <p className="text-[10px] text-slate-400 mt-1">JPG, PNG ou WEBP. A imagem será salva externamente.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className={labelClass}>Formação / Cargo</label>
                                        <input placeholder="Ex: Engenheiro de Software" value={formData.education} onChange={e => setFormData({...formData, education: e.target.value})} className={inputClass} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className={labelClass}>Mini Bio</label>
                                        <textarea rows={3} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>LinkedIn URL</label>
                                        <div className="relative">
                                            <Linkedin className="absolute left-2 top-2.5 text-slate-400" size={16} />
                                            <input value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} className={`${inputClass} pl-8`} placeholder="linkedin.com/in/..." />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Instagram URL</label>
                                        <div className="relative">
                                            <Instagram className="absolute left-2 top-2.5 text-slate-400" size={16} />
                                            <input value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} className={`${inputClass} pl-8`} placeholder="instagram.com/..." />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Lattes URL</label>
                                        <div className="relative">
                                            <BookOpen className="absolute left-2 top-2.5 text-slate-400" size={16} />
                                            <input value={formData.lattes} onChange={e => setFormData({...formData, lattes: e.target.value})} className={`${inputClass} pl-8`} placeholder="http://lattes.cnpq.br/..." />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClass}>GitHub URL</label>
                                        <div className="relative">
                                            <Github className="absolute left-2 top-2.5 text-slate-400" size={16} />
                                            <input value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} className={`${inputClass} pl-8`} placeholder="github.com/..." />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end pt-4 border-t sticky bottom-0 bg-white pb-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancelar</button>
                                <button type="submit" disabled={isSaving || !isPasswordValid()} className={`px-6 py-2 rounded-lg font-bold shadow-md flex items-center gap-2 transition-all ${isSaving || !isPasswordValid() ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
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