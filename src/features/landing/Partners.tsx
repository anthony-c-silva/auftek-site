import React from 'react';
import { Section, SectionTitle } from '../../components/ui/Section';

export const Partners: React.FC = () => {
    return (
        <Section id="parceiros" darker>
            <SectionTitle align="center">Quem usa e apoia</SectionTitle>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Placeholders for logos */}
                <div className="text-2xl font-bold text-gray-500">FAPESP</div>
                <div className="text-2xl font-bold text-gray-500">CNPq</div>
                <div className="text-2xl font-bold text-gray-500">
                    PIPE Empreendedor
                </div>
                <div className="text-2xl font-bold text-gray-500">CIETEC</div>
                <div className="text-2xl font-bold text-gray-500">USP</div>
            </div>
        </Section>
    );
};
