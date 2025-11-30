import React, { useState, useEffect } from "react";
import { Linkedin, ChevronLeft, ChevronRight } from "lucide-react";
import { Section, SectionTitle } from "../../components/ui/Section";
import { TEAM_MEMBERS } from "../../data/constants";

export const Team: React.FC = () => {
  // Estado para controlar o índice atual do carrossel
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  // Lógica para responsividade (quantos cards aparecem por vez)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerPage(1); // Mobile
      else if (window.innerWidth < 1024) setItemsPerPage(2); // Tablet
      else setItemsPerPage(4); // Desktop
    };

    handleResize(); // Inicializa
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Funções de Navegação
  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev + 1 > TEAM_MEMBERS.length - itemsPerPage ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? TEAM_MEMBERS.length - itemsPerPage : prev - 1
    );
  };

  // Caso tenhamos menos membros que o espaço disponível, não precisa deslizar
  const canSlide = TEAM_MEMBERS.length > itemsPerPage;

  return (
    <Section id="time" className="relative overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-auftek-dark via-[#0f1e33] to-auftek-dark -z-10"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <SectionTitle
            align="center"
            subtitle="Por trás de cada solução, há um time de especialistas apaixonados."
          >
            Quem faz acontecer
          </SectionTitle>
        </div>

        {/* --- CARROSSEL CONTAINER --- */}
        <div className="relative group/carousel">
          {/* Botão Anterior (Só aparece se puder deslizar) */}
          {canSlide && (
            <button
              onClick={prevSlide}
              className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-auftek-dark border border-gray-700 text-white shadow-lg hover:border-auftek-blue hover:text-auftek-blue transition-all disabled:opacity-50"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Janela de Visualização (Viewport) */}
          <div className="overflow-hidden px-2 py-4">
            {" "}
            {/* Padding para shadows não cortarem */}
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / itemsPerPage)
                }%)`,
              }}
            >
              {TEAM_MEMBERS.map((member, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / itemsPerPage}%` }}
                >
                  {/* --- CARD DO MEMBRO --- */}
                  <div className="group relative bg-[#132338] rounded-2xl border border-gray-800 overflow-hidden hover:border-auftek-blue/50 hover:shadow-[0_0_30px_-10px_rgba(30,144,255,0.3)] transition-all duration-300 h-full flex flex-col">
                    {/* Imagem */}
                    <div className="aspect-[4/5] overflow-hidden relative">
                      <div className="absolute inset-0 bg-auftek-blue/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      />
                    </div>

                    {/* Informações */}
                    <div className="p-6 flex flex-col flex-grow bg-gradient-to-b from-[#132338] to-[#0e1a2b]">
                      <h4 className="text-xl font-bold text-white mb-1 group-hover:text-auftek-blue transition-colors">
                        {member.name}
                      </h4>
                      <p className="text-sm text-gray-400 font-medium mb-6 uppercase tracking-wider">
                        {member.role}
                      </p>

                      {/* Ícone Social (Push to bottom) */}
                      <div className="mt-auto pt-4 border-t border-gray-700/50 flex justify-between items-center">
                        <a
                          href="#"
                          className="text-gray-500 hover:text-white transition-colors"
                        >
                          <Linkedin size={20} />
                        </a>
                        <div className="h-1 w-1 rounded-full bg-gray-600 group-hover:bg-auftek-green transition-colors"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botão Próximo */}
          {canSlide && (
            <button
              onClick={nextSlide}
              className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-auftek-dark border border-gray-700 text-white shadow-lg hover:border-auftek-blue hover:text-auftek-blue transition-all"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>

        {/* Paginação (Dots) */}
        {canSlide && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: TEAM_MEMBERS.length - itemsPerPage + 1 }).map(
              (_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === idx
                      ? "w-8 bg-auftek-blue"
                      : "w-2 bg-gray-700 hover:bg-gray-500"
                  }`}
                />
              )
            )}
          </div>
        )}
      </div>
    </Section>
  );
};
