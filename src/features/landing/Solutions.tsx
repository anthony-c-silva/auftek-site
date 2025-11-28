import React from 'react';
import { Section, SectionTitle } from '../../components/ui/Section';
import { SOLUTIONS } from '../../data/constants'; // Verifique se o caminho está correto para sua pasta data

export const Solutions: React.FC = () => {
    return (
        <Section id="solucoes">
            <SectionTitle align="center" subtitle="O que fazemos">
                Nossas Soluções Laboratoriais
            </SectionTitle>
            <div className="grid md:grid-cols-3 gap-8">
                {SOLUTIONS.map((sol, i) => (
                    <div
                        key={i}
                        className="group relative bg-auftek-slate p-8 rounded-xl border border-gray-800 hover:border-auftek-blue/60 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_10px_40px_-10px_rgba(30,144,255,0.2)] cursor-default"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-auftek-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-[#0e223b] rounded-lg flex items-center justify-center mb-6 group-hover:bg-auftek-blue text-auftek-blue group-hover:text-white transition-colors duration-300">
                                <sol.icon size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4 group-hover:text-auftek-blue transition-colors">
                                {sol.title}
                            </h3>
                            <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                                {sol.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
};
