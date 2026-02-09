import React from "react";
import { Section, SectionTitle } from "../ui/Section";

export const About: React.FC = () => {
  return (
      <Section id="quem-somos" className="border-t border-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <SectionTitle>Quem Somos</SectionTitle>
          </div>

          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Transformamos ciência em instrumentação inteligente. Somos uma deeptech
            focada em resolver gargalos críticos em análises laboratoriais e
            controle de qualidade.
          </p>
          <p className="text-gray-400 leading-relaxed mb-6">
            Nosso lema —{" "}
            <span className="italic text-auftek-green">
            It’s time to save time
          </span>{" "}
            — reflete o propósito de criar tecnologias que economizam tempo e
            otimizam processos. Com uma equipe multidisciplinar de mestres e
            doutores, unimos microbiologia, eletrônica e inteligência artificial
            para entregar precisão e velocidade.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            <div className="border-l-4 border-auftek-blue pl-4">
              <h4 className="text-3xl font-bold text-white mb-1">+10</h4>
              <p className="text-sm text-gray-500">Anos de Pesquisa</p>
            </div>
            <div className="border-l-4 border-auftek-green pl-4">
              <h4 className="text-3xl font-bold text-white mb-1">IA + IoT</h4>
              <p className="text-sm text-gray-500">Tecnologia Proprietária</p>
            </div>
          </div>
        </div>
      </Section>
  );
};