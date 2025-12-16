import React from "react";
import { Section, SectionTitle } from "../../components/ui/Section";
import { TEAM_MEMBERS } from "../../data/constants";

export const Team: React.FC = () => {
  return (
    // 'pb-32' mantido para o espaçamento do footer/contato
    <Section id="time" className="pb-32 md:pb-40">
      <SectionTitle
        align="center"
        subtitle="Mestres, doutores e especialistas dedicados à inovação."
      >
        Nosso Time
      </SectionTitle>

      {/* MUDANÇAS AQUI:
        1. 'flex' no mobile, 'md:grid' no desktop.
        2. 'overflow-x-auto' permite rolar para o lado.
        3. 'snap-x snap-mandatory' faz o card centralizar ao soltar o dedo.
        4. Ocultamos a scrollbar com estilos inline ou classes arbitrárias.
      */}
      <div
        className="
          mt-12 
          flex gap-4 overflow-x-auto pb-6 px-4 snap-x snap-mandatory
          md:grid md:grid-cols-4 md:gap-6 md:px-0 md:pb-0
          
          /* Esconder Scrollbar (Chrome, Safari, Opera) */
          [&::-webkit-scrollbar]:hidden 
          /* Esconder Scrollbar (IE, Edge, Firefox) */
          [-ms-overflow-style:none] [scrollbar-width:none]
        "
      >
        {TEAM_MEMBERS.map((member, idx) => (
          <div
            key={idx}
            // MUDANÇAS NO CARD:
            // 1. 'min-w-[260px]' garante que o card tenha largura fixa no mobile.
            // 2. 'snap-center' garante o alinhamento ao rolar.
            className="
              bg-[#132644] p-4 rounded-xl text-center border border-gray-800 
              hover:border-gray-600 transition-colors
              min-w-[260px] md:min-w-0 flex-shrink-0 snap-center
            "
          >
            <div className="w-24 h-24 mx-auto bg-gray-700 rounded-full mb-4 overflow-hidden">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="text-white font-bold">{member.name}</h4>
            <p className="text-auftek-blue text-sm">{member.role}</p>
          </div>
        ))}
      </div>

      {/* Dica visual opcional apenas para mobile */}
      <p className="md:hidden text-center text-gray-600 text-xs mt-2 animate-pulse">
        Deslize para ver mais →
      </p>
    </Section>
  );
};
