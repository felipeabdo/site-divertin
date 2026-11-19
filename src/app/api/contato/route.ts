import { del, get, head } from '@vercel/blob';
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import { hasSameOrigin } from '@/lib/contactSecurity';
import { contactAttachmentMimeType, MAX_ATTACHMENTS, MAX_TOTAL_ATTACHMENT_SIZE } from '@/lib/contactFileTypes';

export const runtime = 'nodejs';
export const maxDuration = 60;


type SubmittedAttachment = {
  pathname: string;
  name: string;
  size: number;
  type: string;
};

type ContactRequestBody = {
  nome?: unknown;
  email?: unknown;
  telefone?: unknown;
  assunto?: unknown;
  mensagem?: unknown;
  website?: unknown;
  formStartedAt?: unknown;
  attachments?: unknown;
};

type MailAttachment = {
  filename: string;
  content: Buffer;
  contentType: string;
};

function textValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function isValidEmail(email: string): boolean {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeFilename(value: string): string {
  const normalized = value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  return normalized
    .replace(/[\\/]/g, '_')
    .replace(/[^A-Za-z0-9._ -]/g, '_')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120) || 'anexo';
}

function expectedMimeType(filename: string): string | null {
  return contactAttachmentMimeType(filename);
}

function isValidAttachmentPath(pathname: string): boolean {
  return /^contact-attachments\/[0-9a-f-]{36}\/[A-Za-z0-9._-]{1,140}$/i.test(pathname);
}

function hasExpectedFileSignature(buffer: Buffer, extension: string): boolean {
  if (extension === 'pdf') {
    return buffer.subarray(0, 1024).includes(Buffer.from('%PDF-'));
  }
  if (extension === 'doc') {
    return buffer.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]));
  }
  if (extension === 'docx') {
    return buffer.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04]));
  }
  // Other accepted formats (audio, video, spreadsheets, text, images and archives)
  // are treated as opaque attachments. They are never executed by the server.
  return true;
}

function getMailer() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || '465');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.CONTACT_FROM || user;
  // Accept comma-, semicolon- or line-break-separated recipients. Passing an
  // explicit array avoids depending on address-string parsing in the mailer.
  const recipients = [...new Set(
    (process.env.CONTACT_TO || '')
      .split(/[,;\r\n]+/)
      .map((address) => address.trim())
      .filter(Boolean)
      .map((address) => address.toLowerCase()),
  )];

  if (!host || !Number.isInteger(port) || port < 1 || port > 65535 || !user || !pass || !from || recipients.length === 0) {
    throw new Error('O serviço de e-mail ainda não foi configurado por completo.');
  }
  if (recipients.some((address) => !isValidEmail(address))) {
    throw new Error('A lista de destinatários do formulário contém um endereço inválido.');
  }

  return {
    transporter: nodemailer.createTransport({
      host,
      port,
      secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE.toLowerCase() === 'true' : port === 465,
      auth: { user, pass },
      connectionTimeout: 15_000,
      greetingTimeout: 10_000,
      socketTimeout: 25_000,
      tls: { minVersion: 'TLSv1.2' },
    }),
    from,
    recipients,
  };
}

