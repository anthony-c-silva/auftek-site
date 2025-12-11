import React, { useEffect } from 'react';
import { BlogPost } from '../../types/blog';
import { ArrowLeft, Calendar, Clock, Tag, Share2, Linkedin, Twitter, Facebook } from 'lucide-react';
import AuthorBio from './AuthorBio';

interface PostDetailProps {
    post: BlogPost;
    onBack: () => void;
}

const PostDetail: React.FC<PostDetailProps> = ({ post, onBack }) => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [post.id]);

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    const handleShare = (platform: 'linkedin' | 'twitter' | 'facebook') => {
        const encodedUrl = encodeURIComponent(shareUrl);
        const encodedTitle = encodeURIComponent(post.title);
        let url = '';

        switch (platform) {
            case 'linkedin':
                url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
                break;
            case 'twitter':
                url = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
                break;
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                break;
        }
        window.open(url, '_blank', 'noopener,noreferrer,width=600,height=600');
    };

    const handleNativeShare = () => {
        if (navigator.share) {
            navigator.share({
                title: post.title,
                text: post.excerpt,
                url: shareUrl
            }).catch((error) => console.log('Error sharing', error));
        } else {
            navigator.clipboard.writeText(shareUrl);
            alert('Link copiado!');
        }
    };

    return (
        <article className="min-h-screen bg-white">

            {/* Header Image */}
            <div className="w-full h-64 sm:h-96 relative bg-slate-900">
                <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>

                <div className="absolute top-6 left-4 sm:left-8 z-20">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-white/90 hover:text-white bg-black/20 hover:bg-black/40 backdrop-blur-md px-4 py-2 rounded-full transition-all text-sm font-medium"
                    >
                        <ArrowLeft size={18} /> Voltar para o feed
                    </button>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-4 sm:p-8 lg:p-12 z-10 max-w-5xl mx-auto">
            <span className="inline-block bg-auftek-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
              {post.category}
            </span>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-slate-300 text-sm font-medium">
                        <div className="flex items-center gap-2">
                            <img src={post.author.avatarUrl} className="w-8 h-8 rounded-full border border-white/20 object-cover" alt={post.author.name} />
                            <span>{post.author.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} /> <time>{post.date}</time>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* CORREÇÃO DO TEXTO AQUI */}
                {/* Adicionamos 'break-words' para quebrar palavras longas e 'whitespace-pre-wrap' para respeitar espaços */}
                <div className="prose prose-slate prose-lg max-w-none">
                    <p className="text-xl text-slate-600 font-medium leading-relaxed mb-10 border-l-4 border-auftek-500 pl-6 italic break-words">
                        {post.excerpt}
                    </p>

                    {post.content.map((paragraph, idx) => (
                        <p
                            key={idx}
                            className="mb-6 text-slate-700 leading-8 text-justify break-words whitespace-pre-wrap"
                        >
                            {paragraph}
                        </p>
                    ))}
                </div>

                {/* Tags */}
                <div className="mt-12 pt-8 border-t border-slate-100">
                    <div className="flex flex-wrap gap-2 mb-8">
                        {post.tags.map(tag => (
                            <span key={tag} className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-sm hover:bg-slate-200 transition-colors cursor-default">
                  <Tag size={14} /> {tag}
                </span>
                        ))}
                    </div>

                    <div className="flex justify-between items-center py-6 border-y border-slate-100">
                        <span className="text-slate-500 text-sm font-medium">Compartilhe este artigo:</span>
                        <div className="flex gap-4">
                            <button onClick={() => handleShare('linkedin')} className="text-slate-400 hover:text-[#0a66c2] transition-colors p-2"><Linkedin size={20} /></button>
                            <button onClick={() => handleShare('twitter')} className="text-slate-400 hover:text-[#1d9bf0] transition-colors p-2"><Twitter size={20} /></button>
                            <button onClick={() => handleShare('facebook')} className="text-slate-400 hover:text-[#1877f2] transition-colors p-2"><Facebook size={20} /></button>
                            <button onClick={handleNativeShare} className="text-slate-400 hover:text-auftek-600 transition-colors p-2 border-l border-slate-200 ml-2 pl-4"><Share2 size={20} /></button>
                        </div>
                    </div>
                </div>

                <AuthorBio author={post.author} />

            </div>
        </article>
    );
};

export default PostDetail;