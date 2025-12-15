// lib/auth-server.ts
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_secreta_aqui";

export interface DecodedUser {
    id: string;
    email: string;
    name: string;
    role: string;
}

export async function getAuthenticatedUser(): Promise<DecodedUser | null> {
    const headersList = await headers();
    const token = headersList.get("authorization")?.split(" ")[1];

    if (!token) return null;

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as DecodedUser;
        return decoded;
    } catch (error) {
        return null;
    }
}