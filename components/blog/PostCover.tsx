"use client";

import React, { useState } from "react";

interface PostCoverProps {
    title: string;
    imageUrl?: string;
}

export function PostCover({ title, imageUrl }: PostCoverProps) {
    const [imageError, setImageError] = useState(false);
    const hasImage = imageUrl && imageUrl.trim() !== "" && !imageError;

    if (hasImage) {
        return (
            <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover opacity-80"
                onError={() => setImageError(true)}
            />
        );
    }

    // Fallback (Gradiente)
    return (
        <div className="w-full h-full bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center">
            <span className="text-6xl md:text-8xl font-black text-white/5 uppercase tracking-[0.15em] select-none">
                Auftek
            </span>
        </div>
    );
}