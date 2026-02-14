"use client";

import React, { useState } from "react";
import { Section } from "../ui/Section";

// --- DADOS ---
const PARTNERS_LIST = [
  { name: "CORSAN", logo: "/images/partners/CORSAN.png", url: "https://corsan.com.br/" },
  { name: "AEGEA", logo: "/images/partners/AEGEA.png", url: "https://www.aegea.com.br/" },
  { name: "ELETROBRAS CEPEL", logo: "/images/partners/ELTROBRAS_CEPEL.png", url: "https://www.cepel.br/" },
  { name: "IEE USP", logo: "/images/partners/IEEUSP.png", url: "https://www.iee.usp.br/" },
  { name: "IEM UFSM", logo: "/images/partners/IEMUFSM.png", url: "https://iemufsm.com.br/" },
  { name: "MACKENZIE", logo: "/images/partners/MACKENZIE.png", url: "https://www.mackenzie.br/" },
  { name: "SENAI", logo: "/images/partners/SENAI.png", url: "https://www.senairs.org.br/" },
  { name: "SOLUBIO", logo: "/images/partners/SOLUBIO.png", url: "https://www.solubio.agr.br/" },
  { name: "UFSM", logo: "/images/partners/UFSM.png", url: "https://www.ufsm.br/" },
  { name: "USP", logo: "/images/partners/USP.png", url: "https://www5.usp.br/" },
  { name: "ZEIT", logo: "/images/partners/ZEIT.png", url: "https://zeit.com.br/" },
];

const SUPPORTERS_LIST = [
  { name: "CNPq", logo: "/images/apoios/CNPq.png", url: "https://www.gov.br/cnpq/pt-br" },
  { name: "FAPERGS", logo: "/images/apoios/Fapergs.png", url: "https://fapergs.rs.gov.br/inicial" },
  { name: "FINEP", logo: "/images/apoios/Finep.png", url: "http://www.finep.gov.br/" },
  { name: "NVIDIA", logo: "/images/apoios/Nvidia.png", url: "https://www.nvidia.com/" },
  { name: "PULSAR", logo: "/images/apoios/Pulsar.png", url: "https://www.ufsm.br/orgaos-suplementares/inovatec/pulsar" },
  { name: "SEBRAE", logo: "/images/apoios/Sebrae.png", url: "https://sebrae.com.br/sites/PortalSebrae" },
  { name: "VENTIUR", logo: "/images/apoios/Ventiur.png", url: "https://ventiur.net/" },
  { name: "founders", logo: "/images/apoios/founders-hub.svg", url: "https://ventiur.net/" },
];

type Item = typeof PARTNERS_LIST[number];

function LogoPill({ item }: { item: Item }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      title={item.name}
      className="
        flex items-center justify-center
        rounded-2xl bg-white border border-slate-200 shadow-sm
        transition-all duration-200
        hover:-translate-y-0.5 hover:shadow-md
        focus:outline-none focus:ring-2 focus:ring-auftek-blue/30
        h-12 sm:h-16
        w-full sm:w-[220px]
      "
    >
      <img
        src={item.logo}
        alt={`Logo ${item.name}`}
        className="max-h-8 sm:max-h-10 w-auto max-w-[80%] object-contain"
        loading="lazy"
        decoding="async"
      />
    </a>
  );
}

function PillsSection({
  title,
  items,
  mobileInitial,
}: {
  title: string;
  items: Item[];
  mobileInitial: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = items.length > mobileInitial;

  return (
    <div className="mb-12 px-0 md:px-12">
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="h-[1px] w-12 bg-gray-300" />
        <h3 className="text-center text-gray-500 uppercase tracking-[0.2em] font-bold text-xs">
          {title}
        </h3>
        <div className="h-[1px] w-12 bg-gray-300" />
      </div>

      {/* Mobile: grid | Desktop: flex-wrap centralizado */}
      <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-4 md:gap-5">
        {items.map((item, idx) => {
          // ✅ esconde SOMENTE no mobile quando não expandido
          const hideOnMobile = !expanded && idx >= mobileInitial;

          return (
            <div key={item.name} className={hideOnMobile ? "hidden sm:block" : "block"}>
              <LogoPill item={item} />
            </div>
          );
        })}
      </div>

      {/* Botão só no mobile */}
      {hasMore && (
        <div className="mt-5 flex justify-center sm:hidden">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="
              inline-flex items-center justify-center
              rounded-full px-5 py-2 text-sm font-semibold
              border border-slate-200 bg-white shadow-sm
              hover:shadow-md transition text-[#0e223b]
            "
          >
            {expanded ? "Ver menos" : `Ver mais (${items.length - mobileInitial})`}
          </button>
        </div>
      )}
    </div>
  );
}

export const Partners: React.FC = () => {
  return (
    <Section id="parceiros" className="relative overflow-hidden bg-white">
      <div className="relative z-10">
        {/* ✅ copy idêntico */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0e223b] mb-3">
            Quem usa e apoia
          </h2>
          <p className="text-gray-600 font-bold tracking-widest uppercase text-xs">
            Quem confia e impulsiona nossa tecnologia
          </p>
          <div className="w-24 h-1 bg-auftek-blue mx-auto mt-4 rounded-full" />
        </div>

        <div className="max-w-6xl mx-auto">
          {/* ✅ No desktop mostra todos sempre. No mobile limita e oferece “Ver mais”. */}
          <PillsSection
            title="Parceiros Tecnológicos & Clientes"
            items={PARTNERS_LIST}
            mobileInitial={4}
          />

          <PillsSection
            title="Fomento e Apoio Institucional"
            items={SUPPORTERS_LIST}
            mobileInitial={6}
          />
        </div>
      </div>
    </Section>
  );
};
