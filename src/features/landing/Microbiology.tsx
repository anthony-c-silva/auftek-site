import React from 'react';
import { Clock, Factory, Microscope } from 'lucide-react';
import { Section, SectionTitle } from '../../components/ui/Section';

export const Microbiology: React.FC = () => {
    return (
        <Section id="microbiologia" darker>
            <SectionTitle align="center" subtitle="O Contexto">
                O Desafio do Controle Microbiológico
            </SectionTitle>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div className="bg-auftek-slate p-8 rounded-xl border border-gray-800 hover:border-auftek-blue/50 transition-colors">
                    <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-6">
                        <Clock className="text-red-400" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">
                        O Problema do Tempo
                    </h3>
                    <p className="text-gray-400">
                        Análises microbiológicas tradicionais exigem
                        infraestrutura laboratorial complexa e levam dias para
                        indicar presença, ausência e/ou quantificação de
                        microrganismos.
                    </p>
                </div>
                <div className="bg-auftek-slate p-8 rounded-xl border border-gray-800 hover:border-auftek-blue/50 transition-colors">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-6">
                        <Factory className="text-yellow-400" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">
                        Impacto na Indústria
                    </h3>
                    <p className="text-gray-400">
                        A demora nos resultados trava a liberação de lotes,
                        atrasa o tratamento de água e efluentes e gera custos
                        operacionais elevados com armazenamento e reprocesso.
                    </p>
                </div>
                <div className="bg-auftek-slate p-8 rounded-xl border border-gray-800 hover:border-auftek-blue/50 transition-colors">
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-6">
                        <Microscope className="text-green-400" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">
                        A Necessidade
                    </h3>
                    <p className="text-gray-400">
                        O mercado precisa de métodos rápidos, autônomos e que
                        eliminem o erro humano na contagem e identificação de
                        colônias.
                    </p>
                </div>
            </div>
        </Section>
    );
};
