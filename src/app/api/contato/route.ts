import { NextResponse } from 'next/server';
import { CONTATO } from '@/data/contatoData';

export const runtime = 'nodejs';


function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


function readTextField(body: Record<string, unknown>, field: string): string {
  const value = body[field];
  return value == null ? '' : String(value).trim();
}


export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { message: 'O corpo da solicitação precisa ser um JSON válido.' },
      { status: 400 },
    );
  }

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return NextResponse.json(
      { message: 'Envie os dados do formulário em um objeto JSON.' },
      { status: 400 },
    );
  }

  try {
    const body = payload as Record<string, unknown>;
    const nome = readTextField(body, 'nome');
    const email = readTextField(body, 'email');
    const telefone = readTextField(body, 'telefone');
    const assunto = readTextField(body, 'assunto');
    const mensagem = readTextField(body, 'mensagem');

    if (!nome || !email || !mensagem) {
      return NextResponse.json(
        { message: 'Preencha nome, e-mail e mensagem.' },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: 'Digite um e-mail válido.' },
        { status: 400 },
      );
    }

    
    
    
    void telefone;
    void assunto;
    void CONTATO.email;

    return NextResponse.json(
      {
        message:
          'O formulário está pronto. Falta apenas conectar o provedor de e-mail para concluir o envio automático.',
      },
      { status: 501 },
    );
  } catch {
    return NextResponse.json(
      { message: 'Não foi possível processar sua mensagem.' },
      { status: 500 },
    );
  }
}
