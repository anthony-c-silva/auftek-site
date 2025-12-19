import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        await connectDB();

        // 1. Pega das variáveis de ambiente (Seguro)
        const email = process.env.SEED_ADMIN_EMAIL;
        const password = process.env.SEED_ADMIN_PASSWORD;

        // Validação de segurança
        if (!email || !password) {
            return NextResponse.json(
                { error: "Defina SEED_ADMIN_EMAIL e SEED_ADMIN_PASSWORD no ..env.local" },
                { status: 500 }
            );
        }

        // Verifica se já existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return NextResponse.json({ message: "Este usuário Admin já existe no banco!" });
        }

        // Criptografa a senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Cria o usuário
        await User.create({
            name: "Admin Principal",
            email,
            password: hashedPassword,
        });

        return NextResponse.json({ message: "Admin criado com sucesso! Agora apague esta rota por segurança." });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}