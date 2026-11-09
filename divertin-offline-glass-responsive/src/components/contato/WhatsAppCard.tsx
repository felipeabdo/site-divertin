import Botao from '@/components/Botao';
import { CONTATO } from '@/data/contatoData';
import Arrow from '../quem-somos/Arrow';

export default function WhatsAppCard() {
  return (
    <article className="relative overflow-hidden rounded-[34px] bg-[#E6F08F] p-8 shadow-sm md:p-10">
      <div className="mb-4 inline-flex rounded-full bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-gray-700">
        Atendimento rápido
      </div>
      <h2 className="text-3xl font-black leading-tight text-gray-800 md:text-4xl">
        Prefere falar com a gente?
      </h2>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-700">
        O WhatsApp é o caminho mais direto para tirar dúvidas e verificar a disponibilidade de horários.
      </p>
      <div className="mt-6">
        <Botao
          largura="226px"
          cor="laranja_escuro"
          href={CONTATO.whatsappUrl}
          target="_blank"
          rel="noreferrer"
          
        >
          Abrir WhatsApp <Arrow />
        </Botao>
      </div>
      <p className="mt-5 text-sm font-bold text-gray-700">{CONTATO.phoneDisplay}</p>
    </article>
  );
}
