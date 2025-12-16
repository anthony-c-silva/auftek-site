"use client";

import React, { useState, useRef } from "react";
import { Button } from "../../components/ui/Button";
import { ScrollReveal } from "../../components/ui/ScrollReveal";

interface FormData {
  nome: string;
  email: string;
  mensagem: string;
}

type FormStatus = "idle" | "success" | "duplicate";

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    mensagem: "",
  });

  const [status, setStatus] = useState<FormStatus>("idle");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (status === "duplicate") {
      setStatus("idle");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. UI OTIMISTA
    setStatus("success");

    const payload = { ...formData };

    // 2. Envio Backend
    fetch("/api/opportunities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        // 3. VERIFICAÇÃO TARDIA
        if (response.status === 409) {
          setStatus("duplicate");
        } else {
          if (response.ok) {
            timeoutRef.current = setTimeout(() => {
              setFormData({ nome: "", email: "", mensagem: "" });
              setStatus("idle");
            }, 4000);
          }
        }
      })
      .catch((err) => {
        console.error("Erro silencioso de rede:", err);
      });
  };

  return (
    <section
      id="contato"
      className="relative z-20 bg-auftek-dark text-white text-center px-6 py-24 border-t border-white/10 overflow-hidden"
    >
      {/* Background Noise */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>

      {/* --- AJUSTE AQUI --- */}
      {/* Antes estava 'top-0'. Mudei para 'top-1/2' e aumentei um pouco o tamanho */}
      {/* Isso centraliza o brilho atrás do formulário, eliminando a quebra no topo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-auftek-blue/15 rounded-full blur-[120px] pointer-events-none -translate-y-1/2"></div>

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
                  className={`w-full px-4 py-3.5 rounded-xl bg-black/20 border text-white placeholder-white/30 focus:outline-none transition-all ${
                    status === "duplicate"
                      ? "border-amber-500 focus:border-amber-500 bg-amber-900/20"
                      : "border-white/10 focus:border-auftek-blue/50 focus:bg-black/40"
                  }`}
                />
                {status === "duplicate" && (
                  <p className="text-xs text-amber-500 font-bold mt-1 ml-1 animate-pulse">
                    Este e-mail já enviou uma solicitação recentemente.
                  </p>
                )}
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
                disabled={status === "success"}
                className={`w-full py-4 text-lg mt-4 shadow-lg shadow-auftek-blue/25 hover:shadow-auftek-blue/40 transition-all duration-300
                      ${
                        status === "success"
                          ? "!bg-green-600 !border-green-500 hover:!bg-green-700 cursor-default"
                          : ""
                      }
                      ${
                        status === "duplicate"
                          ? "!bg-amber-600 !border-amber-500 hover:!bg-amber-700"
                          : ""
                      }
                    `}
              >
                {status === "idle" && "Solicitar Contato"}
                {status === "success" && "Solicitação Enviada!"}
                {status === "duplicate" && "E-mail já Registrado"}
              </Button>
            </form>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
