import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Cloud from "@/components/Cloud";
import ContactForm from "@/components/contato/ContactForm";
import ContactHero from "@/components/contato/ContactHero";
import HoursCard from "@/components/contato/HoursCard";
import LocationSection from "@/components/contato/LocationSection";
import WhatsAppCard from "@/components/contato/WhatsAppCard";
import EasterSectionDecor from "@/components/seasonal/EasterSectionDecor";
import CarnivalScrollDecorations from "@/components/seasonal/CarnivalScrollDecorations";

export const metadata: Metadata = {
  title: "Contato | Divertin",
  description:
    "Entre em contato com a Clínica Divertin, veja nosso horário de atendimento e encontre nossa localização na Asa Sul, em Brasília.",
};

export default function ContatoPage() {
  return (
    <div className="site-page relative isolate min-h-screen overflow-x-clip bg-white">
      <ContactHero />

      <section data-carnival-section="contact-band" className="site-contact-band relative isolate bg-[#FFF4E8] pb-28 pt-20 md:pb-32 md:pt-24">
        <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-6 px-6 lg:grid-cols-2 lg:gap-7">
          <WhatsAppCard />
          <HoursCard />
        </div>
        <EasterSectionDecor placement="contact-band" />
        <Cloud position="bottom" color="#FFFFFF" />
      </section>
      <LocationSection />
      <ContactForm />
      <Footer />
      <CarnivalScrollDecorations />
    </div>
  );
}
