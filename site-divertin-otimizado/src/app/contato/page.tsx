import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Cloud from "@/components/Cloud";
import ContactForm from "@/components/contato/ContactForm";
import ContactHero from "@/components/contato/ContactHero";
import HoursCard from "@/components/contato/HoursCard";
import LocationSection from "@/components/contato/LocationSection";
import WhatsAppCard from "@/components/contato/WhatsAppCard";

export const metadata: Metadata = {
  title: "Contato | Divertin",
  description:
    "Entre em contato com a Clínica Divertin, veja nosso horário de atendimento e encontre nossa localização na Asa Sul, em Brasília.",
};

export default function ContatoPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <ContactHero />

      <section className="relative bg-[#FDD5A5] py-20 md:py-24">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 lg:grid-cols-[1.1fr_.9fr]">
          <WhatsAppCard />
          <HoursCard />
        </div>
        <Cloud position="bottom"/>
      </section>

      <LocationSection />
      <ContactForm />
      <Footer />
    </div>
  );
}
