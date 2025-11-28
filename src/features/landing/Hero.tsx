import React from 'react';
import { ArrowRight, Zap, Microscope, Wifi, Activity } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { scrollToElement } from '../../hooks/useScroll';

const IMAGES = {
    heroBg: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=2000',
};

export const Hero: React.FC = () => {
    return (
        <div className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-auftek-dark">
            {/* 1. Imagem de Fundo com Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0 opacity-20 transition-transform duration-[20s] hover:scale-105"
                style={{ backgroundImage: `url(${IMAGES.heroBg})` }}
            />
            {/* Gradiente para suavizar a imagem */}
            <div className="absolute inset-0 bg-gradient-to-b from-auftek-dark/90 via-auftek-dark/80 to-auftek-dark z-0"></div>

            {/* 2. Efeito de "Glow" (Brilho) no fundo central */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-auftek-blue/20 rounded-full blur-[120px] animate-[pulse-glow_4s_infinite] pointer-events-none z-0"></div>

            {/* 3. Ícones Flutuantes (Decorativos) */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <Microscope className="absolute top-1/4 left-[10%] text-auftek-green/10 w-24 h-24 animate-float" />
                <Zap className="absolute bottom-1/4 right-[10%] text-yellow-500/10 w-32 h-32 animate-float-slow" />
                <Wifi className="absolute top-1/3 right-[20%] text-auftek-blue/10 w-16 h-16 animate-float-fast" />
                <Activity className="absolute bottom-1/3 left-[15%] text-purple-500/10 w-20 h-20 animate-float" />
            </div>

            {/* Conteúdo Principal */}
            <div className="max-w-7xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
                {/* Badge Animada */}
                <div className="animate-fade-in-up">
                    <span className="inline-block py-1.5 px-4 rounded-full bg-auftek-blue/10 text-white border border-auftek-blue/30 text-xs font-bold tracking-widest mb-8 uppercase backdrop-blur-md shadow-[0_0_15px_rgba(30,144,255,0.3)]">
                        Deeptech Brasileira
                    </span>
                </div>

                {/* Título Principal */}
                <h1 className="animate-fade-in-up delay-100 text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight max-w-5xl tracking-tight drop-shadow-lg">
                    Inovação que transforma <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-auftek-blue to-auftek-green">
                        ciência em soluções reais
                    </span>
                </h1>

                {/* Bloco de Texto Refinado (Novo Layout) */}
                <div className="max-w-4xl space-y-8 mb-12 animate-fade-in-up delay-200">
                    {/* Frase Principal - Limpa e Direta */}
                    <p className="text-xl md:text-3xl text-gray-200 font-light leading-relaxed max-w-3xl mx-auto">
                        Transformamos análises de{' '}
                        <span className="text-white font-semibold border-b-2 border-red-500/30 pb-0.5">
                            dias
                        </span>{' '}
                        em resultados de{' '}
                        <span className="text-auftek-green font-semibold border-b-2 border-auftek-green/30 pb-0.5">
                            poucas horas
                        </span>
                        .
                    </p>

                    {/* Descrição Técnica */}
                    <p className="text-lg text-gray-400 font-light max-w-2xl mx-auto">
                        Instrumentação inovadora com IA e IoT para saneamento,
                        energia e indústria.
                    </p>

                    {/* Lema - Estilo Cápsula */}
                    <div className="flex justify-center mt-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                            <span className="text-sm text-gray-400 italic">
                                Nosso lema:
                            </span>
                            <span className="text-auftek-blue font-medium tracking-wide">
                                It’s time to save time
                            </span>
                        </div>
                    </div>
                </div>

                {/* Botões */}
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center animate-fade-in-up delay-300">
                    <Button
                        onClick={() => scrollToElement('#bioailab')}
                        className="group relative overflow-hidden"
                    >
                        {/* Efeito de brilho ao passar o mouse */}
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <span className="relative flex items-center gap-2">
                            Conheça o BioAiLab
                            <ArrowRight
                                className="group-hover:translate-x-1 transition-transform"
                                size={20}
                            />
                        </span>
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => scrollToElement('#energia')}
                        className="group hover:border-yellow-400/50 hover:bg-yellow-400/5"
                    >
                        <Zap
                            size={20}
                            className="text-yellow-400 group-hover:scale-110 transition-transform"
                        />
                        Soluções em Energia
                    </Button>
                </div>
            </div>
        </div>
    );
};
