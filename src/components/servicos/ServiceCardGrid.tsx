import type { Service } from "@/data/servicosData";
import ServiceCard from "./ServiceCard";
import SectionDashes from "./SectionDashes";
import Cloud from "@/components/Cloud";
import ScrollReveal from "./ScrollReveal";
import EasterSectionDecor from "@/components/seasonal/EasterSectionDecor";

export default function ServiceCardGrid({ services }: { services: Service[] }) {
  return (
    <section data-carnival-section="services-grid" className="site-services-intro relative isolate bg-white">
      <section className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-24 pt-20 md:pb-28 md:pt-24">
        <SectionDashes color="#D684BF" className="left-3 top-12 -rotate-12 md:top-16" />
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <p className="site-eyebrow site-eyebrow--pink">Especialidades</p>
          <h2 className="site-section-title mt-4">
            Cuidado especializado para cada fase do desenvolvimento
          </h2>
          <p className="site-section-copy mx-auto mt-5 max-w-[680px]">
            Na Divertin, as especialidades trabalham com um olhar infantil, individualizado e próximo da família.
          </p>
        </ScrollReveal>
        <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-2 lg:gap-7">
          {services.map((service, index) => (
            <ScrollReveal key={service.slug} delay={index * 130}>
              <ServiceCard service={service} />
            </ScrollReveal>
          ))}
        </div>
      </section>
      <EasterSectionDecor placement="services-grid" />
      <Cloud position="bottom" color="#FFF4E8" />
    </section>
  );
}
