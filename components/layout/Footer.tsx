"use client";
import React from 'react';
import { Logo } from '../ui/Logo';
import Link from 'next/link';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-black py-12 px-6 border-t border-gray-900">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                {/* Logo Auftek */}
                <div className="flex items-center">
                    <Logo className="h-8 w-auto opacity-90 hover:opacity-100 transition-opacity" />
                </div>

                <div className="flex gap-8 text-gray-500 text-sm">
                    <a href="#" className="hover:text-white transition-colors">
                        LinkedIn
                    </a>
                    <a href="#" className="hover:text-white transition-colors">
                        Instagram
                    </a>
                    <a href="#" className="hover:text-white transition-colors">
                        Política de Privacidade
                    </a>
                </div>

                {/* Coluna da Direita: Copyright + Link Admin */}
                <div className="flex flex-col items-center md:items-end gap-2">
                    <div className="text-gray-600 text-sm text-center md:text-right">
                        &copy; {new Date().getFullYear()} Auftek Tecnologia. Todos
                        os direitos reservados.
                    </div>

                    {/* Link Discreto para o Login */}
                    <Link
                        href="/login"
                        className="text-[10px] text-gray-800 hover:text-auftek-blue transition-colors uppercase tracking-widest hover:underline cursor-pointer"
                    >
                        Painel do Admin
                    </Link>
                </div>
            </div>
        </footer>
    );
};