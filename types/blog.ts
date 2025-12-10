// src/types/blog.ts

export enum CategoryType {
    ALL = 'Todos',
    MICROBIOLOGY = 'Microbiologia',
    ENERGY = 'Energia',
    IOT_AI = 'IoT & IA'
}

export interface Author {
    name: string;
    role: string;
    avatarUrl: string;
    bio: string;
}

export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string[]; // Array de parágrafos para facilitar
    date: string;
    readTime: string;
    author: Author;
    category: CategoryType | string;
    imageUrl: string;
    tags: string[];
}