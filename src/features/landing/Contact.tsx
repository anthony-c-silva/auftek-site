import React from 'react';
import { Button } from '../../components/ui/Button';

export const Contact: React.FC = () => {
    return (
        <section
            id="contato"
            className="py-20 bg-auftek-blue text-white text-center px-6"
        >
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold mb-8">
                    Pronto para economizar tempo?
                </h2>
                <p className="text-xl mb-10 opacity-90">
                    Descubra como a Auftek pode otimizar seu laboratório ou sua
                    planta de energia hoje mesmo.
                </p>
                <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl max-w-lg mx-auto border border-white/20">
                    <form
                        className="space-y-4"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <input
                            type="text"
                            placeholder="Seu Nome"
                            className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:bg-white/20"
                        />
                        <input
                            type="email"
                            placeholder="Seu Email Corporativo"
                            className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:bg-white/20"
                        />
                        <textarea
                            placeholder="Mensagem"
                            rows={3}
                            className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:bg-white/20"
                        ></textarea>
                        <Button
                            variant="ghost"
                            className="bg-white text-auftek-blue hover:bg-gray-100 hover:text-auftek-blue w-full font-bold py-3 rounded transition-colors"
                        >
                            Solicitar Contato
                        </Button>
                    </form>
                </div>
            </div>
        </section>
    );
};
