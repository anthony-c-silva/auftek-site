import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auftek_token");

    if (!token) {
        return NextResponse.json({ user: null }, { status: 401 });
    }

    try {
        // Verifica se o token é válido e decodifica
        jwt.verify(token.value, process.env.JWT_SECRET!);
        return NextResponse.json({ user: "admin" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ user: null }, { status: 401 });
    }
}