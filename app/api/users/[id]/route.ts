import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import { getAuthenticatedUser } from "@/lib/auth-server";
import bcrypt from "bcryptjs";

// Helper para lidar com Params no Next.js 15+
type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: RouteParams) {
    try {
        const currentUser = await getAuthenticatedUser();
        if (!currentUser || currentUser.role !== 'admin') {
            return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
        }

        const { id } = await params;

        const body = await request.json();

        const updateData: any = { ...body };

        // Se a senha vier preenchida, faz o hash. Se vazia, remove para não salvar em branco.
        if (body.password && body.password.trim() !== "") {
            updateData.password = await bcrypt.hash(body.password, 10);
        } else {
            delete updateData.password;
        }

        await connectDB();

        // Atualiza e retorna o novo usuário (sem senha)
        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password");

        if (!updatedUser) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
        }

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Erro PUT User:", error);
        return NextResponse.json({ error: "Erro ao atualizar usuário" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const currentUser = await getAuthenticatedUser();
        if (!currentUser || currentUser.role !== 'admin') {
            return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
        }

        // CORREÇÃO: Aguardamos o params antes de usar
        const { id } = await params;

        await connectDB();

        // Soft delete: Apenas marca o campo deletedAt
        const deletedUser = await User.findByIdAndUpdate(id, { deletedAt: new Date() });

        if (!deletedUser) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
        }

        return NextResponse.json({ message: "Usuário removido com sucesso" });
    } catch (error) {
        console.error("Erro DELETE User:", error);
        return NextResponse.json({ error: "Erro ao deletar usuário" }, { status: 500 });
    }
}