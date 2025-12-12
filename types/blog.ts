export enum CategoryType {
    ALL = "Todos",
    MICROBIOLOGY = "Microbiologia",
    ENERGY = "Energia",
    IOT_AI = "IoT & IA"
}

export interface Author {
    id?: string;
    name: string;
    photoUrl: string;
    linkedin?: string;
    lattes?: string;
    education: string;
    bio?: string;
}

export interface BlogPost {
    _id?: string;
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string | string[];
    imageUrl: string;
    date: string;
    readTime?: string;
    category: string;
    tags: string[];
    author: Author;
    writer?: {
        name: string;
        email?: string;
    };
    authorId: string;
    createdAt?: string;

}

