import React from 'react';
import { BlogPost } from '../../types/blog';
import { ArrowRight, Calendar, Clock, Share2 } from 'lucide-react';

interface PostCardProps {
  post: BlogPost;
  featured?: boolean;
  onClick: (post: BlogPost) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, featured = false, onClick }) => {

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/blog/${post.slug}` : '';

    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: shareUrl,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copiado para a área de transferência!');
    }
  };

  return (
      <div
          className={`group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 hover:border-auftek-200 transition-all duration-300 cursor-pointer ${featured ? 'md:grid md:grid-cols-2 md:items-center' : ''}`}
          onClick={() => onClick(post)}
      >
        <div className={`relative overflow-hidden ${featured ? 'h-full min-h-[300px]' : 'h-56'}`}>
          <img
              src={post.imageUrl || '/images/BioAiLabIllustration.png'} // Fallback caso a imagem quebre
              alt={post.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                // Garante que se a imagem falhar, mostra um placeholder
                (e.target as HTMLImageElement).src = '/images/BioAiLabIllustration.png';
              }}
          />
          <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-slate-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wide">
            {post.category}
          </span>
          </div>
        </div>

        <div className="p-6 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
              <div className="flex items-center gap-1"><Calendar size={14} /> {post.date}</div>
              <div className="flex items-center gap-1"><Clock size={14} /> {post.readTime}</div>
            </div>

            {/* Título com quebra de palavra se necessário */}
            <h3 className={`font-bold text-slate-900 group-hover:text-auftek-600 transition-colors mb-3 break-words ${featured ? 'text-2xl' : 'text-xl'}`}>
              {post.title}
            </h3>

            {/* --- CORREÇÃO AQUI: Adicionado 'break-words' --- */}
            <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3 break-words">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.slice(0, 3).map((tag) => (
                  <span
                      key={tag}
                      className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md hover:bg-slate-200 hover:text-auftek-600 transition-colors cursor-default"
                  >
                #{tag}
              </span>
              ))}
              {post.tags.length > 3 && (
                  <span className="text-xs text-slate-400 py-1">+{post.tags.length - 3}</span>
              )}
            </div>
          </div>

          <div className="mt-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img
                  src={post.author.avatarUrl}
                  alt={post.author.name}
                  className="w-6 h-6 rounded-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/images/default-avatar.png'; }}
              />
              <span className="text-xs text-slate-500 font-medium">{post.author.name}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                  onClick={handleShare}
                  className="p-2 text-slate-400 hover:text-auftek-600 hover:bg-auftek-50 rounded-full transition-all"
                  title="Compartilhar"
              >
                <Share2 size={18} />
              </button>

              <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick(post);
                  }}
                  className="inline-flex items-center text-sm font-semibold text-auftek-600 hover:text-auftek-700 transition-colors"
              >
                Ler mais <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default PostCard;