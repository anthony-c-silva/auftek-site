import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPost extends Document {
    title: string;
    slug: string;
    content: string;
    coverImage: string;
    tags: string[];

    // NOVO: Tempo de Leitura (opcional)
    readTime?: string;

    // Autor (Especialista)
    author: {
        name: string;
        photoUrl: string; // Atualizado de avatar para photoUrl
    };

    // Redator (Equipe)
    writer: {
        name: string;
        email: string;
    };

    createdAt: Date;
    deletedAt?: Date | null;
}

const PostSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: [true, "O título é obrigatório"],
            trim: true
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        content: {
            type: String,
            required: [true, "O conteúdo do post é obrigatório"]
        },
        coverImage: {
            type: String,
            required: [true, "A imagem de capa é obrigatória"]
        },
        tags: {
            type: [String],
            default: []
        },

        // Campo novo: Tempo de Leitura
        readTime: {
            type: String,
            required: false // Opcional
        },

        // Configuração do Autor (Especialista)
        author: {
            name: { type: String, required: true },
            photoUrl: { type: String, required: false }
        },

        // Configuração do Redator (Quem postou)
        writer: {
            name: { type: String, required: false },
            email: { type: String, required: false }
        },

        deletedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true,
    }
);

// Previne erro de recompilação do modelo em hot-reload
const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export default Post;