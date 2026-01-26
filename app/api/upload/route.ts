import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const data = await request.formData();
        const file = data.get('file') as File;
        const folder = data.get('folder') as string || 'publication';

        if (!file) {
            return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
        }

        const uploadUrl = process.env.KINGHOST_UPLOAD_URL;
        const apiSecret = process.env.KINGHOST_API_SECRET;

        if (!uploadUrl || !apiSecret) {
            return NextResponse.json({ error: 'Configuração de servidor ausente' }, { status: 500 });
        }

        const formDataToSend = new FormData();
        formDataToSend.append('file', file);
        formDataToSend.append('token', apiSecret);
        formDataToSend.append('folder', folder);

        const response = await fetch(uploadUrl, {
            method: 'POST',
            body: formDataToSend,
        });

        if (!response.ok) {
            // Se der erro, tentamos ler o texto para logar no servidor, mas retornamos erro JSON pro front
            const errorText = await response.text();
            console.error("Erro KingHost:", errorText);
            throw new Error(`Falha remota: ${response.statusText}`);
        }

        const result = await response.json();
        return NextResponse.json(result);

    } catch (error: any) {
        console.error('Erro no Proxy de Upload:', error);
        return NextResponse.json(
            { error: error.message || 'Erro interno' },
            { status: 500 }
        );
    }
}