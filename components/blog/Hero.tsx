import React from 'react';

const Hero: React.FC = () => {
    return (
        // AJUSTE DE CENTRALIZAÇÃO VISUAL:
        // 1. 'min-h-[600px]': Aumentei um pouco a altura mínima para dar respiro.
        // 2. 'pt-40 pb-20': O padding superior (160px) é o dobro do inferior (80px).
        //    Isso "empurra" o conteúdo para baixo, compensando o Header transparente.
        <div className="relative bg-slate-900 min-h-[600px] flex flex-col items-center justify-center overflow-hidden pt-40 pb-20 px-4 sm:px-6 lg:px-8">

            {/* Abstract Background pattern */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative max-w-4xl mx-auto text-center z-10">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
                    Conteúdos técnicos sobre <br className="hidden sm:block" />
                    {/* Mantendo o ajuste de cor vibrante que fizemos antes */}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            microbiologia, energia e sistemas inteligentes
          </span>
                </h1>
                <p className="mt-6 text-lg sm:text-xl leading-8 text-slate-300 max-w-2xl mx-auto">
                    Análises, estudos e insights desenvolvidos pela equipe da Auftek e parceiros de pesquisa.
                </p>
            </div>
        </div>
    );
};

export default Hero;