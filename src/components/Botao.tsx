import type { AnchorHTMLAttributes, CSSProperties, ReactNode } from "react";
import WhatsAppIcon from "@/components/WhatsAppIcon";

const CORES_DISPONIVEIS = {
  rosinha: "bg-divertin-rosa-escuro text-white hover:bg-divertin-rosa-escuro/90",
  rosa: "bg-divertin-rosa text-white hover:bg-divertin-rosa/90",
  azul: "bg-divertin-azul text-white hover:bg-divertin-azul/90",
  verde: "bg-divertin-verde text-white hover:bg-divertin-verde/90",
  amarelo: "bg-divertin-amarelo text-gray-900 hover:bg-divertin-amarelo/90",
  laranja_escuro: "bg-divertin-laranja-escuro text-white hover:bg-divertin-laranja-escuro/90",
} as const;

type ButtonType = "button" | "submit" | "reset";

interface BotaoProps {
  children: ReactNode;
  cor?: keyof typeof CORES_DISPONIVEIS;
  href?: string;
  target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  rel?: string;
  largura?: CSSProperties["width"];
  altura?: CSSProperties["height"];
  sombra?: CSSProperties["boxShadow"];
  type?: ButtonType;
}

export default function Botao({
  children,
  cor = "rosa",
  href,
  target,
  rel,
  largura = "auto",
  altura = "auto",
  sombra = "0 9px 24px rgba(75, 42, 68, .16)",
  type = "button",
}: BotaoProps) {
  const estiloBase =
    "inline-flex min-h-14 max-w-full cursor-pointer items-center justify-center gap-3 rounded-full px-6 py-4 text-center text-sm font-extrabold leading-snug shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[.98] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-3 focus-visible:outline-[#D684BF] sm:px-7 sm:text-[15px]";
  const className = `${estiloBase} ${CORES_DISPONIVEIS[cor]}`;
  const direcionaParaWhatsApp = Boolean(href && /(?:wa\.me|whatsapp\.com|api\.whatsapp)/i.test(href));

  const estiloDimensoes: CSSProperties = {
    width: largura,
    minHeight: altura === "auto" ? "3.5rem" : altura,
    height: altura === "auto" ? undefined : altura,
    boxShadow: sombra,
  };

  if (href) {
    const relSeguro =
      target === "_blank"
        ? [...new Set([...(rel ?? "noreferrer").split(/\s+/), "noopener"])].join(" ")
        : rel;

    return (
      <a href={href} target={target} rel={relSeguro} className={className} style={estiloDimensoes}>
        {direcionaParaWhatsApp && <WhatsAppIcon />}
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={className} style={estiloDimensoes}>
      {children}
    </button>
  );
}
