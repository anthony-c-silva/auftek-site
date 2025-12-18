"use client";
import React from "react";
import { Zap, CheckCircle2, Wifi, Biohazard } from "lucide-react";
import { Section, SectionTitle } from "../../components/ui/Section";
import { BioDashboard } from "../../components/BioDashboard";
import { FaBacteria } from "react-icons/fa";
import { ScrollReveal } from "../../components/ui/ScrollReveal";

import dynamic from "next/dynamic";

// Importação dinâmica desativando o Server-Side Rendering para este componente
const BioAiLab3D = dynamic(
  () => import("../../components/BioAiLab3D").then((mod) => mod.BioAiLab3D),
  {
    ssr: false,
    loading: () => <div className="w-full h-full bg-transparent" />, // Placeholder enquanto carrega
  }
);

export const BioAiLab: React.FC = () => {
  return (
    <Section id="bioailab" className="relative overflow-hidden !bg-auftek-dark">
      {/* --- CAMADA DE FUNDO (INTACTA) --- */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-auftek-blue/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-auftek-green/5 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4"></div>
      </div>

      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-auftek-dark to-transparent z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-auftek-dark to-transparent z-0 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-24 md:w-40 h-full bg-gradient-to-r from-auftek-dark to-transparent z-0 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-24 md:w-40 h-full bg-gradient-to-l from-auftek-dark to-transparent z-0 pointer-events-none"></div>

      {/* --- CONTEÚDO --- */}
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24 relative z-10">
        {/* LADO ESQUERDO: TEXTO */}
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-auftek-green/10 text-auftek-green border border-auftek-green/20 text-xs font-bold mb-6 hover:bg-auftek-green/20 transition-colors cursor-default">
            <FaBacteria size={14} color="currentColor" />
            PRODUTO PRINCIPAL
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            A Solução:{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-auftek-blue to-cyan-400">
              BioAiLab
            </span>
            <span className="text-2xl text-cyan-300 align-top relative -top-0 ml-0">
              ®
            </span>
          </h2>

          <h3 className="text-xl md:text-2xl text-gray-300 font-light mb-8 leading-relaxed">
            Transformamos análises que levavam dias em resultados em{" "}
            <span className="text-auftek-green font-semibold border-b border-auftek-green/30">
              poucas horas
            </span>
            .
          </h3>

          <div className="space-y-8">
            <p className="text-gray-400 text-lg font-light">
              O BioAiLab, reduz análises microbiológicas de {""}
              <strong className="text-white">dias para horas</strong>. Com IA
              embarcada, ele monitora o crescimento microbiano em tempo real e
              envia os dados direto para a nuvem.
            </p>

            <ul className="space-y-4">
              {[
                "Totalmente automatizado: acelera incubação e quantificação.",
                "Identifica E. coli, Coliformes Totais, Salmonella e outros...",
                "Conectividade IoT: dados em nuvem, acesso via app e total rastreabilidade das análises",
                "Dispensa contagem manual e reduz erro humano.",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-4 text-gray-300 group"
                >
                  <div className="mt-1 p-1 rounded-full bg-auftek-blue/10 text-auftek-blue group-hover:bg-auftek-blue group-hover:text-white transition-colors">
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

        {/* LADO DIREITO: APENAS O MODELO 3D (LIMPO) */}
        <ScrollReveal
          delay="200"
          // Mantive apenas o posicionamento e altura total
          className="relative flex justify-center lg:justify-end w-full h-full items-center"
        >
          {/* Container limpo para o 3D.
              Define o tamanho máximo e o aspecto quadrado, sem CSS visual extra.
              Mantive os cursores para indicar interatividade. */}
          <div className="w-full max-w-md aspect-square cursor-grab active:cursor-grabbing relative z-10">
            <BioAiLab3D />
          </div>
        </ScrollReveal>
      </div>
      <ScrollReveal
        delay="300"
        className="mt-20 border-t border-gray-800/50 pt-20"
      >
        <SectionTitle align="center" subtitle="Tecnologia Multiplataforma">
          Controle total na palma da mão
        </SectionTitle>
        <p className="text-center text-gray-400 max-w-2xl mx-auto mb-12 font-light">
          O aplicativo do BioAiLab integra um CRM de monitoramento
          microbiológico em tempo real, acompanhando a dinâmica do crescimento
          por curvas de Gompertz e IA preditiva. A plataforma gera relatórios
          automáticos de contagem, tempo de crescimento e eficiência.
        </p>
        <BioDashboard />
      </ScrollReveal>
    </Section>
  );
};
