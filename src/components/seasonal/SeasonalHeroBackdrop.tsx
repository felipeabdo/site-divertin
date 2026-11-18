"use client";

import { useSiteTheme } from "@/components/auth/SiteExperienceProvider";

type HeroPlacement = "home" | "about" | "services" | "contact";

type SeasonalPhoto = {
  src: string;
  alt: string;
  credit: string;
  href: string;
};

const HERO_PHOTOS: Record<"carnaval" | "pascoa", Record<HeroPlacement, SeasonalPhoto>> = {
  carnaval: {
    home: {
      src: "https://images.pexels.com/photos/31022399/pexels-photo-31022399/free-photo-of-vibrant-carnival-celebration-in-brasilia-streets.jpeg?auto=compress&dpr=1&h=750&w=1260",
      alt: "Bloco de Carnaval de rua em Brasília, com foliões dançando e celebrando juntos.",
      credit: "Mendez · Pexels",
      href: "https://www.pexels.com/photo/vibrant-carnival-celebration-in-brasilia-streets-31022399/",
    },
    about: {
      src: "https://images.pexels.com/photos/15372412/pexels-photo-15372412/free-photo-of-dancers-dancing-samba-at-parade.jpeg?auto=compress&dpr=1&h=750&w=1260",
      alt: "Dançarinos em desfile de samba, com fantasias e movimentos coloridos.",
      credit: "Joel Garcia · Pexels",
      href: "https://www.pexels.com/photo/dancers-dancing-samba-at-parade-15372412/",
    },
    services: {
      src: "https://images.pexels.com/photos/30757849/pexels-photo-30757849/free-photo-of-vibrant-street-carnival-drummers-in-action.jpeg?auto=compress&dpr=1&h=750&w=1260",
      alt: "Percussionistas tocando tambores durante um bloco de rua.",
      credit: "Ligia Camargo · Pexels",
      href: "https://www.pexels.com/photo/vibrant-street-carnival-drummers-in-action-30757849/",
    },
    contact: {
      src: "https://images.pexels.com/photos/36203648/pexels-photo-36203648/free-photo-of-vibrant-carnival-celebration-with-musicians.jpeg?auto=compress&dpr=1&h=750&w=1260",
      alt: "Foliões celebrando o Carnaval com músicos e instrumentos de percussão.",
      credit: "Carina Gonçalves · Pexels",
      href: "https://www.pexels.com/photo/vibrant-carnival-celebration-with-musicians-36203648/",
    },
  },
  pascoa: {
    home: {
      src: "https://images.pexels.com/photos/2072163/pexels-photo-2072163.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=750&w=1260",
      alt: "Coelho de chocolate, ovos de Páscoa em tons pastel e tulipas.",
      credit: "George Dolgikh · Pexels",
      href: "https://www.pexels.com/photo/white-flowers-between-brown-rabbit-figure-and-eggs-2072163/",
    },
    about: {
      src: "https://images.pexels.com/photos/36616829/pexels-photo-36616829/free-photo-of-colorful-easter-egg-basket-with-flowers.jpeg?auto=compress&dpr=1&h=750&w=1260",
      alt: "Cesta de Páscoa com ovos coloridos e flores da estação.",
      credit: "TLK GentooExpressions · Pexels",
      href: "https://www.pexels.com/photo/colorful-easter-egg-basket-with-flowers-36616829/",
    },
    services: {
      src: "https://images.pexels.com/photos/7392776/pexels-photo-7392776.jpeg?auto=compress&cs=tinysrgb&w=1500",
      alt: "Ovos de Páscoa decorados junto a flores em uma composição delicada.",
      credit: "Eleonora Sky · Pexels",
      href: "https://www.pexels.com/photo/decorative-easter-eggs-beside-flowers-during-easter-7392776/",
    },
    contact: {
      src: "https://images.pexels.com/photos/4108593/pexels-photo-4108593.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=750&w=1260",
      alt: "Cesta com ovos de Páscoa e coelho de chocolate.",
      credit: "Polina Zimmerman · Pexels",
      href: "https://www.pexels.com/photo/pastel-colored-easter-eggs-and-chocolate-rabbit-4108593/",
    },
  },
};

// Fallbacks diferentes da imagem principal: se uma URL do CDN falhar,
// o hero continua exibindo uma fotografia sazonal em vez de voltar ao fundo estático.
const FALLBACK_PHOTOS: Record<"carnaval" | "pascoa", string> = {
  carnaval: "https://images.pexels.com/photos/30757849/pexels-photo-30757849/free-photo-of-vibrant-street-carnival-drummers-in-action.jpeg?auto=compress&dpr=1&h=750&w=1260",
  pascoa: "https://images.pexels.com/photos/2072163/pexels-photo-2072163.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=750&w=1260",
};

export default function SeasonalHeroBackdrop({ placement }: { placement: HeroPlacement }) {
  const { settings } = useSiteTheme();

  if (settings.theme !== "carnaval" && settings.theme !== "pascoa") return null;

  const theme: "carnaval" | "pascoa" = settings.theme;
  const photo = HERO_PHOTOS[theme][placement];

  return (
    <div className={`seasonal-hero-backdrop seasonal-hero-backdrop--${theme}`} data-seasonal-hero={placement}>
      {/* Fotografia real de banco gratuito; o crédito abre a página original do fotógrafo. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="seasonal-hero-backdrop__image"
        src={photo.src}
        alt=""
        aria-hidden="true"
        loading="eager"
        decoding="async"
        fetchPriority="high"
        onError={(event) => {
          const image = event.currentTarget;
          if (image.dataset.fallbackApplied !== "true") {
            image.dataset.fallbackApplied = "true";
            image.src = FALLBACK_PHOTOS[theme];
          }
        }}
      />
      <div className="seasonal-hero-backdrop__shade" aria-hidden="true" />
      <div className="seasonal-hero-backdrop__accent" aria-hidden="true">
        {theme === "carnaval" ? <><i /><i /><i /><i /><i /><i /></> : <><i /><i /><i /></>}
      </div>
      <a className="seasonal-hero-backdrop__credit" href={photo.href} target="_blank" rel="noreferrer">
        Foto: {photo.credit}
      </a>
    </div>
  );
}
