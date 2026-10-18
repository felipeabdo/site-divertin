'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, MouseEvent } from 'react';
import { createPortal } from 'react-dom';

type IconName = 'home' | 'face' | 'star' | 'chat';

interface NavLink {
  label: string;
  href: string;
  hoverColor: string;
  
  icon?: IconName;
  
  bg?: string;
  
  accent?: string;
}

interface NavBarProps {
  links?: NavLink[];
}

const defaultLinks: NavLink[] = [
  { label: 'HOME', href: '/', hoverColor: '#e079bc', icon: 'home', bg: '#fbdcea', accent: '#e8408a' },
  { label: 'QUEM SOMOS', href: '/quem-somos', hoverColor: '#f78c00', icon: 'face', bg: '#fde6c2', accent: '#fba10f' },
  { label: 'ESPECIALIDADES', href: '/servicos', hoverColor: '#65bf9d', icon: 'star', bg: '#cbebdd', accent: '#3dbd8a' },
  { label: 'CONTATO', href: '/contato', hoverColor: '#b7db00', icon: 'chat', bg: '#ebdcf4', accent: '#9b63b8' },
];


const NAVIGATION_TIMEOUT = 10000;


const BTN_OFFSET_Y = 36;


const BRUSH_OVERHANG = 6;


const SCROLL_SHOW_AT = 60;

const SCROLL_HIDE_AT = 10;


const bars = [0, 1, 2].map((i) => ({
  closed: { x: 24, y: 24 + (i - 1) * 8, a: 0 },
  open: [
    { x: 5.9, y: 9.8, a: 38 }, 
    { x: 1, y: 24, a: 0 }, 
    { x: 5.9, y: 38.2, a: -38 }, 
  ][i],
}));


const normalizePath = (p: string) => p.split(/[?#]/)[0].replace(/\/+$/, '') || '/';


const isActiveRoute = (href: string, pathname: string) => {
  const h = normalizePath(href);
  const p = normalizePath(pathname);
  return h === '/' ? p === '/' : p === h || p.startsWith(h + '/');
};











const HANDOFF_KEY = 'navbar-menu-handoff';

const setHandoff = () => {
  try {
    sessionStorage.setItem(HANDOFF_KEY, String(Date.now()));
  } catch {}
};

const clearHandoff = () => {
  try {
    sessionStorage.removeItem(HANDOFF_KEY);
  } catch {}
};


const consumeHandoff = () => {
  try {
    const t = Number(sessionStorage.getItem(HANDOFF_KEY));
    sessionStorage.removeItem(HANDOFF_KEY);
    return !!t && Date.now() - t < NAVIGATION_TIMEOUT;
  } catch {
    return false;
  }
};


const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;





function MenuIcon({ name }: { name: IconName }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: '#fff',
    strokeWidth: 1.9,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: 'w-full h-full',
    'aria-hidden': true,
  };

  switch (name) {
    case 'home':
      return (
        <svg {...common}>
          <path d="M3 11.5 12 4l9 7.5" />
          <path d="M5.5 10v9.5h13V10" />
          <path d="M10 19.5v-4.5h4v4.5" />
        </svg>
      );
    case 'face':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M7 9c2.6 0 4.6-1.1 5.6-2.8C13.4 7.9 15 9 17 9" />
          <path d="M8.6 14.2c.9 1.4 2 2.1 3.4 2.1s2.5-.7 3.4-2.1" />
          <circle cx="9.3" cy="11.6" r=".5" fill="#fff" />
          <circle cx="14.7" cy="11.6" r=".5" fill="#fff" />
        </svg>
      );
    case 'star':
      return (
        <svg {...common}>
          <polygon points="12 3.2 14.7 8.9 20.9 9.6 16.3 13.8 17.6 19.9 12 16.8 6.4 19.9 7.7 13.8 3.1 9.6 9.3 8.9" />
        </svg>
      );
    case 'chat':
      return (
        <svg {...common}>
          <path d="M6 4.5h12a2.5 2.5 0 0 1 2.5 2.5v7a2.5 2.5 0 0 1-2.5 2.5h-6.2L8 19.8v-3.8H6A2.5 2.5 0 0 1 3.5 13.5V7A2.5 2.5 0 0 1 6 4.5z" />
        </svg>
      );
  }
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
      aria-hidden
    >
      <path d="M4 12h16M13.5 5.5 20 12l-6.5 6.5" />
    </svg>
  );
}






