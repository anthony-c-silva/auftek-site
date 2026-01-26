"use client"; 

import React from 'react';
import { Mail, Send } from 'lucide-react';

const Newsletter: React.FC = () => {
  return (
    <section className="bg-slate-900 py-16 sm:py-24 relative overflow-hidden">
       {/* Decorative circles */}
       <div className="absolute top-0 right-0 -mr-24 -mt-24 w-64 h-64 rounded-full bg-auftek-500 opacity-10 blur-3xl"></div>
       <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-64 h-64 rounded-full bg-emerald-500 opacity-10 blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 bg-auftek-500/10 rounded-full mb-6 text-auftek-400">
            <Mail size={24} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-4">
            Deseja receber atualizações técnicas?
          </h2>
          <p className="text-slate-300 text-lg mb-8">
            Assine nossa newsletter para acompanhar novos artigos, estudos e lançamentos.
          </p>

          {/* O onSubmit aqui requer que o componente seja "use client" */}
          <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Seu melhor e-mail corporativo"
              className="flex-1 min-w-0 rounded-lg border-0 bg-white/10 px-4 py-3 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-auftek-500 sm:text-sm sm:leading-6"
              required
            />
            <button
              type="submit"
              className="flex-none rounded-lg bg-auftek-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-auftek-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-auftek-600 flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              Quero receber novidades <Send size={16} />
            </button>
          </form>
          <p className="mt-4 text-xs text-slate-500">
            Respeitamos sua privacidade. Cancele a inscrição a qualquer momento.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;