import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Cloud from "@/components/Cloud";
import ContactForm from "@/components/contato/ContactForm";
import ContactHero from "@/components/contato/ContactHero";
import HoursCard from "@/components/contato/HoursCard";
import LocationSection from "@/components/contato/LocationSection";
import WhatsAppCard from "@/components/contato/WhatsAppCard";
import { SeasonalSectionMoment } from "@/components/seasonal/SeasonalMoments";

export const metadata: Metadata = {
  title: "Contato | Divertin",
  description:
    "Entre em contato com a Clínica Divertin, veja nosso horário de atendimento e encontre nossa localização na Asa Sul, em Brasília.",
};

export default function ContatoPage() {
  return (
    <div className="site-page min-h-screen overflow-x-hidden bg-white">
      <ContactHero />

      <section className="site-contact-band relative bg-[#FFF4E8] pb-28 pt-20 md:pb-32 md:pt-24">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 lg:grid-cols-2 lg:gap-7">
          <WhatsAppCard />
          <HoursCard />
        </div>
        <Cloud position="bottom" color="#FFFFFF" />
      </section>

      <section className="seasonal-contact-story-slot">
        <SeasonalSectionMoment placement="contact" />
      </section>
      <LocationSection />
      <ContactForm />
      <Footer />
    </div>
  );
}
