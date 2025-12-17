import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import { getAuthenticatedUser } from "@/lib/auth-server";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        const currentUser = await getAuthenticatedUser();
        if (!currentUser || currentUser.role !== 'admin') {
            return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
        }

        await connectDB();
        // Trazemos todos os usuários ordenados por criação
        const users = await User.find({ deletedAt: null }).select("-password").sort({ createdAt: -1 });
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar usuários" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const currentUser = await getAuthenticatedUser();
        if (!currentUser || currentUser.role !== 'admin') {
            return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
        }

        const body = await request.json();
        const { name, email, password, role, photoUrl, education, bio, socialLinks } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
        }

        await connectDB();

        const userExists = await User.findOne({ email });
        if (userExists) {
            return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'author', // Default para autor se não especificado
            photoUrl: photoUrl || "",
            education: education || "",
            bio: bio || "",
            socialLinks: socialLinks || {}
        });

        // Retorna o usuário sem a senha
        const { password: _, ...userResponse } = newUser.toObject();

        return NextResponse.json(userResponse, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 500 });
    }
}