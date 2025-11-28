import React from 'react';
import { Zap, CheckCircle2, Microscope } from 'lucide-react';
import { Section, SectionTitle } from '../../components/ui/Section';
import { BioDashboard } from '../../components/BioDashboard'; // Atualize o path

export const BioAiLab: React.FC = () => {
    return (
        <Section id="bioailab" className="relative">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-auftek-blue/10 to-transparent pointer-events-none"></div>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-auftek-green/10 text-auftek-green border border-auftek-green/20 text-xs font-bold mb-4">
                        <Zap size={14} fill="currentColor" />
                        PRODUTO PRINCIPAL
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        A Solução:{' '}
                        <span className="text-auftek-blue">BioAiLab®</span>
                    </h2>
                    <h3 className="text-2xl text-gray-300 font-light mb-8">
                        Transformamos análises que levavam dias em resultados em{' '}
                        <span className="text-auftek-green font-semibold">
                            poucas horas
                        </span>
                        .
                    </h3>
                    <div className="space-y-6">
                        <p className="text-gray-400 text-lg">
                            Nosso principal produto, o BioAiLab, reduz análises
                            microbiológicas de dias para horas. Com IA
                            embarcada, ele monitora o crescimento microbiano em
                            tempo real.
                        </p>
                        <ul className="space-y-4">
                            {[
                                'Totalmente automatizado: acelera incubação e quantificação.',
                                'Identifica E. coli, Coliformes Totais e bactérias heterotróficas.',
                                'Conectividade IoT: Dados na nuvem acessíveis via App e Web.',
                                'Dispensa contagem manual e reduz erro humano.',
                            ].map((item, i) => (
                                <li
                                    key={i}
                                    className="flex items-start gap-3 text-gray-300"
                                >
                                    <CheckCircle2
                                        className="text-auftek-blue shrink-0 mt-1"
                                        size={18}
                                    />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="relative">
                    <div className="aspect-square bg-gradient-to-br from-[#1a2c42] to-[#0e223b] rounded-2xl border border-gray-700 shadow-2xl p-8 flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                        <div className="text-center z-10">
                            <Microscope
                                size={120}
                                className="text-auftek-blue mx-auto mb-6 drop-shadow-[0_0_15px_rgba(30,144,255,0.5)]"
                            />
                            <h3 className="text-2xl font-bold text-white tracking-widest">
                                BioAiLab
                                <span className="text-xs align-top">®</span>
                            </h3>
                            <p className="text-auftek-green text-sm mt-2">
                                Smart Incubator System
                            </p>
                        </div>

                        <div className="absolute top-6 right-6 bg-black/40 backdrop-blur-md border border-gray-600 px-3 py-1 rounded text-xs text-white">
                            IoT Connected
                        </div>
                        <div className="absolute bottom-6 left-6 bg-black/40 backdrop-blur-md border border-gray-600 px-3 py-1 rounded text-xs text-white flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>{' '}
                            AI Active
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-20">
                <SectionTitle
                    align="center"
                    subtitle="Tecnologia Multiplataforma"
                >
                    Controle total na palma da mão
                </SectionTitle>
                <p className="text-center text-gray-400 max-w-2xl mx-auto mb-8">
                    O aplicativo exibe conceitos de monitoramento microbiológico
                    em tempo real, com gráficos de curvas de Gompertz e
                    indicadores preditivos.
                </p>
                <BioDashboard />
            </div>
        </Section>
    );
};
