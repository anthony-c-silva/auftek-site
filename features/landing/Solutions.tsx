import React from "react";
import { Microscope, Zap, FlaskConical } from "lucide-react";
import { Section, SectionTitle } from "../../components/ui/Section";

export const Solutions: React.FC = () => {
  return (
    <Section id="solucoes">
      <SectionTitle align="center" subtitle="O que fazemos">
        Nossas Soluções Laboratoriais
      </SectionTitle>

      {/* --- CONTAINER --- */}
      <div
        className="
                    flex overflow-x-auto gap-4 px-4 pb-10 snap-x snap-mandatory items-stretch
                    md:grid md:grid-cols-3 md:gap-6 md:pb-0 md:px-0
                    [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
                "
      >
        {/* 1. Microbiologia Digital (VERDE) */}
        {/* Ajustado para bg-[#0e223b] */}
        <div className="bg-[#0e223b] border border-gray-800 p-6 rounded-xl hover:border-auftek-green/50 transition-colors group w-[85vw] md:w-auto flex-shrink-0 snap-center h-full flex flex-col">
          <div className="w-12 h-12 bg-auftek-green/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-auftek-green/20 transition-colors shrink-0">
            <Microscope className="text-auftek-green" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Microbiologia Digital
          </h3>
          <p className="text-gray-400 text-sm flex-1">
            Automação e digitalização de processos microbiológicos com análise
            de dados em tempo real e inteligência artificial para resultados
            rápidos.
          </p>
        </div>

        {/* 2. Energia Fotovoltaica (AMARELO) */}
        {/* Ajustado para bg-[#0e223b] */}
        <div className="bg-[#0e223b] border border-gray-800 p-6 rounded-xl hover:border-yellow-400/50 transition-colors group w-[85vw] md:w-auto flex-shrink-0 snap-center h-full flex flex-col">
          <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-500/20 transition-colors shrink-0">
            <Zap className="text-yellow-400" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Energia Fotovoltaica
          </h3>
          <p className="text-gray-400 text-sm flex-1">
            Ensaios de segurança elétrica, emulação de arco e performance para
            inversores, garantindo conformidade com normas IEC e Inmetro.
          </p>
        </div>

        {/* 3. Pesquisa e Desenvolvimento (AZUL - Padrão) */}
        {/* Ajustado para bg-[#0e223b] */}
        <div className="bg-[#0e223b] border border-gray-800 p-6 rounded-xl hover:border-auftek-blue/50 transition-colors group w-[85vw] md:w-auto flex-shrink-0 snap-center h-full flex flex-col">
          <div className="w-12 h-12 bg-auftek-blue/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-auftek-blue/20 transition-colors shrink-0">
            <FlaskConical className="text-auftek-blue" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Pesquisa e Desenvolvimento
          </h3>
          <p className="text-gray-400 text-sm flex-1">
            Desenvolvimento de hardware e software sob medida para desafios
            complexos da indústria e laboratórios de pesquisa.
          </p>
        </div>
      </div>

      {/* Dica visual apenas para mobile */}
      <p className="md:hidden text-center text-gray-600 text-xs mt-2 animate-pulse">
        Deslize para ver mais →
      </p>
    </Section>
  );
};
