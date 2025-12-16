import mongoose, { Schema, Document, Model } from "mongoose";

// 1. ATUALIZAÇÃO DA INTERFACE
export interface IPost extends Document {
    title: string;
    slug: string;
    content: string;
    coverImage: string;
    tags: string[];
    readTime?: string;
    
    // CAMPO NOVO ADICIONADO AQUI
    excerpt?: string; 
    
    status: 'published' | 'pending' | 'draft';
    approvedBy?: mongoose.Types.ObjectId; 

    author: {
        name: string;
        photoUrl: string; 
    };

    writer: {
        name: string;
        email: string;
    };

    createdAt: Date;
    updatedAt: Date; // Adicionado para manter tipagem correta com timestamps: true
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
        // CAMPO NOVO ADICIONADO NO SCHEMA
        excerpt: {
            type: String,
            required: false // Opcional, pois posts antigos podem não ter
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

        readTime: {
            type: String,
            required: false 
        },

        status: {
            type: String,
            enum: ['published', 'pending', 'draft'],
            default: 'pending', 
            index: true 
        },

        approvedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User', 
            default: null
        },
        
        author: {
            name: { type: String, required: true },
            photoUrl: { type: String, required: false }
        },
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
        timestamps: true, // Isso cria createdAt e updatedAt automaticamente
    }
);

// Previne recompilação do model em hot-reload do Next.js
const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export default Post;