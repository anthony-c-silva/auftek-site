// src/data/mock-blog.ts
import { BlogPost, CategoryType } from "../types/blog";

// Descrições que aparecem quando você seleciona uma categoria no filtro
export const CATEGORY_DESCRIPTIONS = {
    [CategoryType.ALL]: "Explorando todas as fronteiras da tecnologia industrial e científica.",
    [CategoryType.MICROBIOLOGY]: "Análises avançadas sobre controle biológico, processos fermentativos e segurança alimentar.",
    [CategoryType.ENERGY]: "Estratégias para eficiência energética, matrizes renováveis e redução de pegada de carbono.",
    [CategoryType.IOT_AI]: "Sensores inteligentes, automação preditiva e o futuro da Indústria 4.0."
};

export const BLOG_POSTS: BlogPost[] = [
    {
        id: "1",
        title: "Otimização Energética em Plantas Industriais com IoT",
        excerpt: "Como a implementação de sensores inteligentes está reduzindo o desperdício energético em até 30% em indústrias de manufatura.",
        content: [
            "A eficiência energética deixou de ser apenas uma questão ambiental para se tornar um pilar de competitividade econômica. Com a chegada da Indústria 4.0, a granularidade dos dados coletados permite intervenções cirúrgicas no consumo.",
            "Neste estudo de caso, analisamos como uma planta de médio porte utilizou sensores IoT para identificar picos de consumo em horários ociosos, resultando em uma economia imediata.",
            "O futuro aponta para sistemas autônomos que não apenas monitoram, mas ajustam parâmetros em tempo real para manter o 'ponto ótimo' de operação."
        ],
        date: "12 Dez 2024",
        readTime: "5 min",
        category: CategoryType.ENERGY,
        // Imagem genérica de tecnologia/energia
        imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1000",
        tags: ["Eficiência Energética", "IoT", "Sustentabilidade", "Indústria 4.0"],
        author: {
            name: "Eng. Carlos Mendes",
            role: "Especialista em Energia",
            avatarUrl: "https://i.pravatar.cc/150?u=carlos",
            bio: "Engenheiro Elétrico com foco em sistemas de alta performance e consultor da Auftek."
        }
    },
    {
        id: "2",
        title: "A Revolução da Microbiologia Preditiva",
        excerpt: "Novos algoritmos estão permitindo prever o comportamento de microrganismos em processos fermentativos com precisão inédita.",
        content: [
            "A microbiologia preditiva combina dados experimentais com modelos matemáticos robustos. Isso permite simular cenários que levariam semanas em laboratório em apenas alguns minutos computacionais.",
            "Para a indústria alimentícia e farmacêutica, isso significa um controle de qualidade proativo, antecipando contaminações ou desvios de padrão antes que eles ocorram.",
            "Discutimos aqui as principais ferramentas de software que estão liderando essa mudança."
        ],
        date: "08 Dez 2024",
        readTime: "7 min",
        category: CategoryType.MICROBIOLOGY,
        // Imagem genérica de laboratório/ciência
        imageUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=1000",
        tags: ["Microbiologia", "Bioinformática", "P&D"],
        author: {
            name: "Dra. Ana Silva",
            role: "Bióloga Chefe",
            avatarUrl: "https://i.pravatar.cc/150?u=ana",
            bio: "Doutora em Microbiologia e pesquisadora de novos métodos de análise biológica."
        }
    },
    {
        id: "3",
        title: "Sensores Ópticos: O Olho da Indústria",
        excerpt: "Entenda como a espectroscopia e sensores ópticos estão substituindo análises químicas demoradas no chão de fábrica.",
        content: [
            "A velocidade de produção atual não permite mais esperar horas por um resultado de laboratório. Sensores ópticos oferecem análises em tempo real, diretamente na linha de produção.",
            "Desde a medição de umidade até a detecção de componentes específicos, a luz se tornou a ferramenta de medição mais versátil da indústria moderna.",
            "Exploramos as limitações e as vantagens dessa tecnologia frente aos métodos tradicionais."
        ],
        date: "01 Dez 2024",
        readTime: "4 min",
        category: CategoryType.IOT_AI,
        imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000",
        tags: ["Sensores", "Óptica", "Controle de Qualidade"],
        author: {
            name: "Roberto Chen",
            role: "Desenvolvedor de Hardware",
            avatarUrl: "https://i.pravatar.cc/150?u=chen",
            bio: "Especialista em fotônica e desenvolvimento de sensores industriais."
        }
    }
];