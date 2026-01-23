"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SOLUTIONS } from "../../data/constants";
import { Section, SectionTitle } from "../../components/ui/Section";
import { cn } from "../../lib/utils";
// 1. Importando a função de scroll
import { scrollToElement } from "../../hooks/useScroll";

export const Solutions: React.FC = () => {
  const getThemeStyles = (theme: string) => {
    switch (theme) {
      case "green":
        return {
          borderHover: "hover:border-auftek-green/50",
          iconBg: "bg-auftek-green/10 group-hover:bg-auftek-green/20",
          iconColor: "text-auftek-green",
          // Estilo Tinted (Fundo sutil + Texto colorido)
          buttonStyle: "bg-auftek-green/10 text-auftek-green hover:bg-auftek-green/20",
        };
      case "yellow":
        return {
          borderHover: "hover:border-yellow-400/50",
          iconBg: "bg-yellow-500/10 group-hover:bg-yellow-500/20",
          iconColor: "text-yellow-400",
          buttonStyle: "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20",
        };
      default: // blue
        return {
          borderHover: "hover:border-auftek-blue/50",
          iconBg: "bg-auftek-blue/10 group-hover:bg-auftek-blue/20",
          iconColor: "text-auftek-blue",
          buttonStyle: "bg-auftek-blue/10 text-auftek-blue hover:bg-auftek-blue/20",
        };
    }
  };

  // 2. Função para interceptar o clique e usar o scroll customizado
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault(); // Impede o pulo seco do navegador
      scrollToElement(href, 80); // Rola suavemente com margem de 80px (tamanho do header)
    }
  };

  return (
    <Section id="solucoes">
      <SectionTitle align="center" subtitle="O que fazemos">
        Nossas Soluções Laboratoriais
      </SectionTitle>

      <div
        className="
          flex overflow-x-auto gap-4 px-4 pb-10 pt-4 snap-x snap-mandatory items-stretch
          md:grid md:grid-cols-3 md:gap-6 md:px-0
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
        "
      >
        {SOLUTIONS.map((sol, index) => {
          const styles = getThemeStyles(sol.theme || "blue");
          const Icon = sol.icon;

          return (
            <div
              key={index}
              className="group block w-[85vw] md:w-auto flex-shrink-0 snap-center h-full relative"
            >
              <div
                className={cn(
                  "bg-white/5 border border-white/10 p-6 rounded-xl transition-all duration-300 h-full flex flex-col",
                  styles.borderHover,
                  "group-hover:-translate-y-2 hover:shadow-xl"
                )}
              >
                {/* Ícone */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors shrink-0",
                    styles.iconBg
                  )}
                >
                  <Icon className={styles.iconColor} size={24} />
                </div>

                {/* Título */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {sol.title}
                </h3>

                {/* Descrição */}
                <p className="text-gray-400 text-sm flex-1 leading-relaxed">
                  {sol.description}
                </p>

                {/* Botão Saiba Mais */}
                <Link
                  href={sol.href}
                  // 3. Adicionamos o evento onClick aqui
                  onClick={(e) => handleLinkClick(e, sol.href)}
                  className={cn(
                    "mt-6 w-full py-3 rounded-lg flex items-center justify-center gap-2 font-semibold transition-all duration-300",
                    styles.buttonStyle,
                    "hover:scale-[1.02] active:scale-95"
                  )}
                >
                  Saiba Mais
                  <ArrowRight size={18} />
                </Link>
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