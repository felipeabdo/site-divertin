import Botao from "@/components/Botao";
import NavBar from "@/components/NavBar";
import Cloud from "@/components/Cloud";
import { CONTATO } from "@/data/contatoData";
import Arrow from "../quem-somos/Arrow";

export default function ContactHero() {
  return (
    <section className="relative min-h-[580px] overflow-hidden lg:min-h-[650px]">
      <div aria-hidden className="absolute inset-0">
        <div className="absolute -inset-6 bg-[url('/bg-hero.png')] bg-cover bg-top bg-no-repeat blur-md" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(78,31,68,.94), rgba(214,132,191,.68) 58%, rgba(214,132,191,.35))",
          }}
        />
      </div>

      <header className="absolute inset-x-0 top-[25px] z-30 h-24 px-6">
        <div className="min-[1301px]:absolute min-[1301px]:left-1/2 min-[1301px]:top-8 min-[1301px]:-translate-x-1/2">
          <NavBar />
        </div>
      </header>

      <div className="relative z-10 mx-auto flex min-h-[580px] w-full max-w-6xl items-end px-6 pb-20 pt-36 lg:min-h-[650px] lg:pb-24">
        <div className="max-w-2xl text-white">
          <img
            src="/logo (1).png"
            alt="Logo Divertin"
            className="mb-6 h-auto w-44 object-contain sm:w-52 lg:w-60"
          />
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#FDD5A5]">
            Atendimento e agendamento
          </p>
          <h1 className="mt-4 text-4xl font-black font-avenir leading-tight sm:text-5xl lg:text-6xl">
            Vamos conversar?
          </h1>
          <p className="mt-5 max-w-xl text-base font-semibold leading-relaxed text-white/90 sm:text-lg">
            Tire suas dúvidas, agende uma avaliação e fale diretamente com a
            equipe da Divertin.
          </p>
          <div className="mt-7">
            <Botao
              cor="rosinha"
              href={CONTATO.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              largura="261px"
            >
              Falar pelo WhatsApp <Arrow />
            </Botao>
          </div>
        </div>
      </div>

      <img
        src="/mascote-divertin-contato.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[7%] right-[4%] z-[6] hidden w-[220px] drop-shadow-[0_16px_24px_rgba(0,0,0,.22)] lg:block xl:w-[280px]"
      />

      <div className="mt-[57]">
        <Cloud position="bottom" imageUrl="/cloud (6).png" />
      </div>
    </section>
  );
}
