"use client";
import React, { useState } from "react";
import { Zap, Award, Youtube, ArrowRight } from "lucide-react";
import { Section, SectionTitle } from "../../components/ui/Section";
import { Button } from "../../components/ui/Button";

// --- DADOS DOS PRODUTOS ---
const PRODUCTS = [
  {
    id: "pvag",
    title: "PVAG LAB",
    subtitle: "Arco Elétrico DC",
    description:
      "Sistema modular de precisão para emulação controlada de arcos elétricos em corrente contínua, desenvolvido para ensaios de segurança e certificação de inversores fotovoltaicos conforme a IEC 63027 e portaria 140 Inmetro.",
    details:
      "Reproduz falhas reais de arco com total controle dos parâmetros elétricos, garantindo ensaios repetíveis, confiáveis e alinhados às exigências regulatórias internacionais.",
    points: [
      "Emulação precisa e repetível de arcos elétricos em DC",
      "Atende aos requisitos da Portaria Inmetro nº 140",
      "Sistema modular para ensaios em inversores e micro inversores",
      "Projetado para laboratórios de certificação",
    ],
    image:
      "https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&q=80&w=800",
    color: "yellow",
    icon: Zap,
    message:
      "Olá! Gostaria de solicitar um orçamento para o equipamento PVAG LAB.",
  },
  {
    id: "ircct",
    title: "IRCCT System",
    subtitle: "Fuga de Corrente",
    description:
      "Sistema modular de alta precisão para ensaios de corrente residual e resistência de isolação em inversores fotovoltaicos sem transformador, conforme as normas IEC 62109-2 e IEC 63112.",
    details:
      "Permite a reprodução controlada de correntes de fuga contínuas e variações rápidas, garantindo ensaios repetíveis, confiáveis e alinhados às exigências regulatórias.",
    points: [
      "Ensaios de corrente residual contínua e variação rápida",
      "Conformidade com IEC 62109-2 e IEC 63112",
      "Aplicável aos requisitos de segurança da Portaria Inmetro nº 140",
      "Sistema modular para inversores até 75 KW",
    ],
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800",
    color: "auftek-blue",
    icon: Award,
    message:
      "Olá! Gostaria de solicitar um orçamento para o equipamento IRCCT.",
  },
];

export const Energy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"pvag" | "ircct">("pvag");

  return (
    <Section
      id="energia"
      className="bg-gradient-to-br from-auftek-dark to-[#102a4a]"
    >
      <div className="max-w-4xl mx-auto text-center mb-10 md:mb-16">
        <SectionTitle align="center" subtitle="Soluções para o Setor Elétrico">
          Energia e Acreditação de Inversores
        </SectionTitle>
        <p className="text-xl text-gray-300">
          A Auftek Tecnologia desenvolve instrumentação completa para
          acreditação de inversores fotovoltaicos, atendendo às normas{" "}
          <span className="text-white font-bold">IEC 63027</span> e{" "}
          <span className="text-white font-bold">IEC 62109-2</span>.
        </p>
      </div>

      {/* --- SWITCHER --- */}
      <div className="md:hidden flex justify-center mb-10 px-4">
        <div className="bg-black/20 backdrop-blur-sm p-2 rounded-full border border-white/5 shadow-inner flex w-full max-w-sm relative">
          <div
            className={`
        absolute top-2 bottom-2 w-[calc(50%-10px)] rounded-full transition-all duration-300 ease-out shadow-lg
        ${
          activeTab === "pvag"
            ? "left-2 bg-gray-800 border border-yellow-500/30 shadow-[0_0_15px_-3px_rgba(234,179,8,0.3)]"
            : "left-[calc(50%+2px)] bg-gray-800 border border-cyan-500/30 shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)]"
        }
      `}
          ></div>

          <button
            onClick={() => setActiveTab("pvag")}
            className={`flex-1 relative z-10 py-3 text-sm font-bold rounded-full transition-colors flex items-center justify-center gap-2 ${
              activeTab === "pvag"
                ? "text-yellow-400"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Zap
              size={16}
              className={activeTab === "pvag" ? "fill-yellow-400/20" : ""}
            />
            PVAG LAB
          </button>

          <button
            onClick={() => setActiveTab("ircct")}
            className={`flex-1 relative z-10 py-3 text-sm font-bold rounded-full transition-colors flex items-center justify-center gap-2 ${
              activeTab === "ircct"
                ? "text-cyan-400"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Award
              size={16}
              className={activeTab === "ircct" ? "fill-cyan-400/20" : ""}
            />
            IRCCT System
          </button>
        </div>
      </div>

      {/* --- GRID DE CARDS --- */}
      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        {PRODUCTS.map((product) => {
          const isYellow = product.color === "yellow";
          const Icon = product.icon;

          const borderColor = "hover:border-yellow-500/50";
          
          const badgeBg = isYellow
            ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
            : "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
          
          const bulletColor = isYellow ? "bg-yellow-500" : "bg-cyan-400";

          return (
            <div
              key={product.id}
              className={`
                ${activeTab === product.id ? "flex" : "hidden"} 
                md:flex 
                group relative bg-[#0a192f] rounded-2xl overflow-hidden border border-gray-700 ${borderColor} transition-all flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500
              `}
            >
              {/* Imagem e Badge */}
              <div className="h-48 bg-gray-800 relative shrink-0">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover opacity-60 mix-blend-overlay"
                />
                <div className="absolute bottom-4 left-4">
                  <div
                    className={`border px-3 py-1 rounded text-xs font-bold inline-flex items-center gap-1 ${badgeBg}`}
                  >
                    <Icon size={12} /> {product.subtitle.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-bold text-white mb-3">
                  {product.title}
                </h3>
                <p className="text-gray-400 mb-4">{product.description}</p>
                <p className="text-gray-400 mb-8">{product.details}</p>

                <ul className="text-sm text-gray-500 space-y-2 mb-8">
                  {product.points.map((point, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${bulletColor}`}
                      ></div>
                      {point}
                    </li>
                  ))}
                </ul>

                {/* Botões de Ação */}
                <div className="mt-auto pt-6 flex flex-col sm:flex-row justify-center gap-4">
                  <Button
                    // CORREÇÃO:
                    // 1. Forcei 'shadow-black/20' para garantir que a sombra seja escura e não azul.
                    // 2. Adicionei 'drop-shadow-none' para limpar efeitos externos.
                    className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-full flex items-center justify-center gap-2 w-full sm:w-auto shadow-xl shadow-black/20 drop-shadow-none transition-all border-none"
                    onClick={() => {
                      const phone = "555591261525";
                      const url = `https://wa.me/${phone}?text=${encodeURIComponent(
                        product.message
                      )}`;
                      window.open(url, "_blank");
                    }}
                  >
                    Solicitar Orçamento
                    <ArrowRight size={16} />
                  </Button>

                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-400 hover:text-white px-6 py-3 rounded-full flex items-center justify-center gap-2 w-full sm:w-auto hover:bg-gray-800 transition-all shadow-none"
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
          );
        })}
      </div>
    </Section>
  );
};