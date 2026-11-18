import Image from "next/image";
import Botao from "@/components/Botao";
import NavBar from "@/components/NavBar";
import Cloud from "@/components/Cloud";
import { CONTATO } from "@/data/contatoData";
import Arrow from "../quem-somos/Arrow";
import Logo from "@/components/Logo";
import SantaHat from "@/components/SantaHat";
import EasterSectionDecor from "@/components/seasonal/EasterSectionDecor";

export default function ContactHero() {
  return (
    <section data-carnival-section="contact-hero" className="site-hero relative isolate min-h-[700px] overflow-visible lg:min-h-[760px]">
      <div className="absolute inset-0 overflow-hidden">
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
        <div data-reveal-load className="site-hero-copy max-w-[680px] text-white">
          <Logo className="mb-7" />
          <p className="site-hero-eyebrow">Atendimento e agendamento</p>
          <h1 className="site-hero-title mt-4 font-avenir">Vamos conversar?</h1>
          <p className="site-hero-lead mt-5 max-w-[590px]">
            Tire suas dúvidas, agende uma avaliação e fale diretamente com a equipe da Divertin.
          </p>
          <div className="mt-8">
            <Botao cor="rosinha" href={CONTATO.whatsappUrl} target="_blank" rel="noreferrer">
              Falar pelo WhatsApp <Arrow />
            </Botao>
          </div>
        </div>
      </div>

      <div className="divertin-mascot-art divertin-mascot-art--contact pointer-events-none absolute bottom-[9%] right-[5%] z-[6] hidden w-[190px] lg:block xl:w-[245px]">
        <Image
          src="/mascote-divertin-contato.webp"
          alt=""
          aria-hidden="true"
          width={560}
          height={560}
          sizes="(min-width: 1280px) 245px, 190px"
          className="block h-auto w-full drop-shadow-[0_16px_24px_rgba(0,0,0,.20)]"
        />
        <SantaHat className="divertin-santa-hat--contact" />
      </div>

      <EasterSectionDecor placement="contact-hero" />
      <Cloud position="bottom" color="#FFF4E8" />
    </section>
  );
}
