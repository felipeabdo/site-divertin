import Botao from "@/components/Botao";
import Arrow from "./Arrow";
import { Heart, StarShape } from "./Decor";
import { H2, PAL } from "./data";
import { CONTATO } from '@/data/contatoData';

export default function CtaSection() {
  return (
    <section className="mx-auto mt-24 max-w-6xl px-6 pb-20">
      <div
        className="relative px-8 py-12 text-center"
        style={{
          background: PAL.limeSoft,
          borderRadius: "50px 130px 60px 120px / 50px 60px 90px 60px",
        }}
      >
        <Heart
          color={PAL.pink}
          className="left-[7%] top-[38%] hidden h-12 w-12 md:block"
        />
        <StarShape
          color={PAL.orange}
          className="bottom-[16%] right-[8%] hidden h-10 w-10 md:block"
        />
        <h2 className={H2}>Vamos conversar?</h2>
        <p className="mx-auto mb-6 mt-3 max-w-md text-base text-gray-600 md:text-lg">
          Conheça a <strong className="text-gray-800">Divertin</strong> e
          descubra como podemos caminhar juntos no desenvolvimento da sua
          criança.
        </p>
        <div className="flex w-full justify-center [&>*]:mx-0">
          <Botao largura="245px" cor="laranja_escuro" href={CONTATO.whatsappUrl} target="_blank" rel="noreferrer">
            Agendar avaliação <Arrow />
          </Botao>
        </div>
      </div>
    </section>
  );
}
