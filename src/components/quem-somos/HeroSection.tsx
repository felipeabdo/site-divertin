import Image from "next/image";
import Botao from "@/components/Botao";
import NavBar from "@/components/NavBar";
import Arrow from "./Arrow";
import Logo from "@/components/Logo";
import Cloud from "../Cloud";
import { CONTATO } from "@/data/contatoData";

export default function HeroSection() {
  return (
    <section className="site-hero relative min-h-[700px] w-full overflow-visible lg:min-h-[760px]">
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-6">
          <Image src="/bg-hero.webp" alt="" fill preload sizes="100vw" className="object-cover object-top blur-sm" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#35243A]/92 via-[#4B2B45]/72 to-[#4B2B45]/24" />
        <div className="site-hero-glow absolute inset-0" />
      </div>

      <header className="absolute inset-x-0 top-5 z-30 h-24 px-5 sm:px-7">
        <div className="min-[1301px]:absolute min-[1301px]:left-1/2 min-[1301px]:top-5 min-[1301px]:-translate-x-1/2">
          <NavBar />
        </div>
      </header>

      <div className="site-hero-inner relative z-10 mx-auto flex min-h-[700px] w-full max-w-6xl items-end px-6 pb-28 pt-36 lg:min-h-[760px] lg:pb-32">
        <div data-reveal-load className="site-hero-copy max-w-[700px] text-white">
          <Logo className="mb-7" />
          <p className="site-hero-eyebrow">A clínica onde brincar também é cuidar</p>
          <h1 className="site-hero-title mt-4 font-avenir">Quem Somos</h1>
          <p className="site-hero-lead mt-5 max-w-[620px]">
            A Divertin nasceu do desejo de tornar o cuidado infantil mais acolhedor, leve e significativo. Somos uma clínica de fonoaudiologia que acredita que cada criança tem seu próprio jeito de se comunicar, aprender e se desenvolver.
          </p>
          <div className="mt-8">
            <Botao cor="rosinha" href={CONTATO.whatsappUrl} target="_blank" rel="noreferrer">
              Quero agendar uma avaliação <Arrow />
            </Botao>
          </div>
        </div>
      </div>

      <Cloud position="bottom" color="#FFF4E8" />
    </section>
  );
}
