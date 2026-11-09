import Image from 'next/image';

/**
 * Logo da Divertin usado nos heros.
 *
 * Usa next/image (WebP/AVIF redimensionado) com width/height reais do arquivo
 * (1096x1003). Antes era um <img> do PNG original sem dimensões, o que causava
 * CLS (o h1 "pulava" quando o logo carregava) e baixava ~65 KB para mostrar
 * uma imagem de 240 px.
 */
export default function Logo({ className = '' }: { className?: string }) {
  return (
    <Image
      src="/logo (1).png"
      alt="Logo Divertin"
      width={1096}
      height={1003}
      sizes="(min-width: 1024px) 240px, (min-width: 640px) 208px, 176px"
      loading="eager"
      className={`mb-6 h-auto w-44 object-contain sm:w-52 lg:w-60 ${className}`.trim()}
    />
  );
}
