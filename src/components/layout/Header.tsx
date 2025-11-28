import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "../../data/constants";
import { useScroll, scrollToElement } from "../../hooks/useScroll";
import { Logo } from "../ui/Logo"; // Importe o novo componente

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrolled = useScroll(50);

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    scrollToElement(href);
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-auftek-dark/95 backdrop-blur-md shadow-lg border-b border-gray-800"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* LOGO AREA */}
        <div
          className="cursor-pointer flex items-center gap-2"
          onClick={() => window.scrollTo(0, 0)}
        >
          {/* Aqui inserimos o SVG. Ajuste o 'h-10' para o tamanho desejado */}
          <Logo className="h-10 w-auto text-white hover:text-auftek-blue transition-colors duration-300" />

          {/* Opcional: Se quiser manter o texto "AUFTEK" ao lado do ícone, descomente abaixo: */}
          {/* <span className="text-2xl font-bold text-white tracking-tighter">AUFTEK<span className="text-auftek-blue">.</span></span> */}
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-300 hover:text-auftek-blue transition-colors"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
            >
              {link.name}
            </a>
          ))}
          <button
            className="px-5 py-2 bg-auftek-blue text-white text-sm font-semibold rounded-full hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30"
            onClick={() => handleNavClick("#contato")}
          >
            Fale Conosco
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-auftek-dark border-b border-gray-800 p-6 absolute w-full animate-fade-in">
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-lg font-medium text-gray-300"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