function DrawerDecorations() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      
      <svg
        viewBox="0 0 380 270"
        className="absolute top-0 left-0 block"
        style={{ width: 'clamp(110px, 39vw, 400px)', height: 'auto' }}
      >
        <path
          d="M0 0H370C352 62 298 98 225 98C152 98 120 140 86 180C62 206 32 220 0 220Z"
          fill="#d684bf"
        />
        <g stroke="#ffc34d" strokeWidth="17" strokeLinecap="round" fill="none">
          <path d="M146 146 163 180" />
          <path d="M100 190 130 208" />
          <path d="M96 252 124 245" />
        </g>
      </svg>

      
      <svg
        viewBox="0 0 80 150"
        className="absolute right-0 block"
        style={{ top: '45%', width: 'clamp(28px, 8.5vw, 84px)', height: 'auto' }}
      >
        <g stroke="#ffc34d" strokeWidth="17" strokeLinecap="round" fill="none">
          <path d="M44 14 20 36" />
          <path d="M36 76 68 70" />
          <path d="M30 118 56 134" />
        </g>
      </svg>

      
      <svg
        viewBox="0 0 430 232"
        className="absolute bottom-0 left-0 block"
        style={{ width: 'clamp(120px, 46vw, 480px)', height: 'auto' }}
      >
        <path
          d="M0 8C90 -10 170 20 210 80C240 130 290 150 340 148C380 148 410 170 430 232H0Z"
          fill="#ffc455"
        />
      </svg>

      
      <svg
        viewBox="0 -80 551 322"
        className="absolute bottom-0 right-0 block"
        style={{ width: 'clamp(150px, 58vw, 600px)', height: 'auto' }}
      >
        <path
          d="M0 242C40 200 110 175 180 170C190 100 280 55 340 78C378 92 398 108 406 120C430 60 490 20 551 0V242Z"
          fill="#e286bb"
        />
        <g stroke="#3dbd8a" strokeWidth="17" strokeLinecap="round" fill="none">
          <path d="M455 -62 468 -20" />
          <path d="M397 -18 430 10" />
          <path d="M384 48 416 48" />
        </g>
      </svg>
    </div>
  );
}






interface DesktopMenuProps {
  links: NavLink[];
  pathname: string;
  className?: string;
  style?: CSSProperties;
}

