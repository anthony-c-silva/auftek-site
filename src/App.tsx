import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layout Global
// Se você moveu o Header para src/layout, ajuste o import abaixo para '../layout/Header'
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

// Páginas
import { Home } from './pages/Home';
import { BlogPage } from './features/blog/BlogPage'; // As páginas do Blog que criamos antes
import { BlogPostPage } from './features/blog/BlogPostPage';

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-auftek-dark text-slate-200 font-sans selection:bg-auftek-blue selection:text-white">

                {/* Header Fixo em todas as páginas */}
                <Header />

                {/* Área de conteúdo dinâmico */}
                <Routes>
                    {/* Rota raiz carrega a Home completa */}
                    <Route path="/" element={<Home />} />

                    {/* Rotas do Blog */}
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/blog/:id" element={<BlogPostPage />} />
                </Routes>

                {/* Footer Fixo em todas as páginas */}
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;