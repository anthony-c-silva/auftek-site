import { NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';
import nodemailer from 'nodemailer';

const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const MAX_REQUESTS = 3;
const ipRequestMap = new Map<string, { count: number; firstRequestTime: number }>();

class SimpleRateLimiter {
    static check(ip: string): boolean {
        const now = Date.now();
        const record = ipRequestMap.get(ip);

        if (!record) {
            ipRequestMap.set(ip, { count: 1, firstRequestTime: now });
            return true;
        }

        if (now - record.firstRequestTime > RATE_LIMIT_WINDOW) {
            ipRequestMap.set(ip, { count: 1, firstRequestTime: now });
            return true;
        }

        if (record.count >= MAX_REQUESTS) {
            return false;
        }

        record.count++;
        return true;
    }
}

class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async enviarNotificacao(nome: string, email: string, mensagem: string, telefone: string, nome_empresa: string) {
        try {
            await this.transporter.sendMail({
                from: `"Site Lead" <${process.env.SMTP_USER}>`,
                to: process.env.SMTP_TO,
                subject: `🚀 Novo Lead: ${nome_empresa} - ${nome}`,
                html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
            <h2 style="color: #0e223b;">Novo Contato pelo Site</h2>
            <p><strong>Empresa:</strong> ${nome_empresa}</p>
            <p><strong>Contato:</strong> ${nome}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Telefone:</strong> ${telefone}</p>
            <p><strong>Mensagem:</strong></p>
            <blockquote style="background: #f5f5f5; padding: 10px; border-left: 4px solid #0e223b;">${mensagem}</blockquote>
            <p style="font-size: 12px; color: #888; margin-top: 20px;">Enviado via Gmail SMTP</p>
          </div>
        `
            });
            console.log(`[EMAIL] Enviado para ${process.env.SMTP_TO}`);
        } catch (error) {
            console.error(`[EMAIL] Erro:`, error);
        }
    }
}

class OmieClient {
    private api;
    private appKey = process.env.OMIE_APP_KEY;
    private appSecret = process.env.OMIE_APP_SECRET;

    constructor() {
        // CORREÇÃO CRÍTICA: Configuração do Agente HTTPS
        // O erro "Broken Response" ocorre pq o Node tenta manter a conexão viva e o Omie corta.
        const httpsAgent = new https.Agent({
            keepAlive: false, // Desabilita keepAlive para evitar timeout fantasma
            rejectUnauthorized: false, // Evita erros de SSL em alguns ambientes
            family: 4 // Força IPv4
        });

        this.api = axios.create({
            baseURL: 'https://app.omie.com.br/api/v1',
            timeout: 60000, // Aumentei para 60s pois o Omie é lento
            httpsAgent: httpsAgent,
            headers: {
                'Content-Type': 'application/json',
                'Connection': 'close', // Força fechamento a cada request
                'User-Agent': 'Auftek-Site/1.0'
            }
        });
    }

    async post(endpoint: string, call: string, param: any) {
        // Pequeno delay para não floodar a API do Omie na sequência
        await new Promise(r => setTimeout(r, 500));

        const payload = { call, app_key: this.appKey, app_secret: this.appSecret, param };

        try {
            console.log(`[OMIE] Chamando ${call}...`);
            const { data } = await this.api.post(endpoint, payload);

            if (data.faultstring) {
                console.error(`[OMIE ERRO LOGICO] ${call}:`, data.faultstring);
                throw new Error(data.faultstring);
            }
            return data;
        } catch (err: any) {
            // Log detalhado para debug
            const msg = err.response?.data?.faultstring || err.message;
            console.error(`[OMIE CRASH] Falha ao chamar ${call}:`, msg);

            // Se for o erro "Broken Response", tentamos mais uma vez após 2s
            if (msg.includes("Broken response") || msg.includes("ECONNRESET")) {
                console.log(`[OMIE RETRY] Tentando novamente ${call} em 2s...`);
                await new Promise(r => setTimeout(r, 2000));
                // Retry simples manual (cuidado com recursão infinita aqui, fiz só 1 nível)
                try {
                    const retry = await this.api.post(endpoint, payload);
                    return retry.data;
                } catch (retryErr: any) {
                    throw new Error("OMIE_SERVER_ERROR: " + (retryErr.response?.data?.faultstring || retryErr.message));
                }
            }

            throw new Error(msg);
        }
    }
}

class LeadService {
    constructor(private client: OmieClient) {}

    private gerarIdUnico(prefixo: string) {
        const random = Math.floor(Math.random() * 1000000).toString(36);
        return `${prefixo}-${Date.now()}-${random}`.toUpperCase();
    }

    private limparString(str: string) {
        // Remove emojis e caracteres que quebram o SOAP do Omie
        return (str || "").replace(/[^\w\s\-\.\@\(\)áàãâéêíóõôúçÁÀÃÂÉÊÍÓÕÔÚÇ]/gi, "").trim();
    }

    async verificarDuplicidade(email: string) {
        try {
            const check = await this.client.post("/crm/contas/", "VerificarConta", [{ contaVerificarRequest: { cEmail: email } }]);
            if (check.nCod > 0) return true;
        } catch (e) {}
        const contato = await this.buscarContato(email);
        return !!contato;
    }

    async processarNovoLead(nome: string, email: string, mensagem: string, telefone: string, nome_empresa: string) {
        // Sanitização básica
        const empresaSafe = this.limparString(nome_empresa) || "Empresa Sem Nome";
        const nomeSafe = this.limparString(nome) || "Contato Site";

        console.log(`[PROCESS] Iniciando lead para empresa: ${empresaSafe}`);

        // 1. Criar Conta
        const contaId = await this.criarContaComRetry(empresaSafe, email);
        console.log(`[PROCESS] Conta criada ID: ${contaId}`);

        // 2. Criar Contato
        const contatoId = await this.criarContatoComRetry(contaId, nomeSafe, email);
        console.log(`[PROCESS] Contato criado ID: ${contatoId}`);

        const [solucaoId, origemId] = await Promise.all([this.buscarIdSolucao(), this.buscarIdOrigem()]);

        // 3. Criar Oportunidade
        const opId = await this.criarOportunidadeComRetry(contaId, contatoId, nomeSafe, email, mensagem, telefone, solucaoId, origemId);
        console.log(`[PROCESS] Oportunidade criada ID: ${opId}`);

        return opId;
    }

    async criarContaComRetry(nome_empresa: string, email: string, tentativa = 1): Promise<number> {
        const nomeFinal = tentativa > 1 ? `${nome_empresa} (${Date.now()})` : nome_empresa;

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
            if (((error.message || "").includes("cNome") || (error.message || "").includes("já existe")) && tentativa < 3) {
                return this.criarContaComRetry(nome_empresa, email, tentativa + 1);
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
            if ((error.message || "").includes("já existe") && tentativa <= 3) return this.criarContatoComRetry(contaId, nome, email, tentativa + 1);
            throw error;
        }
    }

    async criarOportunidadeComRetry(contaId: any, contatoId: any, nome: string, email: string, mensagem: string, telefone: string, solucaoId: any, origemId: any, tentativa = 1): Promise<number> {
        const idUnicoOp = this.gerarIdUnico("OP");
        const agora = new Date();
        const dataStr = `${agora.getDate()}/${agora.getMonth()+1} ${agora.getHours()}:${agora.getMinutes()}`;
        const tituloUnico = `Lead Site: ${nome} - ${dataStr}`;

        const observacoesTexto = `Email: ${email}\nTelefone: ${telefone}\n\nMensagem:\n${mensagem}`;
        const payload = {
            identificacao: {
                cCodIntOp: idUnicoOp,
                cDesOp: tituloUnico,
                nCodConta: Number(contaId),
                nCodContato: Number(contatoId),
                nCodSolucao: Number(solucaoId),
                nCodOrigem: Number(origemId)
            },
            observacoes: { cObs: observacoesTexto }
        };
        try {
            const res = await this.client.post("/crm/oportunidades/", "IncluirOportunidade", [payload]);
            return res.nCodOp;
        } catch (error: any) {
            if ((error.message || "").includes("duplicad") && tentativa <= 3) {
                await new Promise(r => setTimeout(r, 1000));
                return this.criarOportunidadeComRetry(contaId, contatoId, nome, email, mensagem, telefone, solucaoId, origemId, tentativa + 1);
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
        try {
            const data = await this.client.post("/crm/solucoes/", "ListarSolucoes", [{ pagina: 1, registros_por_pagina: 10 }]);
            const solucao = data.cadastros?.find((s: any) => s.cInativo === "N");
            return solucao?.nCodigo || 0;
        } catch(e) { return 0; }
    }

    async buscarIdOrigem() {
        try {
            const data = await this.client.post("/crm/origens/", "ListarOrigens", [{ pagina: 1, registros_por_pagina: 1 }]);
            return data.cadastros?.[0]?.nCodigo || 0;
        } catch(e) { return 0; }
    }
}

export async function POST(request: Request) {
    try {
        const ip = request.headers.get("x-forwarded-for")?.split(',')[0] || "unknown";

        if (!SimpleRateLimiter.check(ip)) {
            console.warn(`[RATE LIMIT] Bloqueado IP: ${ip}`);
            return NextResponse.json(
                { error: "Muitas requisições. Tente novamente em 15 minutos." },
                { status: 429 }
            );
        }

        const { nome, email, mensagem, telefone, nome_empresa } = await request.json();

        // Validação estrita
        if (!nome || !email || !nome_empresa) {
            return NextResponse.json({ error: "Campos obrigatórios faltando (Nome, Email ou Empresa)." }, { status: 400 });
        }

        const omie = new OmieClient();
        const leadService = new LeadService(omie);
        const emailService = new EmailService();

        // Verifica duplicidade antes de tentar criar para poupar a API
        const emailDuplicado = await leadService.verificarDuplicidade(email);

        if (emailDuplicado) {
            return NextResponse.json({
                success: false,
                error: "DUPLICATE_EMAIL",
                message: "E-mail duplicado."
            }, { status: 409 });
        }

        await leadService.processarNovoLead(nome, email, mensagem, telefone, nome_empresa);
        await emailService.enviarNotificacao(nome, email, mensagem, telefone, nome_empresa);

        return NextResponse.json({ success: true, message: "Recebido com sucesso!" });

    } catch (error: any) {
        console.error("API Error CRITICAL:", error.message);
        return NextResponse.json({ error: error.message || "Erro interno na comunicação com Omie." }, { status: 500 });
    }
}