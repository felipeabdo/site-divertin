import Arrow from '../quem-somos/Arrow';
import SectionDashes from './SectionDashes';
import { CONTATO } from '@/data/contatoData';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import Cloud from '@/components/Cloud';

export default function ServiceCTA({ accent }: { accent: string }) {
  return (
    <section className="relative w-full bg-[#FBF8F4] px-6 pb-28 pt-10 md:pb-32 md:pt-14">
      <div className="mx-auto w-full max-w-6xl">
      <div data-reveal="zoom" className="relative overflow-hidden rounded-[28px] border border-[#E7EBC7] bg-gradient-to-br from-[#F5F8DF] via-[#F8F7EB] to-[#FBEAF4] px-6 py-12 text-center shadow-[0_16px_40px_rgba(59,43,57,.07)] sm:px-10 md:py-14">
        <SectionDashes color="#D684BF" className="left-8 top-8 rotate-45" />
        <SectionDashes color="#F7931E" className="bottom-7 right-8 -rotate-90" />
        <p className="site-eyebrow site-eyebrow--orange">Vamos conversar?</p>
        <h2 className="site-section-title mx-auto mt-4 max-w-3xl">
          A melhor forma de começar é entender a necessidade da sua criança.
        </h2>
        <p className="site-section-copy mx-auto mt-4 max-w-2xl">
          Entre em contato com a Divertin para saber mais sobre avaliação, acompanhamento e disponibilidade de atendimento.
        </p>
        <a
          href={CONTATO.whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="site-action mt-7 text-white shadow-md hover:-translate-y-0.5"
          style={{ backgroundColor: accent }}
        >
          <WhatsAppIcon /> Quero agendar uma avaliação <Arrow />
        </a>
      </div>
      </div>
      <Cloud position="bottom" color="#FFF5FA" />
    </section>
  );
}
