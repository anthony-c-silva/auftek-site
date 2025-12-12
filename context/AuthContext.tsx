"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 1. Definimos o tipo do Usuário
interface User {
    name: string;
    email: string;
}

// 2. Atualizamos a interface do Contexto para incluir 'user'
interface AuthContextType {
    isAdmin: boolean;
    user: User | null; // <--- Novo campo
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState<User | null>(null); // <--- Novo estado
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Ao carregar, verifica sessão e recupera dados do usuário
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    // Assumindo que sua API retorna { user: { ... } } ou o próprio objeto user
                    // Ajuste conforme o retorno real da sua API /api/auth/me
                    const userData = data.user || data;

                    setIsAdmin(true);
                    setUser({
                        name: userData.name || "Admin",
                        email: userData.email || ""
                    });
                } else {
                    setIsAdmin(false);
                    setUser(null);
                }
            } catch (error) {
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
                setIsAdmin(true);
                // Atualiza o usuário imediatamente após login
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
        await fetch('/api/auth/logout', { method: 'POST' });
        setIsAdmin(false);
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ isAdmin, user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);