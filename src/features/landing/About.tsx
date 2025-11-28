import React from "react";
import { CheckCircle2 } from "lucide-react";
import { Section, SectionTitle } from "../../components/ui/Section";
import { Assets } from "../../assets";

export const About: React.FC = () => {
  return (
    <Section id="quem-somos" className="border-t border-gray-800">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <SectionTitle subtitle="Sobre a Auftek">
            A Auftek Tecnologia transforma ciência em instrumentação inteligente
          </SectionTitle>
          <p className="text-gray-400 text-lg leading-relaxed mb-6">
            Nascemos da necessidade de modernizar processos analíticos arcaicos.
            Somos uma deeptech focada em desenvolver hardware e software
            integrados para resolver dores críticas em laboratórios e usinas de
            energia.
          </p>
          <p className="text-gray-400 text-lg leading-relaxed mb-6">
            Com uma equipe multidisciplinar de doutores e engenheiros, criamos
            soluções que não apenas medem, mas interpretam dados para gerar
            valor real.
          </p>
          <div className="grid grid-cols-2 gap-6 mt-8">
            <div className="p-4 bg-auftek-slate/50 rounded-lg border border-gray-700">
              <CheckCircle2 className="text-auftek-green mb-2" />
              <h4 className="font-bold text-white">Alta Precisão</h4>
              <p className="text-sm text-gray-400">Sensores calibrados e IA</p>
            </div>
            <div className="p-4 bg-auftek-slate/50 rounded-lg border border-gray-700">
              <CheckCircle2 className="text-auftek-blue mb-2" />
              <h4 className="font-bold text-white">IoT Nativo</h4>
              <p className="text-sm text-gray-400">Conectividade total</p>
            </div>
          </div>
        </div>

        {/* ALTERAÇÃO AQUI: 
                    Adicionei 'w-3/4 md:w-1/2' para reduzir a largura (75% no mobile, 50% no desktop)
                    Adicionei 'mx-auto' para centralizar a imagem reduzida no espaço disponível.
                */}
        <div className="relative group w-3/4 md:w-1/2 mx-auto">
          <div className="absolute inset-0 bg-auftek-blue blur-[100px] opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>

          <img
            src={Assets.about.labWork}
            alt="Pesquisa Laboratorial e Tecnologia"
            className="w-full h-auto rounded-xl shadow-2xl relative z-10 border border-gray-700 grayscale hover:grayscale-0 transition-all duration-700 object-cover"
          />
        </div>
      </div>
    </Section>
  );
};
