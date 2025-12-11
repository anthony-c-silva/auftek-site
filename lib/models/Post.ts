import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPost extends Document {
    title: string;
    slug: string;
    content: string;
    coverImage: string;
    tags: string[];
    author: {
        name: string;
        avatar: string;
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
            required: false
        },
        tags: {
            type: [String],
            default: []
        },
        author: {
            name: { type: String, required: true },
            avatar: { type: String, required: false }
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

const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export default Post;