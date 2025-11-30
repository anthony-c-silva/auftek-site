import React from "react";
import { Section, SectionTitle } from "../../components/ui/Section";
import {
  Building2,
  Sprout,
  FlaskConical,
  Landmark,
  Rocket,
} from "lucide-react";

export const Partners: React.FC = () => {
  return (
    <Section id="parceiros" darker className="relative overflow-hidden">
      {/* Background Sutil */}
      <div className="absolute  pointer-events-none"></div>

      <div className="relative z-10">
        <SectionTitle
          align="center"
          subtitle="Quem confia e impulsiona nossa tecnologia"
        >
          Quem usa e apoia
        </SectionTitle>

        <div className="max-w-6xl mx-auto mt-16">
          {/* --- GRUPO 1: Parceiros Tecnológicos & Clientes --- */}
          <div className="mb-20">
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="h-[1px] w-12 bg-gray-700"></div>
              <h3 className="text-center text-gray-400 uppercase tracking-[0.2em] font-bold text-xs">
                Parceiros Tecnológicos & Clientes
              </h3>
              <div className="h-[1px] w-12 bg-gray-700"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: "Embrapa", icon: Sprout },
                { name: "Zeit", icon: Rocket },
                { name: "USP", icon: Landmark },
                { name: "UFSCar", icon: Landmark },
                { name: "Ind. Agro", icon: Building2 }, // Placeholder
                { name: "Lab. Análise", icon: FlaskConical }, // Placeholder
              ].map((partner, i) => (
                <div
                  key={i}
                  className="group flex flex-col items-center justify-center p-4 bg-[#132338] rounded-xl border border-gray-800 hover:border-auftek-blue/50 hover:bg-[#1a2c42] transition-all duration-300 hover:-translate-y-1 cursor-default h-32"
                >
                  {/* SIMULAÇÃO DE LOGO (Troque este ícone pela tag <img> quando tiver o arquivo) */}
                  <partner.icon
                    className="text-gray-600 group-hover:text-white transition-colors mb-3"
                    size={32}
                    strokeWidth={1.5}
                  />

                  <span className="font-semibold text-gray-400 group-hover:text-auftek-blue text-sm text-center leading-tight">
                    {partner.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* --- GRUPO 2: Fomento e Apoio --- */}
          <div>
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="h-[1px] w-12 bg-gray-700"></div>
              <h3 className="text-center text-gray-400 uppercase tracking-[0.2em] font-bold text-xs">
                Fomento e Apoio Institucional
              </h3>
              <div className="h-[1px] w-12 bg-gray-700"></div>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              {[
                "FAPESP",
                "PIPE Empreendedor",
                "FINEP",
                "CNPq",
                "SEBRAE",
                "MCTI",
              ].map((funder, i) => (
                <div
                  key={i}
                  className="group flex items-center justify-center px-8 py-4 bg-[#0e223b] rounded-lg border border-gray-800/60 hover:border-auftek-green/50 hover:shadow-[0_0_15px_-5px_rgba(169,222,202,0.15)] transition-all duration-300"
                >
                  {/* Aqui seria o Logo da instituição */}
                  <span className="font-bold text-gray-500 group-hover:text-white transition-colors text-sm tracking-wide">
                    {funder}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};
