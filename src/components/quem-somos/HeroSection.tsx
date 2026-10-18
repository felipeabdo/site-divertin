import Botao from "@/components/Botao";
import NavBar from "@/components/NavBar";
import Arrow from "./Arrow";
import Cloud from "../Cloud";
import { PAL } from "./data";
import { CONTATO } from "@/data/contatoData";

export default function HeroSection() {
  return (
    <section className="relative min-h-[580px] w-full overflow-hidden lg:min-h-[650px]">
      
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-6 bg-[url(/bg-hero.png)] bg-cover bg-top bg-no-repeat blur-md" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(78,31,68,.94), rgba(214,132,191,.70) 56%, rgba(214,132,191,.35))",
          }}
        />
      </div>

      <header className="absolute inset-x-0 top-[25px] z-30 h-24 px-6">
        <div className="min-[1301px]:absolute min-[1301px]:left-1/2 min-[1301px]:top-8 min-[1301px]:-translate-x-1/2">
          <NavBar />
        </div>
      </header>

      <div className="relative z-10 mx-auto grid min-h-[580px] w-full max-w-6xl grid-cols-1 items-end gap-4 px-6 pb-20 pt-36 lg:min-h-[650px] lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-8 lg:pb-24">
        <div className="max-w-2xl pb-2 text-white lg:pb-0">
          <img
            src="/logo (1).png"
            alt="Logo Divertin"
            className="mb-6 h-auto w-44 object-contain sm:w-52 lg:w-60"
          />
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#FDD5A5]">
            A clínica onde brincar também é cuidar
          </p>
          <h1 className="mt-4 text-4xl font-black font-avenir leading-tight sm:text-5xl lg:text-6xl">
            Quem Somos
          </h1>
          <p className="mt-5 max-w-xl text-base font-semibold leading-relaxed text-white/90 sm:text-lg">
            A Divertin nasceu do desejo de tornar o cuidado infantil mais
            acolhedor, leve e significativo. Somos uma clínica de fonoaudiologia
            que acredita que cada criança tem seu próprio jeito de se comunicar,
            aprender e se desenvolver.
          </p>
          <div className="mt-7 w-full sm:w-auto">
            <Botao
              cor="rosinha"
              href={CONTATO.whatsappUrl}
              target="_blank"
              rel="noreferrer"              
            >
              Quero agendar uma avaliação <Arrow />
            </Botao>
          </div>
        </div>

?
      </div>

      <Cloud position="bottom" color={PAL.orangeSoft} />
    </section>
  );
}
