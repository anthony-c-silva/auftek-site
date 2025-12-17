import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function GET() {
    // 1. Pega o cookie seguro (certifique-se que o nome é o mesmo do login: 'auftek_token')
    const cookieStore = await cookies();
    const token = cookieStore.get("auftek_token");

    if (!token) {
        return NextResponse.json({ user: null }, { status: 401 });
    }

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error("JWT_SECRET is missing");

        // 2. Decodifica o token para pegar o ID
        const decoded = jwt.verify(token.value, secret) as { id: string };

        // 3. Conecta ao Banco
        await connectDB();

        // 4. Busca o usuário atualizado (excluindo senha)
        const user = await User.findById(decoded.id).select("-password -__v");

        if (!user) {
            return NextResponse.json({ user: null }, { status: 401 });
        }

        // 5. Retorna os dados para o AuthContext
        return NextResponse.json({
            user: {
                name: user.name,
                email: user.email,
                role: user.role
            }
        }, { status: 200 });

    } catch (error) {
        console.error("Erro ao validar sessão:", error);
        return NextResponse.json({ user: null }, { status: 401 });
    }
}