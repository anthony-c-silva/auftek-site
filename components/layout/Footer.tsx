"use client";
import React from 'react';
import { Logo } from '../ui/Logo';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LogOut, LayoutDashboard } from 'lucide-react';

export const Footer: React.FC = () => {
    const { isAdmin, logout, isLoading } = useAuth();

    return (
        <footer className="bg-black py-8 px-6 border-t border-gray-900">
            {/* flex-col: Celular (um embaixo do outro)
               xl:flex-row: Desktop (tudo na mesma linha)
               justify-center: Tudo centralizado (não espalhado nas pontas)
               gap-8: Espaço entre os blocos
            */}
            <div className="max-w-7xl mx-auto flex flex-col xl:flex-row justify-center items-center gap-6 xl:gap-12 text-sm">

                {/* 1. Logo */}
                <div className="opacity-90 hover:opacity-100 transition-opacity">
                    <Logo className="h-6 w-auto" />
                </div>

                {/* 2. Links Sociais */}
                <div className="flex gap-6 text-gray-500">
                    <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                    <a href="#" className="hover:text-white transition-colors">Instagram</a>
                    <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
                </div>

                {/* 3. Copyright + Admin */}
                <div className="flex flex-col md:flex-row items-center gap-4 text-gray-600">
                    <span className="text-center">
                        &copy; {new Date().getFullYear()} Auftek Tecnologia. Todos os direitos reservados.
                    </span>

                    {!isLoading && (
                        <div className="flex items-center gap-3 pl-0 md:pl-4 md:border-l md:border-gray-800">
                            {isAdmin ? (
                                <>
                                    <Link
                                        href="/admin"
                                        className="text-auftek-blue hover:text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors text-xs"
                                    >
                                        <LayoutDashboard size={14} /> Painel
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="text-red-500 hover:text-red-400 uppercase tracking-wider flex items-center gap-1.5 transition-colors text-xs"
                                    >
                                        <LogOut size={14} /> Sair
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    className="text-gray-700 hover:text-auftek-blue transition-colors text-[10px] uppercase tracking-widest hover:underline"
                                >
                                    Admin
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </footer>
    );
};