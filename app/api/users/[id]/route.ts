import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

type Props = {
    params: Promise<{ id: string }>;
};

interface UpdateUserData {
    email?: string;
    password?: string;
}

// PUT: Atualizar Email ou Senha
export async function PUT(request: Request, { params }: Props) {
    try {
        const { id } = await params;
        await connectDB();

        // 2. Tipamos o retorno do json()
        const body = await request.json() as UpdateUserData;

        // 3. Inicializamos o objeto com a tipagem correta (sem any)
        const updateData: UpdateUserData = {};

        // Se veio email, verifica duplicidade
        if (body.email) {
            const emailExists = await User.findOne({ email: body.email, _id: { $ne: id } });
            if (emailExists) {
                return NextResponse.json({ error: "Este e-mail já está em uso por outro usuário." }, { status: 400 });
            }
            updateData.email = body.email;
        }

        // Se veio senha, criptografa
        if (body.password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(body.password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedUser) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });

        return NextResponse.json({ message: "Dados atualizados com sucesso!" });

    } catch (error) {
        return NextResponse.json({ error: "Erro ao atualizar usuário" }, { status: 500 });
    }
}

// DELETE: Soft Delete
export async function DELETE(request: Request, { params }: Props) {
    try {
        const { id } = await params;
        await connectDB();

        // Marca a data de exclusão em vez de apagar o registro
        await User.findByIdAndUpdate(id, { deletedAt: new Date() });

        return NextResponse.json({ message: "Usuário removido com sucesso!" });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao remover usuário" }, { status: 500 });
    }
}