import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "../../data/constants";
import { useScroll, scrollToElement } from "../../hooks/useScroll";
import { Logo } from "../ui/Logo";

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrolled = useScroll(50);

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    scrollToElement(href);
  };

  return (
    <nav
      // FIX 1: Adicionado 'top-0 left-0' para garantir posição exata.
      // FIX 2: Alterado 'border-gray-800' para 'border-white/10'.
      // A borda cinza sólida (gray-800) criava o efeito de "linha branca" forte.
      // A borda com opacidade (white/10) é mais sutil e se adapta ao fundo.
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-auftek-dark/95 backdrop-blur-md shadow-lg border-b border-white/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* LOGO AREA */}
        <div
          className="cursor-pointer flex items-center gap-2"
          onClick={() => window.scrollTo(0, 0)}
        >
          <Logo className="h-8 md:h-10 w-auto text-white hover:text-auftek-blue transition-colors duration-300" />
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
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
          className="lg:hidden text-white p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Abrir menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-20 bg-auftek-dark/95 backdrop-blur-xl border-t border-white/10 p-6 flex flex-col h-[calc(100vh-5rem)] overflow-y-auto animate-fade-in z-40">
          <div className="flex flex-col gap-6 items-center justify-center flex-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-2xl font-bold text-gray-300 hover:text-white transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
              >
                {link.name}
              </a>
            ))}
            <button
              className="mt-8 px-8 py-3 bg-auftek-blue text-white text-lg font-bold rounded-full shadow-lg shadow-blue-500/30 w-full max-w-xs"
              onClick={() => handleNavClick("#contato")}
            >
              Fale Conosco
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};