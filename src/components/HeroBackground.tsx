import { getImageProps } from 'next/image';

/**
 * Fundo do hero da home (imagem do LCP).
 *
 * - Direção de arte: no mobile usa a imagem própria para celular
 *   ("backgroud hero section mobile.png"); no desktop usa bg-hero.png.
 * - fetchPriority="high" + loading="eager": o relatório mobile apontava que
 *   a imagem do LCP não tinha prioridade alta.
 * - Continua sendo servida pelo otimizador do Next (WebP/AVIF no tamanho certo).
 */
export default function HeroBackground() {
  const shared = {
    alt: '',
    fill: true,
    sizes: '100vw',
    loading: 'eager' as const,
    fetchPriority: 'high' as const,
    className: 'object-cover object-top',
  };

  const { props: desktop } = getImageProps({ ...shared, src: '/bg-hero.png' });
  const { props: mobile } = getImageProps({
    ...shared,
    src: '/bg-hero.png',
  });

  return (
    <picture>
      <source media="(max-width: 767px)" srcSet={mobile.srcSet} sizes="100vw" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img {...desktop} alt="" />
    </picture>
  );
}
