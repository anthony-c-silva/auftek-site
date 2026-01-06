"use client";
import React from "react";
import { CheckCircle2 } from "lucide-react";
import { Section, SectionTitle } from "../../components/ui/Section";
import { BioDashboard } from "../../components/BioDashboard";
import { FaBacteria } from "react-icons/fa";
import { ScrollReveal } from "../../components/ui/ScrollReveal";

export const BioAiLab: React.FC = () => {
  return (
    <div>
      <Section
        id="bioailab"
        className="relative overflow-hidden !bg-auftek-dark py-16 md:py-24" // Ajuste de padding vertical responsivo
      >
        {/* --- CAMADA DE FUNDO --- */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-auftek-blue/10 rounded-full blur-[100px] md:blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-auftek-green/5 rounded-full blur-[100px] md:blur-[120px] translate-y-1/3 -translate-x-1/4"></div>
        </div>

        <div className="absolute top-0 left-0 w-full h-24 md:h-32 bg-gradient-to-b from-auftek-dark to-transparent z-0 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full h-24 md:h-32 bg-gradient-to-t from-auftek-dark to-transparent z-0 pointer-events-none"></div>
        <div className="hidden md:block absolute top-0 left-0 w-40 h-full bg-gradient-to-r from-auftek-dark to-transparent z-0 pointer-events-none"></div>
        <div className="hidden md:block absolute top-0 right-0 w-40 h-full bg-gradient-to-l from-auftek-dark to-transparent z-0 pointer-events-none"></div>

        {/* --- CONTEÚDO --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16 md:mb-24 relative z-10">
          {/* LADO ESQUERDO: TEXTO */}
          <ScrollReveal className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-auftek-green/10 text-auftek-green border border-auftek-green/20 text-xs font-bold mb-6 hover:bg-auftek-green/20 transition-colors cursor-default">
              <FaBacteria size={14} color="currentColor" />
              PRODUTO PRINCIPAL
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              A Solução:{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-auftek-blue to-cyan-400">
                BioAiLab
              </span>
              <span className="text-xl md:text-2xl text-cyan-300 align-top relative -top-0 ml-0">
                ®
              </span>
            </h2>

            <h3 className="text-lg md:text-xl lg:text-2xl text-gray-300 font-light mb-8 leading-relaxed">
              Transformamos análises que levavam dias em resultados em{" "}
              <span className="text-auftek-green font-semibold border-b border-auftek-green/30">
                poucas horas
              </span>
              .
            </h3>

            <div className="space-y-8">
              <p className="text-gray-400 text-base md:text-lg font-light">
                O BioAiLab reduz análises microbiológicas de {""}
                <strong className="text-white">dias para horas</strong>. Com IA
                embarcada, ele monitora o crescimento microbiano em tempo real e
                envia os dados direto para a nuvem.
              </p>

              <ul className="space-y-4">
                {[
                  "Totalmente automatizado: acelera incubação e quantificação.",
                  "Identifica E. coli, Coliformes Totais, Salmonella e outros...",
                  "Conectividade IoT: dados em nuvem, acesso via app.",
                  "Dispensa contagem manual e reduz erro humano.",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-4 text-gray-300 group text-sm md:text-base"
                  >
                    <div className="mt-1 p-1 flex-shrink-0 rounded-full bg-auftek-blue/10 text-auftek-blue group-hover:bg-auftek-blue group-hover:text-white transition-colors">
                      <CheckCircle2 size={16} />
                    </div>
                    <span className="group-hover:text-white transition-colors">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* LADO DIREITO: IMAGEM (Sem Card, Menor e Responsiva) */}
          <ScrollReveal
            delay="200"
            className="order-1 lg:order-2 relative flex justify-center lg:justify-end w-full items-center"
          >
            <div className="relative z-10 w-full flex justify-center">
              <img
                src="/images/BioAiLabIlustration.svg"
                alt="Ilustração BioAiLab"
                className="w-auto h-auto max-h-[200px] md:max-h-[440px] object-contain drop-shadow-[0_20px_50px_rgba(8,112,184,0.2)]"
              />
            </div>
          </ScrollReveal>
        </div>

        {/* --- PARTE INFERIOR --- */}
        <ScrollReveal
          delay="300"
          className="mt-12 md:mt-20 border-t border-gray-800/50 pt-12 md:pt-20"
        >
          <SectionTitle align="center">
            <div className="text-auftek-blue font-bold text-xs md:text-sm tracking-widest uppercase mb-4 font-sans">
              PLATAFORMA BIOAILAB®
            </div>

            <div className="font-sans text-2xl md:text-4xl">
              O Laboratório do Futuro, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-auftek-blue to-cyan-400 animate-pulse">
                Disponível Agora.
              </span>
            </div>
          </SectionTitle>

          <p className="text-center text-gray-400 max-w-2xl mx-auto mb-12 font-light text-sm md:text-base px-4">
            O aplicativo do BioAiLab integra um CRM de monitoramento
            microbiológico em tempo real, acompanhando a dinâmica do crescimento
            por curvas de Gompertz e IA preditiva.
          </p>
          <BioDashboard />
        </ScrollReveal>
      </Section>
    </div>
  );
};
