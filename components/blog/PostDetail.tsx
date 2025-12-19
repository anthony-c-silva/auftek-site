import React from 'react';
import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import { ArrowLeft, Calendar, Tag, PenTool } from 'lucide-react';
import AuthorBio from './AuthorBio';
import { PostCover } from './PostCover';
import { PostShare } from './PostShare';

interface PostDetailProps {
    post: BlogPost;
}

const PostDetail: React.FC<PostDetailProps> = ({ post }) => {
    // REMOVIDO: A lógica antiga de dividir por \n não serve mais para HTML
    // const contentArray = ...

    return (
        <article className="min-h-screen bg-white">

            {/* HEADER (CAPA) */}
            <div className="w-full h-64 sm:h-96 relative bg-slate-900 overflow-hidden">

                {/* 1. Imagem de Fundo */}
                <div className="absolute inset-0 z-0">
                    <PostCover title={post.title} imageUrl={post.imageUrl} />
                </div>

                {/* Overlay Suave */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent z-0"></div>

                {/* 2. Botão Voltar */}
                <div className="absolute top-6 left-4 sm:left-8 z-20">
                    <Link
                        href="/blog"
                        className="flex items-center gap-2 text-white/90 hover:text-white bg-black/20 hover:bg-black/40 backdrop-blur-md px-4 py-2 rounded-full transition-all text-sm font-medium"
                    >
                        <ArrowLeft size={18} /> Voltar
                    </Link>
                </div>

                {/* 3. Título e Metadados */}
                <div className="absolute bottom-0 left-0 w-full p-4 sm:p-8 lg:p-12 z-10 max-w-5xl mx-auto">
                    <span className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                      {post.category}
                    </span>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-md">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-slate-300 text-sm font-medium">
                        {/* REDATOR */}
                        {post.writer && post.writer.name && (
                            <div className="flex items-center gap-2 text-slate-400" title="Redação e Edição">
                                <div className="bg-white/10 p-1 rounded-full">
                                    <PenTool size={12} className="text-white" />
                                </div>
                                <span className="text-xs uppercase tracking-wide">
                                    Redação: <strong className="text-slate-300 normal-case">{post.writer.name}</strong>
                                </span>
                            </div>
                        )}

                        {/* DATA */}
                        <div className="flex items-center gap-2 text-slate-400">
                            <Calendar size={16} />
                            <time>{post.date}</time>
                        </div>
                    </div>
                </div>
            </div>

            {/* CORPO DO TEXTO */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Excerpt (Resumo) em destaque */}
                {post.excerpt && (
                    <div className="mb-10 text-xl text-slate-600 font-medium leading-relaxed border-l-4 border-blue-600 pl-6 italic">
                        {post.excerpt}
                    </div>
                )}

                {/* AQUI ESTÁ A MÁGICA:
                   1. dangerouslySetInnerHTML: Renderiza o HTML do TipTap
                   2. prose: Aplica estilos bonitos em tags p, h1, img, ul, etc.
                */}
                <div
                    className="
                        prose prose-slate prose-lg max-w-none
                        prose-headings:font-bold prose-headings:text-slate-900
                        prose-p:text-slate-700 prose-p:leading-relaxed prose-p:text-justify
                        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                        prose-img:rounded-xl prose-img:shadow-md prose-img:my-8 prose-img:w-full
                        prose-li:marker:text-blue-500
                    "
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* RODAPÉ */}
                <div className="mt-12 pt-8 border-t border-slate-100">
                    <div className="flex flex-wrap gap-2 mb-8">
                        {post.tags && post.tags.map(tag => (
                            <span key={tag} className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-sm hover:bg-slate-200 transition-colors cursor-default">
                                <Tag size={14} /> {tag}
                            </span>
                        ))}
                    </div>

                    {/* Compartilhamento */}
                    <PostShare title={post.title} excerpt={post.excerpt} />
                </div>

                {/* BIO DO AUTOR */}
                <AuthorBio author={post.author} />
            </div>
        </article>
    );
};

export default PostDetail;