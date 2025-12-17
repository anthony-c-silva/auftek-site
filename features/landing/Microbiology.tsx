import React from "react";
import { Clock, Factory, Leaf } from "lucide-react";
import { Section, SectionTitle } from "../../components/ui/Section";
import { cn } from "../../lib/utils";

export const Microbiology: React.FC = () => {
  // Dados dos cards organizados para evitar repetição de código
  const CARDS = [
    {
      icon: Clock,
      title: "O Problema do Tempo",
      description:
        "Análises microbiológicas tradicionais exigem infraestrutura laboratorial complexa e levam dias para indicar presença, ausência e/ou quantificação de microrganismos.",
      theme: "red",
    },
    {
      icon: Factory,
      title: "Impacto na Indústria",
      description:
        "A demora nos resultados trava a liberação de lotes, atrasa o tratamento de água e efluentes e gera custos operacionais elevados com armazenamento e reprocesso.",
      theme: "orange",
    },
    {
      icon: Leaf,
      title: "A Necessidade",
      description:
        "O mercado precisa de métodos rápidos, autônomos e que eliminem o erro humano na contagem e identificação de colônias.",
      theme: "green",
    },
  ];

  // Helper para cores (Padrão igual ao Solutions)
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

      {/* --- CONTAINER --- */}
      {/* pt-4: Adicionado para evitar que o card seja cortado ao subir.
          mt-12: Mantido para espaçamento do título.
      */}
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
            // Adicionei 'group' e 'relative' aqui
            <div
              key={index}
              className="group relative w-[85vw] md:w-auto flex-shrink-0 snap-center h-full"
            >
              <div
                className={cn(
                  "bg-[#0e223b] border border-gray-800 p-6 rounded-xl transition-all duration-300 h-full flex flex-col",
                  styles.borderHover,
                  // O mesmo efeito de translate e shadow do componente Solutions
                  "group-hover:-translate-y-2 hover:shadow-xl"
                )}
              >
                {/* Ícone */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center mb-6 shrink-0 transition-colors",
                    styles.iconBg
                  )}
                >
                  <Icon className={styles.iconColor} size={24} />
                </div>

                {/* Título */}
                <h3 className="text-xl font-bold text-white mb-4">
                  {card.title}
                </h3>

                {/* Descrição */}
                <p className="text-gray-400 flex-1 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dica visual para mobile */}
      <p className="md:hidden text-center text-gray-600 text-xs mt-2 animate-pulse">
        Deslize para ver mais →
      </p>
    </Section>
  );
};
