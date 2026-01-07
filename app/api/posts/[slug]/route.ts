import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/lib/models/Post";
import { getAuthenticatedUser } from "@/lib/auth-server";
import { logActivity } from "@/lib/logger";

type Props = {
    params: Promise<{ slug: string }>;
};

// 1. GET (Ler Post)
export async function GET(request: Request, { params }: Props) {
    try {
        const { slug } = await params;
        await connectDB();
        const post = await Post.findOne({ slug, deletedAt: null }).lean();
        if (!post) return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
        return NextResponse.json(post);
    } catch (error: unknown) {
        console.error("Erro GET:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

// 2. PUT (Editar / Aprovar / Rejeitar)
export async function PUT(request: Request, { params }: Props) {
    try {
        const user = await getAuthenticatedUser();
        if (!user) return NextResponse.json({ error: "Acesso negado." }, { status: 401 });

        const { slug } = await params;
        await connectDB();

        const body = await request.json();
        const post = await Post.findOne({ slug, deletedAt: null });

        if (!post) return NextResponse.json({ error: "Post não encontrado." }, { status: 404 });

        // Captura o status antigo para logs
        const oldStatus = post.status;

        // =====================================================================
        // 1. ADMIN APROVANDO (Merge)
        // =====================================================================
        if (
            user.role === 'admin' &&
            body.status === 'published' &&
            post.pendingChanges &&
            Object.keys(post.pendingChanges).length > 0
        ) {
            // Aplica as mudanças do pendingChanges no post oficial
            if (post.pendingChanges.title) post.title = post.pendingChanges.title;
            if (post.pendingChanges.content) post.content = post.pendingChanges.content;
            if (post.pendingChanges.excerpt) post.excerpt = post.pendingChanges.excerpt;
            if (post.pendingChanges.coverImage) post.coverImage = post.pendingChanges.coverImage;
            if (post.pendingChanges.tags?.length) post.tags = post.pendingChanges.tags;
            if (post.pendingChanges.slug) post.slug = post.pendingChanges.slug;

            post.pendingChanges = undefined;
            post.status = 'published';
            post.rejectionReason = undefined;
            post.approvedBy = user._id;

            await post.save();

            // LOG: Aprovação
            await logActivity({
                userId: user._id,           // Quem aprovou (Admin)
                targetUserId: post.author,  // De quem é o post (Autor)
                action: 'APPROVE_EDIT',
                resourceId: post._id,
                details: `Aprovou alterações pendentes. Post publicado.`
            });

            return NextResponse.json(post);
        }

        // =====================================================================
        // 2. EDIÇÃO OU REJEIÇÃO
        // =====================================================================
        delete body.writer;
        delete body.createdAt;
        delete body._id;
        delete body.author;

        const isProtectedState =
            post.status === 'published' ||
            post.status === 're-evaluation' ||
            post.status === 'rejected';

        const isAdminRejecting = user.role === 'admin' && body.status === 'rejected';

        // --- CENÁRIO A: Ciclo de Correção (Cria Shadow Draft) ---
        if (isProtectedState && !isAdminRejecting) {

            // Mescla o que já existia no pendingChanges com as novas edições
            const currentPending = post.pendingChanges || {};

            post.pendingChanges = {
                title: body.title ?? currentPending.title ?? post.title,
                content: body.content ?? currentPending.content ?? post.content,
                excerpt: body.excerpt ?? currentPending.excerpt ?? post.excerpt,
                coverImage: body.coverImage ?? currentPending.coverImage ?? post.coverImage,
                tags: body.tags ?? currentPending.tags ?? post.tags,
                slug: body.slug ?? currentPending.slug ?? post.slug
            };

            // Independente do que o front mandou, se o autor editou um post recusado,
            // o status VIRA 're-evaluation' e limpamos o motivo da recusa.
            post.status = 're-evaluation';
            post.rejectionReason = undefined;

            await post.save();

            // LOG: Revisão enviada pelo autor
            await logActivity({
                userId: user._id,
                // Aqui não precisa de targetUser pois o autor age sobre si mesmo
                action: 'SUBMIT_REVISION',
                resourceId: post._id,
                details: `Enviou nova revisão (Status anterior: ${oldStatus})`
            });
        }

        // --- CENÁRIO B: Edição Direta ou Admin Rejeitando ---
        else {
            if (isAdminRejecting) {
                // Se já tinha mudanças pendentes, mantemos elas mas marcamos como rejeitado
                post.status = 'rejected';
                post.rejectionReason = body.rejectionReason;

                await post.save();

                // LOG: Rejeição pelo Admin
                await logActivity({
                    userId: user._id,          // Quem rejeitou (Admin)
                    targetUserId: post.author, // Quem sofreu a rejeição (Autor)
                    action: 'REJECT_POST',
                    resourceId: post._id,
                    details: `Motivo: ${body.rejectionReason}`
                });
            }
            else {
                // Edição Comum (Rascunho ou Novo Post)
                if (body.title) post.title = body.title;
                if (body.content) post.content = body.content;
                if (body.excerpt) post.excerpt = body.excerpt;
                if (body.coverImage) post.coverImage = body.coverImage;
                if (body.tags) post.tags = body.tags;
                if (body.slug) post.slug = body.slug;

                // Controle de status simples
                if (body.status) {
                    if (body.status === 'published' && user.role !== 'admin') {
                        post.status = 'pending';
                    } else {
                        post.status = body.status;
                    }
                }

                post.pendingChanges = undefined;

                await post.save();

                // LOG: Edição simples
                if (oldStatus !== post.status) {
                    await logActivity({
                        userId: user._id,
                        action: 'CHANGE_STATUS',
                        resourceId: post._id,
                        details: `Mudou de ${oldStatus} para ${post.status}`
                    });
                }
            }
        }

        return NextResponse.json(post);

    } catch (error: unknown) {
        console.error("Erro PUT:", error);
        return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
    }
}

// 3. DELETE (Soft Delete)
export async function DELETE(request: Request, { params }: Props) {
    try {
        const user = await getAuthenticatedUser();
        if (!user) return NextResponse.json({ error: "Acesso negado." }, { status: 401 });

        const { slug } = await params;
        await connectDB();

        const softDeletedPost = await Post.findOneAndUpdate(
            { slug, deletedAt: null },
            { deletedAt: new Date() },
            { new: true }
        );

        if (!softDeletedPost) {
            return NextResponse.json({ error: "Post não encontrado." }, { status: 404 });
        }

        // ==========================================================
        // AJUSTE: Identificação Visual do Autor
        // ==========================================================
        // Como o Post não tem o ID do autor (apenas os dados copiados),
        // pegamos o NOME para registrar no histórico.
        const authorData = softDeletedPost.author as any;
        const authorName = authorData?.name || "Autor Desconhecido";

        // Tenta achar um ID se existir (caso raro no seu schema atual), senão null
        let safeTargetUserId = null;
        if (authorData && (typeof authorData === 'string' || authorData._bsontype === 'ObjectID')) {
            safeTargetUserId = authorData;
        } else if (authorData && authorData._id) {
            safeTargetUserId = authorData._id;
        }

        // LOG: Agora o detalhe dirá "Post de [Nome] movido..."
        await logActivity({
            userId: user._id,
            targetUserId: safeTargetUserId,
            action: 'DELETE_POST',
            resourceId: softDeletedPost._id,
            details: `Publicação de "${authorName}" movido para a lixeira` // <--- AQUI ESTÁ A SOLUÇÃO
        });

        return NextResponse.json({ message: "Publicação excluída" });
    } catch (error: unknown) {
        console.error("Erro DELETE:", error);
        return NextResponse.json({ error: "Erro ao excluir publicação" }, { status: 500 });
    }
}