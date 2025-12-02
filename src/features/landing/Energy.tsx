import React from 'react';
import { Zap, Award, CheckCircle2 } from 'lucide-react';
import { Section, SectionTitle } from '../../components/ui/Section';
import { ScrollReveal } from '../../components/ui/ScrollReveal';
import { Assets } from '../../assets';

export const Energy: React.FC = () => {
    return (
        <Section
            id="energia"
            className="relative overflow-hidden !bg-auftek-dark"
        >
            {/* --- BACKGROUND FX --- */}
            {/* Textura */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>

            {/* Luzes de Fundo (Amarelo para Energia, Azul para o resto) */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-auftek-blue/5 rounded-full blur-[120px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

            {/* Vignettes (Fusão com outras seções) */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-auftek-dark to-transparent z-0 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-auftek-dark to-transparent z-0 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* CABEÇALHO */}
                <ScrollReveal>
                    <div className="max-w-4xl mx-auto text-center mb-16 px-4">
                        <SectionTitle
                            align="center"
                            subtitle="Soluções para o Setor Elétrico"
                        >
                            Energia e Creditação de Inversores
                        </SectionTitle>
                        <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed">
                            A Auftek Tecnologia desenvolve instrumentação
                            completa para creditação de inversores
                            fotovoltaicos, atendendo às normas{' '}
                            <span className="text-white font-bold border-b border-yellow-500/30">
                                IEC 63027
                            </span>{' '}
                            e{' '}
                            <span className="text-white font-bold border-b border-blue-500/30">
                                IEC 62109-2
                            </span>
                            .
                        </p>
                    </div>
                </ScrollReveal>

                {/* GRID DE CARDS */}
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12 px-4">
                    {/* CARD 1: PVAG LAB (Foco: Amarelo/Energia) */}
                    <ScrollReveal delay="200">
                        <div className="group relative bg-[#0e1a2b] rounded-3xl overflow-hidden border border-gray-800 hover:border-yellow-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(234,179,8,0.15)] h-full flex flex-col">
                            {/* Imagem com Zoom no Hover */}
                            <div className="h-56 md:h-64 bg-gray-800 relative overflow-hidden">
                                <div className="absolute inset-0 bg-yellow-500/10 mix-blend-overlay z-10 group-hover:bg-yellow-500/0 transition-colors duration-500"></div>
                                <img
                                    src={Assets.solutions.arcFlash}
                                    alt="Arc Flash Simulation"
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                                />
                                {/* Badge Flutuante */}
                                <div className="absolute bottom-4 left-4 z-20">
                                    <div className="bg-black/60 backdrop-blur-md text-yellow-400 border border-yellow-500/30 px-4 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-2 shadow-lg">
                                        <Zap size={14} fill="currentColor" />{' '}
                                        ARCO ELÉTRICO
                                    </div>
                                </div>
                            </div>

                            {/* Conteúdo */}
                            <div className="p-8 flex flex-col flex-grow">
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors">
                                    PVAG LAB
                                </h3>
                                <p className="text-gray-400 mb-8 leading-relaxed text-sm md:text-base">
                                    O PVAG LAB é um sistema modular para
                                    emulação controlada de arcos elétricos em
                                    corrente contínua (DC). Essencial para
                                    testes de segurança em inversores modernos.
                                </p>

                                {/* Lista de Features */}
                                <ul className="space-y-3 mt-auto">
                                    <li className="flex items-start gap-3 text-sm text-gray-300">
                                        <CheckCircle2
                                            size={18}
                                            className="text-yellow-500 shrink-0 mt-0.5"
                                        />
                                        <span>
                                            Emulação precisa de falhas de arco
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-gray-300">
                                        <CheckCircle2
                                            size={18}
                                            className="text-yellow-500 shrink-0 mt-0.5"
                                        />
                                        <span>
                                            Compatível com normas internacionais
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* CARD 2: IRCCT (Foco: Azul/Segurança) */}
                    <ScrollReveal delay="300">
                        <div className="group relative bg-[#0e1a2b] rounded-3xl overflow-hidden border border-gray-800 hover:border-auftek-blue/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(30,144,255,0.15)] h-full flex flex-col">
                            {/* Imagem com Zoom no Hover */}
                            <div className="h-56 md:h-64 bg-gray-800 relative overflow-hidden">
                                <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay z-10 group-hover:bg-blue-500/0 transition-colors duration-500"></div>
                                <img
                                    src={Assets.solutions.safety}
                                    alt="Electrical Safety Testing"
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                                />
                                {/* Badge Flutuante */}
                                <div className="absolute bottom-4 left-4 z-20">
                                    <div className="bg-black/60 backdrop-blur-md text-auftek-blue border border-auftek-blue/30 px-4 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-2 shadow-lg">
                                        <Award size={14} /> IEC 62109-2
                                    </div>
                                </div>
                            </div>

                            {/* Conteúdo */}
                            <div className="p-8 flex flex-col flex-grow">
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-auftek-blue transition-colors">
                                    IRCCT System
                                </h3>
                                <p className="text-gray-400 mb-8 leading-relaxed text-sm md:text-base">
                                    O IRCCT é um sistema modular para ensaios de
                                    corrente residual e isolamento elétrico
                                    conforme IEC 62109-2 e IEC 63112. Garantia
                                    de conformidade para fabricantes.
                                </p>

                                {/* Lista de Features */}
                                <ul className="space-y-3 mt-auto">
                                    <li className="flex items-start gap-3 text-sm text-gray-300">
                                        <CheckCircle2
                                            size={18}
                                            className="text-auftek-blue shrink-0 mt-0.5"
                                        />
                                        <span>
                                            Detecção avançada de fuga de
                                            corrente
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-gray-300">
                                        <CheckCircle2
                                            size={18}
                                            className="text-auftek-blue shrink-0 mt-0.5"
                                        />
                                        <span>
                                            Automação completa de ensaios
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </Section>
    );
};
