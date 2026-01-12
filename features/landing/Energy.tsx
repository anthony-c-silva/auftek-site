"use client";
import React, { useState } from "react";
import {
  Zap,
  Cpu,
  Youtube,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Section, SectionTitle } from "../../components/ui/Section";
import { Button } from "../../components/ui/Button";

// Dados dos produtos
const PRODUCTS = {
  pvag: {
    id: "pvag",
    title: "PVAG Lab",
    subtitle: "Gerador de arco elétrico DC",
    description:
      "Sistema modular de precisão para emulação controlada de arcos elétricos em corrente contínua. Essencial para ensaios de segurança e certificação conforme a IEC 63027 e Portaria 140 Inmetro.",
    points: [
      "Emulação precisa de arcos em DC",
      "Atende aos requisitos da Norma IEC 63027",
      "Sistema modular para ensaios em inversores e micro inversores",
      "Projetado para uso em laboratórios de acreditação e ensaios de conformidade",
    ],
    images: ["/images/PVAG.jpeg", "/images/PVAG2.jpeg", "/images/PVAG3.jpeg"],
    icon: Zap,
    youtubeLink:
      "https://www.youtube.com/playlist?list=PLikkF_yABojGV-2xLF1zsSfi1CkttXdyR",
    // Renomeado de whatsappMessage para contactMessage
    contactMessage:
      "Olá! Gostaria de receber um orçamento técnico para o sistema PVAG LAB.",
    theme: {
      primary: "text-yellow-500",
      bg: "bg-yellow-500",
      border: "border-yellow-500",
      hoverBg: "hover:bg-yellow-600",
      softBg: "bg-yellow-500/10",
      glow: "shadow-yellow-500/20",
      bullet: "bg-yellow-500",
    },
  },
  ircct: {
    id: "ircct",
    title: "IRCCT System",
    subtitle: "Fuga de Corrente residual",
    description:
      "Sistema modular de alta precisão para ensaios de corrente residual e resistência de isolação em inversores fotovoltaicos sem transformador, conforme as normas IEC 62109-2 e IEC 63112, atendendo à Portaria Inmetro nº 140.",
    points: [
      "Ensaios de corrente residual contínua e variação rápida",
      "Conformidade com IEC 62109-2 e IEC 63112",
      "Aplicável aos resíduos de segurança da Portaria inmetro nº 140",
      "Sistema modular para inversores até 75 KW",
    ],
    images: ["/images/IRCCT1.jpg", "/images/IRCCT2.jpg"],
    icon: Cpu,
    youtubeLink:
      "https://www.youtube.com/playlist?list=PLikkF_yABojGV-2xLF1zsSfi1CkttXdyR",
    // Renomeado de whatsappMessage para contactMessage
    contactMessage:
      "Olá! Gostaria de receber um orçamento técnico para o sistema IRCCT.",
    theme: {
      primary: "text-cyan-400",
      bg: "bg-cyan-400",
      border: "border-cyan-400",
      hoverBg: "hover:bg-cyan-500",
      softBg: "bg-cyan-400/10",
      glow: "shadow-cyan-400/20",
      bullet: "bg-cyan-400",
    },
  },
};

