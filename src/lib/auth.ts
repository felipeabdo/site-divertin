import { createHmac, randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import type { NextRequest, NextResponse } from 'next/server';

export type UserRole = 'admin' | 'user';
export type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
};
type StoredUser = PublicUser & { passwordHash: string; updatedAt: string };
export type SiteTheme = 'padrao' | 'natal';
export type SiteSettings = {
  theme: SiteTheme;
  announcement: { enabled: boolean; title: string; message: string };
};

const COOKIE_NAME = 'divertin_session';
const SESSION_SECONDS = 60 * 60 * 24 * 7;
const USERS_SET_KEY = 'divertin:auth:users:v1';
const SETTINGS_KEY = 'divertin:site:settings:v1';
const DEFAULT_ADMIN_EMAIL = 'jehdelcorso@gmail.com';
const DEFAULT_SETTINGS: SiteSettings = {
  theme: 'padrao',
  announcement: { enabled: false, title: '', message: '' },
};

export class AuthError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
    this.name = 'AuthError';
  }
}

function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, '');
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new AuthError('O armazenamento do login ainda não foi configurado. Configure UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN.', 503);
  return { url, token };
}

export function isAuthConfigured() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN && (process.env.AUTH_SESSION_SECRET?.length ?? 0) >= 32 && (process.env.DIVERTIN_ADMIN_PASSWORD?.length ?? 0) >= 10);
}

