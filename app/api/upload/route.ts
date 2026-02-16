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

        console.log('Upload proxy:', { url: uploadUrl, folder, fileName: file.name, fileSize: file.size, status: 'enviando...' });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Erro KingHost:", response.status, errorText);
            return NextResponse.json(
                { error: `KingHost ${response.status}: ${errorText}` },
                { status: response.status }
            );
        }

        const result = await response.json();
        return NextResponse.json(result);

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Erro interno';
        console.error('Erro no Proxy de Upload:', message);
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}