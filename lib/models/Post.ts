import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPost extends Document {
    _id: mongoose.Types.ObjectId;
    authorId: mongoose.Types.ObjectId;

    title: string;
    slug: string;
    content: string;
    coverImage: string;
    category: 'general' | 'case_study';
    tags: string[];
    readTime?: string;
    excerpt?: string;

    status: 'published' | 'pending' | 'draft' | 're-evaluation' | 'rejected';
    approvedBy?: mongoose.Types.ObjectId;
    rejectionReason?: string;

    pendingChanges?: {
        title?: string;
        content?: string;
        excerpt?: string;
        coverImage?: string;
        tags?: string[];
        slug?: string;
        category?: 'general' | 'case_study';
    };

    author: {
        name: string;
        photoUrl: string;
        bio?: string;
        education?: string;
        socialLinks?: {
            linkedin?: string;
            instagram?: string;
            github?: string;
            lattes?: string;
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
        authorId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, "O ID do autor é obrigatório"],
            index: true
        },

        category: {
            type: String,
            enum: ['general', 'case_study'],
            default: 'general',
            required: true,
            index: true
        },

        title: { type: String, required: [true, "O título é obrigatório"], trim: true },
        slug: { type: String, required: true },
        excerpt: { type: String, required: [true, "O resumo é obrigatório"], trim: true },
        content: { type: String, required: [true, "O conteúdo é obrigatório"] },
        coverImage: { type: String, required: [true, "A imagem de capa é obrigatória"] },
        tags: { type: [String], default: [] },
        readTime: { type: String, required: false },

        status: {
            type: String,
            enum: ['published', 'pending', 'draft', 're-evaluation', 'rejected'],
            default: 'pending',
            index: true
        },

        approvedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
        rejectionReason: { type: String, default: '' },

        pendingChanges: {
            title: String,
            content: String,
            excerpt: String,
            coverImage: String,
            slug: String,
            tags: [String],
            category: String
        },

        author: {
            name: { type: String, required: true },
            photoUrl: { type: String, default: '' },
            bio: { type: String, default: '' },
            education: { type: String, default: '' },
            socialLinks: {
                linkedin: String,
                instagram: String,
                github: String,
                lattes: String
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

PostSchema.index(
    { slug: 1 },
    {
        unique: true,
        partialFilterExpression: { deletedAt: null }
    }
);

const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export default Post;