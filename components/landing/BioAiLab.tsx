"use client";

import React from "react";
import { Brain, Zap, BarChart3, Rocket, ArrowRight, ExternalLink } from "lucide-react";
import { Section, SectionTitle } from "../ui/Section";
import { Button } from "../ui/Button";

export const BioAiLab: React.FC = () => {
  const handleQuoteClick = () => {
    const contactSection = document.getElementById("contato");

    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });

      const message =
        "Olá! Gostaria de receber um orçamento técnico para a solução BioAiLab.";

      setTimeout(() => {
        const event = new CustomEvent("prefillContact", { detail: message });
        window.dispatchEvent(event);
      }, 300);
    }
  };

  const TOPICS = [
    {
      icon: Brain,
      title: "Automação via Inteligência Artificial",
      description:
        "O sistema automatiza a leitura das amostras, dispensando a contagem manual de colônias e padronizando a interpretação dos resultados.",
    },
    {
      icon: Zap,
      title: "Operação Simplificada",
      description:
        "Reduz etapas manuais de preparação. O equipamento ocupa pouco espaço físico e integra-se à rotina laboratorial existente.",
    },
    {
      icon: BarChart3,
      title: "Acesso Remoto e Rastreabilidade",
      description:
        "Visualização dos dados via plataforma web ou mobile, com armazenamento de histórico na nuvem para consulta posterior.",
    },
    {
      icon: Rocket,
      title: "Laboratório Portátil e Descentralizado",
      description:
        "Possibilita a realização de análises microbiológicas diretamente no local do processo, por meio de um minilaboratório portátil, de baixo custo.",
    },
  ];

  return (
    <Section id="bioailab" className="relative overflow-hidden bg-auftek-dark">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- CABEÇALHO DA SEÇÃO --- */}
        <div className="text-center mb-12 sm:mb-16">
          <SectionTitle align="center">
            A Solução:{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-auftek-blue to-cyan-400 relative inline-block">
              BioAiLab
              <sup className="text-[0.5em] ml-2 text-cyan-400 font-bold">®</sup>
            </span>
          </SectionTitle>

          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mt-5 sm:mt-6 mb-3 sm:mb-4">
            Resultados em horas, não semanas.
          </h3>

          <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
            O sistema realiza o monitoramento contínuo, em tempo real, da dinâmica
            de crescimento bacteriano, fornecendo dados quantitativos a partir de 8
            horas e reduzindo de forma expressiva o tempo de resposta frente aos
            métodos tradicionais
          </p>
        </div>

        {/* --- CONTEÚDO DIVIDIDO (Tópicos vs Imagem) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-12 sm:mb-16">
          {/* Lado Esquerdo: Tópicos */}
          <div className="flex flex-col">
            <h4 className="text-lg sm:text-xl font-bold text-auftek-blue uppercase tracking-wider mb-6 border-b border-gray-800 pb-4">
              Por que escolher o BioAiLab?
            </h4>

            <div className="space-y-6 sm:space-y-8">
              {TOPICS.map((topic, index) => (
                <div key={index} className="flex gap-4 sm:gap-5 group">
                  <div className="shrink-0 mt-0.5">
                    <div className="w-10 h-10 rounded-lg bg-auftek-blue/10 flex items-center justify-center text-auftek-blue group-hover:bg-auftek-blue group-hover:text-white transition-all duration-300">
                      <topic.icon size={20} />
                    </div>
                  </div>

                  <div>
                    <h5 className="text-base sm:text-lg font-bold text-white mb-1.5 sm:mb-2 group-hover:text-auftek-blue transition-colors">
                      {topic.title}
                    </h5>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {topic.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lado Direito: Imagem */}
          <div className="relative w-full flex justify-center items-center min-h-[260px] sm:min-h-[340px] lg:min-h-[420px]">
            {/* Efeito de brilho de fundo */}
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] lg:w-[360px] lg:h-[360px] bg-auftek-blue/15 blur-[110px] sm:blur-[120px] rounded-full animate-pulse-slow" />
            </div>

            <img
              src="/images/Bioailab.png"
              alt="Equipamento BioAiLab"
              className="relative z-10 w-full max-w-[520px] sm:max-w-[640px] lg:max-w-[900px] h-auto object-contain drop-shadow-2xl hover:scale-[1.03] transition-transform duration-700"
            />
          </div>
        </div>

        {/* --- RODAPÉ: BOTÕES --- */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-center gap-4 sm:gap-6 pb-8 border-t border-gray-800 pt-10 sm:pt-12">
          {/* Botão Acessar Sistema */}
          <a
            href="https://bioailab.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="
              group border border-auftek-blue text-auftek-blue hover:bg-auftek-blue/10
              font-bold px-7 sm:px-8 py-3.5 sm:py-4 rounded-full
              flex items-center justify-center gap-2 transition-all
              w-full md:w-auto
            "
          >
            Acessar Sistema <ExternalLink size={18} />
          </a>

          {/* Botão Solicitar Orçamento */}
          <Button
            variant="primary"
            onClick={handleQuoteClick}
            className="
              w-full md:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-full
              flex items-center justify-center gap-2 transition-all
              hover:scale-[1.03]
              shadow-lg shadow-auftek-blue/20 hover:shadow-auftek-blue/40
            "
          >
            Solicitar Orçamento <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </Section>
  );
};
