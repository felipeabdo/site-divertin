import type { ReactNode } from 'react';

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/**
 * Wrapper sem JavaScript local. O ScrollRevealController único do layout
 * observa este data-reveal e inicia o movimento quando o bloco entra na tela.
 */
export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
}: ScrollRevealProps) {
  const safeDelay = Number.isFinite(delay)
    ? Math.max(0, Math.min(delay, 1000))
    : 0;

  return (
    <div
      data-reveal=""
      data-reveal-delay={safeDelay > 0 ? String(safeDelay) : undefined}
      className={`scroll-reveal ${className}`.trim()}
    >
      {children}
    </div>
  );
}
