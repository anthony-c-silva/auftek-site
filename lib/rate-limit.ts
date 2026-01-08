import LoginAttempt from "@/lib/models/LoginAttempt";

interface RateLimitResult {
    success: boolean;   // Pode prosseguir?
    remaining: number;  // Quantas tentativas restam
    resetTime?: Date;   // Se bloqueado, quando libera?
}

/**
 * Verifica se o IP ou Email pode tentar logar.
 * @param key Identificador único (ex: "ip_192.168.0.1")
 * @param maxAttempts Limite de erros permitidos
 */
export async function checkRateLimit(key: string, maxAttempts: number): Promise<RateLimitResult> {
    const attempt = await LoginAttempt.findOne({ key });

    // Se não tem histórico, está limpo
    if (!attempt) {
        return { success: true, remaining: maxAttempts };
    }

    // Se já estourou o limite
    if (attempt.count >= maxAttempts) {
        return {
            success: false,
            remaining: 0,
            resetTime: attempt.expiresAt
        };
    }

    // Tem histórico, mas ainda não estourou
    return {
        success: true,
        remaining: maxAttempts - attempt.count
    };
}

/**
 * Registra um erro de login (aumenta o contador)
 * @param key Identificador
 * @param windowMinutes Tempo de punição (em minutos)
 */
export async function incrementRateLimit(key: string, windowMinutes: number) {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + windowMinutes);

    // "Upsert": Se existe, atualiza. Se não existe, cria.
    await LoginAttempt.findOneAndUpdate(
        { key },
        {
            $inc: { count: 1 },
            $set: { lastAttempt: new Date(), expiresAt: expiresAt }
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );
}

/**
 * Limpa o histórico (sucesso no login)
 */
export async function clearRateLimit(key: string) {
    await LoginAttempt.deleteOne({ key });
}