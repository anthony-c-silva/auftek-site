"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { SectionTitle } from "../../components/ui/Section";

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  nome_empresa: string;
  mensagem: string;
}

type FormStatus = "idle" | "success" | "duplicate";

export const Contact: React.FC = () => {
  // 2. Estado inicial atualizado
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    telefone: "",
    nome_empresa: "",
    mensagem: "",
  });

  // --- NOVA LÓGICA: ESCUTAR EVENTO ---
  useEffect(() => {
    // Função que será executada quando o evento for disparado
    const handlePrefill = (event: CustomEvent) => {
      const message = event.detail; // Pega o texto enviado
      if (message) {
        setFormData((prev) => ({
          ...prev,
          mensagem: message,
        }));
      }
    };

    // Adiciona o ouvinte do evento na janela do navegador
    window.addEventListener("prefillContact" as any, handlePrefill as any);

    // Limpeza (boa prática): remove o ouvinte se o componente desmontar
    return () => {
      window.removeEventListener("prefillContact" as any, handlePrefill as any);
    };
  }, []);
  // ------------------------------------

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
    setStatus("success");

    fetch("/api/opportunities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then(async (response) => {
        if (response.status === 409) {
          setStatus("duplicate");
        } else if (response.ok) {
          timeoutRef.current = setTimeout(() => {
            // 3. Reset do formulário com os campos novos
            setFormData({
              nome: "",
              email: "",
              telefone: "",
              nome_empresa: "",
              mensagem: "",
            });
            setStatus("idle");
          }, 4000);
        }
      })
      .catch((err) => {
        console.error("Erro de rede:", err);
      });
  };

  return (
    <section
      id="contato" // IMPORTANTE: O ID deve ser exatamente igual ao do href do menu
      className="relative z-20 bg-auftek-dark text-white text-center px-6 py-24 border-t border-white/10 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto relative z-10">
        <SectionTitle
          align="center"
          subtitle="Fale hoje mesmo com um especialista"
        >
          Entre em Contato
        </SectionTitle>

        <div className="mt-10 bg-white/5 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl max-w-lg mx-auto relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-auftek-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
            {/* Campo: Nome */}
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

            {/* Campo: Email */}
            <div className="space-y-1 text-left">
              <label className="text-xs text-gray-400 ml-1 uppercase tracking-wide font-bold">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                required
                className="w-full px-4 py-3.5 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-auftek-blue/50 focus:bg-black/40 transition-all"
              />
            </div>

            {/* Campo: Telefone (Antigo CNPJ) */}
            <div className="space-y-1 text-left">
              <label className="text-xs text-gray-400 ml-1 uppercase tracking-wide font-bold">
                Telefone
              </label>
              <input
                type="text"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
                required
                className="w-full px-4 py-3.5 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-auftek-blue/50 focus:bg-black/40 transition-all"
              />
            </div>

            {/* Campo: Nome da Empresa (Antigo Endereço) */}
            <div className="space-y-1 text-left">
              <label className="text-xs text-gray-400 ml-1 uppercase tracking-wide font-bold">
                Nome da Empresa
              </label>
              <input
                type="text"
                name="nome_empresa"
                value={formData.nome_empresa}
                onChange={handleChange}
                placeholder="Sua Empresa"
                required
                className="w-full px-4 py-3.5 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-auftek-blue/50 focus:bg-black/40 transition-all"
              />
            </div>

            {/* Campo: Mensagem */}
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
              className={`w-full py-4 text-lg mt-4 shadow-lg shadow-auftek-blue/25 hover:shadow-auftek-blue/40 transition-all duration-300 ${
                status === "success" ? "!bg-green-600 !border-green-500" : ""
              }`}
            >
              {status === "idle" && "Solicitar Contato"}
              {status === "success" && "Enviado com Sucesso!"}
              {status === "duplicate" && "Tente Novamente"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};
