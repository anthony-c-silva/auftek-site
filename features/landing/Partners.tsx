"use client";

import React, { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Section } from "../../components/ui/Section";

// --- MAPEAMENTO DE IMAGENS E LINKS ---
const PARTNERS_LIST = [
  { name: "CORSAN", logo: "/images/partners/CORSAN.png", url: "https://corsan.com.br/" },
  { name: "AEGEA", logo: "/images/partners/AEGEA.png", url: "https://www.aegea.com.br/" },
  { name: "ELETROBRAS CEPEL", logo: "/images/partners/ELTROBRAS_CEPEL.png", url: "https://www.cepel.br/" },
  { name: "IEE USP", logo: "/images/partners/IEE USP.png", url: "https://www.iee.usp.br/" },
  { name: "IEM UFSM", logo: "/images/partners/IEM UFSM.png", url: "https://iemufsm.com.br/" },
  { name: "MACKENZIE", logo: "/images/partners/MACKENZIE.png", url: "https://www.mackenzie.br/" },
  { name: "SENAI", logo: "/images/partners/SENAI.png", url: "https://www.senairs.org.br/" },
  { name: "SOLUBIO", logo: "/images/partners/SOLUBIO.png", url: "https://www.solubio.agr.br/" },
  { name: "UFSM", logo: "/images/partners/UFSM.png", url: "https://www.ufsm.br/" },
  { name: "USP", logo: "/images/partners/USP.png", url: "https://www5.usp.br/" },
  { name: "ZEIT", logo: "/images/partners/ZEIT.png", url: "https://zeit.com.br/" },
];

const SUPPORTERS_LIST = [
  { name: "CNPq", logo: "/images/apoios/CNPq.png", url: "https://www.gov.br/cnpq/pt-br" },
  { name: "FAPERGS", logo: "/images/apoios/Fapergs.png", url: "https://fapergs.rs.gov.br/inicial" },
  { name: "FINEP", logo: "/images/apoios/Finep.png", url: "http://www.finep.gov.br/" },
  { name: "NVIDIA", logo: "/images/apoios/Nvidia.png", url: "https://www.nvidia.com/" },
  { name: "PULSAR", logo: "/images/apoios/Pulsar.png", url: "https://www.ufsm.br/orgaos-suplementares/inovatec/pulsar" },
  { name: "SEBRAE", logo: "/images/apoios/Sebrae.png", url: "https://sebrae.com.br/sites/PortalSebrae" },
  { name: "VENTIUR", logo: "/images/apoios/Ventiur.png", url: "https://ventiur.net/" },
];

