import React from "react";
import { Clock, TrendingDown, Target } from "lucide-react";
import { Section, SectionTitle } from "../../components/ui/Section";
import { cn } from "../../lib/utils";

export const Microbiology: React.FC = () => {
  const CARDS = [
    {
      icon: Clock,
      theme: "red",
      title: "O Problema do Tempo",
      description:
        "O fluxo tradicional leva dias ou até semanas entre coleta, transporte e resultado. Se o resultado for positivo, todo o ciclo recomeça, dobrando o seu tempo de espera.",
      footer: (
        <div>
          {/* Timeline Visual */}
          <div className="relative mb-2">
            {/* Linha de Fundo */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 -translate-y-1/2 rounded-full opacity-50"></div>

            {/* Pontos */}
            <div className="relative flex justify-between items-center z-10">
              {/* Ponto Coleta */}
              <div className="flex flex-col items-center gap-2 group/point">
                <div className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] ring-4 ring-[#0e223b]"></div>
              </div>

              {/* Ponto Transporte (Meio - Decorativo) */}
              <div className="w-2 h-2 bg-purple-500 rounded-full ring-4 ring-[#0e223b]"></div>

              {/* Ponto Resultado */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-3 h-3 border-2 border-red-500 bg-[#0e223b] rounded-full ring-4 ring-[#0e223b]"></div>
              </div>
            </div>
          </div>

          {/* Legendas da Timeline */}
          <div className="flex justify-between text-[10px] font-bold tracking-wider text-gray-500 mb-3 font-mono">
            <span>COLETA</span>
            <span className="text-center">TRANSPORTE</span>
            <span>RESULTADO</span>
          </div>

          {/* Badge de Tempo */}
          <div className="inline-flex items-center justify-center w-full py-1.5 px-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold tracking-wide uppercase">
            + 2 DIAS / SEMANAS
          </div>
        </div>
      ),
    },
    {
      icon: TrendingDown,
      theme: "orange",
      title: "Impacto na Indústria",
      description:
        "A demora nos resultados trava a liberação de lotes, atrasa o tratamento de água e efluentes e gera custos operacionais elevados com armazenamento e reprocesso.",
      footer: (
        <div className="mt-auto pt-4">
          {/* Box de Citação */}
          <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/10 text-orange-400 text-sm leading-relaxed relative overflow-hidden">
            <div className="absolute left-0 top-0"></div>
            <p className="font-medium text-xs opacity-90">
              "Lotes retidos geram prejuízos diários de armazenagem e risco de
              perda de validade."
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: Target,
      theme: "green",
      title: "A Necessidade",
      description:
        "O mercado precisa de métodos rápidos, autônomos e que eliminem o erro humano na contagem e identificação de colônias.",
      footer: (
        <div className="mt-auto pt-4">
          {/* Box de Solução */}
          <div className="p-4 rounded-lg bg-auftek-green/5 border border-auftek-green/10 text-auftek-green text-sm leading-relaxed">
            <p className="font-medium text-xs opacity-90">
              Decisões baseadas em dados em tempo real, não em estimativas
              laboratoriais tardias.
            </p>
          </div>
        </div>
      ),
    },
  ];

  // Helper para cores
  const getThemeStyles = (theme: string) => {
    switch (theme) {
      case "red":
        return {
          borderHover: "hover:border-red-400/50",
          iconBg: "bg-red-500/10 group-hover:bg-red-500/20",
          iconColor: "text-red-400",
        };
      case "orange":
        return {
          borderHover: "hover:border-orange-400/50",
          iconBg: "bg-orange-400/10 group-hover:bg-orange-400/20",
          iconColor: "text-orange-400",
        };
      case "green":
        return {
          borderHover: "hover:border-auftek-green/50",
          iconBg: "bg-auftek-green/10 group-hover:bg-auftek-green/20",
          iconColor: "text-auftek-green",
        };
      default:
        return {
          borderHover: "hover:border-gray-500",
          iconBg: "bg-gray-500/10",
          iconColor: "text-gray-400",
        };
    }
  };

  return (
    <Section id="microbiologia" darker>
      <SectionTitle align="center" subtitle="O Contexto">
        O Desafio do Controle Microbiológico
      </SectionTitle>
      <div
        className="
            flex overflow-x-auto gap-4 px-4 pb-10 pt-4 snap-x snap-mandatory items-stretch mt-8
            md:grid md:grid-cols-3 md:gap-8 md:px-0
            [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
        "
      >
        {CARDS.map((card, index) => {
          const styles = getThemeStyles(card.theme);
          const Icon = card.icon;

          return (
            <div
              key={index}
              className="group relative w-[85vw] md:w-auto flex-shrink-0 snap-center h-full"
            >
              <div
                className={cn(
                  "bg-[#0e223b] border border-gray-800 p-6 rounded-xl transition-all duration-300 h-full flex flex-col justify-between",
                  styles.borderHover,
                  "group-hover:-translate-y-2 hover:shadow-xl"
                )}
              >
                {/* Parte Superior do Card */}
                <div>
                  <div
                    className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center mb-6 shrink-0 transition-colors",
                      styles.iconBg
                    )}
                  >
                    <Icon className={styles.iconColor} size={24} />
                  </div>

                  {/* TÍTULO PADRONIZADO */}
                  <h3 className="text-xl font-bold text-white mb-4">
                    {card.title}
                  </h3>

                  {/* DESCRIÇÃO PADRONIZADA */}
                  <p className="text-sm text-gray-400 leading-relaxed mb-6">
                    {card.description}
                  </p>
                </div>

                {/* Footer Customizado (Timeline, Alertas, etc) */}
                {card.footer}
              </div>
            </div>
          );
        })}
      </div>

      <p className="md:hidden text-center text-gray-600 text-xs mt-2 animate-pulse">
        Deslize para ver mais →
      </p>
    </Section>
  );
};