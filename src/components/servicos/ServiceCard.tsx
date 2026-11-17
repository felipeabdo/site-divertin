import Image from 'next/image';
import Link from 'next/link';
import type { Service } from '@/data/servicosData';
import Arrow from '../quem-somos/Arrow';

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <article data-reveal className="site-service-card group flex h-full flex-col overflow-hidden rounded-[26px] border border-[#EEE7ED] bg-white shadow-[0_14px_34px_rgba(59,43,57,.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_42px_rgba(59,43,57,.12)]">
      <div className="relative h-[260px] overflow-hidden sm:h-[300px]">
        <Image
          src={service.heroImage}
          alt={service.professionalName}
          fill
          sizes="(max-width: 1023px) calc(100vw - 3rem), 45vw"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.025]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2F2633]/55 via-transparent to-transparent" />
        <span className="absolute bottom-5 left-5 rounded-full border border-white/70 bg-white/95 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#514956] shadow-sm backdrop-blur">
          {service.eyebrow}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <h3 className="text-2xl font-extrabold leading-tight text-[#3F3544]">{service.title}</h3>
        <p className="mt-4 flex-1 text-[15px] leading-[1.8] text-[#706773]">{service.description}</p>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-[#F0EBF0] pt-6">
          <span className="text-sm font-bold text-[#665C69]">{service.audience}</span>
          <Link
            href={`/servicos/${service.slug}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#D684BF]"
            style={{ backgroundColor: service.accent }}
          >
            Conhecer <Arrow />
          </Link>
        </div>
      </div>
    </article>
  );
}
