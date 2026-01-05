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
        lattes?: string;
    };

    deletedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        email: { type: String, required: true },
        password: { type: String, required: true },
        name: { type: String, required: true },
        role: {
            type: String,
            enum: ['admin', 'author'],
            default: 'author'
        },

        photoUrl: { type: String, default: '' },
        bio: { type: String, default: '' },
        education: { type: String, default: '' },
        socialLinks: {
            linkedin: { type: String, default: '' },
            instagram: { type: String, default: '' },
            github: { type: String, default: '' },
            lattes: { type: String, default: '' }
        },

        deletedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

//se email ja foi soft deletado pode criar outro usuario com mesmo email
UserSchema.index(
    { email: 1 },
    {
        unique: true,
        partialFilterExpression: { deletedAt: null }
    }
);
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;