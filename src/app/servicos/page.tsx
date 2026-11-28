import type { Metadata } from "next";
import Image from "next/image";
import Footer from "@/components/Footer";
import Cloud from "@/components/Cloud";
import Logo from "@/components/Logo";
import ServiceCardGrid from "@/components/servicos/ServiceCardGrid";
import ServiceHeader from "@/components/servicos/ServiceHeader";
import ServicePrinciples from "@/components/servicos/ServicePrinciples";
import SectionDashes from "@/components/servicos/SectionDashes";
import ScrollReveal from "@/components/servicos/ScrollReveal";
import { SERVICOS } from "@/data/servicosData";
import EasterSectionDecor from "@/components/seasonal/EasterSectionDecor";
import CarnivalScrollDecorations from "@/components/seasonal/CarnivalScrollDecorations";

export const metadata: Metadata = {
  title: "Especialidades | Divertin",
  description:
    "Conheça as especialidades da Clínica Divertin: Fonoaudiologia Infantil e Pediatria, com cuidado individualizado para crianças.",
};

export default function ServicosPage() {
  return (
    <div className="site-page relative isolate min-h-screen overflow-x-clip bg-white">
      <section data-carnival-section="services-hero" className="site-hero relative isolate min-h-[700px] overflow-visible lg:min-h-[760px]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-6">
            <Image src="/bg-hero.webp" alt="" fill preload sizes="100vw" className="object-cover object-top blur-sm" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#35243A]/94 via-[#5B3657]/80 to-[#D684BF]/35" />
          <div className="site-hero-glow absolute inset-0" />
        </div>

        <ServiceHeader />

        <div className="site-hero-inner relative z-10 mx-auto flex min-h-[700px] w-full max-w-6xl items-end px-6 pb-28 pt-36 lg:min-h-[760px] lg:pb-32">
          <ScrollReveal className="site-hero-copy mt-0 max-w-[720px] text-white">
            <Logo className="mb-7" />
            <p className="site-hero-eyebrow">Cuidado infantil especializado</p>
            <h1 className="site-hero-title mt-4 font-avenir">Especialidades</h1>
            <p className="site-hero-lead mt-5 max-w-[650px]">
              Duas especialidades, um mesmo propósito: cuidar da criança de forma próxima, individualizada e conectada com a família.
            </p>
          </ScrollReveal>
        </div>

        <SectionDashes color="#FDD5A5" className="bottom-20 right-[8%] rotate-45" />
        <EasterSectionDecor placement="services-hero" />
        <Cloud position="bottom" color="#FFFFFF" />
      </section>

      <ServiceCardGrid services={SERVICOS} />
      <ServicePrinciples />
      <Footer />
      <CarnivalScrollDecorations />
    </div>
  );
}
