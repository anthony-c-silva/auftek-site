import connectDB from "@/lib/mongodb";
import ActivityLog from "@/lib/models/ActivityLog";

interface LogParams {
    userId: string | any;
    targetUserId?: string | any;
    action: string;
    resourceId?: string | any;
    resourceType?: 'Post' | 'User' | 'System';
    details?: string;
}

export async function logActivity({ userId, targetUserId, action, resourceId, resourceType = 'Post', details }: LogParams) {
    try {
        await connectDB();

        await ActivityLog.create({
            user: userId,
            targetUser: targetUserId,
            action,
            resourceId,
            resourceType,
            details
        });

    } catch (error) {
        console.error("Falha ao salvar log de atividade:", error);
    }
}