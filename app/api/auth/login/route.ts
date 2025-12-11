import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json(); // Agora pedimos email também

        await connectDB();

        // 1. Busca o usuário
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
        }

        // 2. Compara a senha enviada com o Hash do banco
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
        }

        // 3. Gera o Token JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" } // Token válido por 7 dias
        );

        // 4. Cria a resposta e define o Cookie HttpOnly
        // HttpOnly = O JavaScript do navegador NÃO consegue ler esse cookie (segurança contra XSS)
        const response = NextResponse.json({ success: true, name: user.name });

        response.cookies.set("auftek_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Só HTTPS em produção
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7, // 7 dias em segundos
            path: "/",
        });

        return response;

    } catch (error) {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}