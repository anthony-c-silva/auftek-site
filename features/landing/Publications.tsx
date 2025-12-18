"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Sprout,
  Waves,
  Gauge,
  Biohazard,
  FileText,
  Rocket
} from "lucide-react";

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
      title: "Salmonella e Patógenos",
      description: "Libere lotes em horas, não dias. Segurança total com detecção rápida para eliminar riscos sanitários.",
      icon: Biohazard,
      theme: "red"
    },
    {
      category: "SANEAMENTO (ETE E ETA)",
      title: "E. coli e Coliformes",
      description: "Dados em tempo real na nuvem. Otimize a operação e garanta a qualidade da água com resposta imediata.",
      icon: Waves,
      theme: "cyan"
    },
    {
      category: "AGRO & BIOINSUMOS",
      title: "Monitoramento On-Farm",
      description: "Maximize a colheita. Valide a viabilidade dos bioinsumos no campo e aplique no momento exato.",
      icon: Sprout,
      theme: "green"
    },
    {
      category: "PROCESSOS INDUSTRIAIS",
      title: "Controle de Processos",
      description: "Zero desperdício. Identifique falhas microbiológicas instantaneamente e corrija a produção em tempo recorde.",
      icon: Gauge,
      theme: "orange"
    },
    {
      category: "QUALIDADE DO LEITE",
      title: "CBT Digital",
      description: "Resultados em 3 horas. Automatize a Contagem Bacteriana Total para rastreabilidade e valorização do produto.",
      icon: null,
      customIcon: MILK_ICON_PATH,
      theme: "white"
    },
    {
      category: "P&D SOB MEDIDA",
      title: "Sua dor é única?",
      description: "Adaptamos o BioAiLab para resolver o seu desafio microbiológico específico.",
      icon: Rocket,
      theme: "primary",
      action: "Falar com um Especialista →",
      href: "#contato"
    }
  ];

  // --- DADOS DOS PAPERS CIENTÍFICOS ---
  const PAPERS = [
    {
      journal: "Analytical Chemistry",
      title: "Feasibility for Real-Time Monitoring of Bacterial Growth in Raw Milk Using a New Contactless Sensor",
      href: "https://pubs.acs.org/doi/10.1021/acs.analchem.5c03766"
    },
    {
      journal: "IEEE Sensors Journal",
      title: "Contactless Electrical Sensor Based on Resonance Frequency for Real-Time Monitoring of Bacterial Growth",
      href: "https://ieeexplore.ieee.org/document/10424681"
    }
  ];

  const getThemeStyles = (theme: string) => {
    switch (theme) {
      case 'red':
        return {
          borderHover: "hover:border-red-500/50",
          iconBg: "bg-red-500/10 group-hover:bg-red-500/20",
          iconColor: "text-red-400",
          categoryColor: "text-red-400"
        };
      case 'cyan':
        return {
          borderHover: "hover:border-cyan-400/50",
          iconBg: "bg-cyan-400/10 group-hover:bg-cyan-400/20",
          iconColor: "text-cyan-400",
          categoryColor: "text-cyan-400"
        };
      case 'green':
        return {
          borderHover: "hover:border-auftek-green/50",
          iconBg: "bg-auftek-green/10 group-hover:bg-auftek-green/20",
          iconColor: "text-auftek-green",
          categoryColor: "text-auftek-green"
        };
      case 'orange':
        return {
          borderHover: "hover:border-orange-400/50",
          iconBg: "bg-orange-400/10 group-hover:bg-orange-400/20",
          iconColor: "text-orange-400",
          categoryColor: "text-orange-400"
        };
      case 'white':
        return {
          borderHover: "hover:border-white/50",
          iconBg: "bg-white/10 group-hover:bg-white/20",
          iconColor: "text-gray-200",
          categoryColor: "text-gray-300"
        };
      case 'primary':
        return {
          borderHover: "hover:border-auftek-blue",
          iconBg: "bg-auftek-blue/10 group-hover:bg-auftek-blue/20",
          iconColor: "text-auftek-blue",
          categoryColor: "text-auftek-blue font-bold"
        };
      default:
        return {
          borderHover: "hover:border-gray-500",
          iconBg: "bg-gray-800",
          iconColor: "text-gray-400",
          categoryColor: "text-gray-500"
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

                  <span className={cn(
                    "text-[11px] uppercase tracking-widest font-bold mt-2 transition-colors",
                    styles.categoryColor
                  )}>
                    {app.category}
                  </span>
                </div>

                {/* Título */}
                <h3 className={cn(
                  "text-xl font-bold text-white mb-3",
                  isActionCard && "text-auftek-blue"
                )}>
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

      {/* --- SEÇÃO DE ARTIGOS CIENTÍFICOS --- */}
      <div className="border-t border-gray-800 pt-16">
        <h3 className="text-2xl font-bold text-gray-300 mb-8 text-center">
          Publicações e Embasamento Técnico-Científico
        </h3>

        {/* --- CARROSSEL 2: PAPERS --- */}
        {/* Alteração: Usamos a mesma estrutura de container flex/scroll-x do mobile */}
        <div
          className="
            flex overflow-x-auto gap-4 px-4 pb-10 pt-4 snap-x snap-mandatory items-stretch
            md:grid md:grid-cols-2 md:gap-6 md:max-w-4xl md:mx-auto md:pb-0 md:px-0
            [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
          "
        >
          {PAPERS.map((paper, index) => (
            <a
              key={index}
              href={paper.href}
              target="_blank"
              rel="noopener noreferrer"
              className="
                group relative w-[85vw] md:w-auto flex-shrink-0 snap-center h-full
                flex gap-4 p-4 rounded-lg bg-[#0e223b]/50 border border-gray-800
                hover:border-auftek-blue/50 hover:bg-[#0e223b] transition-all hover:-translate-y-1 cursor-pointer
              "
            >
              <div className="bg-gray-800/50 p-3 rounded h-fit group-hover:bg-auftek-blue/10 transition-colors shrink-0">
                <FileText className="text-gray-400 group-hover:text-auftek-blue transition-colors" size={24} />
              </div>
              <div className="flex flex-col">
                <h4 className="text-white font-medium group-hover:text-auftek-blue transition-colors">
                  {paper.journal}
                </h4>
                <p className="text-gray-500 text-sm mt-1 leading-snug">
                  {paper.title}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Dica visual extra para os papers no mobile */}
        <p className="md:hidden text-center text-gray-600 text-xs mb-6 animate-pulse">
          Deslize para o lado para ver mais →
        </p>

        <p className="text-center text-gray-500 text-sm mt-6 italic">
          O BioAiLab tem sido utilizado em estudos científicos publicados em
          periódicos de destaque internacional.
        </p>
      </div>
    </Section>
  );
};