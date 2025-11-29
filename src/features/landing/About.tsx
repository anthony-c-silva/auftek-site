import React from "react";
import { CheckCircle2, Cpu, Activity } from "lucide-react";
import { Section, SectionTitle } from "../../components/ui/Section";
import { Assets } from "../../assets";
import { ScrollReveal } from "../../components/ui/ScrollReveal";

export const About: React.FC = () => {
  return (
    // ALTERAÇÃO CRUCIAL AQUI:
    // 1. 'relative z-10': Garante que fique POR CIMA do Hero.
    // 2. 'bg-auftek-dark': Fundo sólido para cobrir o Hero.
    // 3. 'rounded-t-[3rem]': Cria a borda curva futurista no topo.
    // 4. 'shadow-[0_-20px_60px_-15px_rgba(30,144,255,0.15)]': Sombra superior para dar profundidade (glow azul).
    // 5. 'border-t border-white/10': Borda sutil de vidro.
    <section
      id="quem-somos"
      className="relative z-10 bg-auftek-dark rounded-t-[3rem] -mt-10 border-t border-white/10 shadow-[0_-20px_60px_-15px_rgba(30,144,255,0.15)] overflow-hidden pb-20 px-6 md:px-12 lg:px-24"
    >
      {/* BACKGROUND FUTURISTA (Grid + Luz) */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
      <div
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      {/* Holofote de luz azul */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-auftek-blue/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 pt-20">
        {" "}
        {/* pt-20 para dar espaço interno no topo da curva */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* COLUNA DE TEXTO */}
          <ScrollReveal>
            <SectionTitle subtitle="Sobre a Auftek">
              A Auftek Tecnologia transforma ciência em instrumentação
              inteligente
            </SectionTitle>

            <div className="space-y-6 text-gray-400 text-lg leading-relaxed font-light">
              <p>
                Nascemos da necessidade de modernizar processos analíticos
                arcaicos. Somos uma{" "}
                <span className="text-white font-semibold">deeptech</span>{" "}
                focada em desenvolver hardware e software integrados para
                resolver dores críticas em laboratórios e usinas de energia.
              </p>
              <p>
                Com uma equipe multidisciplinar de doutores e engenheiros,
                criamos soluções que não apenas medem, mas{" "}
                <span className="text-auftek-blue">interpretam dados</span> para
                gerar valor real.
              </p>
            </div>

            {/* Cards de Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="group p-5 rounded-xl border border-gray-700/50 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-auftek-green/50 transition-all duration-300 cursor-default">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-auftek-green/10 text-auftek-green group-hover:scale-110 transition-transform">
                    <Activity size={20} />
                  </div>
                  <h4 className="font-bold text-white group-hover:text-auftek-green transition-colors">
                    Alta Precisão
                  </h4>
                </div>
                <p className="text-sm text-gray-400 group-hover:text-gray-300">
                  Sensores calibrados e algoritmos de IA embarcada.
                </p>
              </div>

              <div className="group p-5 rounded-xl border border-gray-700/50 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-auftek-blue/50 transition-all duration-300 cursor-default">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-auftek-blue/10 text-auftek-blue group-hover:scale-110 transition-transform">
                    <Cpu size={20} />
                  </div>
                  <h4 className="font-bold text-white group-hover:text-auftek-blue transition-colors">
                    IoT Nativo
                  </h4>
                </div>
                <p className="text-sm text-gray-400 group-hover:text-gray-300">
                  Conectividade total para monitoramento remoto.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* COLUNA DA IMAGEM */}
          <ScrollReveal delay="200" className="relative flex justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-auftek-blue/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] border border-dashed border-gray-700 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-auftek-blue/20 rounded-full blur-[60px]"></div>

            <div className="relative w-3/4 md:w-2/3 animate-float">
              <img
                src={Assets.about.labWork}
                alt="Equipamento BioAiLab"
                className="w-full h-auto relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] object-contain"
              />
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-2/3 h-4 bg-black/50 blur-lg rounded-[100%] animate-[pulse_6s_ease-in-out_infinite]"></div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
