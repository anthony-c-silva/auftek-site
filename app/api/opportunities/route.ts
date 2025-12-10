import { NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';
import nodemailer from 'nodemailer';

// ==========================================
// 1. SERVIÇO DE E-MAIL
// ==========================================
class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async enviarNotificacao(nome: string, email: string, mensagem: string) {
        try {
            await this.transporter.sendMail({
                from: `"Site Lead" <${process.env.SMTP_USER}>`,
                to: process.env.SMTP_TO,
                subject: `🚀 Novo Lead: ${nome}`,
                html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
            <h2 style="color: #0e223b;">Novo Contato pelo Site</h2>
            <p><strong>Nome:</strong> ${nome}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Mensagem:</strong></p>
            <blockquote style="background: #f5f5f5; padding: 10px; border-left: 4px solid #0e223b;">${mensagem}</blockquote>
          </div>
        `
            });
            console.log(`[EMAIL] Enviado para ${process.env.SMTP_TO}`);
        } catch (error) {
            console.error(`[EMAIL] Erro:`, error);
        }
    }
}

// ==========================================
// 2. CLIENTE OMIE
// ==========================================
class OmieClient {
    private api;
    private appKey = process.env.OMIE_APP_KEY;
    private appSecret = process.env.OMIE_APP_SECRET;

    constructor() {
        this.api = axios.create({
            baseURL: 'https://app.omie.com.br/api/v1',
            timeout: 30000,
            httpsAgent: new https.Agent({ family: 4 }),
            headers: { 'Content-Type': 'application/json' }
        });
    }

    async post(endpoint: string, call: string, param: any) {
        await new Promise(r => setTimeout(r, 500));

        const payload = { call, app_key: this.appKey, app_secret: this.appSecret, param };

        try {
            const { data } = await this.api.post(endpoint, payload);
            if (data.faultstring) throw new Error(data.faultstring);
            return data;
        } catch (err: any) {
            const msg = err.response?.data?.faultstring || err.message;
            throw new Error(msg);
        }
    }
}

// ==========================================
// 3. REGRAS DE NEGÓCIO (LEAD)
// ==========================================
class LeadService {
    constructor(private client: OmieClient) {}

    // Gera ID único
    private gerarIdUnico(prefixo: string) {
        // Adiciona um random grande e converte pra string base 36 para encurtar e variar
        const random = Math.floor(Math.random() * 1000000).toString(36);
        return `${prefixo}-${Date.now()}-${random}`.toUpperCase();
    }

    async verificarDuplicidade(email: string) {
        try {
            const check = await this.client.post("/crm/contas/", "VerificarConta", [{ contaVerificarRequest: { cEmail: email } }]);
            if (check.nCod > 0) return true;
        } catch (e) {}

        const contato = await this.buscarContato(email);
        return !!contato;
    }

    async processarNovoLead(nome: string, email: string, mensagem: string) {
        const contaId = await this.criarContaComRetry(nome, email);
        const contatoId = await this.criarContatoComRetry(contaId, nome, email);

        const [solucaoId, origemId] = await Promise.all([
            this.buscarIdSolucao(),
            this.buscarIdOrigem()
        ]);

        return await this.criarOportunidadeComRetry(contaId, contatoId, nome, email, mensagem, solucaoId, origemId);
    }

    async criarContaComRetry(nome: string, email: string, tentativa = 1): Promise<number> {
        // Se for retry, muda o nome para "Nome (Timestamp)"
        const nomeFinal = tentativa > 1 ? `${nome} (${Date.now()})` : nome;

        const payload = {
            identificacao: {
                cCodInt: this.gerarIdUnico("CONTA"),
                cNome: nomeFinal,
                cObs: "Lead Site NextJS"
            },
            telefone_email: { cEmail: email },
            endereco: { cEndereco: "Via Site", cBairro: "Digital", cCEP: "00000-000", cCidade: "São Paulo", cUF: "SP", cPais: "Brasil" }
        };

        try {
            const res = await this.client.post("/crm/contas/", "IncluirConta", [payload]);
            return res.nCod;
        } catch (error: any) {
            const erroString = error.message || "";
            if (erroString.includes("cNome") || erroString.includes("nome informado") || erroString.includes("já existe")) {
                console.log(`[RETRY CONTA] Nome "${nomeFinal}" duplicado. Tentando variante...`);
                return this.criarContaComRetry(nome, email, tentativa + 1);
            }
            throw error;
        }
    }

    async criarContatoComRetry(contaId: any, nome: string, email: string, tentativa = 1): Promise<number> {
        const nomeFinal = tentativa > 1 ? `${nome} (${Date.now()})` : nome;

        const payload = {
            identificacao: {
                cCodInt: this.gerarIdUnico("CT"),
                cNome: nomeFinal,
                nCodConta: Number(contaId)
            },
            telefone_email: { cEmail: email }
        };

        try {
            const res = await this.client.post("/crm/contatos/", "IncluirContato", [payload]);
            return res.nCod;
        } catch (error: any) {
            const erroString = error.message || "";
            if (erroString.includes("Contato já cadastrado") || erroString.includes("cNome") || erroString.includes("já existe")) {
                console.log(`[RETRY CONTATO] Erro ao criar "${nomeFinal}". Tentando variante...`);
                if (tentativa > 3) throw error;
                return this.criarContatoComRetry(contaId, nome, email, tentativa + 1);
            }
            throw error;
        }
    }

    // --- RETRY OPORTUNIDADE (Com Título Único) ---
    async criarOportunidadeComRetry(contaId: any, contatoId: any, nome: string, email: string, mensagem: string, solucaoId: any, origemId: any, tentativa = 1): Promise<number> {

        const idUnicoOp = this.gerarIdUnico("OP");

        // Formata data atual: DD/MM HH:mm
        const agora = new Date();
        const dataStr = `${agora.getDate()}/${agora.getMonth()+1} ${agora.getHours()}:${agora.getMinutes()}:${agora.getSeconds()}`;

        // Título Único: "Lead Site: Pedro - 10/12 14:30:05"
        // Isso evita qualquer bloqueio por Título duplicado
        const tituloUnico = `Lead Site: ${nome} - ${dataStr}`;

        const payload = {
            identificacao: {
                cCodIntOp: idUnicoOp,
                cDesOp: tituloUnico,
                nCodConta: Number(contaId),
                nCodContato: Number(contatoId),
                nCodSolucao: Number(solucaoId),
                nCodOrigem: Number(origemId)
            },
            observacoes: { cObs: `Mensagem: ${mensagem}\nEmail: ${email}` }
        };

        try {
            const res = await this.client.post("/crm/oportunidades/", "IncluirOportunidade", [payload]);
            return res.nCodOp;
        } catch (error: any) {
            const erroString = error.message || "";

            // Se der erro de "já cadastrada", tenta de novo
            if (erroString.includes("já cadastrada") || erroString.includes("duplicad") || erroString.includes("cCodIntOp")) {
                console.log(`[RETRY OP] Oportunidade conflitou (ID: ${idUnicoOp}). Tentando novo ID...`);
                if (tentativa > 3) throw error;
                await new Promise(r => setTimeout(r, 1000));
                return this.criarOportunidadeComRetry(contaId, contatoId, nome, email, mensagem, solucaoId, origemId, tentativa + 1);
            }
            throw error;
        }
    }

    async buscarContato(email: string) {
        let pagina = 1;
        while(true) {
            const data = await this.client.post("/crm/contatos/", "ListarContatos", [{ pagina, registros_por_pagina: 50, apenas_importado_api: "N" }]);
            const found = data.cadastros?.find((c: any) => c.telefone_email?.cEmail?.toLowerCase() === email.toLowerCase());

            if (found) return { contatoId: found.identificacao.nCod, contaId: found.identificacao.nCodConta };
            if (pagina >= (data.total_de_paginas || 1)) break;
            pagina++;
        }
        return null;
    }

    async buscarIdSolucao() {
        const data = await this.client.post("/crm/solucoes/", "ListarSolucoes", [{ pagina: 1, registros_por_pagina: 10 }]);
        const solucao = data.cadastros?.find((s: any) => s.cInativo === "N");
        return solucao?.nCodigo || 0;
    }

    async buscarIdOrigem() {
        const data = await this.client.post("/crm/origens/", "ListarOrigens", [{ pagina: 1, registros_por_pagina: 1 }]);
        return data.cadastros?.[0]?.nCodigo || 0;
    }
}

// ==========================================
// 4. ROTA POST
// ==========================================
export async function POST(request: Request) {
    try {
        const { nome, email, mensagem } = await request.json();

        if (!nome || !email) {
            return NextResponse.json({ error: "Campos obrigatórios faltando." }, { status: 400 });
        }

        const omie = new OmieClient();
        const leadService = new LeadService(omie);
        const emailService = new EmailService();

        // 1. CHECAGEM DUPLICIDADE
        const emailDuplicado = await leadService.verificarDuplicidade(email);

        if (emailDuplicado) {
            return NextResponse.json({
                success: false,
                error: "DUPLICATE_EMAIL",
                message: "E-mail duplicado."
            }, { status: 409 });
        }

        // 2. PROCESSAMENTO
        await leadService.processarNovoLead(nome, email, mensagem);

        // 3. ENVIO EMAIL
        await emailService.enviarNotificacao(nome, email, mensagem);

        return NextResponse.json({ success: true, message: "Recebido com sucesso!" });

    } catch (error: any) {
        console.error("API Error:", error.message);
        return NextResponse.json({ error: error.message || "Erro interno." }, { status: 500 });
    }
}