import type { Service } from "@/data/servicosData";
import ServiceCard from "./ServiceCard";
import SectionDashes from "./SectionDashes";
import Cloud from "@/components/Cloud";

export default function ServiceCardGrid({ services }: { services: Service[] }) {
  return (
    <section className="relative">
        <Cloud position="bottom" color="#FFF0DE" />
      <section className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
        <SectionDashes color="#D684BF" className="left-3 top-10 -rotate-12 md:top-16" />
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#F7931E]">
            Especialidades
          </p>
          <h2 className="mt-3 text-3xl font-black leading-tight text-gray-800 sm:text-4xl md:text-5xl">
            Cuidado especializado para cada fase do desenvolvimento
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
            Na Divertin, as especialidades trabalham com um olhar infantil,
            individualizado e próximo da família.
          </p>
        </div>
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </section>
    </section>
  );
}
