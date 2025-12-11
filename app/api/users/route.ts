import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

// CRIAR NOVO USUÁRIO (POST)
export async function POST(request: Request) {
    try {
        await connectDB();
        const { name, email, password } = await request.json();

        // 1. Validação Básica
        if (!name || !email || !password) {
            return NextResponse.json({ error: "Preencha todos os campos" }, { status: 400 });
        }

        // 2. Verifica se já existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return NextResponse.json({ error: "E-mail já cadastrado" }, { status: 400 });
        }

        // 3. Criptografa a senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Cria o usuário
        await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return NextResponse.json({ message: "Usuário criado com sucesso!" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 500 });
    }
}