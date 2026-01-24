import React from 'react';

// 1. AJUSTE DE IMPORTS
// Como 'app' e 'features' estão na raiz (irmãos), usamos "../" para sair de 'app'
import { Hero } from '@/components/landing/Hero';
import { About } from '@/components/landing/About';
import { Solutions } from '@/components/landing/Solutions';
import { Microbiology } from '@/components/landing/Microbiology';
import { BioAiLab } from '@/components/landing/BioAiLab';
import { Publications } from '@/components/landing/Publications';
import { Historys } from '../components/history/Historys'
import { Energy } from '@/components/landing/Energy';
import { Partners } from '@/components/landing/Partners';
import { Team } from '@/components/landing/Team';
import { Contact } from '@/components/landing/Contact';

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
        <Historys />
        <Energy />
        <Partners />
        <Team />
        <Contact />
      </main>
  );
}