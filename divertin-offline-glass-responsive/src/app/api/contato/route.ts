import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function readTextField(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === 'string' ? value.trim() : '';
}

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { message: 'Não foi possível ler os dados enviados. Tente novamente.' },
      { status: 400 },
    );
  }

  const nome = readTextField(formData, 'nome');
  const email = readTextField(formData, 'email');
  const telefone = readTextField(formData, 'telefone');
  const assunto = readTextField(formData, 'assunto');
  const mensagem = readTextField(formData, 'mensagem');
  const fileValue = formData.get('curriculo');
  const arquivo = typeof File !== 'undefined' && fileValue instanceof File && fileValue.size > 0
    ? fileValue
    : null;

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

  if (arquivo) {
    const extension = arquivo.name.split('.').pop()?.toLowerCase();
    if (!extension || !['pdf', 'doc', 'docx'].includes(extension)) {
      return NextResponse.json(
        { message: 'Anexe um arquivo PDF, DOC ou DOCX.' },
        { status: 400 },
      );
    }

    if (arquivo.size > 8 * 1024 * 1024) {
      return NextResponse.json(
        { message: 'O arquivo deve ter no máximo 8 MB.' },
        { status: 400 },
      );
    }
  }

  // O endpoint original ainda não tem um provedor de e-mail configurado.
  // Mantemos a resposta explícita para que o cliente não marque o envio como concluído.
  void telefone;
  void assunto;
  void arquivo;

  return NextResponse.json(
    {
      message: 'Seus dados foram validados, mas o envio por e-mail ainda não está configurado no servidor. Nenhuma mensagem foi enviada.',
    },
    { status: 501 },
  );
}
