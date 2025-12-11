"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { NAV_LINKS } from "../../data/constants";
import { useScroll, scrollToElement } from "../../hooks/useScroll";
import { Logo } from "../ui/Logo";
import { cn } from "../../lib/utils";
import { useAuth } from "@/context/AuthContext";
import { LogOut, LayoutDashboard } from "lucide-react";

export const Header: React.FC = () => {
  const { isAdmin, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrolled = useScroll(50);

  const pathname = usePathname();
  const router = useRouter();

  const isHomePage = pathname === "/";

  const handleNavigation = (target: string) => {
    setIsMenuOpen(false);

    if (target.startsWith("#")) {
      if (isHomePage) {
        scrollToElement(target);
      } else {
        router.push(`/${target}`);
        setTimeout(() => {
          const element = document.getElementById(target.replace('#', ''));
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
      return;
    }

    router.push(target);
  };

  // --- NOVA FUNÇÃO PARA O CLICK DO BLOG ---
  const handleBlogClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Se estamos na raiz do blog (/blog), scrollamos pro topo
    if (pathname === "/blog") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    // Se estamos em um post (/blog/post-1), o comportamento padrão do Link acontece (navega para /blog)

    setIsMenuOpen(false); // Fecha o menu mobile se estiver aberto
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

          {/* Desktop Nav */}
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
                onClick={handleBlogClick} // <--- APLICADO AQUI
                className={cn(
                    "text-sm font-medium transition-colors",
                    pathname.startsWith("/blog")
                        ? "text-auftek-blue font-bold"
                        : "text-gray-300 hover:text-auftek-blue"
                )}
            >
              Blog
            </Link>

            <button
                className="px-5 py-2 bg-auftek-blue text-white text-sm font-semibold rounded-full hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30"
                onClick={() => handleNavigation("#contato")}
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
                    onClick={handleBlogClick} // <--- APLICADO AQUI TAMBÉM
                    className={cn(
                        "text-2xl font-bold transition-colors",
                        pathname.startsWith("/blog")
                            ? "text-auftek-blue"
                            : "text-gray-300 hover:text-white"
                    )}
                >
                  Blog
                </Link>

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