import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILoginAttempt extends Document {
    key: string;        // Guarda "ip_123..." ou "email_fulano@..."
    count: number;      // Quantas vezes errou
    lastAttempt: Date;
    expiresAt: Date;    // Hora que o bloqueio acaba
}

const LoginAttemptSchema: Schema = new Schema({
    key: { type: String, required: true, unique: true, index: true },
    count: { type: Number, default: 0 },
    lastAttempt: { type: Date, default: Date.now },
    // O Mongo apaga o documento SOZINHO quando chega nessa data (TTL Index)
    expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } }
});

const LoginAttempt: Model<ILoginAttempt> = mongoose.models.LoginAttempt || mongoose.model<ILoginAttempt>("LoginAttempt", LoginAttemptSchema);

export default LoginAttempt;