"use client";

import React, { useState } from "react";
import { Share2, Linkedin, Twitter, Facebook } from "lucide-react";

interface PostShareProps {
    title: string;
    excerpt?: string;
}

export function PostShare({ title, excerpt }: PostShareProps) {
    // Initialize with empty string for SSR compatibility
    const [shareUrl] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.location.href;
        }
        return "";
    });

    const handleShare = (platform: 'linkedin' | 'twitter' | 'facebook') => {
        // Get the URL at the time of sharing if not set during init
        const url = shareUrl || window.location.href;
        const encodedUrl = encodeURIComponent(url);
        const encodedTitle = encodeURIComponent(title);
        let shareLink = "";

        switch (platform) {
            case 'linkedin': shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`; break;
            case 'twitter': shareLink = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`; break;
            case 'facebook': shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`; break;
        }

        window.open(shareLink, '_blank', 'noopener,noreferrer,width=600,height=600');
    };

    const handleNativeShare = () => {
        const url = shareUrl || window.location.href;

        if (navigator.share) {
            navigator.share({ title, text: excerpt, url }).catch(console.error);
        } else {
            navigator.clipboard.writeText(url);
            alert('Link copiado!');
        }
    };

    return (
        <div className="flex justify-between items-center py-6 border-y border-slate-100">
            <span className="text-slate-500 text-sm font-medium">Compartilhar:</span>
            <div className="flex gap-4">
                <button onClick={() => handleShare('linkedin')} className="text-slate-400 hover:text-[#0a66c2] transition-colors p-2">
                    <Linkedin size={20} />
                </button>
                <button onClick={() => handleShare('twitter')} className="text-slate-400 hover:text-[#1d9bf0] transition-colors p-2">
                    <Twitter size={20} />
                </button>
                <button onClick={() => handleShare('facebook')} className="text-slate-400 hover:text-[#1877f2] transition-colors p-2">
                    <Facebook size={20} />
                </button>
                <button onClick={handleNativeShare} className="text-slate-400 hover:text-auftek-600 transition-colors p-2 border-l border-slate-200 ml-2 pl-4">
                    <Share2 size={20} />
                </button>
            </div>
        </div>
    );
}