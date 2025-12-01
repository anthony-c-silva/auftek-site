import React from "react";
import { Section, SectionTitle } from "../../components/ui/Section";

export const About: React.FC = () => {
  return (
    <Section id="quem-somos" className="border-t border-gray-800">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div>
          <SectionTitle>Quem Somos</SectionTitle>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            A <strong className="text-white">Auftek Tecnologia</strong> transforma ciência em instrumentação inteligente. Somos uma deeptech focada em resolver gargalos críticos em análises laboratoriais e controle de qualidade.
          </p>
          <p className="text-gray-400 leading-relaxed mb-6">
            Nosso lema — <span className="italic text-auftek-green">It’s time to save time</span> — reflete o propósito de criar tecnologias que economizam tempo e otimizam processos. Com uma equipe multidisciplinar de mestres e doutores, unimos microbiologia, eletrônica e inteligência artificial para entregar precisão e velocidade.
          </p>
          <div className="grid grid-cols-2 gap-6 mt-8">
            <div className="border-l-4 border-auftek-blue pl-4">
              <h4 className="text-3xl font-bold text-white mb-1">+10</h4>
              <p className="text-sm text-gray-500">Anos de Pesquisa</p>
            </div>
            <div className="border-l-4 border-auftek-green pl-4">
              <h4 className="text-3xl font-bold text-white mb-1">IA + IoT</h4>
              <p className="text-sm text-gray-500">Tecnologia Proprietária</p>
            </div>
          </div>
        </div>

        <div className="w-full">
          {/* Container responsivo com aspect-ratio de vídeo */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-gray-800 bg-gray-900 group">
            {/* Efeito de brilho na borda */}
            <div className="absolute -inset-1 bg-gradient-to-r from-auftek-blue to-auftek-green opacity-20 blur group-hover:opacity-40 transition duration-1000"></div>
            
            {/* Iframe configurado para React */}
            <iframe 
              className="absolute top-0 left-0 w-full h-full relative z-10"
              src="https://www.youtube.com/embed/Z9QgvWFjhYA?si=0woAwjn7QQx2WDHg" 
              title="Auftek Institutional Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </Section>
  );
};