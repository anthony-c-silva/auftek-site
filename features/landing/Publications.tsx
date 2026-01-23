"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sprout, Waves, Gauge, Rocket, Drumstick } from "lucide-react";

import { Section, SectionTitle } from "../../components/ui/Section";
import { cn } from "../../lib/utils";
import { scrollToElement } from "../../hooks/useScroll";

const MILK_ICON_PATH = "/images/milk.svg";

export const Publications: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";

  const handleNavigation = (target?: string) => {
    if (!target) return;

    if (target.startsWith("#")) {
      if (isHomePage) {
        scrollToElement(target, 80);
      } else {
        router.push(`/${target}`);
        setTimeout(() => {
          const element = document.getElementById(target.replace("#", ""));
          element?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
      return;
    }

    if (target.startsWith("http")) {
      window.open(target, "_blank");
      return;
    }

    router.push(target);
  };

  // --- DADOS DAS APLICAÇÕES ---
  const APPS = [
    {
      category: "INDÚSTRIA ALIMENTÍCIA",
      title: "Salmonella",
      description:
        "Detecção rápida de baixo custo, inclusive de bactérias injuriadas, diretamente no chão de fábrica.",
      icon: Drumstick,
      theme: "red",
    },
    {
      category: "SANEAMENTO (ETE E ETA)",
      title: "E. coli e Coliformes",
      description:
        "Monitoramento rápido de indicadores fecais, incluindo bactérias termotolerantes, para controle eficiente da qualidade da água.",
      icon: Waves,
      theme: "cyan",
    },
    {
      category: "AGRO & BIOINSUMOS",
      title: "Monitoramento On-Farm",
      description:
        "Valide a viabilidade dos bioinsumos no campo e aplique no momento exato. Maximizando a colheita.",
      icon: Sprout,
      theme: "green",
    },
    {
      category: "PROCESSOS INDUSTRIAIS",
      title: "Controle de Processos",
      description:
        "Reduz desperdícios e aumenta a produtividade ao identificar rapidamente desvios microbiológicos e físico-químicos.",
      icon: Gauge,
      theme: "orange",
    },
    {
      category: "QUALIDADE DO LEITE",
      title: "CBT Digital",
      description:
        "Resultados a partir de 3 horas diretamente na fazenda. Automatize a Contagem Bacteriana Total (CBT) para rastreabilidade e valorização do leite.",
      icon: null,
      customIcon: MILK_ICON_PATH,
      theme: "white",
    },
    {
      category: "P&D SOB MEDIDA",
      title: "Sua dor é única?",
      description:
        "Adaptamos o BioAiLab para resolver o seu desafio microbiológico específico.",
      icon: Rocket,
      theme: "primary",
      action: "Falar com um Especialista →",
      href: "#contato",
    },
  ];

  const getThemeStyles = (theme: string) => {
    switch (theme) {
      case "red":
        return {
          borderHover: "hover:border-red-500/50",
          iconBg: "bg-red-500/10 group-hover:bg-red-500/20",
          iconColor: "text-red-400",
          categoryColor: "text-red-400",
        };
      case "cyan":
        return {
          borderHover: "hover:border-cyan-400/50",
          iconBg: "bg-cyan-400/10 group-hover:bg-cyan-400/20",
          iconColor: "text-cyan-400",
          categoryColor: "text-cyan-400",
        };
      case "green":
        return {
          borderHover: "hover:border-auftek-green/50",
          iconBg: "bg-auftek-green/10 group-hover:bg-auftek-green/20",
          iconColor: "text-auftek-green",
          categoryColor: "text-auftek-green",
        };
      case "orange":
        return {
          borderHover: "hover:border-orange-400/50",
          iconBg: "bg-orange-400/10 group-hover:bg-orange-400/20",
          iconColor: "text-orange-400",
          categoryColor: "text-orange-400",
        };
      case "white":
        return {
          borderHover: "hover:border-white/50",
          iconBg: "bg-white/10 group-hover:bg-white/20",
          iconColor: "text-gray-200",
          categoryColor: "text-gray-300",
        };
      case "primary":
        return {
          borderHover: "hover:border-auftek-blue",
          iconBg: "bg-auftek-blue/10 group-hover:bg-auftek-blue/20",
          iconColor: "text-auftek-blue",
          categoryColor: "text-auftek-blue font-bold",
        };
      default:
        return {
          borderHover: "hover:border-gray-500",
          iconBg: "bg-gray-800",
          iconColor: "text-gray-400",
          categoryColor: "text-gray-500",
        };
    }
  };

  return (
    <Section id="publicacoes" darker>
      <SectionTitle
        align="center"
        subtitle="Versatilidade do laboratório ao campo"
      >
        Aplicações Reais do BioAiLab
      </SectionTitle>

      {/* --- CARROSSEL 1: APLICAÇÕES --- */}
      <div
        className="
          flex overflow-x-auto gap-4 px-4 pb-10 pt-4 snap-x snap-mandatory items-stretch mt-8
          md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:pb-0 md:px-0 md:mb-20
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
        "
      >
        {APPS.map((app, index) => {
          const styles = getThemeStyles(app.theme);
          const Icon = app.icon;
          const isActionCard = !!app.action;

          return (
            <div
              key={index}
              onClick={() => handleNavigation(app.href)}
              className={cn(
                "group relative w-[85vw] md:w-auto flex-shrink-0 snap-center h-full block",
                app.href ? "cursor-pointer" : "cursor-default"
              )}
            >
              <div
                className={cn(
                  "bg-[#0e223b] border border-gray-800 p-6 rounded-xl transition-all duration-300 h-full flex flex-col",
                  styles.borderHover,
                  "group-hover:-translate-y-2 hover:shadow-xl",
                  isActionCard && "border-auftek-blue/30"
                )}
              >
                {/* Cabeçalho */}
                <div className="flex items-start gap-4 mb-5">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300",
                      styles.iconBg
                    )}
                  >
                    {Icon ? (
                      <Icon className={styles.iconColor} size={20} />
                    ) : (
                      <img
                        src={app.customIcon}
                        alt={app.title}
                        className="w-6 h-6 invert opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                    )}
                  </div>

                  <span
                    className={cn(
                      "text-[11px] uppercase tracking-widest font-bold mt-2 transition-colors",
                      styles.categoryColor
                    )}
                  >
                    {app.category}
                  </span>
                </div>

                {/* Título */}
                <h3
                  className={cn(
                    "text-xl font-bold text-white mb-3",
                    isActionCard && "text-auftek-blue"
                  )}
                >
                  {app.title}
                </h3>

                {/* Descrição */}
                <p className="text-gray-400 text-sm flex-1 leading-relaxed">
                  {app.description}
                </p>

                {/* Ação */}
                {app.action && (
                  <div className="mt-6 text-auftek-blue font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                    {app.action}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="md:hidden text-center text-gray-600 text-xs mb-12 animate-pulse">
        Deslize para o lado para ver mais →
      </p>
    </Section>
  );
};
