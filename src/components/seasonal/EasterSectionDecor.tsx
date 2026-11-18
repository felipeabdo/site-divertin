'use client';

import { useSiteTheme } from '@/components/auth/SiteExperienceProvider';

type EasterPlacement =
  | 'home-hero'
  | 'home-intro'
  | 'home-features'
  | 'reviews'
  | 'about-hero'
  | 'about-care'
  | 'team'
  | 'clinic'
  | 'cta'
  | 'services-hero'
  | 'services-grid'
  | 'principles'
  | 'service-detail'
  | 'contact-hero'
  | 'contact-band'
  | 'location'
  | 'contact-form';

const BUNNY = 'https://freesvg.org/img/StudioFibonacci_Cartoon_bunny.png';
const BUNNY_LINE = 'https://freesvg.org/img/Machovka_rabbit.png';
const EGG_COLORFUL = 'https://freesvg.org/img/easter_egg_yellow.png';
const EGG_SOFT = 'https://freesvg.org/img/Yellow-Easter-Egg.png';

/** Decorative artwork sourced from CC0 FreeSVG/OpenClipart assets; never replaces clinic photography. */
export default function EasterSectionDecor({ placement }: { placement: EasterPlacement }) {
  const { settings } = useSiteTheme();
  if (settings.theme !== 'pascoa') return null;

  const showBunny = !['home-intro', 'services-grid', 'contact-band', 'contact-hero'].includes(placement);
  const eggCount = ['home-features', 'team', 'clinic', 'services-grid', 'principles'].includes(placement) ? 3 : 2;
  const useLineBunny = ['home-features', 'team', 'clinic', 'principles', 'location'].includes(placement);

  return (
    <div className={`easter-section-decor easter-section-decor--${placement}`} aria-hidden="true">
      {showBunny && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={`easter-section-decor__bunny${useLineBunny ? ' easter-section-decor__bunny--line' : ''}`} src={useLineBunny ? BUNNY_LINE : BUNNY} alt="" loading="lazy" decoding="async" />
      )}
      {Array.from({ length: eggCount }, (_, index) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={index}
          className={`easter-section-decor__egg easter-section-decor__egg--${index + 1}`}
          src={index % 2 === 0 ? EGG_COLORFUL : EGG_SOFT}
          alt=""
          loading="lazy"
          decoding="async"
        />
      ))}
    </div>
  );
}
