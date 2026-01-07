"use client";
import React from "react";
import {
  Hourglass,
  Cloud,
  Cpu,
  Smartphone,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Section, SectionTitle } from "../../components/ui/Section";
import { BioDashboard } from "../../components/BioDashboard";
import { cn } from "../../lib/utils";

// Dados dos Cards
const features = [
  {
    icon: Hourglass,
    theme: "amber",
    label: "OTIMIZAÇÃO",
    title: "Redução de Tempo",
    description:
      "Diminuição do tempo de análise de dias/semanas (método tradicional) para horas.",
  },
  {
    icon: Cloud,
    theme: "blue",
    label: "RASTREABILIDADE",
    title: "Backup em Nuvem",
    description:
      "Armazenamento automático do histórico de análises garantindo segurança nos dados e acesso remoto.",
  },
  {
    icon: Cpu,
    theme: "emerald",
    label: "AUTOMAÇÃO",
    title: "IA Embarcada",
    description:
      "Processamento por Inteligência Artificial que padroniza a contagem e identificação, eliminando o erro humano.",
  },
  {
    icon: Smartphone,
    theme: "purple",
    label: "Multiplataformas",
    title: "Monitoramento via App ou WEB",
    description:
      "Visualização de resultados em tempo real diretamente na palma da sua mão, onde estiver.",
  },
];

export const BioAiLab: React.FC = () => {
  // Lógica do botão de orçamento
  const handleQuoteClick = () => {
    // 1. Rola suavemente até a seção de contato
    const contactSection = document.getElementById("contato");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }

    // 2. Dispara o evento customizado para preencher a mensagem
    // O seu componente Contact.tsx já tem um listener para 'prefillContact'
    const message = "Olá! Gostaria de receber um orçamento para o BioAiLab.";

    // Pequeno timeout para garantir que a rolagem iniciou e a UX fique fluida
    setTimeout(() => {
      const event = new CustomEvent("prefillContact", { detail: message });
      window.dispatchEvent(event);
    }, 100);
  };

  const getThemeStyles = (theme: string) => {
    switch (theme) {
      case "amber":
        return {
          borderHover: "hover:border-amber-500/80",
          iconBox: "bg-amber-500/10 text-amber-500 group-hover:bg-amber-500/20",
          label: "text-amber-500",
        };
      case "blue":
        return {
          borderHover: "hover:border-blue-500/80",
          iconBox: "bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20",
          label: "text-blue-500",
        };
      case "emerald":
        return {
          borderHover: "hover:border-teal-300/60",
          iconBox: "bg-teal-400/10 text-teal-300 group-hover:bg-teal-400/20", // Tom Verde Menta (Pastel)
          label: "text-teal-300",
        };
      case "purple":
        return {
          borderHover: "hover:border-violet-300/60",
          iconBox:
            "bg-violet-400/10 text-violet-300 group-hover:bg-violet-400/20", // Tom Lavanda (Pastel)
          label: "text-violet-300",
        };
      default:
        return {
          borderHover: "hover:border-gray-500",
          iconBox: "bg-gray-800 text-gray-400",
          label: "text-gray-400",
        };
    }
  };

  return (
    <Section id="bioailab" className="relative overflow-hidden bg-auftek-dark">
      <div className="relative z-10 container mx-auto px-4">
        {/* --- GRID SUPERIOR --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-16 lg:mb-24">
          <div className="flex flex-col justify-center text-left">
            <SectionTitle align="left">
              A Solução:{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-auftek-blue to-cyan-400 relative inline-block">
                BioAiLab
                <sup className="text-[0.5em] ml-2 text-cyan-400 font-bold">
                  ®
                </sup>
              </span>
            </SectionTitle>

            <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed max-w-lg">
              O BioAILab realiza o monitoramento microbiológico em tempo real
              utilizando uma IA treinada para modelagem preditiva. Essa
              tecnologia antecipa curvas de crescimento, reduzindo o tempo de
              resultado de dias/semanas em até 48 horas. Todo o gerenciamento de
              dados é centralizado e acessível via aplicativo móvel e web.
            </p>
          </div>

          <div className="relative w-full flex justify-center items-center h-full min-h-[300px] lg:min-h-[400px]">
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="w-[300px] h-[300px] bg-auftek-blue/20 blur-[100px] rounded-full"></div>
            </div>
            <img
              src="/images/BioAiLabIlustration.svg"
              alt="Equipamento BioAiLab"
              className="relative z-10 w-full max-w-[280px] lg:max-w-[240px] h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        {/* --- GRID INFERIOR: CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 md:mb-24">
          {features.map((feature, idx) => {
            const styles = getThemeStyles(feature.theme);
            const Icon = feature.icon;

            return (
              <div
                key={idx}
                className={cn(
                  "group relative flex flex-col justify-start h-full bg-slate-900/60 border border-slate-700/50 backdrop-blur-sm rounded-2xl p-6 transition-all duration-300",
                  "hover:-translate-y-2 hover:shadow-xl",
                  styles.borderHover
                )}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                      styles.iconBox
                    )}
                  >
                    <Icon size={20} strokeWidth={2} />
                  </div>
                  <span
                    className={cn(
                      "text-xs font-bold tracking-[0.15em] uppercase",
                      styles.label
                    )}
                  >
                    {feature.label}
                  </span>
                </div>

                <h4 className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </h4>

                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* --- RODAPÉ: DASHBOARD E BOTÕES --- */}

        {/* ÁREA DOS BOTÕES */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-16 pb-8">
          {/* Botão Acessar Sistema */}
          <a
            href="https://bioailab.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="group border border-auftek-blue/40 hover:border-auftek-blue text-auftek-blue hover:bg-auftek-blue/10 font-bold px-8 py-4 rounded-full flex items-center justify-center gap-2 transition-all w-full md:w-auto"
          >
            Acessar Sistema <ExternalLink size={18} />
          </a>

          {/* Botão Solicitar Orçamento (Interativo) */}
          <button
            onClick={handleQuoteClick}
            className="bg-auftek-blue hover:bg-cyan-400 text-black font-bold px-8 py-4 rounded-full flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] w-full md:w-auto"
          >
            Solicitar Orçamento <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </Section>
  );
};
