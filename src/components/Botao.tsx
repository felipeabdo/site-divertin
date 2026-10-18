import type { AnchorHTMLAttributes, CSSProperties, ReactNode } from "react";
import WhatsAppIcon from "@/components/WhatsAppIcon";


const CORES_DISPONIVEIS = {
  rosinha: "bg-divertin-rosa-escuro text-white hover:bg-divertin-rosa-escuro/90",
  rosa: "bg-divertin-rosa text-white hover:bg-divertin-rosa/90",
  azul: "bg-divertin-azul text-white hover:bg-divertin-azul/90",
  verde: "bg-divertin-verde text-white hover:bg-divertin-verde/90",
  amarelo: "bg-divertin-amarelo text-gray-800 hover:bg-divertin-amarelo/90",
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
  
  type?: ButtonType;
}


export default function Botao({
  children,
  cor = "rosa",
  href,
  target,
  rel,
  largura = "326px",
  altura = "70px",
  type = "button",
}: BotaoProps) {
  const estiloBase =
    "flex cursor-pointer items-center justify-start gap-2 rounded-full px-6 py-6 text-left font-bold shadow-sm transition-all active:scale-95 md:px-6 md:py-6";
  const className = `${estiloBase} ${CORES_DISPONIVEIS[cor]}`;
  const direcionaParaWhatsApp = Boolean(href && /(?:wa\.me|whatsapp\.com|api\.whatsapp)/i.test(href));

  const estiloDimensoes: CSSProperties = {
    width: largura,
    ...(altura ? { height: altura } : {}),
  };

  if (href) {
    
    
    const relSeguro =
      target === "_blank"
        ? [...new Set([...(rel ?? "noreferrer").split(/\s+/), "noopener"])].join(" ")
        : rel;

    return (
      <a
        href={href}
        target={target}
        
        rel={relSeguro}
        className={className}
        style={estiloDimensoes}
      >
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
