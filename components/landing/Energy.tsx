"use client";
import React, { useState } from "react";
import {
  Zap,
  Cpu,
  Youtube,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { Section, SectionTitle } from "../ui/Section";
import { Button } from "../ui/Button";

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
    images: ["/images/ircct1.jpeg", "/images/ircct2.jpeg", "/images/ircct3.jpeg"],
    icon: Cpu,
    youtubeLink:
      "https://www.youtube.com/playlist?list=PLikkF_yABojGV-2xLF1zsSfi1CkttXdyR",
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
      contactSection.scrollIntoView({ behavior: "smooth" });

      setTimeout(() => {
        const event = new CustomEvent("prefillContact", {
          detail: product.contactMessage,
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
        {/* --- CABEÇALHO (NÃO ALTERADO) --- */}
        <div className="mb-10">
          <SectionTitle align="center" subtitle="Soluções em Energia">
            Instrumentação para acreditação de inversores
          </SectionTitle>
        </div>

        {/* --- SWITCHER (NÃO ALTERADO) --- */}
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
            />

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

        {/* --- CARD DO PRODUTO (REFATORADO PARA MOBILE) --- */}
        <div
          className={`
            bg-[#112240] rounded-3xl overflow-hidden border transition-colors duration-500 shadow-2xl
            ${activeTab === "pvag" ? "border-yellow-500/30" : "border-cyan-400/30"}
          `}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* ✅ MOBILE: Galeria primeiro */}
            <div className="relative bg-gray-900 overflow-hidden group order-1 lg:order-2">
              <div
                className={`absolute inset-0 opacity-20 mix-blend-overlay ${theme.bg}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#112240] via-transparent to-transparent z-10" />

              {/* Altura previsível no mobile via aspect-ratio */}
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-full">
                <img
                  key={`${product.id}-${currentImageIndex}`}
                  src={product.images[currentImageIndex]}
                  alt={product.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-85 animate-in fade-in duration-500"
                />
              </div>

              {/* Controles: visíveis no mobile; hover no desktop */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="
                      absolute left-3 top-1/2 -translate-y-1/2 z-30
                      p-3 rounded-full bg-black/55 text-white hover:bg-black/80 transition-all
                      opacity-100 lg:opacity-0 lg:group-hover:opacity-100
                    "
                    aria-label="Imagem anterior"
                  >
                    <ChevronLeft size={22} />
                  </button>

                  <button
                    onClick={nextImage}
                    className="
                      absolute right-3 top-1/2 -translate-y-1/2 z-30
                      p-3 rounded-full bg-black/55 text-white hover:bg-black/80 transition-all
                      opacity-100 lg:opacity-0 lg:group-hover:opacity-100
                    "
                    aria-label="Próxima imagem"
                  >
                    <ChevronRight size={22} />
                  </button>

                  <div
                    className="
                      absolute top-3 right-3 z-30 flex gap-2
                      opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity
                    "
                  >
                    {product.images.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-2 rounded-full transition-all ${
                          idx === currentImageIndex
                            ? "bg-white w-5"
                            : "bg-white/45 w-2"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* ✅ Conteúdo: mais compacto no mobile + detalhes colapsáveis (mobile) / sempre aberto (desktop) */}
            <div
              className="
                order-2 lg:order-1
                p-6 sm:p-8 md:p-10
                flex flex-col
                animate-in fade-in slide-in-from-left-4 duration-500
              "
              key={activeTab}
            >
              <div className="flex items-start gap-4 mb-5">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${theme.softBg} ${theme.primary}`}
                >
                  <Icon size={26} />
                </div>

                <div className="min-w-0">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                    {product.title}
                  </h3>
                  <span
                    className={`text-xs sm:text-sm font-semibold tracking-wide uppercase ${theme.primary}`}
                  >
                    {product.subtitle}
                  </span>
                </div>
              </div>

              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                {product.description}
              </p>

              {/* ====== DETALHES TÉCNICOS ====== */}

              {/* MOBILE: colapsável com animação + seta */}
              <div className="mt-6 lg:hidden">
                <details className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 group">
                  <summary className="cursor-pointer select-none font-semibold text-gray-200 flex items-center justify-between list-none">
                    <span>Detalhes técnicos</span>

                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/5 transition">
                      <ChevronDown
                        size={18}
                        className="text-gray-400 transition-transform duration-300 group-open:rotate-180"
                        aria-hidden="true"
                      />
                    </span>
                  </summary>

                  <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-open:grid-rows-[1fr]">
                    <div className="overflow-hidden">
                      <ul className="space-y-3 mt-4">
                        {product.points.map((point, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-gray-300/90 text-sm"
                          >
                            <div
                              className={`w-2 h-2 rounded-full mt-2 shrink-0 ${theme.bullet}`}
                            />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </details>
              </div>

              {/* DESKTOP: sempre aberto (sem botão) */}
              <div className="hidden lg:block mt-6">
                <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
                  <div className="font-semibold text-gray-200">
                    Detalhes técnicos
                  </div>

                  <ul className="space-y-3 mt-4">
                    {product.points.map((point, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-gray-300/90 text-base"
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-2 shrink-0 ${theme.bullet}`}
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Ações */}
              <div className="flex flex-col gap-3 mt-6 sm:mt-8">
                <Button
                  className={`${theme.bg} ${theme.hoverBg} text-black font-bold px-4 py-4 rounded-full flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-lg shadow-black/20`}
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
          </div>
        </div>
        {/* --- FIM DO CARD --- */}
      </div>
    </Section>
  );
};
