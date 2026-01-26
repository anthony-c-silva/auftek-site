import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function getAuthenticatedUser() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auftek_token");

        if (!token) return null;

        const decoded = jwt.verify(token.value, JWT_SECRET) as { id: string };

        await connectDB();

        const user = await User.findById(decoded.id).select("-password -__v");

        if (!user) return null;

        return user;

    } catch (error) {
        console.error("Erro na autenticação do servidor:", error);
        return null;
    }
}