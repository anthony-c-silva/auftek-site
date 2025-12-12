import {
    ChartLine,
    Zap,
    Activity,
    Users,
    FileText,
    Cpu,
    Microscope,
    Globe,
} from 'lucide-react';

export const COLORS = {
    primary: '#1e90ff', // Dodger Blue
    dark: '#0e223b', // Dark Blue/Black
    accent: '#a9deca', // Pale Green
    white: '#ffffff',
    gray: '#94a3b8',
};

export const NAV_LINKS = [
    { name: 'Quem Somos', href: '#quem-somos' },
    { name: 'BioAiLab', href: '#bioailab' },
    { name: 'Energia', href: '#energia' },
    { name: 'Publicações', href: '#publicacoes' },
    { name: 'Parceiros', href: '#parceiros' },
    { name: 'Contato', href: '#contato' },
];

export const SOLUTIONS = [
    {
        icon: Microscope,
        title: 'Microbiologia Digital',
        description:
            'Transformamos análises que levavam dias em resultados em poucas horas.',
    },
    {
        icon: Zap,
        title: 'Energia Fotovoltaica',
        description:
            'Instrumentação para acreditação de inversores e emulação de arco elétrico.',
    },
    {
        icon: Cpu,
        title: 'IoT & Inteligência Artificial',
        description:
            'Conectividade total para tomada de decisão em tempo real.',
    },
];

export const TEAM_MEMBERS = [
    {
        name: 'Dr. Roberto Silva',
        role: 'CEO & Founder',
        image: 'https://picsum.photos/200/200?random=1',
    },
    {
        name: 'Dra. Ana Souza',
        role: 'Head de P&D',
        image: 'https://picsum.photos/200/200?random=2',
    },
    {
        name: 'Eng. Carlos Mendes',
        role: 'Engenharia de Hardware',
        image: 'https://picsum.photos/200/200?random=3',
    },
    {
        name: 'Mariana Lima',
        role: 'Operações e Qualidade',
        image: 'https://picsum.photos/200/200?random=4',
    },
];
