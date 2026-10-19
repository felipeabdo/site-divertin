import type { Service } from '@/data/servicosData';
import ServiceIcon from './Icon';
import SectionDashes from './SectionDashes';

export default function AreaGrid({ service }: { service: Service }) {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
      <SectionDashes color={service.accent} className="right-3 top-16 rotate-180" />

      <div className="max-w-3xl">
        <p className="text-sm font-black uppercase tracking-[0.18em]" style={{ color: service.accent }}>
          O que podemos acompanhar
        </p>
        <h2 className="mt-3 text-3xl font-black leading-tight text-gray-800 sm:text-4xl md:text-5xl">
          {service.shortTitle} com objetivos claros e adequados à criança
        </h2>
        <p className="mt-5 text-base leading-relaxed text-gray-600 sm:text-lg">
          As demandas abaixo não são etapas prontas: elas são pontos de partida para uma avaliação que considera a história, a rotina e as necessidades de cada criança.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {service.areas.map((area, index) => (
          <article
            key={area.title}
            className="relative rounded-[28px] border border-black/5 bg-white p-7 shadow-[0_14px_40px_rgba(61,42,56,.07)]"
          >
            <div
              className="grid h-14 w-14 place-items-center rounded-2xl"
              style={{ backgroundColor: `${service.softAccent}` }}
            >
              <ServiceIcon icon={area.icon} color={service.accent} />
            </div>
            <span
              className="absolute right-6 top-6 text-sm font-black"
              style={{ color: `${service.accent}99` }}
            >
              0{index + 1}
            </span>
            <h3 className="mt-6 text-xl font-black leading-tight text-gray-800">{area.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">{area.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
