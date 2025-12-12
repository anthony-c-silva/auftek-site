import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

// Regex padrão para validar e-mails (aceita nome@dominio.com)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
    try {
        await connectDB();
        const { name, email, password } = await request.json();

        // 1. Validação: Campos vazios
        if (!name || !email || !password) {
            return NextResponse.json({ error: "Preencha todos os campos." }, { status: 400 });
        }

        // 2. Validação: Formato do E-mail (NOVO)
        if (!EMAIL_REGEX.test(email)) {
            return NextResponse.json({ error: "O e-mail informado é inválido. Verifique o formato (ex: nome@empresa.com)." }, { status: 400 });
        }

        // 3. Validação: Duplicidade (Já existia, mantemos)
        // Verifica se já existe ALGUÉM com esse email (mesmo deletado ou ativo)
        const userExists = await User.findOne({ email });

        if (userExists) {
            // Se o usuário existir mas estiver "Deletado" (Soft Delete), podemos avisar
            if (userExists.deletedAt) {
                return NextResponse.json({ error: "Este e-mail pertence a um usuário desativado. Contate o suporte para reativar." }, { status: 400 });
            }
            return NextResponse.json({ error: "Este e-mail já está cadastrado no sistema." }, { status: 400 });
        }

        // 4. Segurança: Criptografia da Senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 5. Criação
        await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return NextResponse.json({ message: "Usuário criado com sucesso!" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Erro interno ao criar usuário." }, { status: 500 });
    }
}

// MANTENHA O GET AQUI EMBAIXO IGUAL AO QUE JÁ FIZEMOS...
export async function GET() {
    try {
        await connectDB();
        const users = await User.find({ deletedAt: null }, '-password').sort({ createdAt: -1 });
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar usuários" }, { status: 500 });
    }
}