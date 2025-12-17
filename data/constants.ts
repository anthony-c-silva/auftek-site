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
  { name: 'Publicações', href: '#publicacoes' },
  { name: 'Parceiros', href: '#parceiros' },
  { name: 'Sistema', href: 'https://bioailab.com.br/'}
];

export const SOLUTIONS = [
  {
      icon: Microscope,
      title: 'Microbiologia Digital',
      description: 'Automação e digitalização de processos microbiológicos com análise de dados em tempo real e IA.',
      href: '#bioailab', 
      theme: 'green' 
  },
  {
      icon: Zap,
      title: 'Energia Fotovoltaica',
      description: 'Ensaios de segurança elétrica, emulação de arco e performance para inversores (normas IEC/Inmetro).',
      href: '#energia', 
      theme: 'yellow'
  },
  {
      icon: FlaskConical, 
      title: 'Pesquisa e Desenvolvimento',
      description: 'Desenvolvimento de hardware e software sob medida para desafios complexos da indústria.',
      href: '#quem-somos', 
      theme: 'blue'
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
