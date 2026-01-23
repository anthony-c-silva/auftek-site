"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Globe } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { NAV_LINKS } from "../../data/constants";
import { useScroll, scrollToElement } from "../../hooks/useScroll";
import { Logo } from "../ui/Logo";
import { cn } from "../../lib/utils";

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const scrolled = useScroll(20); // Gatilho mais rápido (20px)

  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";

  // Idioma atual
  const [lang, setLang] = useState("pt");

  const languages = [
    { code: "pt", label: "Português", flag: "🇧🇷" },
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "es", label: "Español", flag: "🇪🇸" },
  ];

  const activeLang = languages.find((l) => l.code === lang)!;

  // Bloqueia o scroll do corpo quando o menu mobile está aberto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  const handleLangChange = (code: string) => {
    setLang(code);
    setDropdownOpen(false);
  };

  const handleNavigation = (target: string) => {
    setIsMenuOpen(false);

    if (target.startsWith("#")) {
      if (isHomePage) {
        scrollToElement(target);
      } else {
        router.push(`/${target}`);
        setTimeout(() => {
          const element = document.getElementById(target.replace("#", ""));
          element?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
      return;
    }
    router.push(target);
  };

  const handleBlogClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/blog") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out",
        // Lógica estilo Netflix: Preto sólido ao rolar, Gradiente escuro quando no topo
        scrolled || !isHomePage
          ? "bg-black shadow-lg" // Pode usar bg-auftek-dark se preferir
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
        {/* LOGO */}
        <div
          className="cursor-pointer flex items-center z-50"
          onClick={() => handleNavigation("/")}
        >
          <Logo className="h-6 md:h-9 w-auto text-white hover:text-auftek-blue transition-colors duration-300" />
        </div>

        {/* ------- NAV DESKTOP ------- */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavigation(link.href)}
              className="text-sm font-medium text-gray-200 hover:text-white transition-colors bg-transparent border-none cursor-pointer hover:opacity-80"
            >
              {link.name}
            </button>
          ))}

          <Link
            href="/blog"
            onClick={handleBlogClick}
            className={cn(
              "text-sm font-medium transition-colors hover:opacity-80",
              pathname.startsWith("/blog")
                ? "text-white font-bold"
                : "text-gray-200"
            )}
          >
            Blog
          </Link>

          {/* SELETOR IDIOMA DESKTOP */}
          <div className="relative group">
            <button
              className="flex items-center gap-1 text-gray-200 hover:text-white transition-colors py-2"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <Globe size={16} />
              <span className="text-xs font-bold uppercase">
                {activeLang.code}
              </span>
              <ChevronDown
                size={14}
                className="group-hover:rotate-180 transition-transform duration-300"
              />
            </button>

            {/* Dropdown Desktop Hover/Click */}
            <div className="absolute right-0 top-full mt-2 w-32 bg-black/90 border border-white/20 rounded-md shadow-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => handleLangChange(l.code)}
                  className={cn(
                    "flex items-center gap-3 w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors",
                    lang === l.code
                      ? "text-auftek-blue font-bold"
                      : "text-gray-300"
                  )}
                >
                  <span className="text-base">{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            className="px-4 py-1.5 bg-auftek-blue text-white text-sm font-medium rounded-sm transition-colors duration-300"
            onClick={() => handleNavigation("#contato")}
          >
            Fale Conosco
          </button>
        </div>

        {/* ------- BOTÃO HAMBURGUER MOBILE ------- */}
        <button
          className="lg:hidden text-white z-50 p-1"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Abrir menu"
        >
          <Menu size={28} />
        </button>
      </div>

      {/* ------- SIDEBAR MOBILE (Estilo Gaveta Lateral) ------- */}
      {/* Overlay Escuro */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden",
          isMenuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        )}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Menu Gaveta */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-[75%] max-w-sm bg-black/95 border-l border-white/10 z-50 shadow-2xl transform transition-transform duration-300 ease-out flex flex-col lg:hidden",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Cabeçalho do Menu Mobile */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <span className="text-gray-400 text-sm font-semibold uppercase tracking-widest">
            Menu
          </span>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-white hover:text-red-500 transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        {/* Links Mobile */}
        <div className="flex-1 overflow-y-auto py-6 px-6 flex flex-col gap-6">
          {NAV_LINKS.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavigation(link.href)}
              className="text-xl font-medium text-gray-300 hover:text-white text-left transition-colors border-l-2 border-transparent hover:border-auftek-blue pl-0 hover:pl-4 duration-200"
            >
              {link.name}
            </button>
          ))}

          <Link
            href="/blog"
            onClick={handleBlogClick}
            className={cn(
              "text-xl font-medium text-left transition-all border-l-2 border-transparent duration-200",
              pathname.startsWith("/blog")
                ? "text-white border-auftek-blue pl-4"
                : "text-gray-300 hover:text-white hover:pl-4"
            )}
          >
            Blog
          </Link>
        </div>

        {/* Rodapé do Menu Mobile (Ações) */}
        <div className="p-6 border-t border-white/10 bg-white/5">
          {/* Idiomas Mobile Grid */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => handleLangChange(l.code)}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-md transition-colors border",
                  lang === l.code
                    ? "bg-auftek-blue/20 border-auftek-blue text-white"
                    : "border-transparent hover:bg-white/10 text-gray-400"
                )}
              >
                <span className="text-xl mb-1">{l.flag}</span>
                <span className="text-xs font-bold uppercase">{l.code}</span>
              </button>
            ))}
          </div>

          <button
            className="w-full py-3 bg-auftek-blue text-white text-lg font-bold rounded hover:bg-blue-600 transition-colors"
            onClick={() => handleNavigation("#contato")}
          >
            Fale Conosco
          </button>
        </div>
      </div>
    </nav>
  );
};
