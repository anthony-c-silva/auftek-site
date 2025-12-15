import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { getAuthenticatedUser } from "@/lib/auth-server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface CreateUserBody {
    name?: string;
    email?: string;
    password?: string;
}

// 1. GET - Listar Usuários
export async function GET() {
    try {
        const authenticatedUser = await getAuthenticatedUser();
        if (!authenticatedUser) {
            return NextResponse.json(
                { error: "Acesso negado. Você precisa estar logado." },
                { status: 401 }
            );
        }

        await connectDB();
        const users = await User.find({ deletedAt: null }, '-password').sort({ createdAt: -1 });

        return NextResponse.json(users);
    } catch (error: unknown) {
        console.error("Erro GET Users:", error);
        return NextResponse.json({ error: "Erro ao buscar usuários" }, { status: 500 });
    }
}

// 2. POST - Criar Usuário
export async function POST(request: Request) {
    try {
        // SEGURANÇA
        const authenticatedUser = await getAuthenticatedUser();
        if (!authenticatedUser) {
            return NextResponse.json(
                { error: "Acesso negado." },
                { status: 401 }
            );
        }

        await connectDB();

        const { name, email, password } = await request.json() as CreateUserBody;

        // 1. Validação
        if (!name || !email || !password) {
            return NextResponse.json({ error: "Preencha todos os campos." }, { status: 400 });
        }

        if (!EMAIL_REGEX.test(email)) {
            return NextResponse.json({ error: "O e-mail inválido." }, { status: 400 });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            if (userExists.deletedAt) {
                return NextResponse.json(
                    { error: "Usuário desativado encontrada. Reative-o." },
                    { status: 400 }
                );
            }
            return NextResponse.json({ error: "E-mail já cadastrado." }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return NextResponse.json({ message: "Usuário criado com sucesso!" }, { status: 201 });

    } catch (error: unknown) {
        console.error("Erro POST User:", error);
        return NextResponse.json({ error: "Erro interno ao criar usuário." }, { status: 500 });
    }
}