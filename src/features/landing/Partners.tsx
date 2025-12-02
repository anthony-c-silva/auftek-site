import React from 'react';
import { Section, SectionTitle } from '../../components/ui/Section';
import {
    Building2,
    Sprout,
    FlaskConical,
    Landmark,
    Rocket,
    Award,
} from 'lucide-react';

const PARTNERS = [
    { name: 'Embrapa', icon: Sprout },
    { name: 'Zeit', icon: Rocket },
    { name: 'USP', icon: Landmark },
    { name: 'UFSCar', icon: Landmark },
    { name: 'Finep', icon: Award },
    { name: 'FAPERGS', icon: FlaskConical },
    { name: 'SEBRAE', icon: Building2 },
    { name: 'Badesul', icon: Building2 },
];

export const Partners: React.FC = () => {
    return (
        <Section
            id="parceiros"
            className="relative overflow-hidden !bg-auftek-dark py-24"
        >
            {/* Background Sutil */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-0 pointer-events-none"></div>

            <div className="relative z-10">
                <SectionTitle
                    align="center"
                    subtitle="Quem confia e impulsiona nossa tecnologia"
                >
                    Quem usa e apoia
                </SectionTitle>

                {/* --- CARROSSEL INFINITO --- */}
                {/* AQUI ESTÁ A CORREÇÃO DA SOMBRA: Usamos mask-image em vez de divs laterais */}
                <div
                    className="mt-16 relative w-full overflow-hidden"
                    style={{
                        maskImage:
                            'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                        WebkitMaskImage:
                            'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                    }}
                >
                    {/* Track do Slider */}
                    <div className="flex w-max animate-scroll">
                        {/* Lista Original */}
                        <div className="flex gap-16 mx-8 items-center">
                            {PARTNERS.map((partner, i) => (
                                // CORREÇÃO DE TYPESCRIPT: Passamos a key aqui, mas o componente PartnerItem não precisa saber dela.
                                <PartnerItem
                                    key={`original-${i}`}
                                    partner={partner}
                                />
                            ))}
                        </div>

                        {/* Lista Duplicada */}
                        <div className="flex gap-16 mx-8 items-center">
                            {PARTNERS.map((partner, i) => (
                                <PartnerItem
                                    key={`duplicate-${i}`}
                                    partner={partner}
                                />
                            ))}
                        </div>

                        {/* Triplicada */}
                        <div className="flex gap-16 mx-8 items-center">
                            {PARTNERS.map((partner, i) => (
                                <PartnerItem
                                    key={`triplicate-${i}`}
                                    partner={partner}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    );
};

// CORREÇÃO: Removi a prop 'key' da definição de tipos, pois ela é interna do React.
const PartnerItem = ({
    partner,
}: {
    partner: { name: string; icon: React.ElementType };
}) => (
    <div className="group flex flex-col items-center justify-center min-w-[120px] opacity-40 hover:opacity-100 transition-all duration-300 cursor-pointer grayscale hover:grayscale-0">
        <div className="w-20 h-20 mb-3 rounded-full bg-white/5 border border-white/5 flex items-center justify-center group-hover:border-auftek-blue/30 group-hover:bg-auftek-blue/5 transition-colors">
            <partner.icon
                size={32}
                className="text-gray-400 group-hover:text-white"
            />
        </div>

        <span className="text-sm font-bold text-gray-500 group-hover:text-white transition-colors">
            {partner.name}
        </span>
    </div>
);
