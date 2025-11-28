import React from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './features/landing/Hero';
import { About } from './features/landing/About';
import { Solutions } from './features/landing/Solutions';
import { Microbiology } from './features/landing/Microbiology';
import { BioAiLab } from './features/landing/BioAiLab';
import { Publications } from './features/landing/Publications'; 
import { Energy } from './features/landing/Energy';
import { Partners } from './features/landing/Partners';
import { Team } from './features/landing/Team'; 
import { Contact } from './features/landing/Contact';

function App() {
    return (
        <div className="min-h-screen bg-auftek-dark text-slate-200 font-sans selection:bg-auftek-blue selection:text-white">
            <Header />

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

            <Footer />
        </div>
    );
}

export default App;
