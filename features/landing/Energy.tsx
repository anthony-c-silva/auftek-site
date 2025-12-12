"use client";
import React from "react";
import { Zap, Award, Youtube, ArrowRight } from "lucide-react";
import { Section, SectionTitle } from "../../components/ui/Section";
import { Button } from "../../components/ui/Button";

const IMG_ARC =
  "https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&q=80&w=800";
const IMG_SAFETY =
  "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800";

export const Energy: React.FC = () => {
  return (
    <Section
      id="energia"
      className="bg-gradient-to-br from-auftek-dark to-[#102a4a]"
    >
      <div className="max-w-4xl mx-auto text-center mb-16">
        <SectionTitle align="center" subtitle="Soluções para o Setor Elétrico">
          Energia e Creditação de Inversores
        </SectionTitle>
        <p className="text-xl text-gray-300">
          A Auftek Tecnologia desenvolve instrumentação completa para creditação
          de inversores fotovoltaicos, atendendo às normas{" "}
          <span className="text-white font-bold">IEC 63027</span> e{" "}
          <span className="text-white font-bold">IEC 62109-2</span>.
        </p>
      </div>

      {/* 1. ADICIONADO items-stretch AQUI PARA FORÇAR ALTURA IGUAL */}
      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        {/* PVAG LAB */}
        {/* 2. O h-full AQUI GARANTE QUE O CARD OCUPE O ESPAÇO ESTICADO */}
        <div className="group relative bg-[#0a192f] rounded-2xl overflow-hidden border border-gray-700 hover:border-yellow-500/50 transition-all flex flex-col h-full">
          <div className="h-48 bg-gray-800 relative shrink-0">
            <img
              src={IMG_ARC}
              alt="Arc Flash"
              className="w-full h-full object-cover opacity-60 mix-blend-overlay"
            />
            <div className="absolute bottom-4 left-4">
              <div className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-3 py-1 rounded text-xs font-bold inline-flex items-center gap-1">
                <Zap size={12} /> ARCO ELÉTRICO DC
              </div>
            </div>
          </div>

          {/* 3. O flex-1 AQUI EMPURRA O CONTEÚDO PARA PREENCHER O VAZIO */}
          <div className="p-8 flex flex-col flex-1">
            <h3 className="text-2xl font-bold text-white mb-3">PVAG LAB</h3>
            <p className="text-gray-400 mb-4">
              Sistema modular de precisão para emulação controlada de arcos
              elétricos em corrente contínua, desenvolvido para ensaios de
              segurança e certificação de inversores fotovoltaicos conforme a
              IEC 63027 e portaria 140 Inmetro. 
            </p>
            <p className="text-gray-400 mb-8">
              Reproduz falhas reais de arco
              com total controle dos parâmetros elétricos, garantindo ensaios
              repetíveis, confiáveis e alinhados às exigências regulatórias
              internacionais.
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>{" "}
                Emulação precisa e repetível de arcos elétricos em DC
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>{" "}
                Atende aos requisitos da Portaria Inmetro nº 140
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>{" "}
                Sistema modular para ensaios em inversores e micro inversores
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>{" "}
                Projetado para uso em laboratórios de certificação e ensaios de
                conformidade
              </li>
            </ul>

            {/* 4. mt-auto EMPURRA OS BOTÕES PARA O FINAL DO CARD ESTICADO */}
            <div className="mt-auto pt-6 flex justify-center gap-4">
              <Button
                className="bg-yellow-500 text-black hover:bg-yellow-600 px-6 py-3 rounded-full flex items-center gap-2"
                onClick={() => alert("Orçamento solicitado")}
              >
                Solicitar Orçamento
                <ArrowRight size={16} />
              </Button>
              <Button
                variant="outline"
                className="border-grey-600 text-grey-600 hover:text-white px-6 py-3 rounded-full"
                onClick={() =>
                  window.open(
                    "https://www.youtube.com/playlist?list=PLikkF_yABojGV-2xLF1zsSfi1CkttXdyR",
                    "_blank"
                  )
                }
              >
                <Youtube size={16} /> YouTube
              </Button>
            </div>
          </div>
        </div>

        {/* IRCCT */}
        <div className="group relative bg-[#0a192f] rounded-2xl overflow-hidden border border-gray-700 hover:border-blue-500/50 transition-all flex flex-col h-full">
          <div className="h-48 bg-gray-800 relative shrink-0">
            <img
              src={IMG_SAFETY}
              alt="Electrical Safety"
              className="w-full h-full object-cover opacity-60 mix-blend-overlay"
            />
            <div className="absolute bottom-4 left-4">
              <div className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded text-xs font-bold inline-flex items-center gap-1">
                <Award size={12} /> FUGA DE CORRENTE
              </div>
            </div>
          </div>

          <div className="p-8 flex flex-col flex-1">
            <h3 className="text-2xl font-bold text-white mb-3">IRCCT System</h3>
            <p className="text-gray-400 mb-4">
              Sistema modular de alta precisão para ensaios de corrente residual
              e resistência de isolação em inversores fotovoltaicos sem
              transformador, conforme as normas IEC 62109-2 e IEC 63112, no
              contexto da certificação exigida pela Portaria Inmetro nº 140.
            </p>
            <p className="text-gray-400 mb-6">
              Permite a reprodução controlada de correntes de fuga contínuas e
              variações rápidas de corrente residual, com total controle dos
              parâmetros elétricos, garantindo ensaios repetíveis, confiáveis e
              alinhados às exigências regulatórias.
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-auftek-blue rounded-full"></div>{" "}
                Ensaios de corrente residual contínua e variação rápida
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-auftek-blue rounded-full"></div>{" "}
                Avaliação de trip level e trip time
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-auftek-blue rounded-full"></div>{" "}
                Conformidade com IEC 62109-2 e IEC 63112
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-auftek-blue rounded-full"></div>{" "}
                Aplicável aos requisitos de segurança da Portaria Inmetro nº 140
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-auftek-blue rounded-full"></div>{" "}
                Sistema modular para inversores até 75 KW
              </li>
            </ul>

            <div className="mt-auto pt-6 flex justify-center gap-4">
              <Button
                className="bg-yellow-500 text-black hover:bg-yellow-600 px-6 py-3 rounded-full flex items-center gap-2"
                onClick={() => alert("Orçamento solicitado")}
              >
                Solicitar Orçamento
                <ArrowRight size={16} />
              </Button>
              <Button
                variant="outline"
                className="border-grey-600 text-grey-600 hover:text-white px-6 py-3 rounded-full"
                onClick={() =>
                  window.open(
                    "https://www.youtube.com/playlist?list=PLikkF_yABojGV-2xLF1zsSfi1CkttXdyR",
                    "_blank"
                  )
                }
              > 
                <Youtube size={16} /> YouTube
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};
