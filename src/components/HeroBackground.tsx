import { getImageProps } from "next/image";

/**
 * Fundo do hero com um único elemento de imagem.
 * O posicionamento muda por breakpoint sem duplicar requests/elementos no DOM.
 */
export default function HeroBackground() {
  const { props } = getImageProps({
    src: "/bg-hero.png",
    alt: "",
    fill: true,
    sizes: "100vw",
    loading: "eager",
    fetchPriority: "high",
    className: "object-cover object-[55%_top] md:object-top",
  });

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* getImageProps aplica o pipeline de otimização do Next ao srcset. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img {...props} alt="" />
      <div className="divertin-christmas-hero-tint" />
    </div>
  );
}
