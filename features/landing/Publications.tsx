import React from "react";
import {
  FileText,
  Factory,
  Leaf,
  Activity,
  AlertCircle,
  Droplet,
} from "lucide-react";
import { Section, SectionTitle } from "../../components/ui/Section";

// NÃO IMPORTE ARQUIVOS DA PUBLIC! Use a string direta.
const MILK_ICON_PATH = "/images/milk.svg";

export const Publications: React.FC = () => {
  return (
    <Section id="publicacoes" darker>
      <SectionTitle
        align="center"
        subtitle="Soluções validadas para diversos setores da indústria e pesquisa."
      >
        Aplicações Reais
      </SectionTitle>

      {/* Grid de Aplicações */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
        {/* ... (Os outros cards permanecem iguais) ... */}

        {/* Cards 1 a 5 omitidos para brevidade - Mantenha o código original deles */}
        <div className="bg-[#0e223b] border border-gray-800 p-6 rounded-xl hover:border-red-400/50 transition-colors group">
          <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-colors">
            <AlertCircle className="text-red-400" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Detecção de Salmonella
          </h3>
          <p className="text-gray-400 text-sm">
            Presença/Ausência a partir de 12h, com baixo custo e mínima
            intervenção.
          </p>
        </div>

        <div className="bg-[#0e223b] border border-gray-800 p-6 rounded-xl hover:border-auftek-blue/50 transition-colors group">
          <div className="w-12 h-12 bg-auftek-blue/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-auftek-blue/20 transition-colors">
            <Activity className="text-auftek-blue" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            E.coli e Coliformes
          </h3>
          <p className="text-gray-400 text-sm">
            Quantificação a partir de 8h e integração automática à nuvem.
          </p>
        </div>

        <div className="bg-[#0e223b] border border-gray-800 p-6 rounded-xl hover:border-auftek-green/50 transition-colors group">
          <div className="w-12 h-12 bg-auftek-green/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-auftek-green/20 transition-colors">
            <Leaf className="text-auftek-green" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Bioinsumos no Agro
          </h3>
          <p className="text-gray-400 text-sm">
            Monitoramento em tempo real de bioinsumos on-farm.
          </p>
        </div>

        <div className="bg-[#0e223b] border border-gray-800 p-6 rounded-xl hover:border-blue-300/50 transition-colors group">
          <div className="w-12 h-12 bg-blue-300/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-300/20 transition-colors">
            <Droplet className="text-blue-300" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Água e Efluentes
          </h3>
          <p className="text-gray-400 text-sm">
            Monitoramento microbiológico de água e efluentes em tempo real.
          </p>
        </div>

        <div className="bg-[#0e223b] border border-gray-800 p-6 rounded-xl hover:border-orange-400/50 transition-colors group">
          <div className="w-12 h-12 bg-orange-400/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-400/20 transition-colors">
            <Factory className="text-orange-400" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Processos Industriais
          </h3>
          <p className="text-gray-400 text-sm">
            Análise microbiológica e físico-química de processos.
          </p>
        </div>

        {/* 6. Qualidade do Leite (CORRIGIDO) */}
        <div className="bg-[#0e223b] border border-gray-800 p-6 rounded-xl hover:border-white/50 transition-colors group">
          <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
            {/* Uso direto do caminho da string */}
            <img
              src={MILK_ICON_PATH}
              alt="Ícone Leite"
              className="w-8 h-8 invert"
            />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Qualidade do Leite
          </h3>
          <p className="text-gray-400 text-sm">
            Fornece a partir de 3h o CBT do leite, de forma automatizada, e sem
            contato direto com a amostra.
          </p>
        </div>
      </div>

      {/* Seção Secundária: Publicações */}
      <div className="border-t border-gray-800 pt-16">
        <h3 className="text-2xl font-bold text-gray-300 mb-8 text-center">
          Publicações e Embasamento Técnico-Científico
        </h3>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <a
            href="https://pubs.acs.org/doi/10.1021/acs.analchem.5c03766"
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-4 p-4 rounded-lg bg-[#0e223b]/50 border border-gray-800 hover:border-gray-600 transition-colors cursor-pointer"
          >
            <FileText className="text-gray-500 shrink-0" size={24} />
            <div>
              <h4 className="text-white font-medium hover:text-auftek-blue transition-colors">
                Analytical Chemistry
              </h4>
              <p className="text-gray-500 text-sm mt-1">
                Feasibility for Real-Time Monitoring of Bacterial Growth in Raw
                Milk Using a New Contactless Sensor - DOI:
                https://doi.org/10.1021/acs.analchem.5c03766
              </p>
            </div>
          </a>
          <a
            href="http://dx.doi.org/10.1109/jsen.2024.3361311"
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-4 p-4 rounded-lg bg-[#0e223b]/50 border border-gray-800 hover:border-gray-600 transition-colors cursor-pointer"
          >
            <FileText className="text-gray-500 shrink-0" size={24} />
            <div>
              <h4 className="text-white font-medium hover:text-auftek-blue transition-colors">
                IEEE Sensors Journal
              </h4>
              <p className="text-gray-500 text-sm mt-1">
                Contactless Electrical Sensor Based on Resonance Frequency for
                Real-Time Monitoring of Bacterial Growth - DOI:
                10.1109/JSEN.2024.3361311
              </p>
            </div>
          </a>
        </div>
        <p className="text-center text-gray-500 text-sm mt-6 italic">
          O BioAiLab tem sido utilizado em estudos científicos publicados em
          periódicos de destaque internacional.
        </p>
      </div>
    </Section>
  );
};
