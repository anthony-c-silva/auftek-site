// fix-admin.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Carrega variáveis de ambiente
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Schema simplificado apenas para acessar o banco
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: String
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function promoteToAdmin() {
    let uri = process.env.MONGODB_URI;

    // Fallback de segurança (igual ao anterior)
    if (!uri) {
        uri = "mongodb+srv://pbalen99_db_user:iS6ISOOhQvgF4rHu@auftek-site.e5piuuc.mongodb.net/auftek_db?appName=AUFTEK-SITE";
    }
    // Garante o banco correto
    if (uri.includes(".net/?")) {
        uri = uri.replace(".net/?", ".net/auftek_db?");
    }

    try {
        console.log("📡 Conectando...");
        await mongoose.connect(uri);

        const emailAlvo = "admin@auftek.com"; // O email do seu usuário

        console.log(`🔍 Buscando usuário: ${emailAlvo}...`);

        // O COMANDO MÁGICO: Atualiza a role para 'admin'
        const result = await User.updateOne(
            { email: emailAlvo },
            { $set: { role: "admin" } } 
        );

        if (result.matchedCount === 0) {
            console.log("❌ Usuário não encontrado. Verifique o e-mail.");
        } else if (result.modifiedCount === 0) {
            console.log("⚠️ O usuário já era Admin (nenhuma mudança feita).");
        } else {
            console.log("✅ SUCESSO! O usuário agora é ADMIN.");
        }

    } catch (error) {
        console.error("❌ Erro:", error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

promoteToAdmin();