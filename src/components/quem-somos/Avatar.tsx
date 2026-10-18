import { PAL } from './data';


export default function Avatar({ tone }: { tone: string }) {
  return (
    <svg viewBox="0 0 300 200" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMax slice" aria-hidden>
      <rect width="300" height="200" fill={tone} />
      <path d="M70 30c30-30 80-26 110-4 30 20 50 60 20 90-30 30-90 20-120 0S40 50 70 30z" fill="#fff" opacity=".7" />
      <path d="M100 200c0-40 20-60 50-60s50 20 50 60z" fill="#fff" />
      <path d="M130 140l20 40 20-40z" fill={PAL.pink} />
      <path d="M108 78c0-34 18-52 42-52s42 18 42 52c0 30 6 60 12 90h-26l-6-52h-44l-6 52H96c6-30 12-60 12-90z" fill="#4a2c3d" />
      <ellipse cx="150" cy="88" rx="26" ry="32" fill="#f4d8c3" />
      <path d="M124 70c8 6 20 8 26-6 8 12 18 14 28 12-4-28-52-30-54-6z" fill="#4a2c3d" />
    </svg>
  );
}
