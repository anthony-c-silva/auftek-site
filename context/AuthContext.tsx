"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    isAdmin: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Ao carregar, pergunta ao servidor se o cookie HttpOnly é válido
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            } catch (error) {
                setIsAdmin(false);
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
                body: JSON.stringify({ email, password }), // Agora enviamos email
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok) {
                setIsAdmin(true);
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
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ isAdmin, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);