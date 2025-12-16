// create-admin.ts
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";

// 1. TENTA CARREGAR AS VARIÁVEIS DE TODOS OS LUGARES POSSÍVEIS
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Definição temporária do Schema
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' }, 
    createdAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null }
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function createAdmin() {
    let uri = process.env.MONGODB_URI;

    // --- FALLBACK DE EMERGÊNCIA ---
    // Se mesmo assim não achar, use a string que você mandou (com a correção do nome do banco)
    if (!uri) {
        console.warn("⚠️ Variável de ambiente não detectada. Usando fallback manual...");
        uri = "mongodb+srv://pbalen99_db_user:iS6ISOOhQvgF4rHu@auftek-site.e5piuuc.mongodb.net/auftek_db?appName=AUFTEK-SITE";
    }

    // Correção de segurança: Adiciona o nome do banco se estiver faltando
    if (uri.includes(".net/?")) {
        uri = uri.replace(".net/?", ".net/auftek_db?");
    }

    try {
        console.log(`📡 Conectando ao MongoDB...`);
        
        await mongoose.connect(uri);
        console.log("✅ Conectado!");

        // 1. Dados do Admin
        const name = "Super Admin";
        const email = "admin@auftek.com"; 
        const password = "0011";       

        // 2. Verifica se já existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log(`⚠️ O usuário ${email} já existe no banco.`);
            // Se quiser forçar a recriação, descomente a linha abaixo:
            // await User.deleteOne({ email }); 
        } else {
             // 3. Criptografa a senha e cria
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await User.create({
                name,
                email,
                password: hashedPassword,
                role: "admin"
            });

            console.log(`🎉 SUCESSO! Usuário Admin criado.`);
            console.log(`📧 Email: ${email}`);
            console.log(`🔑 Senha: ${password}`);
        }

    } catch (error) {
        console.error("❌ Erro:", error);
    } finally {
        await mongoose.disconnect();
        console.log("🔌 Desconectado.");
        process.exit(0);
    }
}

createAdmin();