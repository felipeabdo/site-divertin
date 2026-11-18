"use client";

import { useEffect } from "react";

/**
 * Efeito de entrada ao rolar para o site inteiro.
 * Mantém o movimento original, mas prepara a camada gráfica somente enquanto
 * cada elemento está animando. Isso evita criar dezenas de camadas permanentes
 * e reduz a pressão sobre a GPU durante a rolagem inicial.
 */

const SELECTOR = "[data-reveal]";
const MAX_STAGGER_MS = 360;
const STEP_MS = 90;

export default function ScrollRevealController() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const root = document.documentElement;
    const seen = new WeakSet<Element>();
    const pendingFrames = new Set<number>();

    const nextFrame = (callback: () => void) => {
      const frame = window.requestAnimationFrame(() => {
        pendingFrames.delete(frame);
        callback();
      });
      pendingFrames.add(frame);
    };

    const reveal = (entries: IntersectionObserverEntry[]) => {
      // Usa as medidas já fornecidas pelo IntersectionObserver: evita leituras
      // extras de layout (getBoundingClientRect) durante a rolagem.
      const sorted = entries
        .map((entry) => ({
          el: entry.target as HTMLElement,
          rect: entry.boundingClientRect,
        }))
        .sort((a, b) =>
          Math.abs(a.rect.top - b.rect.top) > 24
            ? a.rect.top - b.rect.top
            : a.rect.left - b.rect.left,
        );

      sorted.forEach(({ el }, index) => {
        const manual = Number(el.dataset.revealDelay);
        const delay = Number.isFinite(manual) && el.dataset.revealDelay !== undefined
          ? manual
          : Math.min(index * STEP_MS, MAX_STAGGER_MS);

        el.style.setProperty("--reveal-delay", `${delay}ms`);
        el.setAttribute("data-reveal-animating", "");

        // Dá ao navegador um ciclo para preparar a transformação antes de
        // trocar o estado visual, sem alterar a duração/easing da animação.
        nextFrame(() => {
          nextFrame(() => {
            if (!el.isConnected || !root.classList.contains("reveal-on")) return;
            el.setAttribute("data-reveal-in", "");
          });
        });
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entering = entries.filter((entry) => entry.isIntersecting);
        if (!entering.length) return;
        entering.forEach((entry) => observer.unobserve(entry.target));
        reveal(entering);
      },
      {
        root: null,
        rootMargin: "0px 0px -10% 0px",
        threshold: 0,
      },
    );

    const watch = (el: Element) => {
      if (seen.has(el) || el.hasAttribute("data-reveal-in")) return;
      seen.add(el);
      observer.observe(el);
    };

    const scan = (node: ParentNode) => {
      if (node instanceof Element && node.matches(SELECTOR)) watch(node);
      node.querySelectorAll(SELECTOR).forEach(watch);
    };

    const finishAnimation = (event: Event) => {
      if (!(event instanceof TransitionEvent) || event.propertyName !== "transform") return;
      const target = event.target;
      if (target instanceof HTMLElement && target.matches(`${SELECTOR}[data-reveal-animating]`)) {
        target.removeAttribute("data-reveal-animating");
      }
    };

    root.classList.add("reveal-on");
    scan(document);

    // Conteúdo inserido depois (rotas/Suspense) também recebe o mesmo efeito.
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (node instanceof Element) scan(node);
        });
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    document.addEventListener("transitionend", finishAnimation, true);
    document.addEventListener("transitioncancel", finishAnimation, true);

    return () => {
      mutations.disconnect();
      observer.disconnect();
      document.removeEventListener("transitionend", finishAnimation, true);
      document.removeEventListener("transitioncancel", finishAnimation, true);
      pendingFrames.forEach((frame) => window.cancelAnimationFrame(frame));
      pendingFrames.clear();
      root.classList.remove("reveal-on");
    };
  }, []);

  return null;
}
