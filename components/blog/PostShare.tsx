"use client";

import React, { useEffect, useState } from "react";
import { Share2, Linkedin, Twitter, Facebook } from "lucide-react";

interface PostShareProps {
    title: string;
    excerpt?: string;
}

export function PostShare({ title, excerpt }: PostShareProps) {
    const [shareUrl, setShareUrl] = useState("");

    useEffect(() => {
        setShareUrl(window.location.href);
    }, []);

    const handleShare = (platform: 'linkedin' | 'twitter' | 'facebook') => {
        if (!shareUrl) return;

        const encodedUrl = encodeURIComponent(shareUrl);
        const encodedTitle = encodeURIComponent(title);
        let url = "";

        switch (platform) {
            case 'linkedin': url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`; break;
            case 'twitter': url = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`; break;
            case 'facebook': url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`; break;
        }

        window.open(url, '_blank', 'noopener,noreferrer,width=600,height=600');
    };

    const handleNativeShare = () => {
        if (navigator.share) {
            navigator.share({ title, text: excerpt, url: shareUrl }).catch(console.error);
        } else {
            navigator.clipboard.writeText(shareUrl);
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