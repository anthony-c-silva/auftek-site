"use client";
import React, { useState } from "react";
import { UserPlus, Save } from "lucide-react";

interface RegisterFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Erro ao criar");

            alert("Novo admin cadastrado com sucesso!");
            onSuccess(); // Fecha o modal
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-auftek-blue outline-none text-slate-900 bg-white";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center mb-4">
                <div className="bg-purple-100 p-3 rounded-full text-purple-600">
                    <UserPlus size={32} />
                </div>
            </div>
            <p className="text-center text-slate-500 text-sm mb-6">
                Adicione um novo membro à equipe administrativa.
            </p>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                <input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={inputClass}
                    placeholder="Ex: Maria Silva"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">E-mail de Acesso</label>
                <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={inputClass}
                    placeholder="maria@auftek.com"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Senha Inicial</label>
                <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className={inputClass}
                    placeholder="Crie uma senha forte"
                />
            </div>

            <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 bg-white border border-slate-300 text-slate-700 font-bold py-2 rounded-lg hover:bg-slate-50"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-purple-600 text-white font-bold py-2 rounded-lg hover:bg-purple-700 flex justify-center items-center gap-2"
                >
                    {loading ? "Criando..." : <><Save size={18} /> Cadastrar</>}
                </button>
            </div>
        </form>
    );
};