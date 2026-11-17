import Cloud from "../Cloud";
import { Dashes } from "./Decor";
import PlayIllustration from "./PlayIllustration";
import { H2, PAL } from "./data";

export default function CuidarSection() {
  return (
    <section className="relative bg-[#FFF4E8] pb-24 pt-24 md:pb-28 md:pt-28">
      <Dashes color={PAL.pink} className="left-[5%] top-14 hidden md:block" size={38} rotate={-15} />
      <Dashes color={PAL.green} className="bottom-16 right-[6%] hidden md:block" size={38} rotate={170} />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 px-6 md:grid-cols-[1.1fr_.9fr] md:gap-16">
        <div data-reveal="left" className="max-w-[630px]">
          <p className="site-eyebrow site-eyebrow--orange">Nosso jeito de cuidar</p>
          <h2 className={`${H2} site-section-title mt-4`}>Cuidar também pode ser divertido</h2>
          <p className="site-section-copy mt-5">
            Na <strong className="text-[#3F3544]">Divertin</strong>, o brincar é um recurso terapêutico. É brincando que a criança se engaja em atividades desafiadoras, experimenta, cria vínculos e encontra caminhos naturais para desenvolver comunicação, linguagem e autonomia. Cada atividade é pensada de forma individualizada, respeitando o ritmo, os interesses e as necessidades de cada criança.
          </p>
        </div>
        <div className="w-full max-w-[430px] justify-self-center md:justify-self-end">
          <PlayIllustration />
        </div>
      </div>

      <Cloud position="bottom" color="#FFFFFF" />
    </section>
  );
}
