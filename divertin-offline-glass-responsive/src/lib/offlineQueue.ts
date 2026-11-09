export type ContactPayload = {
  nome: string;
  email: string;
  telefone: string;
  assunto: string;
  mensagem: string;
  curriculo: File | null;
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
      reject(new Error('Este navegador não oferece armazenamento offline.'));
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

export function contactPayloadToFormData(payload: ContactPayload): FormData {
  const formData = new FormData();
  formData.append('nome', payload.nome);
  formData.append('email', payload.email);
  formData.append('telefone', payload.telefone);
  formData.append('assunto', payload.assunto);
  formData.append('mensagem', payload.mensagem);

  if (payload.curriculo) {
    formData.append('curriculo', payload.curriculo, payload.curriculo.name);
  }

  return formData;
}

export async function submitContactPayload(payload: ContactPayload): Promise<string> {
  const response = await fetch('/api/contato', {
    method: 'POST',
    body: contactPayloadToFormData(payload),
    cache: 'no-store',
  });

  const data = await response.json().catch(() => ({})) as { message?: string };

  if (!response.ok) {
    throw new Error(data.message || 'Não foi possível enviar a mensagem.');
  }

  return data.message || 'Mensagem enviada com sucesso.';
}
