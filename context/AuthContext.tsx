"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 1. Atualizamos a Interface para incluir a Role
interface User {
    name: string;
    email: string;
    role: 'admin' | 'redator';
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

                    // Se a rota /me retornar um token renovado, salvamos também
                    if (data.token) {
                        localStorage.setItem("token", data.token);
                    }

                    // Define a Role (Padrão: redator se não vier nada)
                    const userRole = userData.role || 'redator';

                    // LÓGICA DE ADMIN: Só é admin se a role for explicitamente 'admin'
                    setIsAdmin(userRole === 'admin');
                    
                    setUser({
                        name: userData.name || "Usuário",
                        email: userData.email || "",
                        role: userRole
                    });
                } else {
                    // Se falhar a validação
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

                // Salva o token para as requisições autenticadas
                if (data.token) {
                    localStorage.setItem("token", data.token);
                } else {
                    console.error("AVISO: Token não retornado no login.");
                }

                const userData = data.user || data;
                const userRole = userData.role || 'redator';

                // Define se é admin baseada na role vinda do backend
                setIsAdmin(userRole === 'admin');
                
                setUser({
                    name: userData.name || "Usuário",
                    email: email,
                    role: userRole
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
            localStorage.removeItem("token");
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