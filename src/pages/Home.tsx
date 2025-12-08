import React from 'react';

// Imports ajustados para o caminho relativo correto (saindo de pages/)
import { Hero } from '../features/landing/Hero';
import { About } from '../features/landing/About';
import { Solutions } from '../features/landing/Solutions';
import { Microbiology } from '../features/landing/Microbiology';
import { BioAiLab } from '../features/landing/BioAiLab';
import { Publications } from '../features/landing/Publications';
import { Energy } from '../features/landing/Energy';
import { Partners } from '../features/landing/Partners';
import { Team } from '../features/landing/Team';
import { Contact } from '../features/landing/Contact';

export const Home: React.FC = () => {
    return (
        <main>
            <Hero />
        <About />
        <Solutions />
        <Microbiology />
        <BioAiLab />
        <Publications />
        <Energy />
        <Partners />
        <Team />
        <Contact />
        </main>
    );
};