"use client";
import React from 'react';
import { Author } from '@/types/blog';
import { Linkedin, BookOpen } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';

const AuthorBio: React.FC<{ author: Author }> = ({ author }) => {
    if (!author) return null;

    return (
        <div className="bg-slate-50 rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left border border-slate-100">
            <div className="flex-shrink-0">
                <Avatar
                    // CORREÇÃO: Usar photoUrl padronizado
                    src={author.photoUrl}
                    alt={author.name}
                    size={80} // Tamanho maior para a Bio
                    className="w-20 h-20 border-4 border-white shadow-sm"
                />
            </div>

            <div className="flex-1 space-y-3">
                <div>
                    <h3 className="text-xl font-bold text-slate-900">{author.name}</h3>
                    <p className="text-auftek-blue font-medium text-sm">{author.education}</p>
                </div>

                {author.bio && (
                    <p className="text-slate-600 leading-relaxed text-sm">
                        {author.bio}
                    </p>
                )}

                <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                    {author.linkedin && (
                        <a
                            href={author.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0a66c2] transition-colors uppercase tracking-wider"
                        >
                            <Linkedin size={16} /> LinkedIn
                        </a>
                    )}
                    {author.lattes && (
                        <a
                            href={author.lattes}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider"
                        >
                            <BookOpen size={16} /> Currículo Lattes
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthorBio;