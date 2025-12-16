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

      {/* MUDANÇAS NO CONTAINER:
         1. 'pb-8' ou 'pb-10': Dá espaço extra embaixo para não cortar a borda do card.
         2. 'items-stretch': Garante que todos os cards tenham a altura do maior card.
      */}
      <div
        className="
          flex overflow-x-auto gap-4 px-4 pb-10 snap-x snap-mandatory items-stretch
          md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:pb-0 md:px-0 md:mb-20
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
        "
      >
        {/* Card 1 */}
        {/* MUDANÇAS NO CARD:
            1. 'w-[85vw]': Ocupa 85% da tela do celular. Mostra o conteúdo todo e deixa uma pontinha do próximo card visível.
            2. 'md:w-auto': No desktop volta ao normal.
            3. 'h-full': Força o card a ocupar toda a altura disponível.
        */}
        <div className="bg-[#0e223b] border border-gray-800 p-6 rounded-xl hover:border-red-400/50 transition-colors group w-[85vw] md:w-auto flex-shrink-0 snap-center h-full flex flex-col">
          <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-colors shrink-0">
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

        {/* Card 2 */}
        <div className="bg-[#0e223b] border border-gray-800 p-6 rounded-xl hover:border-auftek-blue/50 transition-colors group w-[85vw] md:w-auto flex-shrink-0 snap-center h-full flex flex-col">
          <div className="w-12 h-12 bg-auftek-blue/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-auftek-blue/20 transition-colors shrink-0">
            <Activity className="text-auftek-blue" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            E.coli e Coliformes
          </h3>
          <p className="text-gray-400 text-sm">
            Quantificação a partir de 8h e integração automática à nuvem.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-[#0e223b] border border-gray-800 p-6 rounded-xl hover:border-auftek-green/50 transition-colors group w-[85vw] md:w-auto flex-shrink-0 snap-center h-full flex flex-col">
          <div className="w-12 h-12 bg-auftek-green/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-auftek-green/20 transition-colors shrink-0">
            <Leaf className="text-auftek-green" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Bioinsumos no Agro
          </h3>
          <p className="text-gray-400 text-sm">
            Monitoramento em tempo real de bioinsumos on-farm.
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-[#0e223b] border border-gray-800 p-6 rounded-xl hover:border-blue-300/50 transition-colors group w-[85vw] md:w-auto flex-shrink-0 snap-center h-full flex flex-col">
          <div className="w-12 h-12 bg-blue-300/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-300/20 transition-colors shrink-0">
            <Droplet className="text-blue-300" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Água e Efluentes
          </h3>
          <p className="text-gray-400 text-sm">
            Monitoramento microbiológico de água e efluentes em tempo real.
          </p>
        </div>

        {/* Card 5 */}
        <div className="bg-[#0e223b] border border-gray-800 p-6 rounded-xl hover:border-orange-400/50 transition-colors group w-[85vw] md:w-auto flex-shrink-0 snap-center h-full flex flex-col">
          <div className="w-12 h-12 bg-orange-400/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-400/20 transition-colors shrink-0">
            <Factory className="text-orange-400" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Processos Industriais
          </h3>
          <p className="text-gray-400 text-sm">
            Análise microbiológica e físico-química de processos.
          </p>
        </div>

        {/* Card 6 */}
        <div className="bg-[#0e223b] border border-gray-800 p-6 rounded-xl hover:border-white/50 transition-colors group w-[85vw] md:w-auto flex-shrink-0 snap-center h-full flex flex-col">
          <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors shrink-0">
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

      <p className="md:hidden text-center text-gray-600 text-xs mb-12 animate-pulse">
        Deslize para o lado para ver mais →
      </p>

      {/* --- Seção Secundária: Publicações --- */}
      <div className="border-t border-gray-800 pt-16">
        <h3 className="text-2xl font-bold text-gray-300 mb-8 text-center">
          Publicações e Embasamento Técnico-Científico
        </h3>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Card Pub 1 */}
          <a
            href="https://pubs.acs.org/doi/10.1021/acs.analchem.5c03766"
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-4 p-4 rounded-lg bg-[#0e223b]/50 border border-gray-800 hover:border-gray-500 hover:bg-[#0e223b]/80 transition-all group"
          >
            <FileText
              className="text-gray-500 shrink-0 group-hover:text-cyan-300 transition-colors"
              size={24}
            />
            <div>
              <h4 className="text-white font-medium group-hover:text-cyan-300 transition-colors">
                Analytical Chemistry
              </h4>
              <p className="text-gray-500 text-sm mt-1">
                Feasibility for Real-Time Monitoring of Bacterial Growth in Raw
                Milk Using a New Contactless Sensor
              </p>
            </div>
          </a>

          {/* Card Pub 2 */}
          <a
            href="https://ieeexplore.ieee.org/document/10424681"
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-4 p-4 rounded-lg bg-[#0e223b]/50 border border-gray-800 hover:border-gray-500 hover:bg-[#0e223b]/80 transition-all group"
          >
            <FileText
              className="text-gray-500 shrink-0 group-hover:text-cyan-300 transition-colors"
              size={24}
            />
            <div>
              <h4 className="text-white font-medium group-hover:text-cyan-300 transition-colors">
                IEEE Sensors Journal
              </h4>
              <p className="text-gray-500 text-sm mt-1">
                Contactless Electrical Sensor Based on Resonance Frequency for
                Real-Time Monitoring of Bacterial Growth
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
