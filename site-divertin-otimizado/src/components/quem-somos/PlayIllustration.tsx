import { Dashes } from './Decor';
import { PAL } from './data';

const STACK: [string, number][] = [[PAL.green, 48], [PAL.lime, 66], [PAL.orange, 82], [PAL.pink, 98]];


export default function PlayIllustration() {
  return (
    <div className="relative mx-auto h-[240px] w-full max-w-[350px]" aria-hidden>
      <div className="absolute inset-0 bg-white/60" style={{ borderRadius: '58% 42% 52% 48% / 55% 58% 42% 45%' }} />

      <div
        className="absolute left-[8%] top-[24%] h-[98px] w-[98px] rounded-full shadow-md"
        style={{ background: `conic-gradient(${PAL.lime} 0 25%, ${PAL.pink} 0 50%, ${PAL.orange} 0 75%, ${PAL.green} 0)` }}
      />

      <svg viewBox="0 0 24 24" className="absolute left-[44%] top-[44%] h-[66px] w-[66px] -rotate-6 drop-shadow">
        <polygon
          points="12 2.5 14.8 8.8 21.5 9.3 16.4 13.7 18 20.3 12 16.8 6 20.3 7.6 13.7 2.5 9.3 9.2 8.8"
          fill={PAL.orange} stroke={PAL.orange} strokeWidth="2" strokeLinejoin="round"
        />
        <circle cx="10" cy="12.5" r=".8" fill="#7a2f63" />
        <circle cx="14" cy="12.5" r=".8" fill="#7a2f63" />
        <path d="M10.2 14.6c1 .9 2.6.9 3.6 0" stroke="#7a2f63" strokeWidth=".7" fill="none" strokeLinecap="round" />
      </svg>

      <div className="absolute bottom-[14%] right-[5%] flex flex-col items-center gap-[3px]">
        <span className="h-[24px] w-[24px] rounded-full" style={{ background: PAL.pink }} />
        {STACK.map(([color, width]) => (
          <span key={color} className="h-[22px] rounded-full" style={{ background: color, width }} />
        ))}
      </div>

      <Dashes color={PAL.lime} className="right-[16%] top-[2%]" size={40} rotate={20} />
    </div>
  );
}
