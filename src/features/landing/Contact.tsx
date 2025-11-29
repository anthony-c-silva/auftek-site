import React from "react";
import { Button } from "../../components/ui/Button";
import { ScrollReveal } from "../../components/ui/ScrollReveal";

export const Contact: React.FC = () => {
  return (
    // ALTERAÇÕES PRINCIPAIS:
    // 1. 'relative z-20': Garante que fique acima de tudo (Hero e seções anteriores).
    // 2. 'bg-auftek-dark': Fundo escuro para consistência (em vez do azul claro).
    // 3. 'rounded-t-[3rem]': Borda curva futurista.
    // 4. 'border-t border-white/10': Detalhe de vidro no topo.
    <section
      id="contato"
      className="relative z-20 bg-auftek-dark text-white text-center px-6 py-24 rounded-t-[3rem] -mt-10 border-t border-white/10 shadow-[0_-20px_60px_-15px_rgba(30,144,255,0.15)] overflow-hidden"
    >
      {/* Background Decorativo (Luzes e Ruído) */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>

      {/* Glow Azul no topo para destacar a curva */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-auftek-blue/20 rounded-full blur-[100px] pointer-events-none -translate-y-1/2"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <ScrollReveal>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Pronto para economizar tempo?
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-light">
            Descubra como a Auftek pode otimizar seu laboratório ou sua planta
            de energia hoje mesmo.
          </p>
        </ScrollReveal>

        <ScrollReveal delay="200">
          <div className="bg-white/5 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl max-w-lg mx-auto relative overflow-hidden group">
            {/* Brilho interno ao passar o mouse */}
            <div className="absolute inset-0 bg-gradient-to-br from-auftek-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <form
              className="space-y-5 relative z-10"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="space-y-1 text-left">
                <label className="text-xs text-gray-400 ml-1 uppercase tracking-wide font-bold">
                  Nome
                </label>
                <input
                  type="text"
                  placeholder="Seu Nome"
                  className="w-full px-4 py-3.5 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-auftek-blue/50 focus:bg-black/40 transition-all"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-xs text-gray-400 ml-1 uppercase tracking-wide font-bold">
                  Email Corporativo
                </label>
                <input
                  type="email"
                  placeholder="seu@empresa.com"
                  className="w-full px-4 py-3.5 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-auftek-blue/50 focus:bg-black/40 transition-all"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-xs text-gray-400 ml-1 uppercase tracking-wide font-bold">
                  Mensagem
                </label>
                <textarea
                  placeholder="Como podemos ajudar?"
                  rows={4}
                  className="w-full px-4 py-3.5 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-auftek-blue/50 focus:bg-black/40 transition-all resize-none"
                ></textarea>
              </div>

              <Button
                variant="primary"
                className="w-full py-4 text-lg mt-4 shadow-lg shadow-auftek-blue/25 hover:shadow-auftek-blue/40"
              >
                Solicitar Contato
              </Button>
            </form>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
