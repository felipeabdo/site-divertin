import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

const UPLOAD_COOKIE = 'divertin_contact_upload';
const UPLOAD_SESSION_SECONDS = 15 * 60;

type UploadSessionPayload = {
  exp: number;
  nonce: string;
};

function sessionSecret(): string {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('A proteção do formulário ainda não está configurada no servidor.');
  }
  return secret;
}

function signature(value: string): string {
  return createHmac('sha256', sessionSecret()).update(value).digest('base64url');
}

export function createContactUploadSession(): { value: string; maxAge: number } {
  const payload: UploadSessionPayload = {
    exp: Math.floor(Date.now() / 1000) + UPLOAD_SESSION_SECONDS,
    nonce: randomBytes(18).toString('base64url'),
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return { value: `${encoded}.${signature(encoded)}`, maxAge: UPLOAD_SESSION_SECONDS };
}

function readCookie(request: Request, name: string): string | null {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;

  for (const part of cookieHeader.split(';')) {
    const [cookieName, ...valueParts] = part.trim().split('=');
    if (cookieName === name) return valueParts.join('=') || null;
  }
  return null;
}

export function hasValidContactUploadSession(request: Request): boolean {
  const token = readCookie(request, UPLOAD_COOKIE);
  if (!token) return false;

  const [encoded, suppliedSignature, extra] = token.split('.');
  if (!encoded || !suppliedSignature || extra) return false;

  try {
    const expected = Buffer.from(signature(encoded));
    const actual = Buffer.from(suppliedSignature);
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return false;

    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as UploadSessionPayload;
    return Number.isFinite(payload.exp)
      && payload.exp >= Math.floor(Date.now() / 1000)
      && typeof payload.nonce === 'string'
      && payload.nonce.length >= 16;
  } catch {
    return false;
  }
}

export function contactUploadCookieName(): string {
  return UPLOAD_COOKIE;
}

export function hasSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (origin) {
    try {
      return new URL(origin).origin === new URL(request.url).origin;
    } catch {
      return false;
    }
  }

  const referer = request.headers.get('referer');
  if (!referer) return false;
  try {
    return new URL(referer).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

function clientAddress(request: Request): string {
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return 'local-development';
}

/**
 * Reserves the declared size of an attachment against a per-IP upload batch.
 * The signed Blob token is capped to this same size, so a client cannot reserve
 * 1 byte and then upload a larger file. The Lua script makes the batch budget
 * atomic when several files are authorized close together.
 */
export async function reserveContactUploadBytes(
  request: Request,
  batchId: string,
  declaredSize: number,
  maxTotalBytes: number,
  windowSeconds = 60 * 60,
): Promise<boolean> {
  const url = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, '');
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    if (process.env.NODE_ENV !== 'production') return true;
    throw new Error('O controle de segurança do formulário não está disponível.');
  }

  if (!Number.isSafeInteger(declaredSize) || declaredSize <= 0 || declaredSize > maxTotalBytes) {
    return false;
  }

  const addressHash = createHash('sha256')
    .update(`${sessionSecret()}:${clientAddress(request)}`)
    .digest('hex');
  const key = `divertin:contact:upload-bytes:${addressHash}:${batchId}`;
  const script = [
    "local amount = tonumber(ARGV[1])",
    "local limit = tonumber(ARGV[2])",
    "local ttl = tonumber(ARGV[3])",
    "local total = redis.call('INCRBY', KEYS[1], amount)",
    "if total == amount then redis.call('EXPIRE', KEYS[1], ttl) end",
    "if total > limit then redis.call('DECRBY', KEYS[1], amount); return -1 end",
    "return total",
  ].join('; ');

  const response = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([['EVAL', script, '1', key, String(declaredSize), String(maxTotalBytes), String(windowSeconds)]]),
    cache: 'no-store',
  });

  if (!response.ok) throw new Error('Não foi possível validar o tamanho dos anexos.');
  const result = await response.json() as Array<{ result?: number | string; error?: string }>;
  if (result[0]?.error) throw new Error('Não foi possível validar o tamanho dos anexos.');
  return Number(result[0]?.result) >= 0;
}
