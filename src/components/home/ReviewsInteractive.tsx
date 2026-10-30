'use client';

import { useEffect, useState } from 'react';
import type { GoogleReview, GoogleReviewsSnapshot } from '@/lib/googleReviews';

const GOOGLE_REVIEWS_URL = 'https://www.google.com/search?q=divertin+clinica&hl=pt-BR#lrd=0x935a3b5645ebeeed:0x8a4f6a14e6ceb4f7,1,,,,';

type Props = {
  snapshot: GoogleReviewsSnapshot | null;
};

function Stars({ rating, size = 'text-base' }: { rating: number; size?: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${size}`} aria-label={`${rating} de 5 estrelas`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} aria-hidden="true" className={index < Math.round(rating) ? 'text-[#E99A26]' : 'text-[#D9D2C8]'}>
          ★
        </span>
      ))}
    </span>
  );
}

function formatDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

function ReviewCard({ review }: { review: GoogleReview }) {
  const initials = review.reviewerName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toLocaleUpperCase('pt-BR'))
    .join('');
  const dateLabel = formatDate(review.createdAt);

  return (
    <article className="flex h-full min-w-0 flex-col rounded-[26px] border border-[#F2DCC5] bg-white p-6 shadow-[0_10px_28px_rgba(105,74,42,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(105,74,42,0.12)] md:p-7">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F9E4D1] font-bold text-[#A64B28]">
          {initials || 'G'}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-gray-800">{review.reviewerName}</p>
          {dateLabel && <p className="mt-0.5 text-xs text-gray-500">{dateLabel}</p>}
        </div>
        <span className="shrink-0 text-[11px] font-semibold text-gray-400">Google</span>
      </div>

      <div className="mt-4">
        <Stars rating={review.rating} />
      </div>

      <p className="mt-3 flex-1 whitespace-pre-line break-words text-sm leading-relaxed text-gray-600 md:text-[15px]">
        {review.comment || 'Avaliação publicada sem comentário escrito.'}
      </p>
    </article>
  );
}

function ReviewsModal({
  snapshot,
  onClose,
}: {
  snapshot: GoogleReviewsSnapshot;
  onClose: () => void;
}) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2E2430]/65 p-0 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="all-reviews-title"
        className="flex h-[80vh] w-[80vw] min-w-0 flex-col overflow-hidden rounded-[24px] border border-white/70 bg-[#FFFCF8] shadow-2xl md:rounded-[32px]"
      >
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-[#F0E2D5] px-5 py-4 md:px-8 md:py-6">
          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#CC4B00]">Opiniões das famílias</p>
            <h3 id="all-reviews-title" className="mt-1 font-avenir text-xl font-black text-gray-800 md:text-2xl">
              Todas as avaliações
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <Stars rating={snapshot.averageRating} />
              <strong className="text-gray-800">{snapshot.averageRating.toFixed(1).replace('.', ',')}</strong>
              <span>·</span>
              <span>{snapshot.totalReviewCount} avaliações</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar avaliações"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F7E8DB] text-2xl leading-none text-[#704A36] transition hover:bg-[#F0D5C0] focus:outline-none focus:ring-2 focus:ring-[#CC4B00]"
          >
            ×
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-8 md:py-7">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            {snapshot.reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-gray-500">
            Avaliações públicas do perfil da Clínica Divertin no Google.
          </p>
        </div>

        <footer className="flex shrink-0 justify-center border-t border-[#F0E2D5] px-4 py-3 md:py-4">
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold text-[#A64B28] underline decoration-[#DDAA83] underline-offset-4 transition hover:text-[#CC4B00]"
          >
            Abrir página oficial de avaliações do Google ↗
          </a>
        </footer>
      </section>
    </div>
  );
}

export default function ReviewsInteractive({ snapshot }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!snapshot || snapshot.reviews.length === 0) {
    return (
      <div className="mx-auto max-w-3xl rounded-[28px] border border-[#F2DCC5] bg-white/85 px-6 py-8 text-center shadow-sm md:px-10 md:py-10">
        <p className="text-base leading-relaxed text-gray-600">
          As avaliações da clínica serão exibidas aqui assim que a conexão com o perfil do Google for ativada.
        </p>
        <a
          href={GOOGLE_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center justify-center rounded-full bg-[#CC4B00] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#A83D00] focus:outline-none focus:ring-2 focus:ring-[#CC4B00] focus:ring-offset-2"
        >
          Ver avaliações no Google ↗
        </a>
      </div>
    );
  }

  const featuredReviews = snapshot.reviews.slice(0, 10);
  const updatedLabel = formatDate(snapshot.updatedAt);

  return (
    <>
      <div className="mb-8 flex flex-col items-center justify-between gap-5 rounded-[28px] border border-[#F2DCC5] bg-white/90 p-5 shadow-[0_10px_28px_rgba(105,74,42,0.06)] sm:flex-row sm:px-8">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-5">
          <div className="text-center sm:text-left">
            <div className="flex items-end justify-center gap-2 sm:justify-start">
              <span className="font-avenir text-5xl font-black leading-none text-gray-800">
                {snapshot.averageRating.toFixed(1).replace('.', ',')}
              </span>
              <span className="pb-1 text-sm text-gray-500">/ 5</span>
            </div>
            <div className="mt-2">
              <Stars rating={snapshot.averageRating} size="text-lg" />
            </div>
          </div>
          <div className="hidden h-14 w-px bg-[#EEDBC8] sm:block" />
          <div className="text-center sm:text-left">
            <p className="font-bold text-gray-800">A opinião de quem já viveu essa experiência</p>
            <p className="mt-1 text-sm text-gray-500">
              {snapshot.totalReviewCount} avaliações no Google
              {updatedLabel ? ` · Atualizado em ${updatedLabel}` : ''}
            </p>
          </div>
        </div>

        <a
          href={GOOGLE_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center rounded-full border border-[#CC4B00] px-5 py-3 text-sm font-bold text-[#A64B28] transition hover:bg-[#FFF2E7] focus:outline-none focus:ring-2 focus:ring-[#CC4B00] focus:ring-offset-2"
        >
          Ver no Google ↗
        </a>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
        {featuredReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center rounded-full bg-[#CC4B00] px-8 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(163,70,19,0.18)] transition hover:-translate-y-0.5 hover:bg-[#A83D00] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#CC4B00] focus:ring-offset-2"
        >
          Ver todos os comentários
        </button>
      </div>

      {isModalOpen && (
        <ReviewsModal snapshot={snapshot} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
