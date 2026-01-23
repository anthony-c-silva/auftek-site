import {
  Zap,
  FlaskConical, 
  Microscope,
} from 'lucide-react';


export const COLORS = {
    primary: '#1e90ff',
    dark: '#0e223b', 
    accent: '#a9deca', 
    white: '#ffffff',
    gray: '#94a3b8',
};


export const NAV_LINKS = [
  { name: 'Quem Somos', href: '#quem-somos' },
  { name: 'BioAiLab', href: '#bioailab' },
  { name: 'Energia', href: '#energia' },
//   { name: 'Contato', href: '#contato'},
  { name: 'Aplicações', href: '#publicacoes' },
  { name: 'Parceiros', href: '#parceiros' },
  { name: 'Sistema', href: 'https://bioailab.com.br/'},

];

export const SOLUTIONS = [
  {
      icon: Microscope,
      title: 'Microbiologia em Tempo real',
      description: 'Automação e digitalização de processos microbiológicos com análise de dados em tempo real.',
      href: '#bioailab', 
      theme: 'green' 
  },
  {
      icon: Zap,
      title: ' Acreditação de inversores',
      description: 'Instrumentação para acreditação de inversores com emulação de arco elétrico e fuga de corrente residual.',
      href: '#energia', 
      theme: 'yellow'
  },
  {
      icon: FlaskConical, 
      title: 'Pesquisa e Desenvolvimento',
      description: 'Desenvolvimento de hardware e software sob medida para desafios complexos da indústria.',
      href: '#contato', 
      theme: 'blue'
  },
];

export const TEAM_MEMBERS = [
    {
        name: 'Adriano Marques Jaime',
        role: 'CEO & Founder',
        image: 'https://picsum.photos/200/200?random=1',
    },
    {
        name: 'Charles Haab',
        role: 'Head de P&D',
        image: 'https://picsum.photos/200/200?random=2',
    },
    {
        name: 'Anthony',
        role: 'Engenharia de Hardware',
        image: 'https://picsum.photos/200/200?random=3',
    },
    {
        name: 'Gertrudes',
        role: 'Operações e Qualidade',
        image: 'https://picsum.photos/200/200?random=4',
    },
        {
        name: 'Gertrudes',
        role: 'Operações e Qualidade',
        image: 'https://picsum.photos/200/200?random=4',
    },
        {
        name: 'Gertrudes',
        role: 'Operações e Qualidade',
        image: 'https://picsum.photos/200/200?random=4',
    },
        {
        name: 'Gertrudes',
        role: 'Operações e Qualidade',
        image: 'https://picsum.photos/200/200?random=4',
    },
];
