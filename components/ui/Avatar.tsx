"use client";
import React, { useState } from 'react';

interface AvatarProps {
    src?: string;
    alt: string;
    size?: number;
    className?: string;
}

const COLORS = [
    "bg-red-500", "bg-orange-500", "bg-amber-500",
    "bg-green-500", "bg-emerald-500", "bg-teal-500",
    "bg-cyan-500", "bg-blue-500", "bg-indigo-500",
    "bg-violet-500", "bg-purple-500", "bg-fuchsia-500",
    "bg-pink-500", "bg-rose-500"
];

export const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 40, className = "" }) => {
    const [error, setError] = useState(false);

    // SOLUÇÃO DO ESLINT:
    // Guardamos qual foi a última URL que tentamos carregar.
    const [lastSrc, setLastSrc] = useState(src);

    // Se a URL mudou (ex: você editou o post e trocou a foto),
    // nós resetamos o erro IMEDIATAMENTE, sem usar useEffect.
    if (src !== lastSrc) {
        setLastSrc(src);
        setError(false);
    }

    const getInitials = (name: string) => {
        if (!name) return "AD";
        const names = name.trim().split(" ");
        if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    };

    const getColorByName = (name: string) => {
        if (!name) return "bg-slate-400";
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash % COLORS.length);
        return COLORS[index];
    };

    const isInvalidSource = !src || src.trim() === "" || src.includes("default-avatar.png");

    // CASO 1: IMAGEM (Se existir e for válida)
    if (!isInvalidSource && !error) {
        return (
            <img
                src={src}
                alt={alt}
                width={size}
                height={size}
                className={`rounded-full object-cover bg-slate-200 ${className}`}
                onError={() => setError(true)}
                style={{ width: size, height: size }}
            />
        );
    }

    // CASO 2: INICIAIS (Se não tiver imagem ou deu erro)
    const bgColorClass = getColorByName(alt);

    return (
        <div
            className={`rounded-full flex items-center justify-center font-bold text-white select-none ${bgColorClass} ${className}`}
            style={{
                width: size,
                height: size,
                fontSize: size * 0.4
            }}
            title={alt}
        >
            {getInitials(alt)}
        </div>
    );
};