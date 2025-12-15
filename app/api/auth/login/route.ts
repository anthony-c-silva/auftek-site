import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
    try {
        // 1. SEGURANÇA: Validação da chave secreta
        const JWT_SECRET = process.env.JWT_SECRET;

        if (!JWT_SECRET) {
            throw new Error("A variável de ambiente JWT_SECRET não está definida.");
        }

        const { email, password } = await request.json();

        await connectDB();

        // 2. Busca o usuário
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
        }

        // 3. Compara a senha
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
        }

        // 4. Gera o Token JWT usando a chave segura do ENV
        const token = jwt.sign(
            { id: user._id, email: user.email, name: user.name },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        // 5. Cria a resposta
        const response = NextResponse.json({
            success: true,
            message: "Login realizado com sucesso",
            token: token, // Envia para o frontend salvar no localStorage
            user: {
                name: user.name,
                email: user.email
            }
        });

        // 6. Define no Cookie também
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        return response;

    } catch (error: unknown) {
        console.error("Erro no login:", error);
        return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
    }
}