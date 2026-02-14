"use client";

import React, { useState } from "react";
import { Linkedin, Instagram, ArrowUpRight, ChevronDown } from "lucide-react";
import { Logo } from "../ui/Logo";

// Ícone do WhatsApp (SVG)
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.07 0C5.537 0 .181 5.37 0 11.926a11.82 11.82 0 001.588 5.911L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.99-5.372 11.99-11.926 0-3.18-1.232-6.18-3.474-8.422" />
  </svg>
);

// --- DADOS ---
const ADDRESS_DETAILS = [
  "Av. Roraima, 1000 - Prédio 2 - Sala 13",
  "PULSAR - UFSM",
  "Camobi | Santa Maria - RS",
  "CEP: 97105-900",
];

const COMPANY_NAME = "AUFTEK SERVICOS DE TECNOLOGIA LTDA";
const CNPJ = "35.789.235/0001-99";
const EMAIL = "adriano.marques@auftek.com";
const WHATSAPP_NUMBER = "555591261525";

const PLACE_ID = "ChIJQ04ZPaQqJa8RsEreb80pxHI";
const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=AUFTEK+TECNOLOGIA&query_place_id=${PLACE_ID}`;
const WA_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=Olá!%20Vim%20pelo%20site.`;
const LINKEDIN_LINK = "https://br.linkedin.com/company/auftek";
const INSTAGRAM_LINK = "https://www.instagram.com/aufteksm";

// --- ACCORDION SIMPLES (mobile) ---
function FooterAccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-white/10">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full py-4 flex items-center justify-between text-left"
        aria-expanded={open}
      >
        <span className="text-white text-sm font-semibold">{title}</span>
        <ChevronDown
          size={18}
          className={`text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden pb-5">{children}</div>
      </div>
    </div>
  );
}

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-white/10 pt-14 sm:pt-16 pb-10 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop: grid | Mobile: accordion */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-8">
          {/* COLUNA 1: Identidade */}
          <div>
            <Logo className="h-14 w-auto text-white mb-6" />
            <p className="text-zinc-500 text-sm leading-relaxed">
              Inteligência artificial e automação para microbiologia e energia.
            </p>
          </div>

          {/* COLUNA 2: Endereço */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Endereço</h4>
            <a
              href={MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 text-sm hover:text-white transition-colors group inline-block"
            >
              <address className="not-italic flex flex-col gap-1">
                {ADDRESS_DETAILS.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </address>
              <span className="inline-flex items-center gap-1 text-auftek-blue text-xs mt-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                Ver no mapa <ArrowUpRight size={12} />
              </span>
            </a>
          </div>

          {/* COLUNA 3: Contato */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Contato</h4>
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${EMAIL}`}
                className="text-zinc-500 text-sm hover:text-white transition-colors break-words"
              >
                {EMAIL}
              </a>
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 text-sm hover:text-white transition-colors"
              >
                +55 (55) 9126-1525
              </a>
            </div>
          </div>

          {/* COLUNA 4: Social */}
          <div className="flex flex-col">
            <h4 className="text-white text-sm font-semibold mb-4">Redes Sociais</h4>

            {/* ✅ centralizado */}
            <div className="flex justify-center">
              <div className="flex gap-3">
                <SocialLink
                  href={LINKEDIN_LINK}
                  label="LinkedIn"
                  hoverClass="hover:text-[#0077b5]"
                  icon={<Linkedin size={26} />}
                />
                <SocialLink
                  href={INSTAGRAM_LINK}
                  label="Instagram"
                  hoverClass="hover:text-[#E1306C]"
                  icon={<Instagram size={26} />}
                />
                <SocialLink
                  href={WA_LINK}
                  label="WhatsApp"
                  hoverClass="hover:text-[#25D366]"
                  icon={<WhatsAppIcon className="w-7 h-7" />}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: accordion */}
        <div className="sm:hidden mb-8">
          {/* Identidade fixa no topo */}
          <div className="pb-6">
            <Logo className="h-14 w-auto text-white mb-5" />
            <p className="text-zinc-500 text-sm leading-relaxed">
              Inteligência artificial e automação para microbiologia e energia.
            </p>
          </div>

          <FooterAccordionItem title="Endereço">
            <a
              href={MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 text-sm hover:text-white transition-colors group inline-block"
            >
              <address className="not-italic flex flex-col gap-1">
                {ADDRESS_DETAILS.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </address>
              <span className="inline-flex items-center gap-1 text-auftek-blue text-xs mt-2">
                Ver no mapa <ArrowUpRight size={12} />
              </span>
            </a>
          </FooterAccordionItem>

          <FooterAccordionItem title="Contato">
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${EMAIL}`}
                className="text-zinc-500 text-sm hover:text-white transition-colors break-words"
              >
                {EMAIL}
              </a>
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 text-sm hover:text-white transition-colors"
              >
                +55 (55) 9126-1525
              </a>
            </div>
          </FooterAccordionItem>

          <FooterAccordionItem title="Redes Sociais">
            {/* ✅ centralizado */}
            <div className="flex justify-center">
              <div className="flex gap-3">
                <SocialLink
                  href={LINKEDIN_LINK}
                  label="LinkedIn"
                  hoverClass="hover:text-[#0077b5]"
                  icon={<Linkedin size={26} />}
                />
                <SocialLink
                  href={INSTAGRAM_LINK}
                  label="Instagram"
                  hoverClass="hover:text-[#E1306C]"
                  icon={<Instagram size={26} />}
                />
                <SocialLink
                  href={WA_LINK}
                  label="WhatsApp"
                  hoverClass="hover:text-[#25D366]"
                  icon={<WhatsAppIcon className="w-7 h-7" />}
                />
              </div>
            </div>
          </FooterAccordionItem>
        </div>

        {/* Rodapé inferior */}
        <div className="border-t border-white/5 pt-8 flex flex-col items-center text-center gap-4 text-xs text-zinc-600">
          <p className="font-bold text-zinc-500 uppercase tracking-wide">
            {COMPANY_NAME} | CNPJ: {CNPJ} | © {new Date().getFullYear()} Todos os direitos reservados.
          </p>

          {/*
            ✅ você pediu pra não aparecer (admin/login)
          */}
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({
  href,
  icon,
  label,
  hoverClass,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  hoverClass: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className={[
      "text-zinc-400 transition-all duration-300",
      "inline-flex items-center justify-center",
      "w-11 h-11 rounded-full",
      "hover:scale-110",
      hoverClass,
    ].join(" ")}
  >
    {icon}
  </a>
);
