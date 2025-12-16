import React from "react";
import { Clock, Factory, Leaf } from "lucide-react";
import { Section, SectionTitle } from "../../components/ui/Section";

export const Microbiology: React.FC = () => {
  return (
    <Section id="microbiologia" darker>
      <SectionTitle align="center" subtitle="O Contexto">
        O Desafio do Controle Microbiológico
      </SectionTitle>

      {/* --- CONTAINER --- */}
      <div
        className="
                flex overflow-x-auto gap-4 px-4 pb-10 snap-x snap-mandatory items-stretch mt-12
                md:grid md:grid-cols-3 md:gap-8 md:pb-0 md:px-0
                [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
            "
      >
        {/* Card 1: O Problema do Tempo */}
        {/* MUDANÇA: bg-[#0e223b] (Azul Padrão) */}
        <div className="bg-[#0e223b] border border-gray-800 p-6 rounded-xl hover:border-red-400/50 transition-colors group w-[85vw] md:w-auto flex-shrink-0 snap-center h-full flex flex-col">
          <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-6 shrink-0">
            <Clock className="text-red-400" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-4">
            O Problema do Tempo
          </h3>
          <p className="text-gray-400 flex-1">
            Análises microbiológicas tradicionais exigem infraestrutura
            laboratorial complexa e levam dias para indicar presença, ausência
            e/ou quantificação de microrganismos.
          </p>
        </div>

        {/* Card 2: Impacto na Indústria */}
        {/* MUDANÇA: bg-[#0e223b] */}
        <div className="bg-[#0e223b] border border-gray-800 p-6 rounded-xl hover:border-orange-400/50 transition-colors group w-[85vw] md:w-auto flex-shrink-0 snap-center h-full flex flex-col">
          <div className="w-12 h-12 bg-orange-400/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-400/20 transition-colors shrink-0">
            <Factory className="text-orange-400" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-4">
            Impacto na Indústria
          </h3>
          <p className="text-gray-400 flex-1">
            A demora nos resultados trava a liberação de lotes, atrasa o
            tratamento de água e efluentes e gera custos operacionais elevados
            com armazenamento e reprocesso.
          </p>
        </div>

        {/* Card 3: A Necessidade */}
        {/* MUDANÇA: bg-[#0e223b] */}
        <div className="bg-[#0e223b] border border-gray-800 p-6 rounded-xl hover:border-auftek-green/50 transition-colors group w-[85vw] md:w-auto flex-shrink-0 snap-center h-full flex flex-col">
          <div className="w-12 h-12 bg-auftek-green/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-auftek-green/20 transition-colors shrink-0">
            <Leaf className="text-auftek-green" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-4">A Necessidade</h3>
          <p className="text-gray-400 flex-1">
            O mercado precisa de métodos rápidos, autônomos e que eliminem o
            erro humano na contagem e identificação de colônias.
          </p>
        </div>
      </div>

      {/* Dica visual para mobile */}
      <p className="md:hidden text-center text-gray-600 text-xs mt-2 animate-pulse">
        Deslize para ver mais →
      </p>
    </Section>
  );
};
