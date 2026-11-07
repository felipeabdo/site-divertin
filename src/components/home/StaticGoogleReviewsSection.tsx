"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import Cloud from "@/components/Cloud";
import { GOOGLE_REVIEWS_PUBLIC_URL, STATIC_GOOGLE_REVIEWS } from "@/data/staticGoogleReviews";

function Stars() {
  return (
    <span className="inline-flex items-center gap-0.5 text-lg leading-none text-[#E99A26]" aria-label="5 de 5 estrelas">
      {Array.from({ length: 5 }, (_, index) => <span key={index} aria-hidden="true">★</span>)}
    </span>
  );
}

function getInitials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part.charAt(0).toLocaleUpperCase("pt-BR")).join("");
}

function ReviewCard({
  review,
  index,
  onOpen,
}: {
  review: (typeof STATIC_GOOGLE_REVIEWS)[number];
  index: number;
  onOpen: () => void;
}) {
  const needsModal = review.comment.length > 180 || review.truncated;

  return (
    <article
      aria-label={`Avaliação ${index + 1} de ${STATIC_GOOGLE_REVIEWS.length}, por ${review.name}`}
      className="group flex h-full min-h-[330px] w-[min(84vw,390px)] shrink-0 snap-center flex-col rounded-[28px] border border-[#F2DCC5] bg-white p-6 shadow-[0_10px_28px_rgba(105,74,42,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(105,74,42,0.13)] sm:w-[370px] md:min-h-[350px] md:p-7"
    >
      <div className="flex items-center gap-3">
        {review.avatar ? (
          <Image
            src={`/reviews/avatars/${review.avatar}`}
            alt={`Foto de perfil de ${review.name}`}
            width={52}
            height={52}
            sizes="52px"
            className="h-[52px] w-[52px] shrink-0 rounded-full border-2 border-[#F8E7D6] object-cover shadow-sm"
          />
        ) : (
          <div aria-hidden="true" className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border-2 border-[#F8E7D6] bg-[#FCE8D7] text-sm font-black text-[#A64B28]">
            {getInitials(review.name)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-extrabold text-[#3D3530]">{review.name}</h3>
          <p className="mt-1 text-xs text-[#8D8178]">{review.dateLabel}</p>
        </div>

        <span className="shrink-0 rounded-full bg-[#F7F3EE] px-2.5 py-1 text-[10px] font-bold tracking-wide text-[#81756C]">
          Google
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <Stars />
        <span className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[#B9A99A]">
          5 estrelas
        </span>
      </div>

      <p
        className={`mt-4 flex-1 whitespace-pre-line break-words text-[14px] leading-[1.8] text-[#625850] md:text-[15px] ${
          needsModal
            ? "[display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:5] overflow-hidden"
            : ""
        }`}
      >
        “{review.comment}”
      </p>

      {needsModal && (
        <button
          type="button"
          onClick={onOpen}
          className="mt-2 self-start rounded text-sm font-bold text-[#D66B24] transition hover:text-[#A64B28] hover:underline focus:outline-none focus:ring-2 focus:ring-[#CC4B00] focus:ring-offset-2"
          aria-label={`Ler comentário completo de ${review.name}`}
        >
          Ler comentário completo →
        </button>
      )}

      {review.truncated && (
        <p className="mt-3 rounded-xl bg-[#FFF7EF] px-3 py-2 text-[10px] leading-relaxed text-[#9A7961]">
          Trecho final recolhido na gravação do Google.
        </p>
      )}

      <div className="mt-5 flex items-center gap-2 border-t border-[#F4E8DC] pt-4 text-xs font-bold text-[#D66B24]">
        <span aria-hidden="true">✦</span> Carinho que faz a diferença
      </div>
    </article>
  );
}

export default function StaticGoogleReviewsSection() {
  const trackRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const [selectedReview, setSelectedReview] = useState<
    (typeof STATIC_GOOGLE_REVIEWS)[number] | null
  >(null);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const lastIndex = STATIC_GOOGLE_REVIEWS.length - 1;

  // Fechar popup com ESC e bloquear rolagem do fundo.
  useEffect(() => {
    if (!selectedReview) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedReview(null);
      }
    };

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [selectedReview]);

  // Atualizar indicador e estado das setas.
  const updateActive = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const firstCard = track.querySelector<HTMLElement>("[data-review-card]");
    if (!firstCard) return;

    const gap = Number.parseFloat(getComputedStyle(track).columnGap || "20") || 20;
    const step = firstCard.getBoundingClientRect().width + gap;

    setActiveIndex(
      Math.max(0, Math.min(lastIndex, Math.round(track.scrollLeft / step)))
    );

    const maxScroll = track.scrollWidth - track.clientWidth;

    setCanScrollPrev(track.scrollLeft > 3);
    setCanScrollNext(track.scrollLeft < maxScroll - 3);
  }, [lastIndex]);

  // Navegação do carrossel.
  const move = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.querySelector<HTMLElement>("[data-review-card]");

    const gap = Number.parseFloat(getComputedStyle(track).columnGap || "20") || 20;

    const step = (card?.getBoundingClientRect().width || 370) + gap;

    track.scrollBy({
      left: direction * step,
      behavior: "smooth",
    });
  };

  return (
    <section
      aria-labelledby="static-reviews-title"
      className="relative isolate overflow-visible bg-[#FFF0DE] px-5 pb-20 pt-24 md:px-8 md:pb-28 md:pt-28"
    >
      <Cloud position="top" color="#FFF0DE" />
      <Cloud position="bottom" color="#FFF0DE" />

      <div aria-hidden="true" className="pointer-events-none absolute left-[5%] top-28 hidden h-20 w-20 rounded-full bg-[#F4A261]/20 blur-2xl md:block" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-24 right-[7%] hidden h-28 w-28 rounded-full bg-[#D684BF]/20 blur-2xl md:block" />

      <div className="relative z-20 mx-auto max-w-7xl">

        {/* Cabeçalho */}
        <header className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
          <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.2em] text-[#CC4B00]">
            Carinho que vira conquista ✦
          </p>

          <h2
            id="static-reviews-title"
            className="font-avenir text-3xl font-black leading-tight text-gray-800 md:text-4xl lg:text-5xl"
          >
            Histórias de quem{" "}
            <span className="text-[#E77B32]">
              confia na Divertin
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
            Cada mensagem representa uma família, uma parceria e muitos passos importantes no desenvolvimento das crianças.
          </p>
        </header>

        {/* Resumo das avaliações */}
        <div className="mb-8 flex flex-col items-center justify-between gap-5 rounded-[28px] border border-[#F2DCC5] bg-white/90 p-5 shadow-[0_10px_28px_rgba(105,74,42,0.06)] sm:flex-row sm:px-8">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="text-center sm:text-left">
              <div className="flex items-end justify-center gap-2 sm:justify-start">
                <span className="font-avenir text-5xl font-black leading-none text-gray-800">
                  5,0
                </span>

                <span className="shrink-0 whitespace-nowrap pb-1 text-sm text-gray-500"> / 5 </span>
              </div>

              <div className="mt-2">
                <Stars />
              </div>
            </div>

            <div className="h-14 w-px bg-[#EEDBC8]" />

            <div>
              <p className="font-bold text-gray-800">
                A opinião de quem já viveu essa experiência
              </p>

              <p className="mt-1 text-sm text-gray-500">
                49 avaliações no Google · 44 comentários escritos
              </p>
            </div>
          </div>

        <a
          href={GOOGLE_REVIEWS_PUBLIC_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 self-start ml-[115px] sm:self-auto sm:ml-0 items-center justify-center gap-2 rounded-full border border-[#CC4B00] px-5 py-3 text-sm font-bold text-[#A64B28] transition hover:bg-[#FFF2E7] focus:outline-none focus:ring-2 focus:ring-[#CC4B00] focus:ring-offset-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="h-[18px] w-[18px]"
            aria-hidden="true"
          >
            <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11c-.5 2.5-2 4.6-4.2 6l6.4 5C41.1 35.3 43.6 30.3 43.6 24.5z"/>
            <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.4-4.8l-6.4-5c-1.8 1.2-4.1 2-7 2-5.4 0-10-3.6-11.6-8.5l-6.6 5.1C9.1 39.4 16 44 24 44z"/>
            <path fill="#FBBC05" d="M12.4 27.7c-.4-1.2-.7-2.4-.7-3.7s.2-2.5.7-3.7l-6.6-5.1C4.6 18 3.5 20.8 3.5 24s1.1 6 2.3 8.8l6.6-5.1z"/>
            <path fill="#EA4335" d="M24 9.5c3 0 5.7 1 7.8 3l5.8-5.8C34.1 3.5 29.5 2 24 2 16 2 9.1 6.6 5.8 13.2l6.6 5.1C14 13.1 18.6 9.5 24 9.5z"/>
          </svg>

          Ver no Google
        </a>
        </div>

        {/* Carrossel */}
        <div
          className="relative"
          aria-roledescription="carrossel"
          aria-label="Comentários de clientes da Clínica Divertin"
        >
          <div
            ref={trackRef}
            onScroll={updateActive}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-1 pb-7 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {STATIC_GOOGLE_REVIEWS.map((review, index) => (
              <div
                data-review-card
                key={review.id}
                className="h-auto shrink-0"
              >
                <ReviewCard
                  review={review}
                  index={index}
                  onOpen={() => setSelectedReview(review)}
                />
              </div>
            ))}
          </div>

          {/* Navegação */}
          <div className="mt-2 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs font-semibold text-[#8D8178]">
              Arraste para o lado ou use as setas para ver mais histórias{" "}
              <span aria-hidden="true">→</span>
            </p>

            <div className="flex items-center gap-3">
              <span
                className="mr-1 min-w-[72px] text-right text-xs font-bold tabular-nums text-[#8D8178]"
                aria-live="polite"
              >
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(STATIC_GOOGLE_REVIEWS.length).padStart(2, "0")}
              </span>

              <button
                type="button"
                onClick={() => move(-1)}
                disabled={!canScrollPrev}
                aria-label="Avaliação anterior"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E7CDB4] bg-white text-2xl leading-none text-[#A64B28] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#FFF8F0] focus:outline-none focus:ring-2 focus:ring-[#CC4B00] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0"
              >
                ‹
              </button>

              <button
                type="button"
                onClick={() => move(1)}
                disabled={!canScrollNext}
                aria-label="Próxima avaliação"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#CC4B00] text-2xl leading-none text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#A83D00] focus:outline-none focus:ring-2 focus:ring-[#CC4B00] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0"
              >
                ›
              </button>
            </div>
          </div>

          {/* Barra de progresso */}
          <div
            className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#EBD8C5]"
            aria-hidden="true"
          >
            <div
              className="h-full rounded-full bg-[#D96B27] transition-[width] duration-300"
              style={{
                width: `${((activeIndex + 1) / STATIC_GOOGLE_REVIEWS.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <p className="mt-7 text-center text-[11px] leading-relaxed text-[#9B8B7D]">
          Versão estática temporária transcrita da gravação enviada. Algumas avaliações aparecem recolhidas pelo Google e foram mantidas somente até o trecho visível no vídeo.
        </p>
      </div>

      {/* POPUP DE AVALIAÇÃO COMPLETA */}
      {selectedReview && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#30251F]/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedReview(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-dialog-title"
            className="relative flex w-full max-w-xl flex-col overflow-hidden rounded-[28px] border border-[#F2DCC5] bg-[#FFFCF8] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Cabeçalho do popup */}
            <div className="flex items-start justify-between gap-4 border-b border-[#F2E5D8] p-6">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#D66B24]">
                  ✦ Avaliação Google
                </span>

                <h3
                  id="review-dialog-title"
                  className="mt-2 text-xl font-black text-[#3D3530]"
                >
                  Comentário completo
                </h3>
              </div>

              <button
                type="button"
                autoFocus
                onClick={() => setSelectedReview(null)}
                aria-label="Fechar comentário"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FCE8D7] text-xl font-bold text-[#A64B28] transition hover:rotate-90 hover:bg-[#F8D7BE] focus:outline-none focus:ring-2 focus:ring-[#CC4B00]"
              >
                ×
              </button>
            </div>

            {/* Autor */}
            <div className="flex items-center gap-3 px-6 pt-5">
              {selectedReview.avatar ? (
                <Image
                  src={`/reviews/avatars/${selectedReview.avatar}`}
                  alt={`Foto de perfil de ${selectedReview.name}`}
                  width={52}
                  height={52}
                  sizes="52px"
                  className="h-[52px] w-[52px] shrink-0 rounded-full border-2 border-[#F8E7D6] object-cover shadow-sm"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border-2 border-[#F8E7D6] bg-[#FCE8D7] text-sm font-black text-[#A64B28]"
                >
                  {getInitials(selectedReview.name)}
                </div>
              )}

              <div className="min-w-0">
                <p className="font-extrabold text-[#3D3530]">
                  {selectedReview.name}
                </p>

                <p className="text-xs text-[#8D8178]">
                  {selectedReview.dateLabel}
                </p>
              </div>
            </div>

            <div className="px-6 pt-4">
              <Stars />
            </div>

            {/* Comentário com rolagem */}
            <div className="max-h-[55vh] overflow-y-auto overscroll-contain px-6 py-5">
              <p className="whitespace-pre-line break-words text-[15px] leading-[1.9] text-[#625850]">
                “{selectedReview.comment}”
              </p>

              {selectedReview.truncated && (
                <p className="mt-4 rounded-xl bg-[#FFF1E4] p-3 text-xs leading-relaxed text-[#9A7961]">
                  O trecho final deste comentário não estava visível na gravação original.
                </p>
              )}
            </div>

            {/* Rodapé do popup */}
            <div className="border-t border-[#F2E5D8] bg-[#FFF7EF] px-6 py-4">
              <p className="text-center text-xs font-bold text-[#D66B24]">
                ✦ Carinho que faz a diferença
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}