export type GoogleReview = {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string | null;
};

export type GoogleReviewsSnapshot = {
  averageRating: number;
  totalReviewCount: number;
  reviews: GoogleReview[];
  updatedAt: string;
};

const CACHE_KEY = 'divertin:google-reviews:v1';

function getRedisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;
  return { url: url.replace(/\/$/, ''), token };
}

/** Lê o snapshot preparado pelo cron. A página nunca consulta o Google diretamente. */
export async function getCachedGoogleReviews(): Promise<GoogleReviewsSnapshot | null> {
  const redis = getRedisConfig();
  if (!redis) return null;

  try {
    const response = await fetch(`${redis.url}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${redis.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([['GET', CACHE_KEY]]),
      cache: 'no-store',
    });

    if (!response.ok) return null;

    const result = (await response.json()) as Array<{ result?: string | null; error?: string }>;
    const serialized = result?.[0]?.result;
    if (!serialized || result?.[0]?.error) return null;

    const snapshot = JSON.parse(serialized) as GoogleReviewsSnapshot;
    if (
      typeof snapshot.averageRating !== 'number' ||
      typeof snapshot.totalReviewCount !== 'number' ||
      !Array.isArray(snapshot.reviews) ||
      typeof snapshot.updatedAt !== 'string'
    ) {
      return null;
    }

    return snapshot;
  } catch (error) {
    console.error('Não foi possível ler o cache das avaliações do Google:', error);
    return null;
  }
}

export async function saveGoogleReviewsCache(snapshot: GoogleReviewsSnapshot) {
  const redis = getRedisConfig();
  if (!redis) {
    throw new Error('Configure UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN.');
  }

  // A política do Business Profile API limita o armazenamento temporário a 30 dias.
  const thirtyDaysInSeconds = 60 * 60 * 24 * 30;
  const response = await fetch(`${redis.url}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${redis.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([['SET', CACHE_KEY, JSON.stringify(snapshot), 'EX', String(thirtyDaysInSeconds)]]),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Não foi possível salvar o cache (Upstash HTTP ${response.status}).`);
  }

  const result = (await response.json()) as Array<{ result?: string; error?: string }>;
  if (result?.[0]?.error || result?.[0]?.result !== 'OK') {
    throw new Error(result?.[0]?.error || 'O Upstash não confirmou o armazenamento do cache.');
  }
}
