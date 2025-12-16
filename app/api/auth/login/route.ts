import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
    try {
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            throw new Error("A variável de ambiente JWT_SECRET não está definida.");
        }

        const { email, password } = await request.json();

        await connectDB();

        // 1. Busca o usuário com a senha
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
        }

        // 2. Compara a senha
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
        }

        // 3. Gera o Token JWT INCLUINDO A ROLE
        const token = jwt.sign(
            { 
                id: user._id, 
                email: user.email, 
                name: user.name,
                role: user.role 
            },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        // 4. Responde INCLUINDO A ROLE no JSON
        const response = NextResponse.json({
            success: true,
            message: "Login realizado com sucesso",
            token: token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role 
            }
        });

        // 5. Define Cookie
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        return response;

    } catch (error: any) {
        console.error("Erro no login:", error);
        return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
    }
}