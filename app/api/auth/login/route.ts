import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { checkRateLimit, incrementRateLimit, clearRateLimit } from "@/lib/rate-limit";

// Helper para pegar o IP real (funciona local, Vercel e AWS)
function getClientIp(request: Request) {
    const forwardedFor = request.headers.get("x-forwarded-for");
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
    }
    return "unknown_ip";
}

export async function POST(request: Request) {
    try {
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            throw new Error("A variável de ambiente JWT_SECRET não está definida.");
        }

        const { email, password } = await request.json();
        const ip = getClientIp(request);

        await connectDB();

        // ============================================================
        // 1. SEGURANÇA: Verifica se já está bloqueado (Antes de tentar logar)
        // ============================================================

        // A. Bloqueio de IP (10 tentativas -> 30 min de bloqueio)
        const ipCheck = await checkRateLimit(`ip_${ip}`, 10);
        if (!ipCheck.success) {
            return NextResponse.json(
                { error: "Muitas tentativas. IP bloqueado temporariamente (30 min)." },
                { status: 429 }
            );
        }

        // B. Bloqueio de Email (5 tentativas -> 15 min de bloqueio)
        const emailCheck = await checkRateLimit(`email_${email}`, 5);
        if (!emailCheck.success) {
            return NextResponse.json(
                { error: "Conta bloqueada por excesso de tentativas. Tente em 15 min." },
                { status: 429 }
            );
        }

        // ============================================================
        // 2. LÓGICA DE LOGIN ORIGINAL
        // ============================================================

        // Busca o usuário com a senha
        const user = await User.findOne({ email }).select("+password");

        // Helper para registrar falha (Evita repetir código)
        const registerFailure = async () => {
            await Promise.all([
                incrementRateLimit(`ip_${ip}`, 1),   // Pune IP por 30m
                incrementRateLimit(`email_${email}`, 1) // Pune Email por 15m
            ]);
        };

        if (!user) {
            await registerFailure();
            return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
        }

        // Compara a senha
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            await registerFailure();
            return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
        }

        // ============================================================
        // 3. SUCESSO E LIMPEZA
        // ============================================================

        // Se chegou aqui, a senha está certa. Limpamos os erros da conta.
        await clearRateLimit(`email_${email}`);

        // Gera o Token JWT INCLUINDO A ROLE
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

        // Responde INCLUINDO A ROLE no JSON
        const response = NextResponse.json({
            success: true,
            message: "Login realizado com sucesso",
            token: token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                photoUrl: user.photoUrl
            }
        });

        // Define Cookie
        response.cookies.set("auftek_token", token, {
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