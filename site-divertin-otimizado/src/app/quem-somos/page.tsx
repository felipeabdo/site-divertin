import type { Metadata } from "next";
import Footer from "@/components/Footer";
import ClinicSection from "@/components/quem-somos/ClinicSection";
import CtaSection from "@/components/quem-somos/CtaSection";
import CuidarSection from "@/components/quem-somos/CuidarSection";
import HeroSection from "@/components/quem-somos/HeroSection";
import TeamSection from "@/components/quem-somos/TeamSection";

export const metadata: Metadata = { title: "Quem Somos | Divertin" };

export default function QuemSomosPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <HeroSection />
      <CuidarSection />
      <TeamSection />
      <ClinicSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
