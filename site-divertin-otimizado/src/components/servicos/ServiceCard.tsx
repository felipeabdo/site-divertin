import Image from 'next/image';
import Link from 'next/link';
import type { Service } from '@/data/servicosData';
import Arrow from '../quem-somos/Arrow';

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[34px] bg-white shadow-[0_18px_50px_rgba(61,42,56,.10)] ring-1 ring-black/5 transition-transform duration-300 hover:-translate-y-1">
      <div className="relative h-60 overflow-hidden sm:h-72">
        <Image
          src={service.heroImage}
          alt={service.shortTitle}
          fill
          sizes="(max-width: 1023px) calc(100vw - 3rem), 45vw"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(180deg, transparent 35%, ${service.accent}dd 100%)` }}
        />
        <span className="absolute bottom-5 left-5 rounded-full bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-gray-700 backdrop-blur">
          {service.eyebrow}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-7 sm:p-8">
        <h3 className="text-2xl font-black leading-tight text-gray-800">{service.title}</h3>
        <p className="mt-4 text-base leading-relaxed text-gray-600">{service.description}</p>

        <div className="mt-7 flex items-center justify-between gap-4 border-t border-gray-100 pt-6">
          <span className="text-sm font-semibold text-gray-700">{service.audience}</span>
          <Link
            href={`/servicos/${service.slug}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: service.accent }}
          >
            Conhecer <Arrow />
          </Link>
        </div>
      </div>
    </article>
  );
}