export const Energy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"pvag" | "ircct">("pvag");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const product = PRODUCTS[activeTab];
  const Icon = product.icon;
  const theme = product.theme;

  const handleTabChange = (tab: "pvag" | "ircct") => {
    setActiveTab(tab);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  // --- LÓGICA PADRONIZADA (IGUAL AO BIOAILAB) ---
  const handleQuoteClick = () => {
    const contactSection = document.getElementById("contato");

    if (contactSection) {
      // 1. Scroll suave até a seção de contato
      contactSection.scrollIntoView({ behavior: "smooth" });

      // 2. Dispara evento com a mensagem específica do produto selecionado
      setTimeout(() => {
        const event = new CustomEvent("prefillContact", {
          detail: product.contactMessage, // Usa a mensagem do produto atual
        });
        window.dispatchEvent(event);
      }, 300);
    }
  };
  // ----------------------------------------------

  return (
    <Section
      id="energia"
      className="bg-[#0e223b] py-20 transition-colors duration-500"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* --- CABEÇALHO --- */}
        <div className="mb-10">
          <SectionTitle align="center" subtitle="Soluções em Energia">
            Instrumentação para acreditação de inversores
          </SectionTitle>
        </div>

        {/* --- SWITCHER (Abas) --- */}
        <div className="flex justify-center mb-12">
          <div className="bg-black/30 backdrop-blur-md p-1.5 rounded-full border border-white/10 shadow-2xl flex w-full max-w-md relative">
            <div
              className={`
                absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-full transition-all duration-500 ease-out shadow-lg
                ${
                  activeTab === "pvag"
                    ? "left-1.5 bg-gray-800 border border-yellow-500/40 shadow-[0_0_15px_-3px_rgba(234,179,8,0.3)]"
                    : "left-[calc(50%+3px)] bg-gray-800 border border-cyan-400/40 shadow-[0_0_15px_-3px_rgba(34,211,238,0.3)]"
                }
              `}
            ></div>

            <button
              onClick={() => handleTabChange("pvag")}
              className={`flex-1 relative z-10 py-3 text-sm font-bold rounded-full transition-colors flex items-center justify-center gap-2 ${
                activeTab === "pvag"
                  ? "text-yellow-400"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <Zap size={18} /> PVAG Lab
            </button>

            <button
              onClick={() => handleTabChange("ircct")}
              className={`flex-1 relative z-10 py-3 text-sm font-bold rounded-full transition-colors flex items-center justify-center gap-2 ${
                activeTab === "ircct"
                  ? "text-cyan-400"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <Cpu size={18} /> IRCCT System
            </button>
          </div>
        </div>

        {/* --- CARD DO PRODUTO --- */}
        <div
          className={`
          bg-[#112240] rounded-3xl overflow-hidden border transition-colors duration-500 shadow-2xl
          ${
            activeTab === "pvag" ? "border-yellow-500/30" : "border-cyan-400/30"
          }
        `}
        >
          <div className="grid lg:grid-cols-2">
            {/* Coluna Esquerda: Informações */}
            <div className="p-8 md:p-12 flex flex-col justify-center animate-in fade-in slide-in-from-left-4 duration-500 key={activeTab}">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${theme.softBg} ${theme.primary}`}
                >
                  <Icon size={28} />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white leading-tight">
                    {product.title}
                  </h3>
                  <span
                    className={`text-sm font-semibold tracking-wide uppercase ${theme.primary}`}
                  >
                    {product.subtitle}
                  </span>
                </div>
              </div>

              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                {product.description}
              </p>

              <ul className="space-y-3 mb-10">
                {product.points.map((point, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-400">
                    <div
                      className={`w-2 h-2 rounded-full ${theme.bullet}`}
                    ></div>
                    {point}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-4 mt-auto">
                <Button
                  className={`${theme.bg} ${theme.hoverBg} text-black font-bold px-4 py-4 rounded-full flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-lg shadow-black/20`}
                  onClick={handleQuoteClick}
                >
                  Solicitar Orçamento <ArrowRight size={18} />
                </Button>

                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:text-white hover:border-white hover:bg-white/5 px-4 py-4 rounded-full flex items-center justify-center gap-2"
                  onClick={() => window.open(product.youtubeLink, "_blank")}
                >
                  <Youtube size={20} /> Ver Demonstração
                </Button>
              </div>
            </div>

            {/* Coluna Direita: Galeria de Imagens */}
            <div className="relative h-64 lg:h-auto bg-gray-900 overflow-hidden group">
              <div
                className={`absolute inset-0 opacity-20 mix-blend-overlay ${theme.bg}`}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#112240] via-transparent to-transparent z-10"></div>

              <img
                key={`${product.id}-${currentImageIndex}`}
                src={product.images[currentImageIndex]}
                alt={product.title}
                className="w-full h-full object-cover opacity-80 animate-in fade-in duration-500"
              />

              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight size={24} />
                  </button>

                  <div className="absolute top-4 right-4 z-30 flex gap-2">
                    {product.images.map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentImageIndex
                            ? "bg-white w-4"
                            : "bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};
