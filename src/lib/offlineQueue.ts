import { upload } from '@vercel/blob/client';
import { contactAttachmentMimeType, MAX_ATTACHMENTS, MAX_TOTAL_ATTACHMENT_SIZE } from '@/lib/contactFileTypes';

export type ContactPayload = {
  nome: string;
  email: string;
  telefone: string;
  assunto: string;
  mensagem: string;
  /** New multi-file field. */
  arquivos?: File[];
  /** Legacy field retained so forms already queued in IndexedDB remain sendable. */
  curriculo?: File | null;
  website?: string;
  formStartedAt?: number;
};

export type QueuedContact = {
  id: string;
  sessionId: string;
  createdAt: number;
  payload: ContactPayload;
};

const DB_NAME = 'divertin-offline';
const DB_VERSION = 1;
const STORE_NAME = 'pending-contact';

function openQueueDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('Este navegador não permite guardar formulários offline.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Não foi possível abrir a fila offline.'));
  });
}

export function getTabSessionId(): string {
  const key = 'divertin-offline-session';

  try {
    const existing = window.sessionStorage.getItem(key);
    if (existing) return existing;

    const created = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    window.sessionStorage.setItem(key, created);
    return created;
  } catch {
    return `session-${Date.now()}`;
  }
}

export async function saveQueuedContact(item: QueuedContact): Promise<void> {
  const database = await openQueueDatabase();

  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).put(item);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('Não foi possível guardar o formulário.'));
    transaction.onabort = () => reject(transaction.error ?? new Error('O armazenamento do formulário foi interrompido.'));
  });

  database.close();
}

export async function loadQueuedContacts(sessionId: string): Promise<QueuedContact[]> {
  const database = await openQueueDatabase();

  const items = await new Promise<QueuedContact[]>((resolve, reject) => {
    const request = database.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve((request.result as QueuedContact[]).filter((item) => item.sessionId === sessionId));
    request.onerror = () => reject(request.error ?? new Error('Não foi possível recuperar os formulários pendentes.'));
  });

  database.close();
  return items.sort((a, b) => a.createdAt - b.createdAt);
}

export async function removeQueuedContact(id: string): Promise<void> {
  const database = await openQueueDatabase();

  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).delete(id);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('Não foi possível atualizar a fila offline.'));
  });

  database.close();
}

function filesFromPayload(payload: ContactPayload): File[] {
  if (Array.isArray(payload.arquivos)) return payload.arquivos.filter((file): file is File => file instanceof File);
  return payload.curriculo instanceof File ? [payload.curriculo] : [];
}

function safeUploadFilename(filename: string): string {
  return filename.normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\\/]/g, '_')
    .replace(/[^A-Za-z0-9._-]/g, '_')
    .slice(0, 100) || 'anexo';
}

function fileMimeType(file: File): string {
  const mimeType = contactAttachmentMimeType(file.name);
  if (!mimeType) {
    throw new Error(`O arquivo \"${file.name}\" não pode ser enviado por e-mail. Formatos executáveis ou bloqueados pelo Titan não são aceitos.`);
  }
  return mimeType;
}

async function uploadContactAttachments(files: File[]): Promise<Array<{ pathname: string; name: string; size: number; type: string }>> {
  if (files.length === 0) return [];

  if (files.length > MAX_ATTACHMENTS) {
    throw new Error(`É possível anexar até ${MAX_ATTACHMENTS} arquivos por mensagem.`);
  }

  const totalSize = files.reduce((total, file) => total + file.size, 0);
  if (totalSize > MAX_TOTAL_ATTACHMENT_SIZE) {
    throw new Error('A soma dos anexos ultrapassa o limite de 17 MB. Remova algum arquivo para continuar.');
  }

  for (const file of files) {
    fileMimeType(file);
    if (file.size <= 0 || file.size > MAX_TOTAL_ATTACHMENT_SIZE) {
      throw new Error(`O arquivo "${file.name}" está vazio ou ultrapassa o limite permitido.`);
    }
  }

  const sessionResponse = await fetch('/api/contato/upload-session', {
    method: 'GET',
    cache: 'no-store',
  });
  const sessionData = await sessionResponse.json().catch(() => ({})) as { message?: string };
  if (!sessionResponse.ok) {
    throw new Error(sessionData.message || 'Não foi possível preparar o envio dos anexos. Atualize a página e tente novamente.');
  }

  const makeBatchId = () => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
      const random = Math.floor(Math.random() * 16);
      return (char === 'x' ? random : (random & 0x3) | 0x8).toString(16);
    });
  };
  const batchId = makeBatchId();

  const uploaded: Array<{ pathname: string; name: string; size: number; type: string }> = [];
  for (const file of files) {
    const pathname = `contact-attachments/${batchId}/${safeUploadFilename(file.name)}`;
    const mimeType = fileMimeType(file);
    const blob = await upload(pathname, file, {
      access: 'private',
      handleUploadUrl: '/api/contato/upload',
      contentType: mimeType,
      multipart: file.size > 5 * 1024 * 1024,
      clientPayload: JSON.stringify({ batchId, size: file.size }),
    });
    uploaded.push({
      pathname: blob.pathname,
      name: file.name,
      size: file.size,
      type: mimeType,
    });
  }

  return uploaded;
}

export async function submitContactPayload(payload: ContactPayload): Promise<string> {
  const files = filesFromPayload(payload);
  const attachments = await uploadContactAttachments(files);

  const response = await fetch('/api/contato', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome: payload.nome,
      email: payload.email,
      telefone: payload.telefone,
      assunto: payload.assunto,
      mensagem: payload.mensagem,
      website: payload.website || '',
      formStartedAt: payload.formStartedAt || 0,
      attachments,
    }),
    cache: 'no-store',
  });

  const data = await response.json().catch(() => ({})) as { message?: string };

  if (!response.ok) {
    throw new Error(data.message || 'Não foi possível enviar a mensagem.');
  }

  return data.message || 'Mensagem enviada com sucesso.';
}
