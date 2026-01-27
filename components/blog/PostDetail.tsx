import React from 'react';
import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import { ArrowLeft, Calendar, Tag, PenTool } from 'lucide-react';
import AuthorBio from './AuthorBio';
import { PostCover } from './PostCover';
import { PostShare } from './PostShare';
import { RelatedPosts } from '@/components/blog/RelatedPosts';

interface PostDetailProps {
    post: BlogPost;
}

const PostDetail: React.FC<PostDetailProps> = ({ post }) => {

    return (
        <article className="min-h-screen bg-white">

            {/* HEADER (CAPA) */}
            <div className="w-full h-64 sm:h-96 relative bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <PostCover title={post.title} imageUrl={post.imageUrl} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent z-0"></div>

                {/* Botão Voltar */}
                <div className="absolute top-6 left-4 sm:left-8 z-20">
                    <Link
                        href="/blog"
                        className="flex items-center gap-2 text-white/90 hover:text-white bg-black/20 hover:bg-black/40 backdrop-blur-md px-4 py-2 rounded-full transition-all text-sm font-medium"
                    >
                        <ArrowLeft size={18} /> Voltar
                    </Link>
                </div>

                {/* --- CONTEÚDO DO CABEÇALHO --- */}
                <div className="absolute bottom-0 left-0 w-full z-10 px-4 sm:px-6 lg:px-8 pb-8 lg:pb-12">

                    {/* Container com mesma estrutura do corpo da página */}
                    <div className="flex flex-col xl:flex-row justify-center items-start xl:items-end gap-12 lg:gap-16">

                        {/* 1. FANTASMA DA ESQUERDA (320px) */}
                        <div className="hidden xl:block w-[320px] shrink-0"></div>

                        {/* 2. CONTEÚDO CENTRAL (Título) - mesma largura do texto abaixo */}
                        <div className="w-full max-w-3xl min-w-0">
                            <span className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                                {post.category === 'case_study' ? 'Estudo de Caso' : 'Geral'}
                            </span>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-md">
                                {post.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-6 text-slate-300 text-sm font-medium">
                                {post.writer && post.writer.name && (
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <div className="bg-white/10 p-1 rounded-full">
                                            <PenTool size={12} className="text-white" />
                                        </div>
                                        <span className="text-xs uppercase tracking-wide">
                                            Redação: <strong className="text-slate-300 normal-case">{post.writer.name}</strong>
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Calendar size={16} />
                                    <time>{post.date}</time>
                                </div>
                            </div>
                        </div>

                        {/* 3. ESPAÇO DA DIREITA (320px) */}
                        <div className="hidden xl:block w-[320px] shrink-0"></div>
                    </div>
                </div>
            </div>

            {/* --- CORPO DA PÁGINA --- */}
            <div className="px-4 sm:px-6 lg:px-8 py-12">

                {/* ESTRUTURA DE 3 COLUNAS BALANCEADAS */}
                <div className="flex flex-col xl:flex-row justify-center items-start gap-12 lg:gap-16">

                    {/* 1. FANTASMA DA ESQUERDA (Mesma largura da Sidebar) */}
                    <div className="hidden xl:block w-[320px] shrink-0"></div>

                    {/* 2. CONTEÚDO PRINCIPAL (Fica isolado no centro) */}
                    <div className="w-full max-w-3xl min-w-0">

                        {post.excerpt && (
                            <div className="mb-10 text-xl text-slate-600 font-medium leading-relaxed border-l-4 border-blue-600 pl-6 italic">
                                {post.excerpt}
                            </div>
                        )}

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

                        {/* Rodapé do Post */}
                        <div className="mt-12 pt-8 border-t border-slate-100">
                            <div className="flex flex-wrap gap-2 mb-8">
                                {post.tags && post.tags.map(tag => (
                                    <span key={tag} className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-sm hover:bg-slate-200 transition-colors cursor-default">
                                        <Tag size={14} /> {tag}
                                    </span>
                                ))}
                            </div>
                            <PostShare title={post.title} excerpt={post.excerpt} />
                        </div>

                        <div className="mt-12">
                            <AuthorBio author={post.author} />
                        </div>
                    </div>

                    {/* 3. SIDEBAR REAL (Lateral Direita) */}
                    <aside className="w-full xl:w-[320px] shrink-0 xl:sticky xl:top-24 space-y-8">
                        <div className="block xl:hidden w-full h-px bg-slate-200 my-8"></div>

                        <RelatedPosts
                            currentId={post.id || post._id?.toString() || undefined}
                            tags={post.tags}
                        />
                    </aside>

                </div>
            </div>
        </article>
    );
};

export default PostDetail;