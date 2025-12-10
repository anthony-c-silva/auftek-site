import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// 1. IMPORTAR SEUS COMPONENTES
// O caminho "../" volta uma pasta (sai de 'app' e vai para a raiz onde está 'components')
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Auftek", // Pode mudar o título aqui
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
            // 2. MISTUREI AS CLASSES
            // Peguei as classes de fonte do Next + as classes de cor/fundo do seu div antigo
            className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-auftek-dark text-slate-200 font-sans selection:bg-auftek-blue selection:text-white`}
        >
        {/* 3. HEADER FIXO */}
        <Header />

        {/* 4. CONTEÚDO DA PÁGINA (Substitui o <Routes> antigo) */}
        {children}

        {/* 5. FOOTER FIXO */}
        <Footer />
        </body>
        </html>
    );
}