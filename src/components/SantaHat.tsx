/** Gorro decorativo exibido somente quando o tema sazonal de Natal está ativo. */
export default function SantaHat({ className = '' }: { className?: string }) {
  return <span aria-hidden="true" className={`divertin-santa-hat ${className}`.trim()} />;
}
