"use client";

import React from "react";
import { ArrowRight, FileText } from "lucide-react";
import { useRouter } from "next/navigation"; // <--- 1. Importamos o useRouter
import { Section } from "../../components/ui/Section";
import { Button } from "../../components/ui/Button";
import { cn } from "../../lib/utils";

export interface Story {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    slug: string; // O slug já vem do banco
}

interface HistorysListProps {
    stories: Story[];
}

const PAPERS = [
    {
        journal: "Analytical Chemistry",
        title: "Feasibility for Real-Time Monitoring of Bacterial Growth in Raw Milk Using a New Contactless Sensor",
        href: "https://pubs.acs.org/doi/10.1021/acs.analchem.5c03766"
    },
    {
        journal: "IEEE Sensors Journal",
        title: "Contactless Electrical Sensor Based on Resonance Frequency for Real-Time Monitoring of Bacterial Growth",
        href: "https://ieeexplore.ieee.org/document/10424681"
    }
];

export const HistorysList: React.FC<HistorysListProps> = ({ stories }) => {
    const router = useRouter(); // <--- 2. Instanciamos o router

    // 3. Atualizamos a função de clique
    const handleStoryClick = (slug: string) => {
        router.push(`/blog/${slug}`);
    };

    return (
        <Section id="historias" darker className="relative pt-0">

            {/* --- BLOCO 1: HISTÓRIAS DE SUCESSO (Dinâmico) --- */}
            <div className="max-w-5xl mx-auto px-4 mb-10 pt-16 border-t border-gray-800">
                <h3 className="text-2xl font-bold text-gray-300 mb-8 text-center">
                    Histórias de sucesso
                </h3>

                {stories.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6 px-4 md:px-0">
                        {stories.map((story) => (
                            <div key={story.id} className="group relative flex flex-col h-full">
                                <div
                                    className={cn(
                                        "bg-[#0e223b] border border-gray-800 rounded-xl transition-all duration-300 h-full flex flex-col overflow-hidden",
                                        "group-hover:-translate-y-1 hover:shadow-lg hover:border-cyan-400/50"
                                    )}
                                >
                                    <div className="relative h-42 overflow-hidden border-b border-gray-800">
                                        <div className="absolute inset-0 bg-[#0e223b]/20 group-hover:bg-transparent transition-all duration-500 z-10" />
                                        <img
                                            src={story.image || "/images/placeholder-case.jpg"}
                                            alt={story.title}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute top-3 right-3 z-20 bg-[#0e223b]/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-gray-300 uppercase tracking-wider border border-gray-700">
                                            {story.category}
                                        </div>
                                    </div>

                                    <div className="p-5 flex flex-col flex-1">
                                        <h3 className="text-lg font-bold text-white mb-3 leading-snug">
                                            {story.title}
                                        </h3>
                                        <p className="text-sm text-gray-400 leading-relaxed mb-6 flex-1 line-clamp-4">
                                            {story.description}
                                        </p>
                                        <div className="mt-auto pt-4 border-t border-gray-800/50">
                                            <Button
                                                variant="primary"
                                                className="w-full font-bold py-3 text-sm rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-auftek-blue/20 hover:shadow-auftek-blue/40"
                                                // 4. Passamos o SLUG em vez do título
                                                onClick={() => handleStoryClick(story.slug)}
                                            >
                                                Saiba Mais <ArrowRight size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-gray-500">Em breve novas histórias de sucesso.</p>
                    </div>
                )}
            </div>

            {/* --- BLOCO 2: PAPERS CIENTÍFICOS (Estático) --- */}
            <div className="max-w-5xl mx-auto px-4 pt-16 border-t border-gray-800">
                <h3 className="text-2xl font-bold text-gray-300 mb-8 text-center">
                    Publicações e Embasamento Técnico-Científico
                </h3>

                <div
                    className="
            flex overflow-x-auto gap-4 px-4 pb-10 pt-4 snap-x snap-mandatory items-stretch
            md:grid md:grid-cols-2 md:gap-6 md:pb-0 md:px-0
            [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
          "
                >
                    {PAPERS.map((paper, index) => (
                        <a
                            key={index}
                            href={paper.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                group relative w-[85vw] md:w-auto flex-shrink-0 snap-center h-full
                flex gap-4 p-4 rounded-lg bg-[#0e223b]/50 border border-gray-800
                hover:border-auftek-blue/50 hover:bg-[#0e223b] transition-all hover:-translate-y-1 cursor-pointer
              "
                        >
                            <div className="bg-gray-800/50 p-3 rounded h-fit group-hover:bg-auftek-blue/10 transition-colors shrink-0">
                                <FileText className="text-gray-400 group-hover:text-auftek-blue transition-colors" size={24} />
                            </div>
                            <div className="flex flex-col">
                                <h4 className="text-white font-medium group-hover:text-auftek-blue transition-colors">
                                    {paper.journal}
                                </h4>
                                <p className="text-gray-500 text-sm mt-1 leading-snug">
                                    {paper.title}
                                </p>
                            </div>
                        </a>
                    ))}
                </div>

                <p className="md:hidden text-center text-gray-600 text-xs mb-6 animate-pulse">
                    Deslize para o lado para ver mais →
                </p>

                <p className="text-center text-gray-500 text-sm mt-6 italic">
                    O BioAiLab tem sido utilizado em estudos científicos publicados em
                    periódicos de destaque internacional.
                </p>
            </div>

        </Section>
    );
};