async function loadPrivateAttachments(items: SubmittedAttachment[]): Promise<MailAttachment[]> {
  const output: MailAttachment[] = [];
  let totalSize = 0;

  for (const item of items) {
    if (!item || typeof item.pathname !== 'string' || !isValidAttachmentPath(item.pathname)) {
      throw new Error('Um dos anexos não é válido. Selecione os arquivos novamente.');
    }

    const filename = safeFilename(textValue(item.name));
    const expectedType = expectedMimeType(filename);
    if (!expectedType) {
      throw new Error('Um dos anexos possui um formato não permitido ou bloqueado pelo Titan.');
    }

    const metadata = await head(item.pathname);
    if (metadata.pathname !== item.pathname || metadata.size <= 0 || metadata.size > MAX_TOTAL_ATTACHMENT_SIZE) {
      throw new Error('Um dos anexos possui tamanho inválido. Selecione os arquivos novamente.');
    }
    if (metadata.contentType !== expectedType) {
      throw new Error('O tipo de um dos anexos não corresponde à extensão do arquivo.');
    }

    totalSize += metadata.size;
    if (totalSize > MAX_TOTAL_ATTACHMENT_SIZE) {
      throw new Error('A soma dos anexos ultrapassa o limite de 17 MB.');
    }

    const result = await get(item.pathname, { access: 'private' });
    if (!result || result.statusCode !== 200 || !result.stream) {
      throw new Error('Não foi possível recuperar um dos anexos. Selecione os arquivos novamente.');
    }

    const buffer = Buffer.from(await new Response(result.stream).arrayBuffer());
    const extension = filename.split('.').pop()?.toLowerCase() || '';
    if (buffer.length !== metadata.size || !hasExpectedFileSignature(buffer, extension)) {
      throw new Error('O conteúdo de um dos arquivos não corresponde ao formato informado.');
    }

    output.push({ filename, content: buffer, contentType: expectedType });
  }

  return output;
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ message: 'Não foi possível validar a origem do envio. Atualize a página e tente novamente.' }, { status: 403 });
  }

  let body: ContactRequestBody;
  try {
    body = await request.json() as ContactRequestBody;
  } catch {
    return NextResponse.json({ message: 'Não foi possível ler os dados enviados. Tente novamente.' }, { status: 400 });
  }

  const nome = textValue(body.nome);
  const email = textValue(body.email);
  const telefone = textValue(body.telefone);
  const assunto = textValue(body.assunto);
  const mensagem = textValue(body.mensagem);
  const website = textValue(body.website);
  const formStartedAt = Number(body.formStartedAt);
  const submittedAttachments = Array.isArray(body.attachments)
    ? body.attachments as SubmittedAttachment[]
    : [];

  if (website) {
    return NextResponse.json({ message: 'Não foi possível processar o formulário.' }, { status: 400 });
  }

  if (!nome || !email || !mensagem) {
    return NextResponse.json({ message: 'Preencha nome, e-mail e mensagem.' }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ message: 'Digite um e-mail válido.' }, { status: 400 });
  }
  if (nome.length > 120 || email.length > 254 || telefone.length > 50 || assunto.length > 160 || mensagem.length > 10_000) {
    return NextResponse.json({ message: 'Algum campo ultrapassou o tamanho permitido. Revise os dados.' }, { status: 400 });
  }
  if (Number.isFinite(formStartedAt) && formStartedAt > 0 && Date.now() - formStartedAt < 1_500) {
    return NextResponse.json({ message: 'Aguarde um instante e tente enviar novamente.' }, { status: 400 });
  }
  if (submittedAttachments.length > MAX_ATTACHMENTS) {
    return NextResponse.json({ message: `É possível anexar até ${MAX_ATTACHMENTS} arquivos por mensagem.` }, { status: 400 });
  }

  // Não aplicamos limite de quantidade de mensagens por IP/conexão.
  // A proteção contra abuso continua com validação de origem, honeypot,
  // tempo mínimo de preenchimento, validação dos campos e arquivos.

  const pathsToDelete = [...new Set(
    submittedAttachments
      .map((item) => item?.pathname)
      .filter((pathname): pathname is string => typeof pathname === 'string' && isValidAttachmentPath(pathname)),
  )];

  try {
    const attachments = await loadPrivateAttachments(submittedAttachments);
    const { transporter, from, recipients } = getMailer();
    const safeNome = nome.replace(/[\r\n]+/g, ' ');
    const safeAssunto = assunto.replace(/[\r\n]+/g, ' ').slice(0, 160);
    const subject = `[Contato site] ${safeAssunto || 'Nova mensagem'} — ${safeNome}`;
    const text = [
      'Nova mensagem recebida pelo site da Clínica Divertin.',
      '',
      `Nome: ${nome}`,
      `E-mail: ${email}`,
      `Telefone / WhatsApp: ${telefone || 'Não informado'}`,
      `Assunto: ${assunto || 'Não informado'}`,
      '',
      'Mensagem:',
      mensagem,
      '',
      `Anexos: ${attachments.length}`,
    ].join('\n');
    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;color:#463D49;line-height:1.6">
        <h2 style="color:#A84A15">Nova mensagem pelo site da Clínica Divertin</h2>
        <p><strong>Nome:</strong> ${escapeHtml(nome)}</p>
        <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
        <p><strong>Telefone / WhatsApp:</strong> ${escapeHtml(telefone || 'Não informado')}</p>
        <p><strong>Assunto:</strong> ${escapeHtml(assunto || 'Não informado')}</p>
        <hr style="border:0;border-top:1px solid #eee" />
        <p><strong>Mensagem:</strong></p>
        <p>${escapeHtml(mensagem).replace(/\r?\n/g, '<br />')}</p>
        <p><strong>Anexos:</strong> ${attachments.length}</p>
      </div>
    `;

    const mailInfo = await transporter.sendMail({
      from: { name: 'Clínica Divertin — Site', address: from },
      to: recipients,
      replyTo: { name: safeNome, address: email },
      subject,
      text,
      html,
      attachments,
    });

    // Nodemailer resolves sendMail when at least one recipient is accepted.
    // Do not tell the visitor that the whole contact was delivered unless every
    // configured mailbox was accepted by the SMTP server.
    const accepted = new Set(mailInfo.accepted.map((address) => String(address).toLowerCase()));
    const notAccepted = recipients.filter((address) => !accepted.has(address));
    if (notAccepted.length > 0 || mailInfo.rejected.length > 0) {
      console.error('[contato] O servidor SMTP não aceitou todos os destinatários:', {
        accepted: mailInfo.accepted,
        rejected: mailInfo.rejected,
        notAccepted,
        response: mailInfo.response,
      });
      return NextResponse.json(
        { message: 'O servidor de e-mail não confirmou o recebimento por todas as caixas da secretaria. Uma delas pode já ter recebido a mensagem; confira antes de reenviar.' },
        { status: 502, headers: { 'Cache-Control': 'no-store' } },
      );
    }

    console.info('[contato] SMTP aceitou todos os destinatários configurados:', {
      accepted: mailInfo.accepted,
      messageId: mailInfo.messageId,
      response: mailInfo.response,
    });

    return NextResponse.json(
      { message: 'Mensagem enviada com sucesso! A secretaria da Clínica Divertin recebeu seus dados.' },
      { status: 200, headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    // Log SMTP diagnostics without logging credentials or the visitor's message.
    const details = error && typeof error === 'object'
      ? error as { name?: unknown; code?: unknown; response?: unknown; rejected?: unknown; rejectedErrors?: unknown }
      : null;
    console.error('[contato] Falha no processamento do formulário:', {
      name: details?.name,
      code: details?.code,
      response: details?.response,
      rejected: details?.rejected,
      rejectedErrors: details?.rejectedErrors,
    });
    return NextResponse.json(
      { message: error instanceof Error && /anexo|arquivo|17 MB|formato|Titan/i.test(error.message)
        ? error.message
        : 'Não foi possível enviar sua mensagem agora. Seus dados continuam preenchidos; tente novamente em instantes.' },
      { status: 502, headers: { 'Cache-Control': 'no-store' } },
    );
  } finally {
    if (pathsToDelete.length > 0) {
      await del(pathsToDelete).catch((error: unknown) => {
        console.error('[contato] Não foi possível remover anexos temporários:', error instanceof Error ? error.name : 'erro desconhecido');
      });
    }
  }
}
