import React from 'react';
import { FileText, Factory, Leaf, Sun, Activity } from 'lucide-react';
import { Section, SectionTitle } from '../../components/ui/Section';

export const Publications: React.FC = () => {
    return (
        <Section id="publicacoes" darker>
            <div className="grid md:grid-cols-2 gap-16">
                <div>
                    <SectionTitle subtitle="Validação Científica">
                        Publicações e Embasamento
                    </SectionTitle>
                    <p className="text-gray-400 mb-6">
                        O BioAiLab tem sido utilizado em estudos científicos
                        publicados em periódicos de destaque internacional.
                        Nossa tecnologia não é apenas promessa, é ciência
                        comprovada.
                    </p>
                    <div className="space-y-4">
                        <div className="bg-[#0e223b] p-4 rounded-lg border-l-4 border-auftek-blue flex items-start gap-4">
                            <FileText className="shrink-0 text-gray-500" />
                            <div>
                                <h4 className="text-white font-semibold">
                                    International Journal of Microbiology
                                </h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    Validação do método condutivométrico
                                    automatizado para detecção de E. coli.
                                </p>
                            </div>
                        </div>
                        <div className="bg-[#0e223b] p-4 rounded-lg border-l-4 border-auftek-green flex items-start gap-4">
                            <FileText className="shrink-0 text-gray-500" />
                            <div>
                                <h4 className="text-white font-semibold">
                                    IEEE Sensors Journal
                                </h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    Aplicação de redes neurais em sensores
                                    ópticos para crescimento microbiano.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <SectionTitle subtitle="Onde Atuamos">
                        Aplicações Reais
                    </SectionTitle>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            {
                                label: 'ETEs (Tratamento de Efluentes)',
                                icon: Factory,
                            },
                            { label: 'Indústria de Alimentos', icon: Leaf },
                            { label: 'Agronegócio', icon: Sun },
                            {
                                label: 'Hospitais e Laboratórios',
                                icon: Activity,
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="bg-[#0e223b] p-6 rounded-xl flex flex-col items-center justify-center text-center gap-3 border border-gray-800 hover:bg-auftek-slate transition-colors group"
                            >
                                <item.icon
                                    className="text-auftek-blue group-hover:scale-110 transition-transform"
                                    size={32}
                                />
                                <span className="text-gray-300 font-medium">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Section>
    );
};
