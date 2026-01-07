import mongoose, { Schema, Document, Model } from "mongoose";

export interface IActivityLog extends Document {
    user: mongoose.Types.ObjectId;
    targetUser?: mongoose.Types.ObjectId;
    action: string;
    resourceId?: mongoose.Types.ObjectId;
    resourceType: string;
    details?: string;
    createdAt: Date;
}

const ActivityLogSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    targetUser: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    action: { type: String, required: true, index: true },
    resourceId: { type: Schema.Types.ObjectId, index: true },
    resourceType: { type: String, default: 'Post' },
    details: { type: String },
}, { timestamps: true });

const ActivityLog: Model<IActivityLog> = mongoose.models.ActivityLog || mongoose.model("ActivityLog", ActivityLogSchema);

export default ActivityLog;