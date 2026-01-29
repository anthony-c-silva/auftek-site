import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICampaign extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  theme?: string;
  tone?: 'educational' | 'informational' | 'promotional' | 'inspirational' | 'entertaining' | 'professional' | 'casual';
  customPromptImage?: string;
  customPromptText?: string;
  authorId: mongoose.Types.ObjectId;
  status: 'active' | 'archived';
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const CampaignSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "O nome da campanha é obrigatório"],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    theme: {
      type: String,
      trim: true,
      default: ''
    },
    tone: {
      type: String,
      enum: ['educational', 'informational', 'promotional', 'inspirational', 'entertaining', 'professional', 'casual'],
      default: 'professional',
      trim: true
    },
    customPromptImage: {
      type: String,
      trim: true,
      default: ''
    },
    customPromptText: {
      type: String,
      trim: true,
      default: ''
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, "O ID do autor é obrigatório"],
      index: true
    },
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active',
      index: true
    },
    deletedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

// Unique constraint: one user cannot have duplicate campaign names (unless soft deleted)
CampaignSchema.index(
  { name: 1, authorId: 1 },
  {
    unique: true,
    partialFilterExpression: { deletedAt: null }
  }
);

const Campaign: Model<ICampaign> = mongoose.models.Campaign || mongoose.model<ICampaign>("Campaign", CampaignSchema);

export default Campaign;
