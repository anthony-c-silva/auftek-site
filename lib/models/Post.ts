import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPost extends Document {
    title: string;
    slug: string;
    content: string;
    coverImage: string;
    tags: string[];
    readTime?: string;
    excerpt?: string;

    status: 'published' | 'pending' | 'draft';
    approvedBy?: mongoose.Types.ObjectId;

    author: {
        name: string;
        photoUrl: string;
        bio?: string;
        education?: string;
        socialLinks?: {
            linkedin?: string;
            instagram?: string;
            github?: string;
        };
    };

    writer: {
        name: string;
        email: string;
    };

    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}

const PostSchema: Schema = new Schema(
    {
        title: { type: String, required: [true, "O título é obrigatório"], trim: true },
        slug: { type: String, required: true, unique: true, index: true },
        excerpt: { type: String, required: false },
        content: { type: String, required: [true, "O conteúdo é obrigatório"] },
        coverImage: { type: String, required: [true, "A imagem de capa é obrigatória"] },
        tags: { type: [String], default: [] },
        readTime: { type: String, required: false },
        status: { type: String, enum: ['published', 'pending', 'draft'], default: 'pending', index: true },
        approvedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
        author: {
            name: { type: String, required: true },
            photoUrl: { type: String, default: '' },
            bio: { type: String, default: '' },
            education: { type: String, default: '' },
            socialLinks: {
                linkedin: String,
                instagram: String,
                github: String
            }
        },

        writer: {
            name: { type: String, required: false },
            email: { type: String, required: false }
        },

        deletedAt: { type: Date, default: null }
    },
    { timestamps: true }
);

const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export default Post;