export const Partners: React.FC = () => {
  const partnersScrollRef = useRef<HTMLDivElement>(null);
  const partnersSpeedRef = useRef(1);

  const supportersScrollRef = useRef<HTMLDivElement>(null);
  const supportersSpeedRef = useRef(1);

  const infinitePartners = [...PARTNERS_LIST, ...PARTNERS_LIST];
  const infiniteSupporters = [...SUPPORTERS_LIST, ...SUPPORTERS_LIST];

  useEffect(() => {
    let animationFrameId: number;

    const step = () => {
      // Animação Parceiros
      if (partnersScrollRef.current) {
        partnersScrollRef.current.scrollLeft += partnersSpeedRef.current;
        const maxScroll1 = partnersScrollRef.current.scrollWidth / 2;

        if (partnersScrollRef.current.scrollLeft >= maxScroll1) {
          partnersScrollRef.current.scrollLeft = partnersScrollRef.current.scrollLeft - maxScroll1;
        } else if (partnersScrollRef.current.scrollLeft <= 0) {
          partnersScrollRef.current.scrollLeft = maxScroll1 + partnersScrollRef.current.scrollLeft;
        }
      }

      // Animação Apoios
      if (supportersScrollRef.current) {
        supportersScrollRef.current.scrollLeft += supportersSpeedRef.current;
        const maxScroll2 = supportersScrollRef.current.scrollWidth / 2;

        if (supportersScrollRef.current.scrollLeft >= maxScroll2) {
          supportersScrollRef.current.scrollLeft = supportersScrollRef.current.scrollLeft - maxScroll2;
        } else if (supportersScrollRef.current.scrollLeft <= 0) {
          supportersScrollRef.current.scrollLeft = maxScroll2 + supportersScrollRef.current.scrollLeft;
        }
      }

      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handlePartnersEnterContainer = () => { partnersSpeedRef.current = 0; };
  const handlePartnersLeaveContainer = () => { partnersSpeedRef.current = 1; };
  const handlePartnersEnterLeft = () => { partnersSpeedRef.current = -10; };
  const handlePartnersLeaveLeft = () => { partnersSpeedRef.current = 0; };
  const handlePartnersEnterRight = () => { partnersSpeedRef.current = 10; };
  const handlePartnersLeaveRight = () => { partnersSpeedRef.current = 0; };

  const handleSupportersEnterContainer = () => { supportersSpeedRef.current = 0; };
  const handleSupportersLeaveContainer = () => { supportersSpeedRef.current = 1; };
  const handleSupportersEnterLeft = () => { supportersSpeedRef.current = -10; };
  const handleSupportersLeaveLeft = () => { supportersSpeedRef.current = 0; };
  const handleSupportersEnterRight = () => { supportersSpeedRef.current = 10; };
  const handleSupportersLeaveRight = () => { supportersSpeedRef.current = 0; };

  return (
      <Section id="parceiros" className="relative overflow-hidden bg-white">
        <div className="relative z-10">

          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0e223b] mb-3">
              Quem usa e apoia
            </h2>
            <p className="text-gray-600 font-bold tracking-widest uppercase text-xs">
              Quem confia e impulsiona nossa tecnologia
            </p>
            <div className="w-24 h-1 bg-auftek-blue mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="max-w-6xl mx-auto">

            {/* --- CARROSEL 1: PARCEIROS --- */}
            <div className="mb-12 px-4 md:px-12">
              <div className="flex items-center justify-center gap-4 mb-10">
                <div className="h-[1px] w-12 bg-gray-300"></div>
                <h3 className="text-center text-gray-500 uppercase tracking-[0.2em] font-bold text-xs">
                  Parceiros Tecnológicos & Clientes
                </h3>
                <div className="h-[1px] w-12 bg-gray-300"></div>
              </div>

              <div
                  className="relative group/carousel"
                  onMouseEnter={handlePartnersEnterContainer}
                  onMouseLeave={handlePartnersLeaveContainer}
              >
                <div
                    className="absolute -left-2 md:-left-10 top-0 bottom-0 z-20 flex items-center justify-center cursor-pointer w-16"
                    onMouseEnter={handlePartnersEnterLeft}
                    onMouseLeave={handlePartnersLeaveLeft}
                >
                  <ChevronLeft
                      size={40}
                      strokeWidth={1.5}
                      className="text-gray-400 hover:text-[#0e223b] hover:scale-125 transition-all duration-300"
                  />
                </div>

                <div
                    ref={partnersScrollRef}
                    className="flex overflow-x-hidden py-4 items-center gap-8 md:gap-12 select-none"
                    style={{ scrollBehavior: "auto" }}
                >
                  {infinitePartners.map((partner, i) => (
                      <div key={i} className="flex-shrink-0 w-40 md:w-52">
                        <a
                            href={partner.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-center h-24 md:h-28 p-3 bg-slate-50 rounded-xl border border-gray-200 shadow-sm hover:border-auftek-green/50 hover:bg-white hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden block"
                        >
                          <img
                              src={partner.logo}
                              alt={`Logo ${partner.name}`}
                              className="max-h-20 w-auto max-w-full object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                              draggable={false}
                          />
                        </a>
                      </div>
                  ))}
                </div>

                <div
                    className="absolute -right-2 md:-right-10 top-0 bottom-0 z-20 flex items-center justify-center cursor-pointer w-16"
                    onMouseEnter={handlePartnersEnterRight}
                    onMouseLeave={handlePartnersLeaveRight}
                >
                  <ChevronRight
                      size={40}
                      strokeWidth={1.5}
                      className="text-gray-400 hover:text-[#0e223b] hover:scale-125 transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* --- CARROSEL 2: APOIOS --- */}
            <div className="mb-10 px-4 md:px-12">
              <div className="flex items-center justify-center gap-4 mb-10">
                <div className="h-[1px] w-12 bg-gray-300"></div>
                <h3 className="text-center text-gray-500 uppercase tracking-[0.2em] font-bold text-xs">
                  Fomento e Apoio Institucional
                </h3>
                <div className="h-[1px] w-12 bg-gray-300"></div>
              </div>

              <div
                  className="relative group/carousel-apoio"
                  onMouseEnter={handleSupportersEnterContainer}
                  onMouseLeave={handleSupportersLeaveContainer}
              >
                <div
                    className="absolute -left-2 md:-left-10 top-0 bottom-0 z-20 flex items-center justify-center cursor-pointer w-16"
                    onMouseEnter={handleSupportersEnterLeft}
                    onMouseLeave={handleSupportersLeaveLeft}
                >
                  <ChevronLeft
                      size={40}
                      strokeWidth={1.5}
                      className="text-gray-400 hover:text-auftek-green hover:scale-125 transition-all duration-300"
                  />
                </div>

                <div
                    ref={supportersScrollRef}
                    className="flex overflow-x-hidden py-4 items-center gap-6 md:gap-8 select-none"
                    style={{ scrollBehavior: "auto" }}
                >
                  {infiniteSupporters.map((supporter, i) => (
                      <div key={i} className="flex-shrink-0 w-32 md:w-44">
                        <a
                            href={supporter.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-center h-24 md:h-28 p-3 bg-slate-50 rounded-xl border border-gray-200 shadow-sm hover:border-auftek-green/50 hover:bg-white hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden block"
                        >
                          <img
                              src={supporter.logo}
                              alt={`Logo ${supporter.name}`}
                              className="max-h-20 w-auto max-w-full object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                              draggable={false}
                          />
                        </a>
                      </div>
                  ))}
                </div>

                <div
                    className="absolute -right-2 md:-right-10 top-0 bottom-0 z-20 flex items-center justify-center cursor-pointer w-16"
                    onMouseEnter={handleSupportersEnterRight}
                    onMouseLeave={handleSupportersLeaveRight}
                >
                  <ChevronRight
                      size={40}
                      strokeWidth={1.5}
                      className="text-gray-400 hover:text-auftek-green hover:scale-125 transition-all duration-300"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </Section>
  );
};