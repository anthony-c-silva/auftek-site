"use client";
import React, { useRef, useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Section, SectionTitle } from "../../components/ui/Section";
import { BioDashboard } from "../../components/BioDashboard";
import { FaBacteria } from "react-icons/fa";
import { ScrollReveal } from "../../components/ui/ScrollReveal";

export const BioAiLab: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null); // Ref para a seção inteira (área vermelha)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;

    if (!section || !video) return;

    let requestIds: number;

    const handleScroll = () => {
      // Obtém a posição da seção em relação à janela (viewport)
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Cálculo da visibilidade:
      // Início: quando o topo da seção entra na tela (rect.top < windowHeight)
      // Fim: quando o fundo da seção sai da tela (rect.bottom < 0) ou ajustado conforme altura

      // Distância total que a seção percorre na tela
      const totalDistance = windowHeight + rect.height;
      // O quanto já percorreu (windowHeight - rect.top dá positivo assim que entra na tela)
      const distanceTravelled = windowHeight - rect.top;

      // Transforma em porcentagem (0 a 1)
      let progress = distanceTravelled / totalDistance;

      // Limita entre 0 e 1 para não estourar o tempo do vídeo fora da área
      progress = Math.max(0, Math.min(progress, 1));

      if (Number.isFinite(video.duration)) {
        // Define o tempo do vídeo baseado na porcentagem do scroll
        // requestAnimationFrame deixa a atualização visual mais suave
        requestIds = requestAnimationFrame(() => {
          video.currentTime = video.duration * progress;
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Chama uma vez para ajustar caso a página já carregue no meio
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(requestIds);
    };
  }, [isVideoLoaded]);

  return (
    // Adicionei o ref={sectionRef} aqui para demarcar a "Área Vermelha"
    <div ref={sectionRef}>
      <Section
        id="bioailab"
        className="relative overflow-hidden !bg-auftek-dark"
      >
        {/* --- CAMADA DE FUNDO --- */}
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
              <span className="text-2xl text-cyan-300 align-top relative -top-0 ml-0">
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
                O BioAiLab, reduz análises microbiológicas de {""}
                <strong className="text-white">dias para horas</strong>. Com IA
                embarcada, ele monitora o crescimento microbiano em tempo real e
                envia os dados direto para a nuvem.
              </p>

              <ul className="space-y-4">
                {[
                  "Totalmente automatizado: acelera incubação e quantificação.",
                  "Identifica E. coli, Coliformes Totais, Salmonella e outros...",
                  "Conectividade IoT: dados em nuvem, acesso via app e total rastreabilidade das análises",
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

          {/* LADO DIREITO: VIDEO SCROLLABLE */}
          <ScrollReveal
            delay="200"
            className="relative flex justify-center w-full h-full items-center"
          >
            {/* Removi o containerRef daqui pois não controlamos mais pelo mouse local */}
            <div className="w-full max-w-lg relative z-10 border border-white/10 rounded-2xl p-2 bg-white/5 backdrop-blur-sm overflow-hidden shadow-2xl shadow-auftek-blue/5">
              {/* Removi o overlay de "Use o Scroll" pois agora é automático com a página */}

              <video
                ref={videoRef}
                muted
                playsInline
                preload="auto"
                onLoadedMetadata={() => setIsVideoLoaded(true)}
                className="w-full h-auto object-contain rounded-xl pointer-events-none"
              >
                <source src="/images/bioailab.mp4" type="video/mp4" />
                Seu navegador não suporta a tag de vídeo.
              </video>
            </div>
          </ScrollReveal>
        </div>

        {/* --- PARTE INFERIOR --- */}
        <ScrollReveal
          delay="300"
          className="mt-20 border-t border-gray-800/50 pt-20"
        >
          <SectionTitle align="center">
            <div className="text-auftek-blue font-bold text-sm tracking-widest uppercase mb-4 font-sans">
              PLATAFORMA BIOAILAB®
            </div>

            <div className="font-sans">
              O Laboratório do Futuro, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-auftek-blue to-cyan-400 animate-pulse">
                Disponível Agora.
              </span>
            </div>
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
    </div>
  );
};
