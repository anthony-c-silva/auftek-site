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
