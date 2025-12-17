"use client";
import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: "md" | "lg" | "xl" | "full"; // Novo: controle de largura
}

export const Modal: React.FC<ModalProps> = ({
                                                isOpen,
                                                onClose,
                                                title,
                                                children,
                                                size = "lg"
                                            }) => {

    // Fecha com ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    // Bloqueia o scroll da página de fundo quando o modal abre
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    if (!isOpen) return null;

    // Mapa de tamanhos
    const sizeClasses = {
        md: "max-w-md",
        lg: "max-w-2xl",
        xl: "max-w-6xl", // Ideal para formulários largos
        full: "max-w-[95vw]" // Quase tela cheia
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">

            {/* O Modal em si */}
            <div
                className={`
                    bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size]} 
                    max-h-[90vh] flex flex-col relative overflow-hidden animate-scale-in
                `}
                onClick={(e) => e.stopPropagation()} // Evita fechar ao clicar dentro
            >
                {/* Header (Fixo, não rola) */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0 z-10">
                    <h3 className="text-xl font-bold text-slate-800 line-clamp-1">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Fechar (Esc)"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Conteúdo (Scrollável) */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                    {children}
                </div>
            </div>

            {/* Camada clicável para fechar (Background) */}
            <div
                className="absolute inset-0 -z-10"
                onClick={onClose}
            ></div>
        </div>
    );
};