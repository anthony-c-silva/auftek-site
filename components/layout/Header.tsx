"use client";

import React, { useEffect, useRef, useState } from "react";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { NAV_LINKS } from "../../data/constants";
import { useScroll, scrollToElement } from "../../hooks/useScroll";
import { Logo } from "../ui/Logo";
import { Avatar } from "../ui/Avatar";
import { cn } from "../../lib/utils";
import { useAuth } from "@/context/AuthContext";

type NavLink = { name: string; href: string };

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const scrolled = useScroll(20);
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";

  const profileRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    if (isMenuOpen) setTimeout(() => closeBtnRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsMenuOpen(false);
    }
    if (isMenuOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  const isActive = (href: string) => {
    if (href.startsWith("#")) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href);
  };

  const handleNavigation = (target: string) => {
    setIsMenuOpen(false);
    setProfileDropdownOpen(false);

    if (target.startsWith("#")) {
      if (isHomePage) {
        scrollToElement(target);
      } else {
        router.push(`/${target}`);
        setTimeout(() => {
          const el = document.getElementById(target.replace("#", ""));
          el?.scrollIntoView({ behavior: "smooth" });
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
    setProfileDropdownOpen(false);
    router.push("/");
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out",
        scrolled || !isHomePage
          ? "bg-black/95 shadow-lg backdrop-blur-md"
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
        {/* LOGO */}
        <div className="cursor-pointer flex items-center z-50" onClick={() => handleNavigation("/")}>
          <Logo className="h-6 md:h-9 w-auto text-white hover:text-auftek-blue transition-colors duration-300" />
        </div>

        {/* ------- NAV DESKTOP ------- */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {NAV_LINKS.map((link: NavLink) => (
            <button
              key={link.name}
              onClick={() => handleNavigation(link.href)}
              className={cn(
                "text-sm font-medium transition-colors bg-transparent border-none cursor-pointer",
                isActive(link.href) ? "text-white" : "text-gray-200 hover:text-white hover:opacity-80"
              )}
            >
              {link.name}
            </button>
          ))}

          <Link
            href="/blog"
            onClick={handleBlogClick}
            className={cn(
              "text-sm font-medium transition-colors hover:opacity-80",
              pathname.startsWith("/blog") ? "text-white font-bold" : "text-gray-200 hover:text-white"
            )}
          >
            Blog
          </Link>

          {/* USUÁRIO / CTA */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 focus:outline-none transition-transform hover:scale-105"
                aria-label="Abrir menu do usuário"
              >
                <Avatar
                  src={user.photoUrl}
                  alt={user.name}
                  size={38}
                  className="border-2 border-white/20 hover:border-auftek-blue transition-colors"
                />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl py-2 border border-slate-100 animate-fade-in-up origin-top-right text-slate-800">
                  <div className="px-4 py-2 border-b border-slate-100 mb-1">
                    <p className="text-sm font-bold truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>

                  <Link
                    href="/admin"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-50 hover:text-auftek-blue transition-colors"
                  >
                    <LayoutDashboard size={18} />
                    Painel
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
              className="px-4 py-2 bg-auftek-blue text-white text-sm font-semibold rounded-md transition-colors duration-300 hover:bg-blue-600"
              onClick={() => handleNavigation("#contato")}
            >
              Fale Conosco
            </button>
          )}
        </div>

        {/* ------- BOTÃO HAMBURGUER MOBILE ------- */}
        <button
          className="lg:hidden z-50 inline-flex items-center justify-center h-11 w-11 rounded-md border border-white/15 bg-black/30 hover:bg-black/50 transition-colors"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Abrir menu"
        >
          <Menu size={22} className="text-white" />
        </button>
      </div>

      {/* ------- SIDEBAR MOBILE ------- */}
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/70 z-40 transition-opacity duration-200 lg:hidden",
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 right-0 h-full w-[320px] max-w-[90vw] z-50 lg:hidden",
          "bg-black border-l border-white/15 shadow-2xl",
          "transform transition-transform duration-200 ease-out",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menu lateral"
      >
        {/* Header sidebar */}
        <div className="h-16 px-4 border-b border-white/15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="h-7 w-auto text-white" />
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-widest">
              Menu
            </span>
          </div>

          <button
            ref={closeBtnRef}
            onClick={() => setIsMenuOpen(false)}
            className="inline-flex items-center justify-center h-10 w-10 rounded-md border border-white/15 bg-white/5 hover:bg-white/10 transition-colors text-white"
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex flex-col h-[calc(100%-64px)]">
          {/* Nav list */}
          <div className="flex-1 overflow-y-auto">
            <ul className="divide-y divide-white/15">
              {NAV_LINKS.map((link: NavLink) => {
                const active = isActive(link.href);
                return (
                  <li key={link.name}>
                    <button
                      onClick={() => handleNavigation(link.href)}
                      className={cn(
                        "w-full text-left px-4 py-4",
                        "flex items-center gap-3",
                        "transition-colors",
                        active ? "bg-white/10 text-white" : "text-gray-200 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      {/* barra ativa clássica */}
                      <span
                        className={cn(
                          "h-5 w-1 rounded-full",
                          active ? "bg-auftek-blue" : "bg-transparent"
                        )}
                      />
                      <span className="text-base font-medium">{link.name}</span>
                    </button>
                  </li>
                );
              })}

              {/* Blog como item normal */}
              <li>
                <Link
                  href="/blog"
                  onClick={handleBlogClick}
                  className={cn(
                    "w-full px-4 py-4 flex items-center gap-3 transition-colors",
                    pathname.startsWith("/blog")
                      ? "bg-white/10 text-white"
                      : "text-gray-200 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <span className={cn("h-5 w-1 rounded-full", pathname.startsWith("/blog") ? "bg-auftek-blue" : "bg-transparent")} />
                  <span className="text-base font-medium">Blog</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Footer actions */}
          <div className="border-t border-white/15 p-4">
            {user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 p-3 rounded-md bg-white/5 border border-white/10">
                  <Avatar
                    src={user.photoUrl}
                    alt={user.name}
                    size={40}
                    className="border border-auftek-blue"
                  />
                  <div className="overflow-hidden">
                    <p className="text-white font-medium text-sm truncate">{user.name}</p>
                    <p className="text-gray-400 text-xs truncate">{user.email}</p>
                  </div>
                </div>

                <Link
                  href="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full h-11 rounded-md bg-auftek-blue text-white font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
                >
                  <LayoutDashboard size={18} />
                  Painel
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full h-11 rounded-md border border-red-500/50 text-red-300 font-bold flex items-center justify-center gap-2 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={18} />
                  Sair
                </button>
              </div>
            ) : (
              <button
                className="w-full h-11 rounded-md bg-auftek-blue text-white text-base font-bold hover:bg-blue-600 transition-colors"
                onClick={() => handleNavigation("#contato")}
              >
                Fale Conosco
              </button>
            )}
          </div>
        </div>
      </aside>
    </nav>
  );
};
