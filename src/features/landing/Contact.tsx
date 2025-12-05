import React, { useState } from "react";
import { Button } from "../../components/ui/Button";
import { ScrollReveal } from "../../components/ui/ScrollReveal";

interface FormData {
  nome: string;
  email: string;
  mensagem: string;
}

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    mensagem: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Captura os dados antes de limpar o estado
    const payload = { ...formData };

    // 2. Feedback Visual Imediato (Optimistic UI)
    setStatus("success");
    setFormData({ nome: "", email: "", mensagem: "" });

    // 3. Dispara a requisição em background (Fire-and-Forget)
    const API_URL = "/api/opportunities";

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
        .then(async (response) => {
          if (!response.ok) {
            const errData = await response.json();
            console.error("Erro no envio (Background):", errData);
            // Opcional: Aqui você poderia reverter o status para error se quisesse,
            // mas para manter a UX fluida, apenas logamos.
          }
        })
        .catch((error) => {
          console.error("Erro de conexão (Background):", error);
        });

    // 4. Reseta o botão para o estado original após 5 segundos
    setTimeout(() => setStatus("idle"), 5000);
  };

  return (
      <section
          id="contato"
          // ALTERADO: Removido 'rounded-t-[3rem]', '-mt-10' e a sombra específica de elevação.
          // Mantido apenas o estilo base reto.
          className="relative z-20 bg-auftek-dark text-white text-center px-6 py-24 border-t border-white/10 overflow-hidden"
      >
        {/* Background Decorativo */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-auftek-blue/20 rounded-full blur-[100px] pointer-events-none -translate-y-1/2"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Pronto para economizar tempo?
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-light">
              Descubra como a Auftek pode otimizar seu laboratório ou sua planta
              de energia hoje mesmo.
            </p>
          </ScrollReveal>

          <ScrollReveal delay="200">
            <div className="bg-white/5 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl max-w-lg mx-auto relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-auftek-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
                <div className="space-y-1 text-left">
                  <label className="text-xs text-gray-400 ml-1 uppercase tracking-wide font-bold">
                    Nome
                  </label>
                  <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      placeholder="Seu Nome"
                      required
                      className="w-full px-4 py-3.5 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-auftek-blue/50 focus:bg-black/40 transition-all"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs text-gray-400 ml-1 uppercase tracking-wide font-bold">
                    Email Corporativo
                  </label>
                  <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="seu@empresa.com"
                      required
                      className="w-full px-4 py-3.5 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-auftek-blue/50 focus:bg-black/40 transition-all"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs text-gray-400 ml-1 uppercase tracking-wide font-bold">
                    Mensagem
                  </label>
                  <textarea
                      name="mensagem"
                      value={formData.mensagem}
                      onChange={handleChange}
                      placeholder="Como podemos ajudar?"
                      rows={4}
                      className="w-full px-4 py-3.5 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-auftek-blue/50 focus:bg-black/40 transition-all resize-none"
                  ></textarea>
                </div>

                <Button
                    variant="primary"
                    type="submit"
                    // Removemos 'loading' do disabled, pois não existe mais espera visual
                    disabled={status === "success"}
                    className={`w-full py-4 text-lg mt-4 shadow-lg shadow-auftek-blue/25 hover:shadow-auftek-blue/40 transition-all duration-300 ${
                        status === "success" ? "!bg-green-600 !border-green-500 hover:!bg-green-700" : ""
                    } ${status === "error" ? "!bg-red-600 !border-red-500 hover:!bg-red-700" : ""}`}
                >
                  {status === "success" ? "Solicitação Enviada!" : "Solicitar Contato"}
                </Button>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </section>
  );
};