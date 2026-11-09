export default function SectionDashes({ color, className = '' }: { color: string; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 40 40"
      fill="none"
      stroke={color}
      strokeWidth="4.5"
      strokeLinecap="round"
      className={`pointer-events-none absolute h-9 w-9 ${className}`}
    >
      <path d="M7 9l7 8" />
      <path d="M21 4l3 11" />
      <path d="M20 30l12-4" />
    </svg>
  );
}
