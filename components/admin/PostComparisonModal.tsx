// components/admin/PostComparisonModal.tsx
import React from "react";
import { X, CheckCircle, AlertTriangle } from "lucide-react";
import { PostData } from "./AdminPostList";

interface PostComparisonModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: PostData;
    onApprove: (slug: string) => void;
    onReject: (slug: string, reason: string) => void;
}

export const PostComparisonModal: React.FC<PostComparisonModalProps> = ({
                                                                            isOpen,
                                                                            onClose,
                                                                            post,
                                                                            onApprove,
                                                                            onReject
                                                                        }) => {
    if (!isOpen) return null;

    // FIX: Define que 'field' só pode ser uma das chaves que existem em pendingChanges
    // (title, content, excerpt, coverImage, tags, slug)
    type PendingKeys = keyof NonNullable<PostData['pendingChanges']>;

    const getNewValue = (field: PendingKeys) => {
        // Verifica se existe o objeto e se o campo específico foi alterado
        if (post.pendingChanges && post.pendingChanges[field] !== undefined) {
            return post.pendingChanges[field];
        }
        // Retorna o valor original
        // O cast 'as keyof PostData' garante ao TS que a chave é válida no objeto pai também
        return post[field as keyof PostData];
    };

    const hasChanged = (field: PendingKeys) => {
        return post.pendingChanges && post.pendingChanges[field] !== undefined;
    };

    // Helper para garantir que o src da imagem seja string (evita erro de tipagem com tags[])
    const getCoverImage = () => {
        const val = getNewValue('coverImage');
        return typeof val === 'string' ? val : '';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <AlertTriangle className="text-amber-500" size={20} />
                            Revisar Alterações
                        </h2>
                        <p className="text-sm text-slate-500">Compare a versão atual com a sugerida pelo autor.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* COLUNA ESQUERDA: ORIGINAL */}
                        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm opacity-80">
                            <div className="mb-4 pb-2 border-b border-slate-100 flex justify-between">
                                <span className="font-bold text-slate-400 uppercase text-xs tracking-wider">Versão Atual (No Ar)</span>
                            </div>

                            {/* Título */}
                            <div className="mb-6">
                                <label className="text-xs font-bold text-slate-400">TÍTULO</label>
                                <h3 className="text-xl font-semibold text-slate-700">{post.title}</h3>
                            </div>

                            {/* Capa */}
                            <div className="mb-6">
                                <label className="text-xs font-bold text-slate-400">CAPA</label>
                                <div className="h-32 w-full bg-slate-100 rounded-md overflow-hidden mt-1 relative">
                                    <img src={post.coverImage} alt="Original" className="w-full h-full object-cover grayscale" />
                                </div>
                            </div>

                            {/* Resumo */}
                            <div className="mb-6">
                                <label className="text-xs font-bold text-slate-400">RESUMO</label>
                                <p className="text-sm text-slate-600 italic">{post.excerpt}</p>
                            </div>

                            {/* Conteúdo (Simplificado para preview) */}
                            <div>
                                <label className="text-xs font-bold text-slate-400">CONTEÚDO</label>
                                <div className="mt-2 text-sm text-slate-500 h-64 overflow-y-auto p-3 border border-slate-100 rounded bg-slate-50 whitespace-pre-wrap">
                                    {post.content}
                                </div>
                            </div>
                        </div>

                        {/* COLUNA DIREITA: NOVA VERSÃO */}
                        <div className="bg-white p-6 rounded-lg border-2 border-blue-500 shadow-lg relative">
                            <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                NOVA VERSÃO
                            </div>

                            <div className="mb-4 pb-2 border-b border-slate-100">
                                <span className="font-bold text-blue-600 uppercase text-xs tracking-wider">Proposta de Edição</span>
                            </div>

                            {/* Título */}
                            <div className={`mb-6 p-2 rounded ${hasChanged('title') ? 'bg-blue-50 border border-blue-100' : ''}`}>
                                <label className="text-xs font-bold text-blue-300">TÍTULO</label>
                                <h3 className="text-xl font-bold text-slate-900 flex items-start gap-2">
                                    {getNewValue('title') as string}
                                    {hasChanged('title') && <span className="text-[10px] bg-blue-100 text-blue-600 px-1 rounded mt-1">MODIFICADO</span>}
                                </h3>
                            </div>

                            {/* Capa */}
                            <div className={`mb-6 p-2 rounded ${hasChanged('coverImage') ? 'bg-blue-50 border border-blue-100' : ''}`}>
                                <label className="text-xs font-bold text-blue-300">CAPA</label>
                                <div className="h-32 w-full bg-slate-100 rounded-md overflow-hidden mt-1">
                                    <img src={getCoverImage()} alt="Nova" className="w-full h-full object-cover" />
                                </div>
                            </div>

                            {/* Resumo */}
                            <div className={`mb-6 p-2 rounded ${hasChanged('excerpt') ? 'bg-blue-50 border border-blue-100' : ''}`}>
                                <label className="text-xs font-bold text-blue-300">RESUMO</label>
                                <p className="text-sm text-slate-800 italic">{getNewValue('excerpt') as string}</p>
                            </div>

                            {/* Conteúdo */}
                            <div className={`p-2 rounded ${hasChanged('content') ? 'bg-blue-50 border border-blue-100' : ''}`}>
                                <label className="text-xs font-bold text-blue-300">CONTEÚDO</label>
                                <div className="mt-2 text-sm text-slate-800 h-64 overflow-y-auto p-3 border border-slate-200 rounded bg-white whitespace-pre-wrap">
                                    {getNewValue('content') as string}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-slate-200 bg-white flex justify-end gap-3">
                    <button
                        onClick={() => {
                            const reason = prompt("Motivo da rejeição (será enviado ao autor):");
                            if (reason) onReject(post.slug, reason);
                        }}
                        className="px-6 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-medium transition"
                    >
                        Rejeitar Alterações
                    </button>

                    <button
                        onClick={() => onApprove(post.slug)}
                        className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 font-bold shadow-lg shadow-green-200 transition flex items-center gap-2"
                    >
                        <CheckCircle size={18} />
                        Aprovar e Publicar
                    </button>
                </div>
            </div>
        </div>
    );
};