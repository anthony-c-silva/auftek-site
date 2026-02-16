import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import connectDB from "@/lib/mongodb";
import Post from "@/lib/models/Post";
import { getAuthenticatedUser } from "@/lib/auth-server";
import { logActivity } from "@/lib/logger";

type Props = {
    params: Promise<{ slug: string }>;
};

// 1. GET (Ler Post Único)
export async function GET(request: Request, { params }: Props) {
    try {
        const { slug } = await params;
        await connectDB();

        // Usamos lean() para performance.
        // O authorId já está no schema se precisar popular no futuro.
        const post = await Post.findOne({ slug, deletedAt: null }).lean();

        if (!post) return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });

        return NextResponse.json(post, {
            headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' }
        });
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

        // --- SELF-HEALING (Correção Automática de Posts Antigos) ---
        // Se o post não tem authorId e quem edita é o autor (não admin), salvamos o ID agora.
        if (!post.authorId && user.role !== 'admin') {
            post.authorId = user._id;
        }

        const oldStatus = post.status;
        const targetAuthorId = post.authorId || null;

        // Limpeza de campos imutáveis via edição direta
        delete body.writer;
        delete body.createdAt;
        delete body._id;
        delete body.author;
        delete body.authorId;

        // --- LÓGICA DE APROVAÇÃO (ADMIN) ---
        if (
            user.role === 'admin' &&
            body.status === 'published' &&
            post.pendingChanges &&
            Object.keys(post.pendingChanges).length > 0
        ) {
            // Merge das alterações pendentes
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

            await logActivity({
                userId: user._id,
                targetUserId: targetAuthorId,
                action: 'APPROVE_EDIT',
                resourceId: post._id,
                details: `Aprovou alterações pendentes.`
            });

            revalidatePath('/blog');
            revalidatePath(`/blog/${post.slug}`);
            return NextResponse.json(post);
        }

        // --- LÓGICA DE EDIÇÃO / REJEIÇÃO ---
        const isAdminRejecting = user.role === 'admin' && body.status === 'rejected';
        const isProtectedState = ['published', 're-evaluation', 'rejected'].includes(post.status);

        // Se o post já foi publicado/rejeitado e não é o admin rejeitando agora -> Cria Rascunho (Shadow Draft)
        if (isProtectedState && !isAdminRejecting) {
            const currentPending = post.pendingChanges || {};

            post.pendingChanges = {
                title: body.title ?? currentPending.title ?? post.title,
                content: body.content ?? currentPending.content ?? post.content,
                excerpt: body.excerpt ?? currentPending.excerpt ?? post.excerpt,
                coverImage: body.coverImage ?? currentPending.coverImage ?? post.coverImage,
                tags: body.tags ?? currentPending.tags ?? post.tags,
                slug: body.slug ?? currentPending.slug ?? post.slug
            };

            post.status = 're-evaluation';
            post.rejectionReason = undefined;
            await post.save();

            await logActivity({
                userId: user._id,
                action: 'SUBMIT_REVISION',
                resourceId: post._id,
                details: `Enviou nova revisão.`
            });
        }
        // Edição direta (Rascunhos ou Rejeição do Admin)
        else {
            if (isAdminRejecting) {
                post.status = 'rejected';
                post.rejectionReason = body.rejectionReason;
                await post.save();

                await logActivity({
                    userId: user._id,
                    targetUserId: targetAuthorId,
                    action: 'REJECT_POST',
                    resourceId: post._id,
                    details: `Motivo: ${body.rejectionReason}`
                });
            } else {
                // Atualização normal de rascunho
                if (body.title) post.title = body.title;
                if (body.content) post.content = body.content;
                if (body.excerpt) post.excerpt = body.excerpt;
                if (body.coverImage) post.coverImage = body.coverImage;
                if (body.tags) post.tags = body.tags;
                if (body.slug) post.slug = body.slug;

                if (body.status) {
                    // Autor não pode forçar 'published' diretamente se não for admin
                    if (body.status === 'published' && user.role !== 'admin') {
                        post.status = 'pending';
                    } else {
                        post.status = body.status;
                    }
                }

                post.pendingChanges = undefined;
                await post.save();
            }
        }

        revalidatePath('/blog');
        revalidatePath(`/blog/${post.slug}`);
        return NextResponse.json(post);
    } catch (error: unknown) {
        console.error("Erro PUT:", error);
        return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
    }
}

// 3. DELETE (Soft Delete) - A função que estava faltando ou incorreta
export async function DELETE(request: Request, { params }: Props) {
    try {
        const user = await getAuthenticatedUser();
        if (!user) return NextResponse.json({ error: "Acesso negado." }, { status: 401 });

        const { slug } = await params;
        await connectDB();

        // Soft delete: apenas preenche o deletedAt
        const softDeletedPost = await Post.findOneAndUpdate(
            { slug, deletedAt: null },
            { deletedAt: new Date() },
            { new: true }
        );

        if (!softDeletedPost) {
            return NextResponse.json({ error: "Post não encontrado." }, { status: 404 });
        }

        // Se tiver authorId (novo schema), usa ele. Se for legado, null.
        const targetUserId = softDeletedPost.authorId || null;

        await logActivity({
            userId: user._id,
            targetUserId: targetUserId,
            action: 'DELETE_POST',
            resourceId: softDeletedPost._id,
            details: `Post excluído (Soft Delete)`
        });

        revalidatePath('/blog');
        revalidatePath(`/blog/${slug}`);
        return NextResponse.json({ message: "Post excluído" });
    } catch (error: unknown) {
        console.error("Erro DELETE:", error);
        return NextResponse.json({ error: "Erro ao excluir post" }, { status: 500 });
    }
}