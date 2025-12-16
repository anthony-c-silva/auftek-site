import React from "react";
import { Zap, CheckCircle2, Wifi, Biohazard } from "lucide-react";
import { Section, SectionTitle } from "../../components/ui/Section";
import { BioDashboard } from "../../components/BioDashboard";
import { FaBacteria } from "react-icons/fa";
import { ScrollReveal } from "../../components/ui/ScrollReveal";

export const BioAiLab: React.FC = () => {
  return (
    <Section id="bioailab" className="relative overflow-hidden !bg-auftek-dark">
      {/* --- CAMADA DE FUNDO (INTACTA) --- */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-auftek-blue/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-auftek-green/5 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4"></div>
      </div>

      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-auftek-dark to-transparent z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-auftek-dark to-transparent z-0 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-24 md:w-40 h-full bg-gradient-to-r from-auftek-dark to-transparent z-0 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-24 md:w-40 h-full bg-gradient-to-l from-auftek-dark to-transparent z-0 pointer-events-none"></div>

      {/* --- CONTEÚDO --- */}
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24 relative z-10">
        {/* LADO ESQUERDO: TEXTO */}
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-auftek-green/10 text-auftek-green border border-auftek-green/20 text-xs font-bold mb-6 hover:bg-auftek-green/20 transition-colors cursor-default">
            <FaBacteria size={14} color="currentColor" />
            PRODUTO PRINCIPAL
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            A Solução:{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-auftek-blue to-cyan-400">
              BioAiLab
            </span>
            <span className="text-2xl text-cyan-300 align-top relative -top-2 ml-1">
              ®
            </span>
          </h2>

          <h3 className="text-xl md:text-2xl text-gray-300 font-light mb-8 leading-relaxed">
            Transformamos análises que levavam dias em resultados em{" "}
            <span className="text-auftek-green font-semibold border-b border-auftek-green/30">
              poucas horas
            </span>
            .
          </h3>

          <div className="space-y-8">
            <p className="text-gray-400 text-lg font-light">
              Nosso principal produto, o BioAiLab, reduz análises
              microbiológicas de {""}
              <strong className="text-white">dias para horas</strong>. Com IA
              embarcada, ele monitora o crescimento microbiano em tempo real e
              envia os dados direto para a nuvem.
            </p>

            <ul className="space-y-4">
              {[
                "Totalmente automatizado: acelera incubação e quantificação.",
                "Identifica E. coli, Coliformes Totais e bactérias heterotróficas, Salmonella e outros...",
                "Conectividade IoT: Dados na nuvem acessíveis via App e Web.",
                "Dispensa contagem manual e reduz erro humano.",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-4 text-gray-300 group"
                >
                  <div className="mt-1 p-1 rounded-full bg-auftek-blue/10 text-auftek-blue group-hover:bg-auftek-blue group-hover:text-white transition-colors">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="group-hover:text-white transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        {/* LADO DIREITO: CARD DO PRODUTO (AJUSTADO PARA MOBILE) */}
        <ScrollReveal
          delay="200"
          className="relative flex justify-center lg:justify-end w-full"
        >
          {/* Ponto de luz animado (bg) */}
          <div className="absolute top-10 right-10 w-4 h-4 bg-auftek-green rounded-full blur-[2px] animate-ping opacity-20"></div>

          {/* Container do Card: Adicionado mx-auto e max-w responsivo */}
          <div className="relative w-full max-w-[320px] md:max-w-md aspect-square bg-gradient-to-br from-[#132338] to-[#0b1624] rounded-3xl border border-gray-700/50 shadow-[0_0_50px_-10px_rgba(30,144,255,0.15)] p-1 overflow-hidden group hover:border-auftek-blue/30 transition-all duration-500 mx-auto">
            {/* Backgrounds internos do card (Noise e Grid) */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(30,144,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(30,144,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            {/* Conteúdo Centralizado do Card */}
            <div className="relative h-full w-full flex flex-col items-center justify-center z-10 p-4 md:p-8">
              {/* Área da Imagem + Glow */}
              <div className="relative mb-6 md:mb-8 animate-float flex justify-center items-center">
                <div className="absolute w-[160px] h-[160px] md:w-[220px] md:h-[220px] bg-auftek-blue blur-[50px] md:blur-[70px] opacity-25 group-hover:opacity-45 transition-opacity duration-500 rounded-full"></div>

                <img
                  src="/images/BioAiLabIlustration.png"
                  alt="Dispositivo BioAiLab"
                  className="w-[140px] h-[140px] md:w-[180px] md:h-[180px] object-contain drop-shadow-[0_0_25px_rgba(30,144,255,0.8)] relative z-10"
                />

                <div className="absolute inset-0 border border-auftek-blue/30 rounded-full scale-[1.5] md:scale-[1.8] animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] opacity-20"></div>
              </div>

              {/* Texto do Produto */}
              <div className="text-center space-y-1 md:space-y-2">
                <h3 className="text-2xl md:text-3xl font-bold text-white tracking-widest group-hover:text-auftek-blue transition-colors">
                  BioAiLab
                  <span className="text-xs md:text-sm opacity-60 align-top relative -top-1 ml-0.5">
                    ®
                  </span>
                </h3>

                <p className="text-auftek-green text-xs md:text-sm font-medium tracking-wide bg-auftek-green/5 px-2 py-1 md:px-3 rounded-full border border-auftek-green/10 inline-block">
                  Smart Incubator System
                </p>
              </div>

              {/* Badge: IoT Connected (Ajuste Mobile: top-3 right-3) */}
              <div className="absolute top-3 right-3 md:top-6 md:right-6 flex items-center gap-1.5 md:gap-2 px-2 py-1 md:px-3 md:py-1.5 rounded-lg bg-black/40 border border-gray-700/50 backdrop-blur-md text-[10px] md:text-xs text-gray-300 shadow-lg animate-float-slow">
                <Wifi size={10} className="text-auftek-blue md:w-3 md:h-3" />
                <span>IoT Connected</span>
              </div>

              {/* Badge: AI Active (Ajuste Mobile: bottom-3 left-3) */}
              <div className="absolute bottom-3 left-3 md:bottom-6 md:left-6 flex items-center gap-1.5 md:gap-2 px-2 py-1 md:px-3 md:py-1.5 rounded-lg bg-black/40 border border-gray-700/50 backdrop-blur-md text-[10px] md:text-xs text-gray-300 shadow-lg animate-float-fast">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </div>
                <span>AI Active</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <ScrollReveal
        delay="300"
        className="mt-20 border-t border-gray-800/50 pt-20"
      >
        <SectionTitle align="center" subtitle="Tecnologia Multiplataforma">
          Controle total na palma da mão
        </SectionTitle>
        <p className="text-center text-gray-400 max-w-2xl mx-auto mb-12 font-light">
          O aplicativo do BioAiLab integra um CRM de monitoramento
          microbiológico em tempo real, acompanhando a dinâmica do crescimento
          por curvas de Gompertz e IA preditiva. A plataforma gera relatórios
          automáticos de contagem, tempo de crescimento e eficiência.
        </p>
        <BioDashboard />
      </ScrollReveal>
    </Section>
  );
};
