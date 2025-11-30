import React from "react";
import {
  FileText,
  Factory,
  Leaf,
  Sun,
  Activity,
  AlertCircle,
  Droplet,
  FlaskConical,
} from "lucide-react";
import { Section, SectionTitle } from "../../components/ui/Section";

export const Publications: React.FC = () => {
  return (
    <Section id="publicacoes" darker>
      <SectionTitle subtitle="Soluções validadas para diversos setores da indústria e pesquisa.">
        Aplicações Reais
      </SectionTitle>

      {/* Updated Applications Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
        {/* 1. Detecção de Salmonella */}
        <div className="bg-[#0e223b] border border-gray-800 p-6 rounded-xl hover:border-red-400/50 transition-colors group">
          <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-colors">
            <AlertCircle className="text-red-400" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Detecção de Salmonella
          </h3>
          <p className="text-gray-400 text-sm">
            Presença/Ausência em até 24h, com baixo custo e mínima intervenção.
            Detecta bactérias injuriadas direto na fábrica.
          </p>
        </div>

        {/* 2. E.coli e Coliformes */}
        <div className="bg-[#0e223b] border border-gray-800 p-6 rounded-xl hover:border-auftek-blue/50 transition-colors group">
          <div className="w-12 h-12 bg-auftek-blue/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-auftek-blue/20 transition-colors">
            <Activity className="text-auftek-blue" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            E.coli e Coliformes
          </h3>
          <p className="text-gray-400 text-sm">
            Quantificação em até 8h e integração automática à nuvem, reduzindo o
            tempo de análise de dias para horas.
          </p>
        </div>

        {/* 3. Bioinsumos no Agro */}
        <div className="bg-[#0e223b] border border-gray-800 p-6 rounded-xl hover:border-auftek-green/50 transition-colors group">
          <div className="w-12 h-12 bg-auftek-green/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-auftek-green/20 transition-colors">
            <Leaf className="text-auftek-green" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Bioinsumos no Agro
          </h3>
          <p className="text-gray-400 text-sm">
            Monitoramento em tempo real de bioinsumos on-farm, otimizando a
            aplicação. Parceria tecnológica com a startup Zeit.
          </p>
        </div>

        {/* 4. Água e Efluentes */}
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

        {/* 5. Processos Industriais */}
        <div className="bg-[#0e223b] border border-gray-800 p-6 rounded-xl hover:border-orange-400/50 transition-colors group">
          <div className="w-12 h-12 bg-orange-400/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-400/20 transition-colors">
            <Factory className="text-orange-400" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Processos Industriais
          </h3>
          <p className="text-gray-400 text-sm">
            Análise microbiológica e físico-química de processos, com detecção
            de adulterações químicas.
          </p>
        </div>

        {/* 6. Qualidade do Leite */}
        <div className="bg-[#0e223b] border border-gray-800 p-6 rounded-xl hover:border-white/50 transition-colors group">
          <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
            <FlaskConical className="text-white" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Qualidade do Leite
          </h3>
          <p className="text-gray-400 text-sm">
            Fornece em até 3h o CBT do leite, de forma automatizada, e sem
            contato direto com a amostra.
          </p>
        </div>
      </div>

      {/* Less prominent Publicações Section */}
      <div className="border-t border-gray-800 pt-16">
        <h3 className="text-2xl font-bold text-gray-300 mb-8 text-center">
          Publicações e Embasamento Técnico-Científico
        </h3>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="flex gap-4 p-4 rounded-lg bg-[#0e223b]/50 border border-gray-800 hover:border-gray-600 transition-colors cursor-pointer">
            <FileText className="text-gray-500 shrink-0" size={24} />
            <div>
              <h4 className="text-white font-medium hover:text-auftek-blue transition-colors">
                Journal of Microbiological Methods
              </h4>
              <p className="text-gray-500 text-sm mt-1">
                Validação do método BioAiLab para detecção rápida de E. coli em
                água.
              </p>
            </div>
          </div>
          <div className="flex gap-4 p-4 rounded-lg bg-[#0e223b]/50 border border-gray-800 hover:border-gray-600 transition-colors cursor-pointer">
            <FileText className="text-gray-500 shrink-0" size={24} />
            <div>
              <h4 className="text-white font-medium hover:text-auftek-blue transition-colors">
                IEEE Sensors Journal
              </h4>
              <p className="text-gray-500 text-sm mt-1">
                Aplicação de sensores ópticos e IA no monitoramento de
                crescimento bacteriano.
              </p>
            </div>
          </div>
        </div>
        <p className="text-center text-gray-500 text-sm mt-6 italic">
          O BioAiLab tem sido utilizado em estudos científicos publicados em
          periódicos de destaque internacional.
        </p>
      </div>
    </Section>
  );
};
