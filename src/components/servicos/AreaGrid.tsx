import type { Service } from '@/data/servicosData';
import ServiceIcon from './Icon';
import SectionDashes from './SectionDashes';
import Cloud from '@/components/Cloud';
import EasterSectionDecor from '@/components/seasonal/EasterSectionDecor';

export default function AreaGrid({ service }: { service: Service }) {
  return (
    <section data-carnival-section="service-areas" className="relative isolate mx-auto w-full max-w-6xl px-6 pb-28 pt-20 md:pb-32 md:pt-24">
      <SectionDashes color={service.accent} className="right-3 top-16 rotate-180" />

      <div data-reveal className="relative z-10 mx-auto max-w-3xl text-center">
        <p className="site-eyebrow" style={{ color: service.accent }}>
          O que podemos acompanhar
        </p>
        <h2 className="site-section-title mt-4">
          {service.shortTitle} com objetivos claros e adequados à criança
        </h2>
        <p className="site-section-copy mx-auto mt-5 max-w-[700px]">
          Estas são algumas das principais demandas que podem motivar uma avaliação. Elas são pontos de partida para um olhar que considera a história, a rotina e as necessidades de cada criança.
        </p>
      </div>

      <div className="relative z-10 mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {service.areas.map((area, index) => (
          <article
            key={area.title}
            data-reveal
            data-reveal-delay={String((index % 3) * 70)}
            className="site-area-card relative h-full rounded-[24px] border border-[#EEE7ED] bg-white p-6 shadow-[0_10px_28px_rgba(59,43,57,.055)] sm:p-7"
          >
            <div className="grid h-14 w-14 place-items-center rounded-[18px]" style={{ backgroundColor: service.softAccent }}>
              <ServiceIcon icon={area.icon} color={service.accent} />
            </div>
            <span className="absolute right-6 top-6 text-xs font-extrabold tracking-[0.08em]" style={{ color: `${service.accent}B0` }}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="mt-5 text-lg font-extrabold leading-snug text-[#3F3544]">{area.title}</h3>
            <p className="mt-3 text-sm leading-[1.8] text-[#706773]">{area.description}</p>
          </article>
        ))}
      </div>
      <EasterSectionDecor placement="service-detail" />
      <Cloud position="bottom" color="#FBF8F4" />
    </section>
  );
}
