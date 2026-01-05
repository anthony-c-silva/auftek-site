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
        "O fluxo atual é ineficiente: da coleta ao transporte e incubação, perde-se dias ou semanas. Se o resultado for positivo, o ciclo reinicia: tratamento da água e novo teste, dobrando o tempo de espera.",
      footer: (
        <div className="mt-auto border-t border-white/5">

          {/* Timeline de Barras Sólidas (Tamanhos Iguais) */}
          <div className="flex w-full gap-1 h-2.5 mb-2">
            {/* Barra 1 */}
            <div className="flex-1 bg-blue-500/40 border border-blue-500/20 rounded-l-sm"></div>
            {/* Barra 2 */}
            <div className="flex-1 bg-purple-500/40 border border-purple-500/20"></div>
            {/* Barra 3 (Pulsante para destaque) */}
            <div className="flex-1 bg-red-500/60 border border-red-500/30 rounded-r-sm animate-pulse"></div>
          </div>

          {/* Descrições das Etapas (Alinhadas com as barras) */}
          <div className="flex w-full gap-1 mb-5">
            <div className="flex-1 text-center">
              <span className="block text-[10px] font-bold text-blue-400">
                COLETA
              </span>
            </div>
            <div className="flex-1 text-center">
              <span className="block text-[10px] font-bold text-purple-400">
                TRANSPORTE
              </span>
             
            </div>
            <div className="flex-1 text-center">
              <span className="block text-[10px] font-bold text-red-400">
                ANÁLISE
              </span>
            </div>
          </div>

          {/* Alerta de Tempo Total */}
          <div className="flex items-center justify-between bg-red-950/30 border border-red-500/20 rounded px-3 py-2">
            <span className="text-xs text-gray-300 font-medium">
              Ciclo Total:
            </span>
            <span className="text-sm font-bold text-red-400">
              De 2 dias a 2 Semanas
            </span>
          </div>
        </div>
      ),
    },
    {
      icon: TrendingDown,
      theme: "orange",
      title: "Impacto na Indústria",
      description:
        "A demora nos laudos gera impacto financeiro direto. O atraso bloqueia a liberação de lotes e posterga o tratamento de água e efluentes. Isso eleva os custos operacionais, aumentando as despesas com armazenamento e exigindo maior consumo de energia e insumos para reprocesso.",
      footer: (
        <div className="mt-auto pt-4">
          {/* Box de Citação (LARANJA - Ajustado) */}
          <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/10 text-orange-400 text-sm leading-relaxed relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1"></div>
            <p className="font-medium text-xs md:text-sm opacity-90">
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
        "O mercado busca substituir a análise visual por métodos autônomos. A automação na contagem e identificação de colônias é necessária para garantir a integridade dos resultados, eliminando variações causadas pelo fator humano e acelerando a liberação técnica.",
      footer: (
        <div className="mt-auto pt-4">
          {/* Box de Solução (VERDE - Ajustado) */}
          <div className="p-4 rounded-lg bg-auftek-green/5 border border-auftek-green/10 text-auftek-green text-sm leading-relaxed">
            <p className="font-medium text-xs md:text-sm opacity-90">
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

                  <h3 className="text-xl font-bold text-white mb-4">
                    {card.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed mb-6">
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
