"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    name: string;
    email: string;
}

interface AuthContextType {
    isAdmin: boolean;
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Tenta validar a sessão
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    const userData = data.user || data;

                    // SE a rota /me retornar um token renovado, salvamos também
                    if (data.token) {
                        localStorage.setItem("token", data.token);
                    }

                    setIsAdmin(true);
                    setUser({
                        name: userData.name || "Admin",
                        email: userData.email || ""
                    });
                } else {
                    // Se falhar a validação, removemos qualquer token antigo
                    localStorage.removeItem("token");
                    setIsAdmin(false);
                    setUser(null);
                }
            } catch (error) {
                localStorage.removeItem("token");
                setIsAdmin(false);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok) {
                const data = await res.json();

                // --- A CORREÇÃO MÁGICA ESTÁ AQUI ---
                // Precisamos salvar o token explicitamente para o TeamManager usar depois
                if (data.token) {
                    localStorage.setItem("token", data.token);
                } else {
                    console.error("AVISO: A API de login não retornou a propriedade 'token'. Verifique o backend.");
                }
                // -----------------------------------

                setIsAdmin(true);
                const userData = data.user || data;
                setUser({
                    name: userData.name || "Admin",
                    email: email
                });

                router.push('/admin');
                return true;
            }
            return false;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error("Erro no logout API", error);
        } finally {
            // Limpeza completa do Frontend
            localStorage.removeItem("token"); // <--- Limpa o token
            setIsAdmin(false);
            setUser(null);
            router.push('/login');
        }
    };

    return (
        <AuthContext.Provider value={{ isAdmin, user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);