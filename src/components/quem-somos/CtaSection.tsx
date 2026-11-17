import Botao from "@/components/Botao";
import Cloud from "@/components/Cloud";
import Arrow from "./Arrow";
import { Heart, StarShape } from "./Decor";
import { H2, PAL } from "./data";
import { CONTATO } from "@/data/contatoData";

export default function CtaSection() {
  return (
    <section className="relative mt-0 w-full bg-white px-6 pb-28 pt-10 md:pb-32 md:pt-14">
      <div className="mx-auto w-full max-w-6xl">
      <div data-reveal="zoom" className="relative overflow-hidden rounded-[30px] border border-[#E9EBC4] bg-gradient-to-br from-[#F6F8DF] via-[#F8F6E7] to-[#FBEAF4] px-6 py-14 text-center shadow-[0_18px_44px_rgba(74,60,61,.07)] sm:px-10 md:py-16">
        <Heart color={PAL.pink} className="left-[7%] top-[34%] hidden h-10 w-10 md:block" />
        <StarShape color={PAL.orange} className="bottom-[17%] right-[8%] hidden h-9 w-9 md:block" />
        <p className="site-eyebrow site-eyebrow--orange">Estamos por perto</p>
        <h2 className={`${H2} site-section-title mt-4`}>Vamos conversar?</h2>
        <p className="site-section-copy mx-auto mb-7 mt-4 max-w-[560px]">
          Conheça a <strong className="text-[#3F3544]">Divertin</strong> e descubra como podemos caminhar juntos no desenvolvimento da sua criança.
        </p>
        <div className="flex w-full justify-center">
          <Botao cor="laranja_escuro" href={CONTATO.whatsappUrl} target="_blank" rel="noreferrer">
            Agendar avaliação <Arrow />
          </Botao>
        </div>
      </div>
      </div>
      <Cloud position="bottom" color="#ffb3d9" />
    </section>
  );
}
