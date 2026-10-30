import { NextResponse } from 'next/server';
import { saveGoogleReviewsCache, type GoogleReview, type GoogleReviewsSnapshot } from '@/lib/googleReviews';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const STAR_RATINGS: Record<string, number> = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
};

type GoogleApiReview = {
  reviewId?: string;
  reviewer?: {
    displayName?: string;
    isAnonymous?: boolean;
  };
  starRating?: string;
  comment?: string;
  createTime?: string;
  updateTime?: string;
};

type GoogleReviewsPage = {
  reviews?: GoogleApiReview[];
  averageRating?: number;
  totalReviewCount?: number;
  nextPageToken?: string;
};

function jsonError(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

async function getGoogleAccessToken() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Configure GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET e GOOGLE_REFRESH_TOKEN.');
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`O Google não autorizou a atualização (OAuth HTTP ${response.status}).`);
  }

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) throw new Error('O Google não retornou um token de acesso.');
  return data.access_token;
}

async function fetchAllGoogleReviews(accessToken: string): Promise<GoogleReviewsSnapshot> {
  const accountId = process.env.GOOGLE_BUSINESS_ACCOUNT_ID;
  const locationId = process.env.GOOGLE_BUSINESS_LOCATION_ID;

  if (!accountId || !locationId) {
    throw new Error('Configure GOOGLE_BUSINESS_ACCOUNT_ID e GOOGLE_BUSINESS_LOCATION_ID.');
  }

  const parent = `accounts/${encodeURIComponent(accountId)}/locations/${encodeURIComponent(locationId)}`;
  const allReviews: GoogleReview[] = [];
  let pageToken: string | undefined;
  let averageRating = 0;
  let totalReviewCount = 0;
  let pageCount = 0;

  do {
    const params = new URLSearchParams({ pageSize: '50', orderBy: 'rating desc' });
    if (pageToken) params.set('pageToken', pageToken);

    const url = `https://mybusiness.googleapis.com/v4/${parent}/reviews?${params.toString()}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`A API do Google retornou HTTP ${response.status} ao buscar as avaliações.`);
    }

    const page = (await response.json()) as GoogleReviewsPage;
    if (pageCount === 0) {
      averageRating = typeof page.averageRating === 'number' ? page.averageRating : 0;
      totalReviewCount = typeof page.totalReviewCount === 'number' ? page.totalReviewCount : 0;
    }

    for (const review of page.reviews ?? []) {
      const reviewerName = review.reviewer?.isAnonymous
        ? 'Cliente do Google'
        : review.reviewer?.displayName?.trim() || 'Cliente do Google';

      allReviews.push({
        id: review.reviewId || `${reviewerName}-${review.createTime || review.updateTime || allReviews.length}`,
        reviewerName,
        rating: STAR_RATINGS[review.starRating || ''] || 0,
        comment: review.comment?.trim() || '',
        createdAt: review.createTime || review.updateTime || null,
      });
    }

    pageToken = page.nextPageToken;
    pageCount += 1;

    // Proteção contra uma resposta inesperada que gere paginação infinita.
    if (pageCount >= 100 && pageToken) {
      throw new Error('A sincronização ultrapassou o limite de segurança de 100 páginas.');
    }
  } while (pageToken);

  return {
    averageRating,
    totalReviewCount,
    reviews: allReviews,
    updatedAt: new Date().toISOString(),
  };
}

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get('authorization');

  if (!cronSecret || authorization !== `Bearer ${cronSecret}`) {
    return jsonError('Não autorizado.', 401);
  }

  try {
    const accessToken = await getGoogleAccessToken();
    const snapshot = await fetchAllGoogleReviews(accessToken);
    await saveGoogleReviewsCache(snapshot);

    return NextResponse.json({
      ok: true,
      totalReviewCount: snapshot.totalReviewCount,
      reviewsFetched: snapshot.reviews.length,
      updatedAt: snapshot.updatedAt,
    });
  } catch (error) {
    console.error('Erro ao sincronizar avaliações do Google:', error);
    const message = error instanceof Error ? error.message : 'Erro inesperado na sincronização.';
    return jsonError(message, 500);
  }
}
