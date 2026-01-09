"use client";
import React from "react";
import { ArrowRight } from "lucide-react";
import { Section, SectionTitle } from "../../components/ui/Section";
import { Button } from "../../components/ui/Button";
import { cn } from "../../lib/utils";

const SUCCESS_STORIES = [
  {
    id: 1,
    title: "Monitoramento Avançado na CORSAN",
    description:
      "Aplicação da tecnologia para otimização do controle de qualidade da água na Companhia Riograndense de Saneamento. O equipamento permite análises mais rápidas e precisas, garantindo segurança hídrica e eficiência operacional.",
    image:
      "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800",
    category: "Saneamento",
  },
  {
    id: 2,
    title: "Validação Técnica no SENAI Estância Velha",
    description:
      "Parceria estratégica com o SENAI de Estância Velha para validação rigorosa do dispositivo. Os testes locais realizados confirmam a precisão e a robustez do equipamento em cenários reais.",
    image:
      "https://images.unsplash.com/photo-1581093588401-fbb072049136?auto=format&fit=crop&q=80&w=800",
    category: "Pesquisa",
  },
];

export const Historys: React.FC = () => {
  // Função para rolar até o contato e preencher a mensagem
  const handleStoryClick = (storyTitle: string) => {
    const contactSection = document.getElementById("contato");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }

    const message = `Olá! Gostaria de saber mais detalhes sobre o caso de sucesso: ${storyTitle}.`;

    setTimeout(() => {
      const event = new CustomEvent("prefillContact", { detail: message });
      window.dispatchEvent(event);
    }, 100);
  };

  return (
    <Section id="historias" darker className="relative pt-0">
      {/* --- DIVISOR SUPERIOR --- */}
      <div className="max-w-5xl mx-auto px-4 mb-16">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent opacity-70"></div>
      </div>

      {/* TÍTULO */}
      <SectionTitle align="center" subtitle="Histórias de Sucesso">
        Aplicações Reais e Validações
      </SectionTitle>

      {/* Container reduzido para max-w-5xl para cards menores */}
      <div className="max-w-5xl mx-auto px-8 mt-10">
        <div className="grid md:grid-cols-2 gap-6">
          {SUCCESS_STORIES.map((story) => (
            <div key={story.id} className="group relative flex flex-col h-full">
              {/* CARD */}
              <div
                className={cn(
                  "bg-[#0e223b] border border-gray-800 rounded-xl transition-all duration-300 h-full flex flex-col overflow-hidden",
                  "group-hover:-translate-y-1 hover:shadow-lg hover:border-cyan-400/50"
                )}
              >
                {/* Imagem Reduzida (h-48) */}
                <div className="relative h-42 overflow-hidden border-b border-gray-800">
                  <div className="absolute inset-0 bg-[#0e223b]/20 group-hover:bg-transparent transition-all duration-500 z-10" />
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Badge menor */}
                  <div className="absolute top-3 right-3 z-20 bg-[#0e223b]/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-gray-300 uppercase tracking-wider border border-gray-700">
                    {story.category}
                  </div>
                </div>

                {/* Conteúdo mais compacto (p-5) */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-white mb-3 leading-snug">
                    {story.title}
                  </h3>

                  <p className="text-sm text-gray-400 leading-relaxed mb-6 flex-1">
                    {story.description}
                  </p>

                  {/* Botão */}
                  <div className="mt-auto pt-4 border-t border-gray-800/50">
                    <Button
                      // 1. Adicionado variant="primary" para puxar a cor exata do botão de contato
                      variant="primary"
                      // 2. Removido 'bg-cyan-500' manual e ajustado a sombra para 'auftek-blue'
                      className="w-full font-bold py-3 text-sm rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-auftek-blue/20 hover:shadow-auftek-blue/40"
                      onClick={() => handleStoryClick(story.title)}
                    >
                      Saiba Mais <ArrowRight size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};