async function redisCommand<T = unknown>(...command: Array<string | number>): Promise<T> {
  const redis = redisConfig();
  const response = await fetch(`${redis.url}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${redis.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify([command.map(String)]),
    cache: 'no-store',
  });
  if (!response.ok) throw new AuthError(`Falha ao acessar o armazenamento seguro (HTTP ${response.status}).`, 503);
  const result = (await response.json()) as Array<{ result?: T; error?: string }>;
  if (result?.[0]?.error) throw new AuthError(`Falha no armazenamento seguro: ${result[0].error}`, 503);
  return result?.[0]?.result as T;
}

function emailKey(email: string) { return `divertin:auth:email:${email.toLowerCase()}`; }
function userKey(id: string) { return `divertin:auth:user:${id}`; }

function publicUser(user: StoredUser): PublicUser {
  return { id: user.id, name: user.name, email: user.email, role: user.role, active: user.active, createdAt: user.createdAt };
}

function scrypt(password: string, salt: Buffer, length: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(password, salt, length, (error, derivedKey) => error ? reject(error) : resolve(derivedKey as Buffer));
  });
}

export async function hashPassword(password: string) {
  if (password.length < 10 || password.length > 128) throw new AuthError('A senha deve ter entre 10 e 128 caracteres.');
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString('base64url')}$${derived.toString('base64url')}`;
}

export async function verifyPassword(password: string, encoded: string) {
  const [scheme, saltText, hashText] = encoded.split('$');
  if (scheme !== 'scrypt' || !saltText || !hashText) return false;
  try {
    const expected = Buffer.from(hashText, 'base64url');
    const actual = await scrypt(password, Buffer.from(saltText, 'base64url'), expected.length);
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

export async function getUserById(id: string): Promise<StoredUser | null> {
  const raw = await redisCommand<string | null>('GET', userKey(id));
  if (!raw) return null;
  try { return JSON.parse(raw) as StoredUser; } catch { return null; }
}

export async function getUserByEmail(email: string): Promise<StoredUser | null> {
  const id = await redisCommand<string | null>('GET', emailKey(email.toLowerCase()));
  return id ? getUserById(id) : null;
}

export async function createUser(input: { name: string; email: string; password: string; role: UserRole }) {
  const email = input.email.trim().toLowerCase();
  const id = randomUUID();
  const now = new Date().toISOString();
  const user: StoredUser = {
    id,
    name: input.name.trim(),
    email,
    passwordHash: await hashPassword(input.password),
    role: input.role,
    active: true,
    createdAt: now,
    updatedAt: now,
  };
  const claimed = await redisCommand<string | null>('SET', emailKey(email), id, 'NX');
  if (claimed !== 'OK') throw new AuthError('Já existe um usuário cadastrado com esse e-mail.', 409);
  try {
    const redis = redisConfig();
    const response = await fetch(`${redis.url}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${redis.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([
        ['SET', userKey(id), JSON.stringify(user)],
        ['SADD', USERS_SET_KEY, id],
      ]),
      cache: 'no-store',
    });
    if (!response.ok) throw new Error(`Upstash HTTP ${response.status}`);
    const result = await response.json() as Array<{ result?: string; error?: string }>;
    if (result.some((item) => item.error)) throw new Error(result.find((item) => item.error)?.error);
    return publicUser(user);
  } catch (error) {
    await redisCommand('DEL', emailKey(email)).catch(() => undefined);
    throw error;
  }
}

let seedPromise: Promise<void> | null = null;
export async function ensureInitialAdmin() {
  const password = process.env.DIVERTIN_ADMIN_PASSWORD;
  if (!password) throw new AuthError('Configure DIVERTIN_ADMIN_PASSWORD no ambiente do site para ativar o primeiro ADM.', 503);
  if (seedPromise) return seedPromise;
  seedPromise = (async () => {
    const email = (process.env.DIVERTIN_ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).trim().toLowerCase();
    const existing = await getUserByEmail(email);
    if (existing) {
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        existing.updatedAt = new Date().toISOString();
        await redisCommand('SET', userKey(existing.id), JSON.stringify(existing));
      }
      return;
    }
    try {
      await createUser({ name: 'Administrador Divertin', email, password, role: 'admin' });
    } catch (error) {
      // Outra instância pode ter feito o bootstrap simultaneamente.
      const raced = await getUserByEmail(email);
      if (!raced) throw error;
      if (raced.role !== 'admin') {
        raced.role = 'admin';
        await redisCommand('SET', userKey(raced.id), JSON.stringify(raced));
      }
    }
  })();
  try { await seedPromise; } catch (error) { seedPromise = null; throw error; }
}

export async function listUsers(): Promise<PublicUser[]> {
  const ids = await redisCommand<string[]>('SMEMBERS', USERS_SET_KEY) || [];
  const users = await Promise.all(ids.map(getUserById));
  return users.filter((user): user is StoredUser => Boolean(user)).map(publicUser).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
}

export async function updateUser(id: string, patch: Partial<Pick<StoredUser, 'name' | 'role' | 'active'>> & { password?: string }) {
  const user = await getUserById(id);
  if (!user) throw new AuthError('Usuário não encontrado.', 404);
  if (patch.name !== undefined) user.name = patch.name.trim();
  if (patch.role !== undefined) user.role = patch.role;
  if (patch.active !== undefined) user.active = patch.active;
  if (patch.password) user.passwordHash = await hashPassword(patch.password);
  user.updatedAt = new Date().toISOString();
  await redisCommand('SET', userKey(id), JSON.stringify(user));
  return publicUser(user);
}

function sessionSecret() {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new AuthError('Configure AUTH_SESSION_SECRET com pelo menos 32 caracteres aleatórios.', 503);
  return secret;
}

function sign(value: string) {
  return createHmac('sha256', sessionSecret()).update(value).digest('base64url');
}

export function createSessionToken(userId: string) {
  const payload = Buffer.from(JSON.stringify({ uid: userId, exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS, nonce: randomBytes(12).toString('base64url') })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export async function getSessionUser(request: NextRequest): Promise<PublicUser | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra) return null;
  try {
    const expected = Buffer.from(sign(payload));
    const actual = Buffer.from(signature);
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { uid: string; exp: number };
    if (!data.uid || !Number.isFinite(data.exp) || data.exp < Math.floor(Date.now() / 1000)) return null;
    const user = await getUserById(data.uid);
    if (!user || !user.active) return null;
    return publicUser(user);
  } catch {
    return null;
  }
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_SECONDS,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 });
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const raw = await redisCommand<string | null>('GET', SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const saved = JSON.parse(raw) as Partial<SiteSettings>;
    return {
      theme: saved.theme === 'natal' ? 'natal' : 'padrao',
      announcement: {
        enabled: Boolean(saved.announcement?.enabled),
        title: String(saved.announcement?.title || '').slice(0, 90),
        message: String(saved.announcement?.message || '').slice(0, 300),
      },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSiteSettings(settings: SiteSettings) {
  await redisCommand('SET', SETTINGS_KEY, JSON.stringify(settings));
  return settings;
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function enforceLoginRateLimit(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const key = `divertin:auth:login-rate:${forwarded}`;
  const count = Number(await redisCommand<number>('INCR', key));
  if (count === 1) await redisCommand('EXPIRE', key, 900);
  if (count > 10) throw new AuthError('Muitas tentativas de acesso. Aguarde 15 minutos e tente novamente.', 429);
  return key;
}

export async function clearLoginRateLimit(key: string) {
  await redisCommand('DEL', key);
}
