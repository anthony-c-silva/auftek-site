import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITag extends Document {
    name: string;
    slug: string;
    createdAt: Date;
}

const TagSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Nome da tag é obrigatório"],
            unique: true,
            trim: true
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
    },
    { timestamps: true }
);

const Tag: Model<ITag> = mongoose.models.Tag || mongoose.model<ITag>("Tag", TagSchema);

export default Tag;