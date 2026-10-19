import type { Metadata } from "next";
import Image from "next/image";
import Footer from "@/components/Footer";
import Cloud from "@/components/Cloud";
import ServiceCardGrid from "@/components/servicos/ServiceCardGrid";
import ServiceHeader from "@/components/servicos/ServiceHeader";
import ServicePrinciples from "@/components/servicos/ServicePrinciples";
import SectionDashes from "@/components/servicos/SectionDashes";
import { SERVICOS } from "@/data/servicosData";

export const metadata: Metadata = {
  title: "Especialidades | Divertin",
  description:
    "Conheça as especialidades da Clínica Divertin: Fonoaudiologia Infantil e Pediatria, com cuidado individualizado para crianças.",
};

export default function ServicosPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <section className="relative min-h-[580px] overflow-hidden lg:min-h-[650px]">
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
              background:
                "linear-gradient(90deg, rgba(78,31,68,.94), rgba(214,132,191,.70) 56%, rgba(214,132,191,.35))",
            }}
          />
        </div>

        <ServiceHeader />

        <div className="relative z-10 mx-auto flex min-h-[580px] w-full max-w-6xl items-end px-6 pb-20 pt-36 lg:min-h-[650px] lg:pb-24">
          <div className="mt-0 max-w-3xl text-white">
            <img
              src="/logo (1).png"
              alt="Logo Divertin"
              decoding="async"
              className="mb-6 h-auto w-44 object-contain sm:w-52 lg:w-60"
            />
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#FDD5A5]">
              Cuidado infantil especializado
            </p>
            <h1 className="mt-4 text-4xl font-avenir font-black leading-tight sm:text-5xl lg:text-6xl">
              Especialidades
            </h1>
            <p className="mt-5 max-w-2xl text-base font-semibold leading-relaxed text-white/90 sm:text-lg">
              Duas especialidades, um mesmo propósito: cuidar da criança de
              forma próxima, individualizada e conectada com a família.
            </p>
          </div>
        </div>

        <SectionDashes
          color="#FDD5A5"
          className="bottom-10 right-[8%] rotate-45"
        />
        <div className="mt-[155]">
          <Cloud position="bottom" />
        </div>
      </section>

      <ServiceCardGrid services={SERVICOS} />
      <ServicePrinciples />
      <Footer />
    </div>
  );
}
