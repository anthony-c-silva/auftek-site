import React from 'react';
import { Zap, CheckCircle2, Wifi } from 'lucide-react';
import { Section, SectionTitle } from '../../components/ui/Section';
import { BioDashboard } from '../../components/BioDashboard';
import { ScrollReveal } from '../../components/ui/ScrollReveal';
import { Assets } from '../../assets';

export const BioAiLab: React.FC = () => {
    return (
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

            {/* VIGNETTES */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-auftek-dark to-transparent z-0 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-auftek-dark to-transparent z-0 pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-24 md:w-40 h-full bg-gradient-to-r from-auftek-dark to-transparent z-0 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-24 md:w-40 h-full bg-gradient-to-l from-auftek-dark to-transparent z-0 pointer-events-none"></div>

            {/* --- CONTEÚDO --- */}
            <div className="grid lg:grid-cols-2 gap-16 items-center mb-24 relative z-10">
                {/* COLUNA ESQUERDA: Texto */}
                <ScrollReveal>
                    {/* ... (Texto mantido igual) ... */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-auftek-green/10 text-auftek-green border border-auftek-green/20 text-xs font-bold mb-6 hover:bg-auftek-green/20 transition-colors cursor-default">
                        <Zap size={14} fill="currentColor" />
                        PRODUTO PRINCIPAL
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        A Solução:{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-auftek-blue to-cyan-400">
                            BioAiLab®
                        </span>
                    </h2>

                    <h3 className="text-xl md:text-2xl text-gray-300 font-light mb-8 leading-relaxed">
                        Transformamos análises que levavam dias em resultados em{' '}
                        <span className="text-auftek-green font-semibold border-b border-auftek-green/30">
                            poucas horas
                        </span>
                        .
                    </h3>

                    <div className="space-y-8">
                        <p className="text-gray-400 text-lg font-light">
                            Nosso principal produto, o BioAiLab, reduz análises
                            microbiológicas de dias para horas. Com{' '}
                            <strong className="text-white">IA embarcada</strong>
                            , ele monitora o crescimento microbiano em tempo
                            real e envia os dados direto para a nuvem.
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

                {/* COLUNA DIREITA: Visual do Produto RESPONSIVO */}
                <ScrollReveal
                    delay="200"
                    className="relative flex justify-center lg:justify-end w-full"
                >
                    <div className="absolute top-10 right-10 w-4 h-4 bg-auftek-green rounded-full blur-[2px] animate-ping opacity-20 hidden md:block"></div>

                    {/* Card do Produto */}
                    {/* Alterações de Responsividade: max-w-full no mobile, min-h-[500px] para garantir espaço vertical */}
                    <div className="relative w-full max-w-md aspect-square md:aspect-auto md:min-h-[550px] bg-gradient-to-br from-[#132338] to-[#0b1624] rounded-3xl border border-gray-700/50 shadow-[0_0_50px_-10px_rgba(30,144,255,0.15)] p-1 overflow-hidden group hover:border-auftek-blue/30 transition-all duration-500 flex flex-col justify-center">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(30,144,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(30,144,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                        <div className="relative h-full w-full flex flex-col items-center justify-between py-12 px-6 md:p-8 z-10">
                            {/* Topo Vazio ou Badge no Mobile */}
                            <div className="w-full flex justify-end">
                                {/* IoT Badge - Ajustado posição */}
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-gray-700/50 backdrop-blur-md text-xs text-gray-300 shadow-lg animate-float-slow">
                                    <Wifi
                                        size={12}
                                        className="text-auftek-blue"
                                    />
                                    <span>IoT Connected</span>
                                </div>
                            </div>

                            {/* Centro: Imagem e Glow */}
                            <div className="relative my-6 animate-float flex justify-center items-center flex-1">
                                {/* Glow de fundo - Ajustado tamanho responsivo */}
                                <div className="absolute w-[180px] h-[180px] md:w-[220px] md:h-[220px] bg-auftek-blue blur-[60px] opacity-25 group-hover:opacity-45 transition-opacity duration-500 rounded-full"></div>

                                {/* Imagem - Responsiva: menor no mobile (w-36), maior no desktop (w-[180px]) */}
                                <img
                                    src={Assets.about.labWork}
                                    alt="Dispositivo BioAiLab"
                                    className="w-36 h-36 md:w-[180px] md:h-[180px] object-contain drop-shadow-[0_0_25px_rgba(30,144,255,0.8)] relative z-10"
                                />

                                {/* Anéis de radar */}
                                <div className="absolute inset-0 border border-auftek-blue/30 rounded-full scale-[1.6] md:scale-[1.8] animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] opacity-20"></div>
                            </div>

                            {/* Base: Textos e Badge */}
                            <div className="w-full relative">
                                <div className="text-center space-y-3 mb-8">
                                    <h3 className="text-2xl md:text-3xl font-bold text-white tracking-widest group-hover:text-auftek-blue transition-colors">
                                        BioAiLab
                                        <span className="text-sm align-top opacity-60">
                                            ®
                                        </span>
                                    </h3>
                                    <p className="text-auftek-green text-xs md:text-sm font-medium tracking-wide bg-auftek-green/5 px-3 py-1 rounded-full border border-auftek-green/10 inline-block">
                                        Smart Incubator System
                                    </p>
                                </div>

                                {/* AI Active Badge - Posicionado no fluxo normal em baixo, alinhado à esquerda */}
                                <div className="absolute bottom-0 left-0 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-gray-700/50 backdrop-blur-md text-xs text-gray-300 shadow-lg animate-float-fast">
                                    <div className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </div>
                                    <span>AI Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </div>

            {/* DASHBOARD PREVIEW */}
            {/* ... (mantido igual) */}
            <ScrollReveal
                delay="300"
                className="mt-20 border-t border-gray-800/50 pt-20"
            >
                <SectionTitle
                    align="center"
                    subtitle="Tecnologia Multiplataforma"
                >
                    Controle total na palma da mão
                </SectionTitle>
                <p className="text-center text-gray-400 max-w-2xl mx-auto mb-12 font-light">
                    O aplicativo exibe conceitos de monitoramento microbiológico
                    em tempo real, com gráficos de curvas de Gompertz e
                    indicadores preditivos gerados pela nossa IA.
                </p>
                <BioDashboard />
            </ScrollReveal>
        </Section>
    );
};
