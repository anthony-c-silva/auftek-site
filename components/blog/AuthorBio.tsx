"use client";
import React from 'react';
import { Author } from '@/types/blog';
import { Linkedin, BookOpen, Github, Instagram } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';

// formata link das redes do usuario para https
const formatUrl = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
    }
    return `https://${url}`;
};

const AuthorBio: React.FC<{ author: Author }> = ({ author }) => {
    if (!author) return null;


    const links = author.socialLinks || {
        linkedin: author.linkedin,
        lattes: author.lattes,
        instagram: '',
        github: ''
    };

    return (
        <div className="bg-slate-50 rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left border border-slate-100 mt-12">
            <div className="flex-shrink-0">
                <Avatar
                    src={author.photoUrl}
                    alt={author.name}
                    size={80}
                    className="w-20 h-20 border-4 border-white shadow-sm"
                />
            </div>

            <div className="flex-1 space-y-3">
                <div>
                    <h3 className="text-xl font-bold text-slate-900">{author.name}</h3>
                    {author.education && (
                        <p className="text-auftek-blue font-medium text-sm">{author.education}</p>
                    )}
                </div>

                {author.bio && (
                    <p className="text-slate-600 leading-relaxed text-sm">
                        {author.bio}
                    </p>
                )}

                {/* O botão só é renderizado se links.xxxx existir. Se for vazio, some. */}
                <div className="flex items-center justify-center md:justify-start gap-4 pt-2 flex-wrap">

                    {links.linkedin && (
                        <a
                            href={formatUrl(links.linkedin)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0a66c2] transition-colors uppercase tracking-wider"
                        >
                            <Linkedin size={16} /> LinkedIn
                        </a>
                    )}

                    {links.github && (
                        <a
                            href={formatUrl(links.github)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-black transition-colors uppercase tracking-wider"
                        >
                            <Github size={16} /> GitHub
                        </a>
                    )}

                    {links.instagram && (
                        <a
                            href={formatUrl(links.instagram)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#E4405F] transition-colors uppercase tracking-wider"
                        >
                            <Instagram size={16} /> Instagram
                        </a>
                    )}

                    {links.lattes && (
                        <a
                            href={formatUrl(links.lattes)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider"
                        >
                            <BookOpen size={16} /> Lattes
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthorBio;