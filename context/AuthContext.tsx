"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
                const res = await fetch('/api/auth/me');

                if (res.ok) {
                    const data = await res.json();
                    const userData = data.user;

                    const userRole = userData.role || 'redator';

                    setIsAdmin(userRole === 'admin');
                    setUser({
                        name: userData.name,
                        email: userData.email,
                        role: userRole
                    });
                } else {
                    setIsAdmin(false);
                    setUser(null);
                }
            } catch (error) {
                console.error("Erro na verificação de sessão:", error);
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

                // Assumindo que o login retorna a mesma estrutura de user
                const userData = data.user || {};
                const userRole = userData.role || 'redator';

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
            console.error("Erro no login:", error);
            return false;
        }
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error("Erro no logout API", error);
        } finally {
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