function DesktopMenu({ links, pathname, className = '', style }: DesktopMenuProps) {
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [brushRect, setBrushRect] = useState<{ left: number; top: number; width: number } | null>(
    null,
  );
  
  const [brushAnimated, setBrushAnimated] = useState(false);

  const activeIndex = links.findIndex((l) => isActiveRoute(l.href, pathname));
  
  const targetIndex = hoveredIndex ?? (activeIndex >= 0 ? activeIndex : null);

  useIsoLayoutEffect(() => {
    let cancelled = false;

    const measure = () => {
      
      if (cancelled) return;
      const el = targetIndex !== null ? itemRefs.current[targetIndex] : null;
      if (!el) return;
      setBrushRect({
        left: el.offsetLeft - BRUSH_OVERHANG,
        
        top: el.offsetTop + el.offsetHeight - 1,
        width: el.offsetWidth + BRUSH_OVERHANG * 2,
      });
    };

    measure();
    window.addEventListener('resize', measure);
    
    document.fonts?.ready.then(measure);

    return () => {
      cancelled = true;
      window.removeEventListener('resize', measure);
    };
  }, [targetIndex, links]);

  useEffect(() => {
    if (!brushRect || brushAnimated) return;
    const id = requestAnimationFrame(() => setBrushAnimated(true));
    return () => cancelAnimationFrame(id);
  }, [brushRect, brushAnimated]);

  return (
    <ul className={`relative ${className}`} style={style} onMouseLeave={() => setHoveredIndex(null)}>
      
      {brushRect && targetIndex !== null && (
        <span
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            left: 0,
            top: brushRect.top,
            width: brushRect.width,
            height: 10,
            transform: `translateX(${brushRect.left}px)`,
            color: links[targetIndex].hoverColor,
            transition: brushAnimated
              ? 'transform 550ms cubic-bezier(.34,1.56,.64,1), width 550ms cubic-bezier(.34,1.56,.64,1), color 400ms ease'
              : 'none',
          }}
        >
          
          <svg
            key={targetIndex}
            viewBox="0 0 100 12"
            preserveAspectRatio="none"
            className="block w-full h-full"
            style={{
              transformOrigin: 'center',
              animation: brushAnimated ? 'brush-wobble 550ms ease-out' : 'none',
            }}
          >
            <path
              fill="currentColor"
              d="M1 7C6 3 22 8 40 5.5S72 3 88 5.5C95 6.5 99 6 99 7.5C98 10.5 82 9 62 10S22 11.5 5 10.2C1.5 9.6 0 8.4 1 7Z"
            />
          </svg>
        </span>
      )}

      {links.map((link, index) => (
        <li
          key={`desk-${index}`}
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          className="w-auto"
          onMouseEnter={() => setHoveredIndex(index)}
        >
          <Link
            href={link.href}
            onFocus={() => setHoveredIndex(index)}
            onBlur={() => setHoveredIndex(null)}
            className="block py-0"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}





export default function NavBar({ links = defaultLinks }: NavBarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  const [instant, setInstant] = useState(false);
  
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const prevPathname = useRef(pathname);
  const handoffChecked = useRef(false);
  const handoffActive = useRef(false);

  
  
  const [scrolled, setScrolled] = useState(false);
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const y = window.scrollY;
      
      setScrolled((prev) => (prev ? y > SCROLL_HIDE_AT : y > SCROLL_SHOW_AT));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  
  
  
  useIsoLayoutEffect(() => {
    if (!handoffChecked.current) {
      handoffChecked.current = true;
      handoffActive.current = consumeHandoff();
    }
    if (!handoffActive.current) return;

    setInstant(true);
    setIsOpen(true);

    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setInstant(false);
        setIsOpen(false);
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  const closeMenu = () => {
    setIsOpen(false);
    setPendingHref(null);
    clearHandoff();
  };

  const toggleMenu = () => {
    setIsOpen((open) => !open);
    setPendingHref(null);
    clearHandoff();
  };

  
  
  
  const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

    if (normalizePath(href) === normalizePath(pathname)) {
      closeMenu();
      return;
    }
    setPendingHref(href);
    setHandoff();
  };

  
  
  
  useEffect(() => {
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;
    closeMenu();
    
  }, [pathname]);

  
  useEffect(() => {
    if (!pendingHref) return;
    const t = setTimeout(closeMenu, NAVIGATION_TIMEOUT);
    return () => clearTimeout(t);
    
  }, [pendingHref]);

  
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
    
  }, [isOpen]);

  return (
    <div className="relative">
      
      <style>{`
        @keyframes navx-glow {
          0%   { transform: scale(.2); opacity: 0; }
          40%  { transform: scale(1.35); opacity: .95; }
          100% { transform: scale(1); opacity: 0; }
        }
      `}</style>

      <div className="fixed top-6 right-6 min-[1301px]:hidden w-12 h-12 flex items-center justify-center z-50">
        <button
          onClick={toggleMenu}
          className="w-full h-full focus:outline-none"
          aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isOpen}
        >
          <svg viewBox="0 0 48 48" className="w-full h-full overflow-visible" fill="none">
            <defs>
              <radialGradient id="navx-glow-grad">
                <stop offset="0%" stopColor="#ffd45e" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#ffd45e" stopOpacity="0" />
              </radialGradient>
              <filter id="navx-badge-shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#5a1f45" floodOpacity="0.28" />
              </filter>
            </defs>

            
            <g transform={`translate(0 ${BTN_OFFSET_Y})`}>
              
              <g
                style={{
                  transformOrigin: '24px 24px',
                  transform: isOpen ? 'scale(1.35) rotate(50deg)' : 'scale(1) rotate(0deg)',
                  opacity: isOpen ? 0 : 1,
                  transition: instant
                    ? 'none'
                    : isOpen
                      ? 'transform 350ms ease-in, opacity 250ms ease-in'
                      : 'transform 450ms cubic-bezier(.34,1.56,.64,1) 150ms, opacity 200ms ease 150ms',
                }}
              >
                <circle
                  cx="24"
                  cy="24"
                  r="27"
                  fill="#fff"
                  stroke="#fbdcea"
                  strokeWidth="3"
                  filter="url(#navx-badge-shadow)"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="33.5"
                  fill="none"
                  stroke="#ffc34d"
                  strokeWidth="3"
                  strokeLinecap="round"
                  pathLength={100}
                  strokeDasharray="3 7"
                />
              </g>

              
              <rect x="8" y="6" width="32" height="36" fill="transparent" />

              
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="url(#navx-glow-grad)"
                style={{
                  transformOrigin: '24px 24px',
                  opacity: 0,
                  animation:
                    isOpen && !instant ? 'navx-glow 800ms ease-out 280ms both' : 'none',
                }}
              />

              
              <g
                stroke="#e6007e"
                strokeWidth="4"
                strokeLinecap="round"
                style={{
                  transformOrigin: '24px 24px',
                  transform: isOpen ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(-120deg)',
                  opacity: isOpen ? 1 : 0,
                  transition: instant
                    ? 'none'
                    : isOpen
                      ? 'transform 550ms cubic-bezier(.34,1.56,.64,1) 280ms, opacity 150ms ease 280ms'
                      : 'transform 200ms ease-in, opacity 150ms ease',
                }}
              >
                <path d="M16 16 32 32M32 16 16 32" />
              </g>

              
              {bars.map((b, i) => {
                const p = isOpen ? b.open : b.closed;
                const delay = isOpen ? i * 60 : (2 - i) * 40;
                return (
                  <g
                    key={i}
                    style={{
                      transform: `translate(${p.x}px, ${p.y}px) rotate(${p.a}deg)`,
                      transition: instant
                        ? 'none'
                        : `transform 450ms cubic-bezier(.65,0,.35,1) ${delay}ms`,
                    }}
                  >
                    <line
                      x1="-11"
                      y1="0"
                      x2="11"
                      y2="0"
                      strokeWidth="4"
                      strokeLinecap="round"
                      style={{
                        stroke: isOpen ? '#ffc34d' : '#e6407d',
                        strokeDasharray: isOpen ? '8 22' : '22 22',
                        strokeDashoffset: isOpen ? -7 : 0,
                        transition: instant
                          ? 'none'
                          : `stroke 400ms ease ${delay}ms, stroke-dasharray 450ms ease ${delay}ms, stroke-dashoffset 450ms ease ${delay}ms`,
                      }}
                    />
                  </g>
                );
              })}
            </g>
          </svg>
        </button>
      </div>

      
      <style>{`
        @keyframes brush-wobble {
          0%   { transform: scaleY(.55) skewX(-14deg); }
          45%  { transform: scaleY(1.5) skewX(8deg); }
          75%  { transform: scaleY(.9) skewX(-3deg); }
          100% { transform: scaleY(1) skewX(0deg); }
        }
      `}</style>

      
      <DesktopMenu
        links={links}
        pathname={pathname}
        className="hidden min-[1301px]:flex min-[1301px]:flex-row min-[1301px]:gap-10 min-[1301px]:font-black min-[1301px]:text-[20px] text-white"
        style={{
          opacity: scrolled ? 0 : 1,
          visibility: scrolled ? 'hidden' : 'visible',
          transition: `opacity 200ms ease, visibility 0s linear ${scrolled ? '200ms' : '0s'}`,
        }}
      />

      
      {mounted &&
        createPortal(
          <div
            aria-hidden={!scrolled}
            className="fixed inset-x-0 top-4 z-50 hidden min-[1301px]:flex justify-center pointer-events-none"
            style={{
              transform: scrolled ? 'translateY(0)' : 'translateY(-140%)',
              opacity: scrolled ? 1 : 0,
              visibility: scrolled ? 'visible' : 'hidden',
              transition: scrolled
                ? 'transform 550ms cubic-bezier(.34,1.56,.64,1), opacity 250ms ease, visibility 0s'
                : 'transform 300ms ease-in, opacity 250ms ease, visibility 0s linear 300ms',
            }}
          >
            <div
              className="relative pointer-events-auto rounded-full"
              style={{
                padding: '12px 44px 18px',
                background: 'rgba(8, 8, 8, 0.28)', 
                
                
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '2px solid rgba(255,255,255,0.14)',
                boxShadow: '0 10px 30px -8px rgba(40,10,40,0.5)',
              }}
            >
              
              <svg
                viewBox="0 0 40 24"
                className="absolute -top-4 right-9 block w-9 h-5"
                fill="none"
                stroke="#ffc34d"
                strokeWidth="4"
                strokeLinecap="round"
                aria-hidden
              >
                <path d="M7 20 3 12" />
                <path d="M20 16V5" />
                <path d="M33 20 37 12" />
              </svg>

              <DesktopMenu
                links={links}
                pathname={pathname}
                className="flex flex-row gap-9 font-black text-[18px] text-white"
              />
            </div>
          </div>,
          document.body,
        )}

      
      <nav
        aria-hidden={!isOpen}
        className={`
          fixed inset-0 z-40 min-[1301px]:hidden
          overflow-y-auto overflow-x-hidden
          transition-[translate,transform,visibility] duration-300 ease-in-out
          ${isOpen ? 'translate-x-0 visible' : 'translate-x-full invisible'}
        `}
        style={{
          backgroundColor: '#faf8f4',
          
          ['--pill-h' as string]: 'clamp(52px, min(15.7vw, 11.5vh), 112px)',
          
          transition: instant ? 'none' : undefined,
        }}
      >
        <DrawerDecorations />

        
        <div className="relative z-10 min-h-full flex flex-col items-center py-6">
          <ul
            className="m-auto flex flex-col items-stretch list-none p-0"
            style={{
              width: 'min(92%, max(68%, 250px), 560px)',
              gap: 'clamp(12px, 2.7vh, 34px)',
            }}
          >
            {links.map((link, index) => {
              const accent = link.accent ?? link.hoverColor;
              const bg = link.bg ?? '#f3f3f3';
              const isPending = pendingHref === link.href;
              return (
                <li key={`mob-${index}`}>
                  <Link
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="flex items-center rounded-full transition-[transform,filter,opacity] duration-150 active:scale-[0.98] hover:brightness-[0.98]"
                    style={{
                      height: 'var(--pill-h)',
                      backgroundColor: bg,
                      paddingLeft: 'calc(var(--pill-h) * 0.22)',
                      paddingRight: 'calc(var(--pill-h) * 0.3)',
                      gap: 'calc(var(--pill-h) * 0.26)',
                      color: '#1f2a37',
                      opacity: pendingHref && !isPending ? 0.6 : 1,
                    }}
                  >
                    
                    <span
                      className="shrink-0 rounded-full flex items-center justify-center"
                      style={{
                        width: 'calc(var(--pill-h) * 0.68)',
                        height: 'calc(var(--pill-h) * 0.68)',
                        backgroundColor: accent,
                        padding: 'calc(var(--pill-h) * 0.15)',
                      }}
                    >
                      {link.icon && <MenuIcon name={link.icon} />}
                    </span>

                    
                    <span
                      className="flex-1 min-w-0 truncate"
                      style={{
                        fontFamily: "'Quicksand', 'Nunito', ui-rounded, system-ui, sans-serif",
                        fontWeight: 500,
                        fontSize: 'max(15px, calc(var(--pill-h) * 0.3))',
                        lineHeight: 1.1,
                        textTransform: 'lowercase',
                      }}
                    >
                      <span style={{ display: 'inline-block', textTransform: 'capitalize' }}>
                        {link.label.toLowerCase()}
                      </span>
                    </span>

                    
                    <span
                      className={`shrink-0 ${isPending ? 'animate-pulse' : ''}`}
                      style={{
                        width: 'calc(var(--pill-h) * 0.26)',
                        height: 'calc(var(--pill-h) * 0.26)',
                        color: accent,
                      }}
                    >
                      <ArrowIcon />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </div>
  );
}