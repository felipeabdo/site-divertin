import { setTtl } from '@vercel/blob';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { hasSameOrigin, hasValidContactUploadSession, reserveContactUploadBytes } from '@/lib/contactSecurity';
import { CONTACT_ATTACHMENT_MIME_TYPES, contactAttachmentMimeType, MAX_TOTAL_ATTACHMENT_SIZE } from '@/lib/contactFileTypes';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = MAX_TOTAL_ATTACHMENT_SIZE;
const ALLOWED_CONTENT_TYPES = [...new Set([...Object.values(CONTACT_ATTACHMENT_MIME_TYPES), 'application/octet-stream'])];

function isAllowedPath(pathname: string, batchId: string): boolean {
  const match = /^contact-attachments\/([0-9a-f-]{36})\/([A-Za-z0-9._-]{1,120})$/i.exec(pathname);
  if (!match || match[1] !== batchId) return false;
  return Boolean(contactAttachmentMimeType(match[2]));
}

export async function POST(request: Request) {
  let body: HandleUploadBody;
  try {
    body = await request.json() as HandleUploadBody;
  } catch {
    return NextResponse.json({ message: 'Solicitação de upload inválida.' }, { status: 400 });
  }

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!hasSameOrigin(request) || !hasValidContactUploadSession(request)) {
          throw new Error('Sessão de upload inválida. Atualize a página e tente novamente.');
        }

        const payload = JSON.parse(clientPayload || '{}') as { batchId?: string; size?: number };
        const batchId = payload.batchId || '';
        const declaredSize = Number(payload.size);
        if (!/^[0-9a-f-]{36}$/i.test(batchId) || !isAllowedPath(pathname, batchId) || !Number.isSafeInteger(declaredSize) || declaredSize <= 0 || declaredSize > MAX_FILE_SIZE) {
          throw new Error('Arquivo não permitido.');
        }

        // Não há limite de uploads por hora/conexão. O tamanho total do lote
        // continua limitado a 17 MiB por segurança e compatibilidade com e-mail.

        const withinBatchSize = await reserveContactUploadBytes(request, batchId, declaredSize, MAX_FILE_SIZE, 60 * 60);
        if (!withinBatchSize) throw new Error('A soma dos anexos ultrapassa o limite de 17 MB.');

        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          maximumSizeInBytes: declaredSize,
          addRandomSuffix: true,
          validUntil: Date.now() + 15 * 60 * 1000,
          tokenPayload: JSON.stringify({ batchId }),
        };
      },
      onUploadCompleted: async ({ blob }) => {
        // Protege contra anexos abandonados quando a pessoa fecha a página antes do envio.
        await setTtl(blob.pathname, { ttlDays: 1 });
      },
    });

    return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Não foi possível autorizar o anexo.';
    return NextResponse.json({ message }, { status: 400 });
  }
}
