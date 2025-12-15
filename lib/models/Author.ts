
// lib/models/Author.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAuthor extends Document {
    name: string;
    photoUrl: string; // Padronizado
    education: string;
    linkedin?: string;
    lattes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const AuthorSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        photoUrl: { type: String, required: false },
        education: { type: String, required: true },
        linkedin: { type: String, required: false },
        lattes: { type: String, required: false },
    },
    {
        timestamps: true, // Cria createdAt e updatedAt
    }
);

// Previne erro de recompilação do modelo em hot-reload
const Author: Model<IAuthor> = mongoose.models.Author || mongoose.model<IAuthor>("Author", AuthorSchema);

export default Author;