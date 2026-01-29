import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISocialMediaPost extends Document {
  _id: mongoose.Types.ObjectId;
  campaignId: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
  context: string;
  postType?: 'educational' | 'informational' | 'promotional' | 'inspirational' | 'entertaining' | 'professional' | 'casual';
  generatedImage: string;
  overlayText: string;
  description: string;
  originalImages?: string[];
  aspectRatio: string;
  status: 'draft' | 'published';
  publishedAt?: Date | null;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const SocialMediaPostSchema: Schema = new Schema(
  {
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
      required: [true, "O ID da campanha é obrigatório"],
      index: true
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, "O ID do autor é obrigatório"],
      index: true
    },
    context: {
      type: String,
      required: [true, "O contexto é obrigatório"],
      trim: true
    },
    postType: {
      type: String,
      enum: ['educational', 'informational', 'promotional', 'inspirational', 'entertaining', 'professional', 'casual'],
      trim: true
    },
    generatedImage: {
      type: String,
      required: [true, "A imagem gerada é obrigatória"]
    },
    overlayText: {
      type: String,
      required: [true, "O texto sobreposto é obrigatório"],
      trim: true
    },
    description: {
      type: String,
      required: [true, "A descrição é obrigatória"],
      trim: true
    },
    originalImages: {
      type: [String],
      default: []
    },
    aspectRatio: {
      type: String,
      default: '4:5'
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
      index: true
    },
    publishedAt: {
      type: Date,
      default: null
    },
    deletedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

// Compound index for fetching posts within a campaign chronologically
SocialMediaPostSchema.index({ campaignId: 1, createdAt: -1 });

const SocialMediaPost: Model<ISocialMediaPost> = mongoose.models.SocialMediaPost || mongoose.model<ISocialMediaPost>("SocialMediaPost", SocialMediaPostSchema);

export default SocialMediaPost;
