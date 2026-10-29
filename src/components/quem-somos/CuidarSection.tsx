import Cloud from "../Cloud";
import { Dashes } from "./Decor";
import PlayIllustration from "./PlayIllustration";
import { H2, PAL } from "./data";


export default function CuidarSection() {
  return (
    <section
      className="relative pb-20 pt-24 md:pb-24 md:pt-28"
      style={{ background: PAL.orangeSoft }}
    >
      <Dashes
        color={PAL.pink}
        className="left-[4%] top-12 hidden md:block"
        size={40}
        rotate={-15}
      />
      <Dashes
        color={PAL.green}
        className="bottom-12 right-[5%] hidden md:block"
        size={40}
        rotate={170}
      />

      <div className="relative z-20 mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-[1.2fr_1fr]">
        <div>
          <h2 className={H2}>Cuidar também pode ser divertido</h2>
          <p className="mt-5 text-base leading-relaxed text-gray-700 md:text-lg">
            Na <strong className="text-gray-800">Divertin</strong>, o brincar é um recurso terapêutico. É brincando que a criança se engaja em atividades desafiadoras, experimenta, cria vínculos e encontra caminhos naturais para desenvolver comunicação, linguagem e autonomia. Cada atividade é pensada de forma individualizada, respeitando o ritmo, os interesses e as necessidades de cada criança.
          </p>
        </div>
        <PlayIllustration />
      </div>

      <Cloud position="bottom" />
    </section>
  );
}
