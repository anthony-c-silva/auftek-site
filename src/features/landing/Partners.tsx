import React, { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Section } from "../../components/ui/Section";

// --- IMPORTS DE PARCEIROS ---
// Certifique-se que o caminho ../../ está correto para onde este arquivo Partners.tsx está salvo.
// Se der erro de 'Module not found', tente mudar para '../assets' em vez de '../../assets'

import corsanLogo from "../../assets/images/partners/CORSAN.png";
import aegeaLogo from "../../assets/images/partners/AEGEA.png";
// Mantido ELTROBRAS conforme o nome do arquivo no seu print (sem o primeiro E)
import eletrobrasLogo from "../../assets/images/partners/ELTROBRAS_CEPEL.png";
// CORRIGIDO: Renomeie o arquivo na pasta para IEE_USP.png
import ieeUspLogo from "../../assets/images/partners/IEE_USP.png";
// CORRIGIDO: Renomeie o arquivo na pasta para IEM_UFSM.png
import iemUfsmLogo from "../../assets/images/partners/IEM_UFSM.png";
import mackenzieLogo from "../../assets/images/partners/MACKENZIE.png";
import senaiLogo from "../../assets/images/partners/SENAI.png";
import solubioLogo from "../../assets/images/partners/SOLUBIO.png";
import ufsmLogo from "../../assets/images/partners/UFSM.png";
import uspLogo from "../../assets/images/partners/USP.png";
import zeitLogo from "../../assets/images/partners/ZEIT.png";

// --- IMPORTS DE APOIO ---
import cnpqLogo from "../../assets/images/apoios/CNPq.svg";
import fapergsLogo from "../../assets/images/apoios/Fapergs.svg";
import finepLogo from "../../assets/images/apoios/Finep.svg";
import nvidiaLogo from "../../assets/images/apoios/Nvidia.svg";
import pulsarLogo from "../../assets/images/apoios/Pulsar.svg";
import sebraeLogo from "../../assets/images/apoios/Sebrae.svg";
import ventiurLogo from "../../assets/images/apoios/Ventiur.svg";

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

const SUPPORTERS_LIST = [
  { name: "CNPq", logo: cnpqLogo },
  { name: "FAPERGS", logo: fapergsLogo },
  { name: "FINEP", logo: finepLogo },
  { name: "NVIDIA", logo: nvidiaLogo },
  { name: "PULSAR", logo: pulsarLogo },
  { name: "SEBRAE", logo: sebraeLogo },
  { name: "VENTIUR", logo: ventiurLogo },
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
      if (partnersScrollRef.current) {
        partnersScrollRef.current.scrollLeft += partnersSpeedRef.current;
        const maxScroll1 = partnersScrollRef.current.scrollWidth / 2;
        if (partnersScrollRef.current.scrollLeft >= maxScroll1) {
          partnersScrollRef.current.scrollLeft = partnersScrollRef.current.scrollLeft - maxScroll1;
        } else if (partnersScrollRef.current.scrollLeft <= 0) {
          partnersScrollRef.current.scrollLeft = maxScroll1 + partnersScrollRef.current.scrollLeft;
        }
      }

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
                    className="flex overflow-x-hidden py-4 items-center gap-8 md:gap-12 select-none"
                    style={{ scrollBehavior: "auto" }}
                >
                  {infiniteSupporters.map((supporter, i) => (
                      <div key={i} className="flex-shrink-0 w-40 md:w-52">
                        <div className="group flex items-center justify-center h-32 p-4 bg-slate-50 rounded-xl border border-gray-200 shadow-sm hover:border-auftek-green/50 hover:bg-white hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-grab active:cursor-grabbing overflow-hidden">
                          <img
                              src={supporter.logo}
                              alt={`Logo ${supporter.name}`}
                              className="max-h-20 w-auto max-w-full object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                              draggable={false}
                          />
                        </div>
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