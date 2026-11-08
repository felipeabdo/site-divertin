import { getImageProps } from 'next/image';

export default function HeroBackground() {
  const shared = {
    alt: '',
    fill: true,
    sizes: '100vw',
    loading: 'eager' as const,
    fetchPriority: 'high' as const,
  };

  const { props: desktop } = getImageProps({
    ...shared,
    src: '/bg-hero.png',
    className: 'object-cover object-top hidden md:block',
  });

  const { props: mobile } = getImageProps({
    ...shared,
    src: '/bg-hero.png',
    // Ajuste fino: mude o valor de 75% para mais (ex: 80%) ou menos (ex: 70%) 
    // se quiser mover a imagem para a esquerda ou direita milimetricamente.
    className: 'object-cover object-[55%_top] block md:hidden',
  });

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img {...mobile} alt="" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img {...desktop} alt="" />
    </div>
  );
}