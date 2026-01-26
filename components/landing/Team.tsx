"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Section, SectionTitle } from "../ui/Section";
import { TEAM_MEMBERS } from "@/data/constants";

// --- COMPONENTE CARROSSEL ---
interface InfiniteCarouselProps {
  items: typeof TEAM_MEMBERS;
  baseSpeed?: number;
}

const InfiniteCarousel: React.FC<InfiniteCarouselProps> = ({
                                                             items,
                                                             baseSpeed = 0.6,
                                                           }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef(baseSpeed);
  const animationRef = useRef<number | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [initialScrollLeft, setInitialScrollLeft] = useState(0);

  const infiniteItems = [...items, ...items, ...items, ...items];

  useEffect(() => {
    const animate = () => {
      if (scrollRef.current && !isDragging) {
        scrollRef.current.scrollLeft += speedRef.current;
        const maxScroll = scrollRef.current.scrollWidth / 4;

        if (scrollRef.current.scrollLeft >= maxScroll) {
          scrollRef.current.scrollLeft -= maxScroll;
        } else if (scrollRef.current.scrollLeft <= 0) {
          scrollRef.current.scrollLeft += maxScroll;
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isDragging]);

  const handleMouseEnter = () => { speedRef.current = 0; };
  const handleMouseLeave = () => { speedRef.current = baseSpeed; };
  const handleLeftHover = () => { speedRef.current = -4; };
  const handleRightHover = () => { speedRef.current = 4; };
  const handleArrowLeave = () => { speedRef.current = 0; };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (scrollRef.current?.offsetLeft || 0));
    setInitialScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollRef.current) return;

    const x = e.touches[0].pageX - (scrollRef.current.offsetLeft || 0);
    const walk = (x - startX) * 1.5;

    scrollRef.current.scrollLeft = initialScrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    speedRef.current = baseSpeed;
  };

  return (
      <div
          className="relative group/carousel"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
      >
        {/* Seta Esquerda */}
        <div
            className="hidden md:flex absolute left-0 top-0 bottom-0 z-20 items-center justify-center w-20 cursor-pointer"
            onMouseEnter={handleLeftHover}
            onMouseLeave={handleArrowLeave}
        >
          <ChevronLeft
              size={40}
              className="text-gray-500 hover:text-auftek-blue hover:scale-125 transition-all"
          />
        </div>

        <div
            ref={scrollRef}
            className="flex overflow-x-hidden items-stretch gap-6 select-none cursor-grab active:cursor-grabbing py-10"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
          {infiniteItems.map((member, i) => (
              <div key={i} className="flex-shrink-0 w-[280px] md:w-[320px]">
                <div
                    className="
                h-full bg-[#132644] p-6 rounded-2xl text-center border border-gray-800
                hover:border-auftek-blue/50 hover:bg-[#1a3359] hover:-translate-y-2 hover:shadow-xl
                transition-all duration-300 group/card flex flex-col items-center justify-between
              "
                    onClick={(e) => {
                      if (isDragging) e.preventDefault();
                    }}
                >
                  <div className="w-28 h-28 mx-auto bg-gray-700 rounded-full mb-6 overflow-hidden border-4 border-[#0B1221] shadow-lg group-hover/card:scale-105 transition-transform duration-300">
                    <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="w-full">
                    <h4 className="text-white text-lg font-bold mb-1 group-hover/card:text-auftek-blue transition-colors">
                      {member.name}
                    </h4>
                    <div className="h-[1px] w-12 bg-gray-600 mx-auto my-3 group-hover/card:bg-auftek-blue/50 transition-colors"></div>
                    <p className="text-gray-300 text-sm font-medium">
                      {member.role}
                    </p>
                  </div>
                </div>
              </div>
          ))}
        </div>

        {/* Seta Direita */}
        <div
            className="hidden md:flex absolute right-0 top-0 bottom-0 z-20 items-center justify-center w-20 cursor-pointer "
            onMouseEnter={handleRightHover}
            onMouseLeave={handleArrowLeave}
        >
          <ChevronRight
              size={40}
              className="text-gray-500 hover:text-auftek-blue hover:scale-125 transition-all"
          />
        </div>
      </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
export const Team: React.FC = () => {
  return (
      <Section
          id="time"
          className="pb-32 md:pb-40 relative overflow-hidden"
          darker
      >
        <SectionTitle
            align="center"
            subtitle="Mestres, doutores e especialistas dedicados à inovação."
        >
          Nosso Time
        </SectionTitle>

        <div className="mt-8 md:mt-12 w-full">
          <InfiniteCarousel items={TEAM_MEMBERS} baseSpeed={0.5} />
        </div>
      </Section>
  );
};