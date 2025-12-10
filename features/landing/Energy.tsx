import React from 'react';
import { Zap, Award } from 'lucide-react';
import { Section, SectionTitle } from '../../components/ui/Section';

const IMG_ARC =
    'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&q=80&w=800';
const IMG_SAFETY =
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800';

export const Energy: React.FC = () => {
    return (
        <Section
            id="energia"
            className="bg-gradient-to-br from-auftek-dark to-[#102a4a]"
        >
            <div className="max-w-4xl mx-auto text-center mb-16">
                <SectionTitle
                    align="center"
                    subtitle="Soluções para o Setor Elétrico"
                >
                    Energia e Creditação de Inversores
                </SectionTitle>
                <p className="text-xl text-gray-300">
                    A Auftek Tecnologia desenvolve instrumentação completa para
                    creditação de inversores fotovoltaicos, atendendo às normas{' '}
                    <span className="text-white font-bold">IEC 63027</span> e{' '}
                    <span className="text-white font-bold">IEC 62109-2</span>.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* PVAG LAB */}
                <div className="group relative bg-[#0a192f] rounded-2xl overflow-hidden border border-gray-700 hover:border-yellow-500/50 transition-all">
                    <div className="h-48 bg-gray-800 relative">
                        <img
                            src={IMG_ARC}
                            alt="Arc Flash"
                            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
                        />
                        <div className="absolute bottom-4 left-4">
                            <div className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-3 py-1 rounded text-xs font-bold inline-flex items-center gap-1">
                                <Zap size={12} /> ARCO ELÉTRICO
                            </div>
                        </div>
                    </div>
                    <div className="p-8">
                        <h3 className="text-2xl font-bold text-white mb-3">
                            PVAG LAB
                        </h3>
                        <p className="text-gray-400 mb-6">
                            O PVAG LAB é um sistema modular para emulação
                            controlada de arcos elétricos em corrente contínua
                            (DC). Essencial para testes de segurança em
                            inversores modernos.
                        </p>
                        <ul className="text-sm text-gray-500 space-y-2">
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>{' '}
                                Emulação precisa de falhas
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>{' '}
                                Compatível com normas internacionais
                            </li>
                        </ul>
                    </div>
                </div>

                {/* IRCCT */}
                <div className="group relative bg-[#0a192f] rounded-2xl overflow-hidden border border-gray-700 hover:border-blue-500/50 transition-all">
                    <div className="h-48 bg-gray-800 relative">
                        <img
                            src={IMG_SAFETY}
                            alt="Electrical Safety"
                            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
                        />
                        <div className="absolute bottom-4 left-4">
                            <div className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded text-xs font-bold inline-flex items-center gap-1">
                                <Award size={12} /> IEC 62109-2
                            </div>
                        </div>
                    </div>
                    <div className="p-8">
                        <h3 className="text-2xl font-bold text-white mb-3">
                            IRCCT System
                        </h3>
                        <p className="text-gray-400 mb-6">
                            O IRCCT é um sistema modular para ensaios de
                            corrente residual e isolamento elétrico conforme IEC
                            62109-2 e IEC 63112. Garantia de conformidade para
                            fabricantes.
                        </p>
                        <ul className="text-sm text-gray-500 space-y-2">
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-auftek-blue rounded-full"></div>{' '}
                                Detecção de fuga de corrente
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-auftek-blue rounded-full"></div>{' '}
                                Automação de ensaios
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </Section>
    );
};
