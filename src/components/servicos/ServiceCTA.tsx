import Arrow from '../quem-somos/Arrow';
import SectionDashes from './SectionDashes';
import { CONTATO } from '@/data/contatoData';
import WhatsAppIcon from '@/components/WhatsAppIcon';

export default function ServiceCTA({ accent }: { accent: string }) {
  return (
    <section className="relative mx-auto max-w-6xl px-6 pb-24">
      <div
        className="relative overflow-hidden rounded-[34px] px-7 py-12 text-center shadow-sm sm:px-10 md:py-14"
        style={{ backgroundColor: '#E6F08F' }}
      >
        <SectionDashes color="#D684BF" className="left-8 top-8 rotate-45" />
        <SectionDashes color="#F7931E" className="bottom-7 right-8 -rotate-90" />

        <p className="text-sm font-black uppercase tracking-[0.18em] text-gray-700">Vamos conversar?</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-black leading-tight text-gray-800 sm:text-4xl">
          A melhor forma de começar é entender a necessidade da sua criança.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-700 sm:text-base">
          Entre em contato com a Divertin para saber mais sobre avaliação, acompanhamento e disponibilidade de atendimento.
        </p>
        <a
          href={CONTATO.whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-7 inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-black text-white shadow-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: accent }}
        >
          <WhatsAppIcon /> Quero agendar uma avaliação <Arrow />
        </a>
      </div>
    </section>
  );
}
