import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Imports
import PostDetail from '../../components/blog/PostDetail';
import Newsletter from '../../components/blog/Newsletter';
import { BLOG_POSTS } from '../../data/mock-blog';

export const BlogPostPage: React.FC = () => {
    const { id } = useParams(); // Pega o ID da URL (ex: /blog/1)
    const navigate = useNavigate();

    // Busca o post correto nos dados falsos
    const post = BLOG_POSTS.find(p => p.id === id);

    // Scroll para o topo ao carregar a página
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Artigo não encontrado</h1>
                <p className="text-gray-600 mb-8">O conteúdo que você procura pode ter sido removido ou não existe.</p>
                <button
                    onClick={() => navigate('/blog')}
                    className="bg-auftek-blue text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
                >
                    Voltar para o Blog
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white animate-fade-in">
            {/* O PostDetail já inclui o SEO específico do artigo */}
            <PostDetail
                post={post}
                onBack={() => navigate('/blog')}
            />
            <Newsletter />
        </div>
    );
};