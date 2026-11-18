import Image from 'next/image';
import Link from 'next/link';
import type { Service } from '@/data/servicosData';
import ServiceHeader from './ServiceHeader';
import SectionDashes from './SectionDashes';
import Cloud from '@/components/Cloud';
import EasterSectionDecor from '@/components/seasonal/EasterSectionDecor';

export default function ServiceDetailHero({ service }: { service: Service }) {
  return (
    <section data-carnival-section="service-detail-hero" className="site-hero relative isolate overflow-visible">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-6">
          <Image src="/bg-hero.webp" alt="" fill priority sizes="100vw" className="object-cover object-top blur-sm" />
        </div>
        <div className="absolute inset-0" style={{ background: `linear-gradient(112deg, rgba(53,36,58,.95) 0%, ${service.accent}C7 58%, ${service.accent}65 100%)` }} />
        <div className="site-hero-glow absolute inset-0" />
      </div>

      <ServiceHeader />

      <div className="site-hero-inner relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 px-6 pb-28 pt-36 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)] lg:gap-16 lg:pb-32 lg:pt-36">
        <div className="max-w-[650px] text-white">
          <Link href="/servicos" className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-bold text-white/95 backdrop-blur transition hover:bg-white/20 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-white">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="m14.5 5-7 7 7 7M8 12h12" /></svg> Voltar para especialidades
          </Link>
          <p className="site-hero-eyebrow mt-8">{service.eyebrow}</p>
          <h1 className="site-hero-title mt-4 font-avenir">{service.title}</h1>
          <p className="site-hero-lead mt-6 max-w-[590px]">
            {service.professionalBio || service.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full border border-white/25 bg-white/12 px-4 py-2.5 text-sm font-bold text-white backdrop-blur">
              {service.audience}
            </span>
            <span className="rounded-full border border-white/25 bg-white/12 px-4 py-2.5 text-sm font-bold text-white backdrop-blur">
              Atendimento individualizado
            </span>
          </div>
        </div>

        <figure data-reveal="right" className="relative mx-auto w-full max-w-[440px]">
          <div className="absolute -inset-3 rounded-[34px]" style={{ backgroundColor: `${service.softAccent}B8` }} aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white p-2.5 shadow-[0_24px_60px_rgba(35,22,37,.28)]">
            <div className="relative aspect-[4/4.3] overflow-hidden rounded-[21px] bg-[#F8F2F7]">
              <Image
                src={service.heroImage}
                alt={service.professionalName}
                fill
                sizes="(max-width: 1023px) 88vw, 430px"
                className="object-cover object-top"
              />
            </div>
            <figcaption className="px-4 pb-4 pt-5 text-center">
              <h2 className="text-lg font-black tracking-[0.07em] text-[#493B4A] sm:text-xl">{service.professionalName}</h2>
              {service.education && (
                <ul className="mt-3 flex flex-wrap justify-center gap-2">
                  {service.education.map((item, index) => (
                    <li key={index} className="max-w-full rounded-full border border-[#EEE4EC] bg-[#FBF7FA] px-3 py-1.5 text-[11px] font-semibold leading-snug text-[#665B68] sm:text-xs">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </figcaption>
          </div>
          <SectionDashes color="#FDD5A5" className="-right-8 -top-8 rotate-45" />
        </figure>
      </div>

      <EasterSectionDecor placement="service-detail" />
      <Cloud position="bottom" color="#FFFFFF" />
    </section>
  );
}
