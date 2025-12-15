import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { getAuthenticatedUser } from "@/lib/auth-server"; // Importante para segurança

type Props = {
    params: Promise<{ id: string }>;
};

// Interface tipada para o corpo da requisição
interface UpdateUserData {
    name?: string; // Adicionei name caso queira editar também
    email?: string;
    password?: string;
}

// 1. PUT: Atualizar Usuário (Protegido)
export async function PUT(request: Request, { params }: Props) {
    try {
        // SEGURANÇA: Apenas usuários logados podem editar
        const authenticatedUser = await getAuthenticatedUser();
        if (!authenticatedUser) {
            return NextResponse.json(
                { error: "Acesso negado. Token inválido ou ausente." },
                { status: 401 }
            );
        }

        const { id } = await params;
        await connectDB();

        // Tipagem do body
        const body = await request.json() as UpdateUserData;

        // Objeto de atualização tipado
        // Usamos Partial<UpdateUserData> para dizer que nem todos os campos são obrigatórios agora
        const updateData: any = {}; // Usamos any temporário aqui apenas para montar o objeto dinâmico do Mongoose, ou tipamos estritamente

        // Se veio nome
        if (body.name) {
            updateData.name = body.name;
        }

        // Se veio email, verifica duplicidade (excluindo o próprio ID)
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

        // Atualiza e retorna o novo documento (sem a senha)
        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password");

        if (!updatedUser) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
        }

        return NextResponse.json({ message: "Dados atualizados com sucesso!", user: updatedUser });

    } catch (error: unknown) {
        console.error("Erro PUT User:", error);
        return NextResponse.json({ error: "Erro ao atualizar usuário" }, { status: 500 });
    }
}

// 2. DELETE: Soft Delete (Protegido)
export async function DELETE(request: Request, { params }: Props) {
    try {
        // SEGURANÇA: Apenas usuários logados podem deletar
        const authenticatedUser = await getAuthenticatedUser();
        if (!authenticatedUser) {
            return NextResponse.json(
                { error: "Acesso negado. Token inválido ou ausente." },
                { status: 401 }
            );
        }

        const { id } = await params;
        await connectDB();

        // Marca a data de exclusão
        const deletedUser = await User.findByIdAndUpdate(id, { deletedAt: new Date() });

        if (!deletedUser) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
        }

        return NextResponse.json({ message: "Usuário removido com sucesso!" });
    } catch (error: unknown) {
        console.error("Erro DELETE User:", error);
        return NextResponse.json({ error: "Erro ao remover usuário" }, { status: 500 });
    }
}