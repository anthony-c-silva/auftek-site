import React, { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Section } from "../../components/ui/Section";

// --- IMPORTAÇÃO DOS LOGOS ---
import corsanLogo from "../../assets/images/partners/CORSAN.png";
import aegeaLogo from "../../assets/images/partners/AEGEA.png";
import eletrobrasLogo from "../../assets/images/partners/ELTROBRAS_CEPEL.png";
import ieeUspLogo from "../../assets/images/partners/IEE USP.png";
import iemUfsmLogo from "../../assets/images/partners/IEM UFSM.png";
import mackenzieLogo from "../../assets/images/partners/MACKENZIE.png";
import senaiLogo from "../../assets/images/partners/SENAI.png";
import solubioLogo from "../../assets/images/partners/SOLUBIO.png";
import ufsmLogo from "../../assets/images/partners/UFSM.png";
import uspLogo from "../../assets/images/partners/USP.png";
import zeitLogo from "../../assets/images/partners/ZEIT.png";

// Lista de Dados
const PARTNERS_LIST = [
  { name: "CORSAN", logo: corsanLogo },
  { name: "AEGEA", logo: aegeaLogo },
  { name: "ELETROBRAS CEPEL", logo: eletrobrasLogo },
  { name: "IEE USP", logo: ieeUspLogo },
  { name: "IEM UFSM", logo: iemUfsmLogo },
  { name: "MACKENZIE", logo: mackenzieLogo },
  { name: "SENAI", logo: senaiLogo },
  { name: "SOLUBIO", logo: solubioLogo },
  { name: "UFSM", logo: ufsmLogo },
  { name: "USP", logo: uspLogo },
  { name: "ZEIT", logo: zeitLogo },
];

export const Partners: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  // Controla a velocidade do scroll:
  // 1 = normal, 0 = pausado, 10 = rápido direita, -10 = rápido esquerda
  const speedRef = useRef(1);

  // Duplicamos a lista para criar o efeito de loop infinito
  const infiniteList = [...PARTNERS_LIST, ...PARTNERS_LIST];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;

    const step = () => {
      if (scrollContainer) {
        // Aplica a velocidade atual
        scrollContainer.scrollLeft += speedRef.current;

        // --- LÓGICA DO LOOP INFINITO ---
        const maxScroll = scrollContainer.scrollWidth / 2; // Metade do conteúdo duplicado

        // Se chegou no fim (direita), volta pro começo
        if (scrollContainer.scrollLeft >= maxScroll) {
          scrollContainer.scrollLeft = scrollContainer.scrollLeft - maxScroll;
        }
        // Se chegou no começo (esquerda/ré), pula pro "final" virtual
        else if (scrollContainer.scrollLeft <= 0) {
          scrollContainer.scrollLeft = maxScroll + scrollContainer.scrollLeft;
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    // Inicia a animação
    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Handlers para alterar a velocidade baseado no Mouse
  const handleMouseEnterContainer = () => { speedRef.current = 0; }; // Pausa ao ler
  const handleMouseLeaveContainer = () => { speedRef.current = 1; }; // Retoma suave

  const handleMouseEnterLeft = () => { speedRef.current = -10; }; // Rápido para Esquerda
  const handleMouseLeaveLeft = () => { speedRef.current = 0; };   // Volta a pausar (pois está dentro do container)

  const handleMouseEnterRight = () => { speedRef.current = 10; }; // Rápido para Direita
  const handleMouseLeaveRight = () => { speedRef.current = 0; };  // Volta a pausar

  return (
      <Section id="parceiros" className="relative overflow-hidden bg-white">
        <div className="relative z-10">

          {/* CABEÇALHO */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0e223b] mb-3">
              Quem usa e apoia
            </h2>
            <p className="text-gray-600 font-bold tracking-widest uppercase text-xs">
              Quem confia e impulsiona nossa tecnologia
            </p>
            <div className="w-24 h-1 bg-auftek-blue mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="max-w-6xl mx-auto mt-12">

            <div className="mb-20 px-4 md:px-12">
              <div className="flex items-center justify-center gap-4 mb-10">
                <div className="h-[1px] w-12 bg-gray-300"></div>
                <h3 className="text-center text-gray-500 uppercase tracking-[0.2em] font-bold text-xs">
                  Parceiros Tecnológicos & Clientes
                </h3>
                <div className="h-[1px] w-12 bg-gray-300"></div>
              </div>

              {/* Container Relativo */}
              <div
                  className="relative group/carousel"
                  onMouseEnter={handleMouseEnterContainer}
                  onMouseLeave={handleMouseLeaveContainer}
              >

                {/* --- BOTÃO ESQUERDA (ZONA DE ACELERAÇÃO) --- */}
                <div
                    className="absolute -left-2 md:-left-10 top-0 bottom-0 z-20 flex items-center justify-center cursor-pointer w-16"
                    onMouseEnter={handleMouseEnterLeft}
                    onMouseLeave={handleMouseLeaveLeft}
                >
                  <ChevronLeft
                      size={40}
                      strokeWidth={1.5}
                      className="text-gray-400 hover:text-[#0e223b] hover:scale-125 transition-all duration-300"
                  />
                </div>

                {/* Viewport do Scroll */}
                <div
                    ref={scrollRef}
                    className="flex overflow-x-hidden py-4 items-center gap-8 md:gap-12 select-none"
                    style={{ scrollBehavior: "auto" }}
                >
                  {infiniteList.map((partner, i) => (
                      <div
                          key={i}
                          className="flex-shrink-0 w-40 md:w-52"
                      >
                        <div className="group flex items-center justify-center h-32 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-[#0e223b] hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-grab active:cursor-grabbing">
                          <img
                              src={partner.logo}
                              alt={`Logo ${partner.name}`}
                              className="max-h-20 w-auto max-w-full object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                              draggable={false}
                          />
                        </div>
                      </div>
                  ))}
                </div>

                {/* --- BOTÃO DIREITA (ZONA DE ACELERAÇÃO) --- */}
                <div
                    className="absolute -right-2 md:-right-10 top-0 bottom-0 z-20 flex items-center justify-center cursor-pointer w-16"
                    onMouseEnter={handleMouseEnterRight}
                    onMouseLeave={handleMouseLeaveRight}
                >
                  <ChevronRight
                      size={40}
                      strokeWidth={1.5}
                      className="text-gray-400 hover:text-[#0e223b] hover:scale-125 transition-all duration-300"
                  />
                </div>

              </div>
            </div>

            {/* --- GRUPO 2: FOMENTO --- */}
            <div>
              <div className="flex items-center justify-center gap-4 mb-10">
                <div className="h-[1px] w-12 bg-gray-300"></div>
                <h3 className="text-center text-gray-500 uppercase tracking-[0.2em] font-bold text-xs">
                  Fomento e Apoio Institucional
                </h3>
                <div className="h-[1px] w-12 bg-gray-300"></div>
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
                        className="group flex items-center justify-center px-8 py-4 bg-slate-50 rounded-lg border border-gray-200 hover:border-auftek-green/50 hover:bg-white hover:shadow-md transition-all duration-300"
                    >
                  <span className="font-bold text-gray-600 group-hover:text-[#0e223b] transition-colors text-sm tracking-wide">
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