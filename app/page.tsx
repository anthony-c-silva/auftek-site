import React from 'react';

// 1. AJUSTE DE IMPORTS
// Como 'app' e 'features' estão na raiz (irmãos), usamos "../" para sair de 'app'
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

// 2. EXPORT DEFAULT
// O Next.js exige que a página seja um export default
export default function Home() {
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
}