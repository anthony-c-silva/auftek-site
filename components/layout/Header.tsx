"use client";

import React, { useState, useRef, useEffect } from "react";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react"; // Removi 'User' pois o Avatar cuida disso
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { NAV_LINKS } from "../../data/constants";
import { useScroll, scrollToElement } from "../../hooks/useScroll";
import { Logo } from "../ui/Logo";
import { Avatar } from "../ui/Avatar"; // <--- 1. IMPORTANTE: Importe o componente
import { cn } from "../../lib/utils";
import { useAuth } from "@/context/AuthContext";

export const Header: React.FC = () => {
  const { user, logout } = useAuth(); // isAdmin não estava sendo usado visualmente aqui

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const scrolled = useScroll(50);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isHomePage = pathname === "/";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigation = (target: string) => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);

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

  const handleBlogClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/blog") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    setIsProfileOpen(false);
    router.push("/");
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

            {/* LÓGICA DE USUÁRIO LOGADO (DESKTOP) */}
            {user ? (
                <div className="relative" ref={dropdownRef}>
                  {/* Botão do Avatar - AGORA USANDO O COMPONENTE */}
                  <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-2 focus:outline-none"
                  >
                    <Avatar
                        src={user.photoUrl}
                        alt={user.name}
                        size={40}
                        className="border-2 border-auftek-blue"
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                      <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl py-2 border border-slate-100 animate-fade-in-up origin-top-right text-slate-800">
                        <div className="px-4 py-2 border-b border-slate-100 mb-1">
                          <p className="text-sm font-bold truncate">{user.name}</p>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>

                        <Link
                            href="/admin"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-50 hover:text-auftek-blue transition-colors"
                        >
                          <LayoutDashboard size={18} />
                          Painel de Postagens
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                        >
                          <LogOut size={18} />
                          Sair
                        </button>
                      </div>
                  )}
                </div>
            ) : (
                <button
                    className="px-5 py-2 bg-auftek-blue text-white text-sm font-semibold rounded-full hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30"
                    onClick={() => handleNavigation("#contato")}
                >
                  Fale Conosco
                </button>
            )}
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

                {/* LÓGICA DE USUÁRIO LOGADO (MOBILE) */}
                {user ? (
                    <div className="flex flex-col items-center gap-4 mt-8 w-full border-t border-white/10 pt-8">
                      <div className="flex items-center gap-3 mb-2">
                        {/* Avatar Mobile - AGORA USANDO O COMPONENTE */}
                        <Avatar
                            src={user.photoUrl}
                            alt={user.name}
                            size={40}
                            className="border border-auftek-blue"
                        />
                        <span className="text-white font-medium">{user.name}</span>
                      </div>

                      <Link
                          href="/admin"
                          onClick={() => setIsMenuOpen(false)}
                          className="px-8 py-3 bg-auftek-blue text-white text-lg font-bold rounded-full w-full max-w-xs flex items-center justify-center gap-2"
                      >
                        <LayoutDashboard size={20} />
                        Painel
                      </Link>

                      <button
                          onClick={handleLogout}
                          className="px-8 py-3 border border-red-500/50 text-red-400 text-lg font-bold rounded-full w-full max-w-xs flex items-center justify-center gap-2 hover:bg-red-500/10"
                      >
                        <LogOut size={20} />
                        Sair
                      </button>
                    </div>
                ) : (
                    <button
                        className="mt-8 px-8 py-3 bg-auftek-blue text-white text-lg font-bold rounded-full shadow-lg shadow-blue-500/30 w-full max-w-xs"
                        onClick={() => handleNavigation("#contato")}
                    >
                      Fale Conosco
                    </button>
                )}
              </div>
            </div>
        )}
      </nav>
  );
};