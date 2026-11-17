"use client";

import { useEffect } from "react";

/**
 * Efeito de entrada ao rolar para o site inteiro.
 *
 * Como usar: basta colocar `data-reveal` em qualquer elemento (sem criar
 * wrappers, então o layout não muda):
 *
 *   data-reveal            -> sobe suavemente (padrão)
 *   data-reveal="left"     -> entra vindo da esquerda
 *   data-reveal="right"    -> entra vindo da direita
 *   data-reveal="zoom"     -> sobe e cresce levemente
 *   data-reveal-delay="200" (opcional, em ms) -> atraso manual
 *
 * Elementos que entram na tela ao mesmo tempo (ex.: 3 cards lado a lado)
 * são escalonados automaticamente, um logo após o outro.
 *
 * Sem JavaScript, ou se o IntersectionObserver não existir, nada é escondido.
 * Os estilos ficam em globals.css (bloco "Scroll reveal global").
 */

const SELECTOR = "[data-reveal]";
const MAX_STAGGER_MS = 360;
const STEP_MS = 90;

export default function ScrollRevealController() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const root = document.documentElement;
    const seen = new WeakSet<Element>();

    const reveal = (elements: HTMLElement[]) => {
      // Ordem visual: de cima para baixo e, na mesma linha, da esquerda p/ direita.
      const sorted = elements
        .map((el) => ({ el, rect: el.getBoundingClientRect() }))
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
        el.setAttribute("data-reveal-in", "");
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entering = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target as HTMLElement);

        if (!entering.length) return;

        entering.forEach((el) => observer.unobserve(el));
        reveal(entering);
      },
      {
        root: null,
        // Dispara quando o elemento já subiu um pouco acima da borda inferior.
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

    // Só passa a esconder os elementos depois que o observador está pronto.
    root.classList.add("reveal-on");
    scan(document);

    // Páginas trocadas pelo roteador e conteúdo que aparece depois (Suspense).
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (node instanceof Element) scan(node);
        });
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
      root.classList.remove("reveal-on");
    };
  }, []);

  return null;
}
