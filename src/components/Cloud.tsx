import type { CSSProperties } from 'react';

interface CloudProps {
  position: 'top' | 'bottom';
  /** Cor da seção que recebe a borda de nuvens. */
  color?: string;
  className?: string;
}

/**
 * Divisória vetorial traçada diretamente de `public/cloud bottom.webp`.
 * A máscara SVG preserva o contorno original e o fundo permite recolorir
 * cada divisória com a cor da seção que vem a seguir.
 *
 * A arte mantém a proporção original e tem largura mínima de 1300px.
 * Em telas estreitas, o viewport recorta as laterais em vez de comprimir a nuvem.
 */
export default function Cloud({
  position,
  color = '#FFFFFF',
  className = '',
}: CloudProps) {
  const wrapperStyle: CSSProperties = {
    left: '50%',
    width: '100vw',
    height: 'max(83.25px, 6.402vw)',
    bottom: position === 'bottom' ? 0 : undefined,
    top: position === 'top' ? 0 : undefined,
    transform: position === 'top'
      ? 'translate(-50%, -28%)'
      : 'translate(-50%, 28%)',
  };

  const maskStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: color,
    WebkitMaskImage: "url('/cloud-divider.svg')",
    maskImage: "url('/cloud-divider.svg')",
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
    WebkitMaskSize: 'max(1300px, 100vw) auto',
    maskSize: 'max(1300px, 100vw) auto',
    transform: position === 'top' ? 'rotate(180deg)' : undefined,
  };

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute z-20 overflow-hidden ${className}`.trim()}
      style={wrapperStyle}
    >
      <div className="h-full w-full" style={maskStyle} />
    </div>
  );
}
