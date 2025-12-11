import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
// Import do contexto que criamos no passo anterior
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Auftek",
    description: "Tecnologia Industrial",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-auftek-dark text-slate-200 font-sans selection:bg-auftek-blue selection:text-white`}
        >
        {/* O AuthProvider precisa envolver tudo que vai usar a autenticação (Header, Páginas e Footer) */}
        <AuthProvider>

            {/* 3. HEADER FIXO */}
            <Header />

            {/* 4. CONTEÚDO DA PÁGINA */}
            {children}

            {/* 5. FOOTER FIXO */}
            <Footer />

        </AuthProvider>
        </body>
        </html>
    );
}