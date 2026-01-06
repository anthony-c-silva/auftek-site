import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/lib/models/Post";
import { getAuthenticatedUser } from "@/lib/auth-server";

type Props = {
    params: Promise<{ slug: string }>;
};

// 1. GET (Ler Post) - Público
export async function GET(request: Request, { params }: Props) {
    try {
        const { slug } = await params;
        await connectDB();

        const post = await Post.findOne({ slug, deletedAt: null }).lean();

        if (!post) {
            return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error: unknown) {
        console.error("Erro GET [slug]:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

// 2. PUT (Editar / Aprovar / Rejeitar)
export async function PUT(request: Request, { params }: Props) {
    try {
        const user = await getAuthenticatedUser();
        if (!user) {
            return NextResponse.json(
                { error: "Acesso negado. Token inválido ou ausente." },
                { status: 401 }
            );
        }

        const { slug } = await params;
        await connectDB();

        const body = await request.json();

        // Busca o documento (instância Mongoose para poder salvar)
        const post = await Post.findOne({ slug, deletedAt: null });

        if (!post) {
            return NextResponse.json({ error: "Post não encontrado." }, { status: 404 });
        }

        // =====================================================================
        // 1. CASO ESPECIAL: ADMIN APROVANDO REAVALIAÇÃO (MERGE)
        // =====================================================================
        // Se for Admin + Status indo para 'published' + Tem mudanças pendentes
        if (
            user.role === 'admin' &&
            body.status === 'published' &&
            post.pendingChanges &&
            Object.keys(post.pendingChanges).length > 0
        ) {
            console.log(`✅ Admin aprovando alterações para: ${slug}`);

            // APLICA AS MUDANÇAS (Commit do Shadow Draft)
            if (post.pendingChanges.title) post.title = post.pendingChanges.title;
            if (post.pendingChanges.content) post.content = post.pendingChanges.content;
            if (post.pendingChanges.excerpt) post.excerpt = post.pendingChanges.excerpt;
            if (post.pendingChanges.coverImage) post.coverImage = post.pendingChanges.coverImage;
            if (post.pendingChanges.tags && post.pendingChanges.tags.length > 0) post.tags = post.pendingChanges.tags;

            // Slug é delicado: se mudar, a URL muda. O Admin aceitou isso ao aprovar.
            if (post.pendingChanges.slug) post.slug = post.pendingChanges.slug;

            // Limpeza final
            post.pendingChanges = undefined;
            post.status = 'published';
            post.rejectionReason = undefined;
            post.approvedBy = user._id;

            await post.save();
            return NextResponse.json(post);
        }

        // =====================================================================
        // 2. CASO NORMAL: EDIÇÃO OU REJEIÇÃO
        // =====================================================================

        // Proteção: Remove campos que não devem ser injetados manualmente
        delete body.writer;
        delete body.createdAt;
        delete body._id;
        delete body.author;

        // --- CENÁRIO A: O Post já está publicado? (Cria Shadow Draft) ---
        // Se o usuário tenta editar algo que está "published", criamos o rascunho.
        // Nota: Se o Admin estiver rejeitando (status='rejected'), cai no Else abaixo.
        if (post.status === 'published' && body.status !== 'rejected') {

            post.pendingChanges = {
                title: body.title ?? post.title,
                content: body.content ?? post.content,
                excerpt: body.excerpt ?? post.excerpt,
                coverImage: body.coverImage ?? post.coverImage,
                tags: body.tags ?? post.tags,
                slug: body.slug ?? post.slug
            };

            // Muda status para avisar admin
            post.status = 're-evaluation';

            // Se o usuário está enviando uma nova versão, limpamos a recusa anterior
            post.rejectionReason = undefined;

            console.log(`📝 Post publicado editado. Enviado para re-evaluation. Slug: ${slug}`);
        }

        // --- CENÁRIO B: Post não publicado OU Admin Rejeitando ---
        else {

            // 🚨 ADMIN REJEITANDO
            if (user.role === 'admin' && body.status === 'rejected') {

                // CASO B1: Rejeitando uma EDIÇÃO de post que já existe no ar
                // Ação: Volta status para 'published' (não derruba o site), mantém rascunho, salva motivo.
                if (post.status === 're-evaluation' || (post.status === 'published' && post.pendingChanges)) {
                    post.status = 'published';
                    post.rejectionReason = body.rejectionReason;
                    // IMPORTANTE: Mantemos pendingChanges para o autor corrigir
                }

                    // CASO B2: Rejeitando post NOVO (que nunca foi ao ar)
                // Ação: Marca como rejected total
                else {
                    post.status = 'rejected';
                    post.rejectionReason = body.rejectionReason;
                }

            }

            // ✍️ EDIÇÃO COMUM (Rascunho, Pendente, Recusado)
            else {
                // Aplica mudanças direto no documento (pois não está público ainda)
                if (body.title) post.title = body.title;
                if (body.content) post.content = body.content;
                if (body.excerpt) post.excerpt = body.excerpt;
                if (body.coverImage) post.coverImage = body.coverImage;
                if (body.tags) post.tags = body.tags;
                if (body.slug) post.slug = body.slug;

                // Se autor edita um post recusado/pendente, limpa o motivo da recusa
                if (body.title || body.content) {
                    post.rejectionReason = undefined;
                }

                // Controle de Status pelo Usuário/Admin
                if (body.status) {
                    // Autor não pode forçar 'published', vira 'pending'
                    if (body.status === 'published' && user.role !== 'admin') {
                        post.status = 'pending';
                    } else {
                        post.status = body.status;
                    }
                }

                // Limpeza de segurança
                post.pendingChanges = undefined;
            }
        }

        await post.save();
        return NextResponse.json(post);

    } catch (error: unknown) {
        console.error("Erro PUT [slug]:", error);
        return NextResponse.json({ error: "Erro ao atualizar post" }, { status: 500 });
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

        return NextResponse.json({ message: "Post movido para a lixeira." });
    } catch (error: unknown) {
        console.error("Erro DELETE [slug]:", error);
        return NextResponse.json({ error: "Erro ao excluir post" }, { status: 500 });
    }
}