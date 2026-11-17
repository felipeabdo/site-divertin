import type { CSSProperties } from 'react';

interface CloudProps {
  position: 'top' | 'bottom';
  /** Cor da seção que recebe a borda de nuvens. */
  color?: string;
  className?: string;
}

/** Divisória vetorial com massas de nuvens assimétricas, em vez de ondas repetidas. */
export default function Cloud({
  position,
  color = '#FFFFFF',
  className = '',
}: CloudProps) {
  const style: CSSProperties = {
    left: '50%',
    width: '100vw',
    bottom: position === 'bottom' ? 0 : undefined,
    top: position === 'top' ? 0 : undefined,
    fill: color,
    transform: position === 'top' ? 'translateX(-50%) translateY(-28%)' : 'translateX(-50%) translateY(28%)',
  };

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute z-20 h-[clamp(72px,18vw,104px)] overflow-hidden md:h-[clamp(88px,7.5vw,128px)] ${className}`.trim()}
      style={style}
    >
      {/* Desenho próprio para mobile: proporção próxima à tela evita nuvens achatadas. */}
      <svg
        viewBox="0 0 560 100"
        preserveAspectRatio="none"
        className="block h-full w-full md:hidden"
        style={position === 'top' ? { transform: 'rotate(180deg)' } : undefined}
        focusable="false"
      >
        <path d="M0 85C18 83 20 72 34 67C50 61 61 75 72 72C82 69 86 50 95 35C108 13 135 12 152 29C167 44 163 64 179 74C195 85 210 71 218 55C226 40 246 34 258 48C270 63 268 78 283 84C301 91 318 83 327 68C339 47 359 40 375 51C392 63 389 81 406 87C423 93 442 84 448 65C456 40 475 31 491 42C507 54 501 73 519 83C533 90 548 82 560 77V100H0Z" />
      </svg>

      {/* Versão ampla com grupos de volumes de alturas e larguras variadas. */}
      <svg
        viewBox="0 0 1600 120"
        preserveAspectRatio="xMidYMid slice"
        className="hidden h-full w-full md:block"
        style={position === 'top' ? { transform: 'rotate(180deg)' } : undefined}
        focusable="false"
      >
        <path d="M0 92C45 91 50 80 69 76C92 70 103 89 120 86C137 84 143 60 155 42C171 19 200 17 220 34C239 51 231 75 252 84C273 95 295 82 306 65C319 45 342 47 355 63C367 79 366 89 386 90C420 92 450 92 479 90C503 88 512 69 526 52C545 28 575 20 597 35C620 50 618 74 640 84C660 94 687 83 694 59C704 28 730 13 757 24C785 36 786 65 807 81C829 99 853 91 868 74C887 51 881 32 907 25C931 18 952 32 958 57C966 88 988 96 1011 85C1033 74 1038 48 1063 36C1090 23 1120 32 1131 59C1141 84 1134 95 1161 98C1190 101 1210 80 1219 56C1230 28 1256 16 1278 28C1301 39 1300 67 1323 83C1344 98 1370 95 1387 77C1403 60 1396 38 1419 29C1442 20 1460 35 1468 59C1478 88 1500 95 1521 82C1540 71 1542 53 1560 52C1578 51 1588 67 1600 74V120H0Z" />
      </svg>
    </div>
  );
}
