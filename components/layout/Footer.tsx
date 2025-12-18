"use client";

import React from "react";
import Link from "next/link";
import { Linkedin, Instagram, ArrowUpRight } from "lucide-react";
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

export const Footer: React.FC = () => {
  // --- DADOS ---
  const addressDetails = [
    "Av. Roraima, 1000 - Prédio 2 - Sala 13",
    "PULSAR - UFSM",
    "Camobi | Santa Maria - RS",
    "CEP: 97105-900",
  ];

  const fullAddressSearch =
    "Av. Roraima 1000 Prédio 2 Sala 13 PULSAR UFSM Santa Maria RS";
  const companyName = "AUFTEK SERVICOS DE TECNOLOGIA LTDA";
  const cnpj = "35.789.235/0001-99";
  const email = "adriano.marques@auftek.com";
  const whatsappNumber = "555591261525";

  // Links
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    fullAddressSearch
  )}`;
  const waLink = `https://wa.me/${whatsappNumber}?text=Olá!%20Vim%20pelo%20site.`;
  const linkedInLink = "https://br.linkedin.com/company/auftek";
  const instagramLink = "https://www.instagram.com/aufteksm";

  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* GRID SUPERIOR */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
          {/* COLUNA 1: Identidade */}
          <div className="col-span-1">
            <Logo className="h-7 w-auto text-white mb-6" />
            <p className="text-zinc-500 text-sm leading-relaxed">
              Inteligência artificial e automação para microbiologia e energia.
            </p>
          </div>

          {/* COLUNA 2: Endereço */}
          <div className="col-span-1">
            <h4 className="text-white text-sm font-semibold mb-4">Endereço</h4>
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 text-sm hover:text-white transition-colors flex flex-col gap-1 group"
            >
              {addressDetails.map((line, i) => (
                <span key={i}>{line}</span>
              ))}
              <span className="inline-flex items-center gap-1 text-auftek-blue text-xs mt-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                Ver no mapa <ArrowUpRight size={12} />
              </span>
            </a>
          </div>

          {/* COLUNA 3: Contato */}
          <div className="col-span-1">
            <h4 className="text-white text-sm font-semibold mb-4">Contato</h4>
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${email}`}
                className="text-zinc-500 text-sm hover:text-white transition-colors break-words"
              >
                {email}
              </a>
              <a
                href={waLink}
                target="_blank"
                className="text-zinc-500 text-sm hover:text-white transition-colors"
              >
                +55 (55) 9126-1525
              </a>
            </div>
          </div>

          {/* COLUNA 4: Social */}
          <div className="col-span-1">
            <h4 className="text-white text-sm font-semibold mb-4">
              Redes Sociais
            </h4>
            <div className="flex gap-4">
              {/* ÍCONES AUMENTADOS PARA TAMANHO 24px */}
              <SocialLink
                href={linkedInLink}
                icon={<Linkedin size={28} />}
                label="LinkedIn"
                hoverClass="hover:text-[#0077b5]"
              />
              <SocialLink
                href={instagramLink}
                icon={<Instagram size={28} />}
                label="Instagram"
                hoverClass="hover:text-[#E1306C]"
              />
              <SocialLink
                href={waLink}
                icon={<WhatsAppIcon className="w-8 h-7" />}
                label="WhatsApp"
                hoverClass="hover:text-[#25D366]"
              />
            </div>
          </div>
        </div>

        {/* RODAPÉ INFERIOR */}
        <div className=" border-t border-white/5 flex flex-col items-center text-center gap-6 text-xs text-zinc-600">
          <div className="flex flex-col gap-1">
            <p className="font-bold text-zinc-500 uppercase tracking-wide">
              {companyName} CNPJ: {cnpj}
            </p>
            <p></p>
          </div>

          <div className="flex flex-col items-center gap-4">
           
            <p>© {new Date().getFullYear()} Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Componente Social
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
    className={`text-zinc-400 transition-all duration-300 transform hover:scale-110 ${hoverClass}`}
  >
    {icon}
  </a>
);
