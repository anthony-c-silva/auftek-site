"use client";
import React from 'react';
import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import { Calendar, ArrowRight, Clock } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';

// 1. Atualização da Interface para aceitar as props extras que a página envia
interface PostCardProps {
  post: BlogPost;
  featured?: boolean;      // <--- Adicionado
  onClick?: () => void;    // <--- Adicionado
  className?: string;      // <--- Adicionado
}

const PostCard: React.FC<PostCardProps> = ({ post, featured, onClick, className = "" }) => {
  return (
      <article
          // 2. Se onClick for passado, aplicamos ao article para torná-lo clicável
          onClick={onClick}
          className={`
                flex flex-col bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100 overflow-hidden h-full group
                ${onClick ? 'cursor-pointer' : ''} 
                ${className}
            `}
      >

        {/* Imagem de Capa */}
        <Link href={`/blog/${post.slug}`} className="relative h-48 w-full overflow-hidden block" onClick={(e) => e.stopPropagation()}>
          {post.imageUrl ? (
              <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
          ) : (
              // Gradiente de fallback
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/20 select-none">
                            Auftek Blog
                        </span>
              </div>
          )}

          {/* Badge de Categoria */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-auftek-blue uppercase tracking-wider shadow-sm">
            {post.category}
          </div>
        </Link>

        {/* Conteúdo */}
        <div className="flex-1 p-6 flex flex-col">
          <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <time>{post.date}</time>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>5 min</span>
            </div>
          </div>

          <Link href={`/blog/${post.slug}`} className="group-hover:text-auftek-blue transition-colors" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2">
              {post.title}
            </h3>
          </Link>

          <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-1">
            {post.excerpt}
          </p>

          {/* Rodapé do Card */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar
                  src={post.author.photoUrl}
                  alt={post.author.name}
                  size={24}
                  className="w-6 h-6 border border-slate-200"
              />
              <span className="text-sm font-medium text-slate-700 truncate max-w-[120px]">
                            {post.author.name}
                        </span>
            </div>

            <Link
                href={`/blog/${post.slug}`}
                className="flex items-center gap-1 text-sm font-bold text-auftek-blue hover:text-auftek-700 transition-colors"
                onClick={(e) => e.stopPropagation()}
            >
              Ler mais <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </article>
  );
};

export default PostCard;