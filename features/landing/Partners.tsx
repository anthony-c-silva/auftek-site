"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Section } from "../../components/ui/Section";

// --- DADOS ---
const PARTNERS_LIST = [
  {
    name: "CORSAN",
    logo: "/images/partners/CORSAN.png",
    url: "https://corsan.com.br/",
  },
  {
    name: "AEGEA",
    logo: "/images/partners/AEGEA.png",
    url: "https://www.aegea.com.br/",
  },
  {
    name: "ELETROBRAS CEPEL",
    logo: "/images/partners/ELTROBRAS_CEPEL.png",
    url: "https://www.cepel.br/",
  },
  {
    name: "IEE USP",
    logo: "/images/partners/IEE USP.png",
    url: "https://www.iee.usp.br/",
  },
  {
    name: "IEM UFSM",
    logo: "/images/partners/IEM UFSM.png",
    url: "https://iemufsm.com.br/",
  },
  {
    name: "MACKENZIE",
    logo: "/images/partners/MACKENZIE.png",
    url: "https://www.mackenzie.br/",
  },
  {
    name: "SENAI",
    logo: "/images/partners/SENAI.png",
    url: "https://www.senairs.org.br/",
  },
  {
    name: "SOLUBIO",
    logo: "/images/partners/SOLUBIO.png",
    url: "https://www.solubio.agr.br/",
  },
  {
    name: "UFSM",
    logo: "/images/partners/UFSM.png",
    url: "https://www.ufsm.br/",
  },
  {
    name: "USP",
    logo: "/images/partners/USP.png",
    url: "https://www5.usp.br/",
  },
  {
    name: "ZEIT",
    logo: "/images/partners/ZEIT.png",
    url: "https://zeit.com.br/",
  },
];

const SUPPORTERS_LIST = [
  {
    name: "CNPq",
    logo: "/images/apoios/CNPq.png",
    url: "https://www.gov.br/cnpq/pt-br",
  },
  {
    name: "FAPERGS",
    logo: "/images/apoios/Fapergs.png",
    url: "https://fapergs.rs.gov.br/inicial",
  },
  {
    name: "FINEP",
    logo: "/images/apoios/Finep.png",
    url: "http://www.finep.gov.br/",
  },
  {
    name: "NVIDIA",
    logo: "/images/apoios/Nvidia.png",
    url: "https://www.nvidia.com/",
  },
  {
    name: "PULSAR",
    logo: "/images/apoios/Pulsar.png",
    url: "https://www.ufsm.br/orgaos-suplementares/inovatec/pulsar",
  },
  {
    name: "SEBRAE",
    logo: "/images/apoios/Sebrae.png",
    url: "https://sebrae.com.br/sites/PortalSebrae",
  },
  {
    name: "VENTIUR",
    logo: "/images/apoios/Ventiur.png",
    url: "https://ventiur.net/",
  },
];

// --- COMPONENTE CARROSSEL REUTILIZÁVEL ---
interface InfiniteCarouselProps {
  items: typeof PARTNERS_LIST;
  baseSpeed?: number;
  hoverColor?: string; // Cor da borda ao passar o mouse
}

