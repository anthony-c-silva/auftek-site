import React from "react";
import {
  ArrowRight,
  Zap,
  Microscope,
  Wifi,
  Activity,
  ChevronDown,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { scrollToElement } from "../../hooks/useScroll";

const IMAGES = {
  heroBg:
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=2000",
};

export const Hero: React.FC = () => {
  return (
    // RESTAURADO: 'sticky top-0' para o efeito de scroll desejado.
    // MANTIDO: 'min-h-[700px]' para evitar achatamento em telas baixas.
    <div className="sticky top-0 h-screen min-h-[700px] flex flex-col items-center justify-start overflow-hidden bg-auftek-dark">
      
      {/* --- CAMADA DE FUNDO --- */}
      <div className="absolute inset-0 w-full h-full">
        <div
          className="absolute inset-0 bg-cover bg-center z-0 opacity-20 transition-transform duration-[20s] hover:scale-105"
          style={{ backgroundImage: `url(${IMAGES.heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-auftek-dark/90 via-auftek-dark/80 to-auftek-dark z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-auftek-blue/20 rounded-full blur-[80px] md:blur-[120px] animate-[pulse-glow_4s_infinite] pointer-events-none z-0"></div>
        
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
          <Microscope className="absolute top-[15%] left-[5%] lg:top-1/4 lg:left-[10%] text-auftek-green/10 w-10 h-10 sm:w-16 sm:h-16 lg:w-24 lg:h-24 animate-float" />
          <Zap className="absolute bottom-[15%] right-[5%] lg:bottom-1/4 lg:right-[10%] text-yellow-500/10 w-12 h-12 sm:w-24 sm:h-24 lg:w-32 lg:h-32 animate-float-slow" />
          <Wifi className="absolute top-[20%] right-[10%] lg:top-1/3 lg:right-[20%] text-auftek-blue/10 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 animate-float-fast" />
          <Activity className="absolute bottom-[20%] left-[8%] lg:bottom-1/3 lg:left-[15%] text-purple-500/10 w-8 h-8 sm:w-14 sm:h-14 lg:w-20 lg:h-20 animate-float" />
        </div>
      </div>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      {/* LÓGICA DE POSICIONAMENTO:
          1. 'pt-32': Padding fixo no topo (~128px). Isso empurra o conteúdo para baixo da Navbar (que tem ~80px).
          2. 'justify-start': O conteúdo começa do topo+padding, não do centro. Isso evita que o topo seja cortado.
          3. 'lg:justify-center lg:pt-0': Em telas grandes onde sobra espaço, voltamos a centralizar perfeitamente.
      */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow flex flex-col items-center justify-start pt-32 lg:justify-center lg:pt-0 text-center">
        
        <div className="animate-fade-in-up">
          <span className="inline-block py-1.5 px-4 rounded-full bg-auftek-blue/10 text-white border border-auftek-blue/30 text-[10px] sm:text-xs font-bold tracking-widest mb-6 uppercase backdrop-blur-md shadow-[0_0_15px_rgba(30,144,255,0.3)]">
            Deeptech Brasileira
          </span>
        </div>

        <h1 className="animate-fade-in-up delay-100 text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.2] tracking-tight drop-shadow-lg max-w-4xl">
          Inovação que transforma <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-auftek-blue to-auftek-green block mt-2 sm:mt-0">
            ciência em soluções reais
          </span>
        </h1>

        <div className="max-w-3xl w-full space-y-6 mb-10 animate-fade-in-up delay-200">
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 font-light leading-relaxed px-4">
            Transformamos análises de{" "}
            <span className="text-white font-semibold border-b-2 border-red-500/30">
              dias
            </span>{" "}
            em resultados de{" "}
            <span className="text-auftek-green font-semibold border-b-2 border-auftek-green/30">
              poucas horas
            </span>
            .
          </p>

          <p className="text-sm sm:text-base text-gray-400 font-light max-w-xl mx-auto hidden sm:block">
            Instrumentação inovadora com IA e IoT para saneamento, energia e indústria.
          </p>

          <div className="flex justify-center mt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-xs text-gray-400 italic">Lema:</span>
              <span className="text-xs sm:text-sm text-auftek-blue font-medium tracking-wide uppercase">
                It’s time to save time
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center px-4 animate-fade-in-up delay-300">
          <Button
            onClick={() => scrollToElement("#bioailab")}
            className="group relative overflow-hidden w-full sm:w-auto min-w-[200px] justify-center"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative flex items-center gap-2 justify-center">
              Conheça o BioAiLab
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </span>
          </Button>

          <Button
            variant="outline"
            onClick={() => scrollToElement("#energia")}
            className="group hover:border-yellow-400/50 hover:bg-yellow-400/5 w-full sm:w-auto min-w-[200px] justify-center"
          >
            <Zap className="text-yellow-400 group-hover:scale-110 transition-transform" size={18} />
            Soluções em Energia
          </Button>
        </div>
      </div>

      <div className="absolute bottom-6 w-full flex flex-col items-center z-20 pointer-events-none">
        <div
          className="flex flex-col items-center gap-2 animate-bounce cursor-pointer opacity-70 hover:opacity-100 transition-opacity pointer-events-auto"
          onClick={() => scrollToElement("#quem-somos")}
        >
          <span className="text-[10px] text-gray-400 uppercase tracking-widest">
            Descubra Mais
          </span>
          <ChevronDown className="text-auftek-blue w-5 h-5" />
        </div>
      </div>
    </div>
  );
};