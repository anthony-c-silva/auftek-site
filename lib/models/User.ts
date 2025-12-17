import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    role: 'admin' | 'author';

    photoUrl?: string;
    bio?: string;
    education?: string;
    socialLinks?: {
        linkedin?: string;
        instagram?: string;
        github?: string;
    };

    deletedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        name: { type: String, required: true },

        // Enum atualizado
        role: {
            type: String,
            enum: ['admin', 'author'],
            default: 'author'
        },

        // Campos de Perfil
        photoUrl: { type: String, default: '' },
        bio: { type: String, default: '' },
        education: { type: String, default: '' },
        socialLinks: {
            linkedin: { type: String, default: '' },
            instagram: { type: String, default: '' },
            github: { type: String, default: '' }
        },

        deletedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;