const InfiniteCarousel: React.FC<InfiniteCarouselProps> = ({
  items,
  baseSpeed = 1,
  hoverColor = "border-auftek-green/50",
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const speedRef = useRef(baseSpeed);
  const animationRef = useRef<number | null>(null);

  // Criamos uma lista x4 para garantir loop infinito suave em telas grandes
  const infiniteItems = [...items, ...items, ...items, ...items];

  // Lógica de Animação e Loop
  const animate = useCallback(() => {
    if (scrollRef.current && !isDragging) {
      scrollRef.current.scrollLeft += speedRef.current;

      const maxScroll = scrollRef.current.scrollWidth / 4; // 1/4 pois quadruplicamos a lista

      // Correção da "Travadinha": Subtrai o valor exato em vez de resetar para 0
      // Isso mantém a fluidez dos sub-pixels
      if (scrollRef.current.scrollLeft >= maxScroll) {
        scrollRef.current.scrollLeft -= maxScroll;
      } else if (scrollRef.current.scrollLeft <= 0) {
        scrollRef.current.scrollLeft += maxScroll;
      }
    }
    animationRef.current = requestAnimationFrame(animate);
  }, [isDragging]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  // Controles de Mouse (Desktop)
  const handleMouseEnter = () => {
    speedRef.current = 0;
  };
  const handleMouseLeave = () => {
    speedRef.current = baseSpeed;
  };
  const handleLeftHover = () => {
    speedRef.current = -5;
  }; // Velocidade manual
  const handleRightHover = () => {
    speedRef.current = 5;
  };
  const handleArrowLeave = () => {
    speedRef.current = 0;
  }; // Para no hover da seta

  // Controles de Toque (Mobile - Swipe)
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault(); // Evita scroll da página enquanto arrasta o carrossel
    const x = e.touches[0].pageX - (scrollRef.current.offsetLeft || 0);
    const walk = (x - startX) * 1.5; // * 1.5 para dar uma sensação mais ágil ao dedo
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    speedRef.current = baseSpeed; // Retoma o movimento automático
  };

  return (
    <div
      className="relative group/carousel py-4"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Seta Esquerda (Apenas Desktop) */}
      <div
        className="hidden md:flex absolute left-0 top-0 bottom-0 z-20 items-center justify-center w-16 cursor-pointer bg-gradient-to-r from-white via-white/80 to-transparent"
        onMouseEnter={handleLeftHover}
        onMouseLeave={handleArrowLeave}
      >
        <ChevronLeft
          size={40}
          className="text-gray-400 hover:text-[#0e223b] hover:scale-125 transition-all"
        />
      </div>

      {/* Container de Scroll */}
      <div
        ref={scrollRef}
        className="flex overflow-x-hidden items-center gap-8 md:gap-12 select-none cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {infiniteItems.map((item, i) => (
          <div key={i} className="flex-shrink-0 w-36 md:w-52">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center justify-center h-24 md:h-28 p-3 bg-slate-50 rounded-xl border border-gray-200 shadow-sm hover:${hoverColor} hover:bg-white hover:shadow-md transition-all duration-300 hover:-translate-y-1 block`}
              // Prevenir clique acidental ao arrastar no mobile
              onClick={(e) => {
                if (isDragging) e.preventDefault();
              }}
            >
              <img
                src={item.logo}
                alt={`Logo ${item.name}`}
                className="max-h-16 md:max-h-20 w-auto max-w-full object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
              />
            </a>
          </div>
        ))}
      </div>

      {/* Seta Direita (Apenas Desktop) */}
      <div
        className="hidden md:flex absolute right-0 top-0 bottom-0 z-20 items-center justify-center w-16 cursor-pointer bg-gradient-to-l from-white via-white/80 to-transparent"
        onMouseEnter={handleRightHover}
        onMouseLeave={handleArrowLeave}
      >
        <ChevronRight
          size={40}
          className="text-gray-400 hover:text-[#0e223b] hover:scale-125 transition-all"
        />
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
export const Partners: React.FC = () => {
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
          <div className="mb-12 px-0 md:px-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-[1px] w-12 bg-gray-300"></div>
              <h3 className="text-center text-gray-500 uppercase tracking-[0.2em] font-bold text-xs">
                Parceiros Tecnológicos & Clientes
              </h3>
              <div className="h-[1px] w-12 bg-gray-300"></div>
            </div>

            <InfiniteCarousel
              items={PARTNERS_LIST}
              baseSpeed={0.8}
              hoverColor="border-auftek-green/50"
            />
          </div>

          {/* --- CARROSEL 2: APOIOS --- */}
          <div className="mb-10 px-0 md:px-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-[1px] w-12 bg-gray-300"></div>
              <h3 className="text-center text-gray-500 uppercase tracking-[0.2em] font-bold text-xs">
                Fomento e Apoio Institucional
              </h3>
              <div className="h-[1px] w-12 bg-gray-300"></div>
            </div>

            <InfiniteCarousel
              items={SUPPORTERS_LIST}
              baseSpeed={0.8}
              hoverColor="border-blue-400/50"
            />
          </div>
        </div>
      </div>
    </Section>
  );
};
