import React from "react";
import { Section, SectionTitle } from "../../components/ui/Section";
import { TEAM_MEMBERS } from "../../data/constants";

export const Team: React.FC = () => {
  return (
      // ADICIONADO: 'pb-32' para dar espaço extra no fundo por causa
      // da margem negativa e borda arredondada da seção de Contato seguinte.
      <Section id="time" className="pb-32 md:pb-40">
        <SectionTitle
            align="center"
            subtitle="Mestres, doutores e engenheiros dedicados à inovação."
        >
          Nosso Time
        </SectionTitle>

        <div className="grid md:grid-cols-4 gap-6 mt-12">
          {TEAM_MEMBERS.map((member, idx) => (
              <div
                  key={idx}
                  className="bg-[#132644] p-4 rounded-xl text-center border border-gray-800 hover:border-gray-600 transition-colors"
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
      </Section>
  );
};