import Image from 'next/image';
import Link from 'next/link';
import type { Service } from '@/data/servicosData';
import ServiceHeader from './ServiceHeader';
import SectionDashes from './SectionDashes';

export default function ServiceDetailHero({ service }: { service: Service }) {
  return (
    <section className="relative min-h-[720px] overflow-hidden lg:min-h-[760px]">
      <div aria-hidden className="absolute inset-0">
        <div className="absolute -inset-6">
          <Image
            src="/bg-hero.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-top blur-md"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, rgba(72,33,65,.94), ${service.accent}99 55%, ${service.accent}55)`,
          }}
        />
      </div>

      <ServiceHeader />

      <div className="relative z-10 mx-auto grid min-h-[720px] w-full max-w-6xl items-center gap-10 px-6 pb-24 pt-28 lg:grid-cols-[1.05fr_.95fr] lg:pb-20">
        <div className="max-w-2xl text-white">
          <Link
            href="/servicos"
            className="inline-flex items-center gap-2 text-sm font-bold text-white/85 transition-opacity hover:opacity-70"
          >
            ← Voltar para especialidades
          </Link>
          <p className="mt-8 text-sm font-black uppercase tracking-[0.18em] text-[#FDD5A5]">
            {service.eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">{service.title}</h1>
          <p className="mt-6 max-w-xl text-base font-semibold leading-relaxed text-white/90 sm:text-lg">
            {service.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full bg-white/12 px-5 py-3 text-sm font-bold ring-1 ring-white/20 backdrop-blur">
              {service.audience}
            </span>
            <span className="rounded-full bg-white/12 px-5 py-3 text-sm font-bold ring-1 ring-white/20 backdrop-blur">
              Atendimento individualizado
            </span>
          </div>
        </div>

        <figure className="relative mx-auto w-full max-w-[470px]">
          <div
            className="absolute -inset-4 rounded-[38%_28%_34%_30%/24%_32%_25%_34%]"
            style={{ backgroundColor: `${service.softAccent}cc` }}
            aria-hidden
          />
          <div className="relative overflow-hidden rounded-[36px] bg-white p-3 shadow-2xl">
            <div className="overflow-hidden rounded-[28px]">
              <Image
                src={service.heroImage}
                alt=""
                width={600}
                height={750}
                sizes="(max-width: 1023px) 90vw, 470px"
                className="aspect-[4/5] w-full object-cover object-top"
              />
            </div>
          </div>
          <div
            className="absolute -bottom-5 -right-3 hidden h-20 w-20 rounded-full sm:block"
            style={{ backgroundColor: service.accent }}
            aria-hidden
          />
          <SectionDashes color="#FDD5A5" className="-right-8 -top-8 rotate-45" />
        </figure>
      </div>
    </section>
  );
}
