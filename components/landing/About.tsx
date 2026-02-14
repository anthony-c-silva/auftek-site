import React from "react";
import { Section, SectionTitle } from "../ui/Section";

export const About: React.FC = () => {
  return (
    <Section id="quem-somos" className="border-t border-gray-800">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-8 sm:mb-10">
          <SectionTitle align="center">Quem Somos</SectionTitle>
        </div>

        <p className="text-gray-300 leading-relaxed mb-6 text-base sm:text-lg mx-auto">
          Transformamos ciência em instrumentação inteligente. Somos uma deeptech
          focada em resolver gargalos críticos em análises laboratoriais e
          controle de qualidade.
        </p>

        <p className="text-gray-400 leading-relaxed mb-8 text-sm sm:text-base mx-auto">
          Nosso lema —{" "}
          <span className="italic text-auftek-green">It’s time to save time</span>{" "}
          — reflete o propósito de criar tecnologias que economizam tempo e
          otimizam processos. Com uma equipe multidisciplinar de mestres e
          doutores, unimos microbiologia, eletrônica e inteligência artificial
          para entregar precisão e velocidade.
        </p>

        {/* Métricas: força 2 colunas cedo para ficarem lado a lado */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 mt-8 max-w-xl mx-auto">
          <div className="border-l-4 border-auftek-blue pl-4 text-left">
            <h4 className="font-bold text-white mb-1 text-[clamp(1.4rem,5vw,2rem)]">
              +10
            </h4>
            <p className="text-xs sm:text-sm text-gray-500">Anos de Pesquisa</p>
          </div>

          <div className="border-l-4 border-auftek-green pl-4 text-left">
            <h4 className="font-bold text-white mb-1 text-[clamp(1.4rem,5vw,2rem)]">
              IA + IoT
            </h4>
            <p className="text-xs sm:text-sm text-gray-500">Tecnologia Proprietária</p>
          </div>
        </div>
      </div>
    </Section>
  );
};
