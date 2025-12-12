"use client";

import React, { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { NAV_LINKS } from "../../data/constants";
import { useScroll, scrollToElement } from "../../hooks/useScroll";
import { Logo } from "../ui/Logo";
import { cn } from "../../lib/utils";

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const scrolled = useScroll(50);

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

  const handleLangChange = (code: string) => {
    setLang(code);
    setDropdownOpen(false);
    // futuramente: trigger de tradução automática
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
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        scrolled || !isHomePage
          ? "bg-auftek-dark/95 backdrop-blur-md shadow-lg border-b border-white/10"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div
          className="cursor-pointer flex items-center gap-2"
          onClick={() => handleNavigation("/")}
        >
          <Logo className="h-8 md:h-10 w-auto text-white hover:text-auftek-blue transition-colors duration-300" />
        </div>

        {/* ------- NAV DESKTOP ------- */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavigation(link.href)}
              className="text-sm font-medium text-gray-300 hover:text-auftek-blue transition-colors bg-transparent border-none cursor-pointer"
            >
              {link.name}
            </button>
          ))}

          <Link
            href="/blog"
            onClick={handleBlogClick}
            className={cn(
              "text-sm font-medium transition-colors",
              pathname.startsWith("/blog")
                ? "text-auftek-blue font-bold"
                : "text-gray-300 hover:text-auftek-blue"
            )}
          >
            Blog
          </Link>

          {/* ------- DROPDOWN DE LÍNGUA DESKTOP ------- */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <span>{activeLang.flag}</span>
              <span className="text-sm">{activeLang.code.toUpperCase()}</span>
              <ChevronDown size={16} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-auftek-dark border border-white/10 rounded-lg shadow-lg p-2 w-32">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => handleLangChange(l.code)}
                    className={cn(
                      "flex items-center gap-2 w-full px-2 py-1 text-left rounded-md transition-colors",
                      lang === l.code
                        ? "text-auftek-blue font-semibold"
                        : "text-gray-300 hover:bg-white/5"
                    )}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* ------------------------------------------ */}

          <button
            className="px-5 py-2 bg-auftek-blue text-white text-sm font-semibold rounded-full hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30"
            onClick={() => handleNavigation("#contato")}
          >
            Fale Conosco
          </button>
        </div>

        {/* ------- BOTÃO MOBILE ------- */}
        <button
          className="lg:hidden text-white p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Abrir menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* ------- NAV MOBILE ------- */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-20 bg-auftek-dark/95 backdrop-blur-xl border-t border-white/10 p-6 flex flex-col h-[calc(100vh-5rem)] overflow-y-auto animate-fade-in z-40">
          <div className="flex flex-col gap-6 items-center justify-center flex-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavigation(link.href)}
                className="text-2xl font-bold text-gray-300 hover:text-white transition-colors bg-transparent border-none"
              >
                {link.name}
              </button>
            ))}

            <Link
              href="/blog"
              onClick={handleBlogClick}
              className={cn(
                "text-2xl font-bold transition-colors",
                pathname.startsWith("/blog")
                  ? "text-auftek-blue"
                  : "text-gray-300 hover:text-white"
              )}
            >
              Blog
            </Link>

            {/* DROPDOWN MOBILE */}
            <div className="flex flex-col items-center gap-2 mt-6">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    handleLangChange(l.code);
                    setIsMenuOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-2 text-2xl font-bold transition-colors",
                    lang === l.code
                      ? "text-auftek-blue"
                      : "text-gray-300 hover:text-white"
                  )}
                >
                  <span>{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              ))}
            </div>

            <button
              className="mt-8 px-8 py-3 bg-auftek-blue text-white text-lg font-bold rounded-full shadow-lg shadow-blue-500/30 w-full max-w-xs"
              onClick={() => handleNavigation("#contato")}
            >
              Fale Conosco
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
