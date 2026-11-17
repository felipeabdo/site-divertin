import Botao from '@/components/Botao';
import { CONTATO } from '@/data/contatoData';
import Arrow from '../quem-somos/Arrow';

export default function WhatsAppCard() {
  return (
    <article data-reveal="left" className="site-contact-card site-contact-card--whatsapp">
      <p className="site-eyebrow site-eyebrow--green">Atendimento rápido</p>
      <h2 className="site-card-title mt-4">Prefere falar com a gente?</h2>
      <p className="mt-4 max-w-xl text-base leading-[1.8] text-[#59635F]">
        O WhatsApp é o caminho mais direto para tirar dúvidas e verificar a disponibilidade de horários.
      </p>
      <div className="mt-7">
        <Botao largura="auto" cor="laranja_escuro" href={CONTATO.whatsappUrl} target="_blank" rel="noreferrer">
          Abrir WhatsApp <Arrow />
        </Botao>
      </div>
      <p className="mt-5 text-sm font-extrabold tracking-[0.02em] text-[#43534D]">{CONTATO.phoneDisplay}</p>
    </article>
  );
}
