import { CONTATO } from '@/data/contatoData';

export default function HoursCard() {
  return (
    <article data-reveal="right" className="site-contact-card bg-white">
      <p className="site-eyebrow site-eyebrow--pink">Horário de atendimento</p>
      <h2 className="site-card-title mt-4">Quando nos encontrar</h2>
      <div className="mt-7 overflow-hidden rounded-[20px] border border-[#EEE8EE] bg-[#FFFCFE]">
        {CONTATO.hours.map((item, index) => (
          <div
            key={item.day}
            className={`flex items-center justify-between gap-5 px-5 py-4 text-sm md:text-[15px] ${index !== CONTATO.hours.length - 1 ? 'border-b border-[#EEE8EE]' : ''}`}
          >
            <span className="font-extrabold text-[#463D49]">{item.day}</span>
            <span className="text-right font-semibold text-[#746B77]">{item.time}</span>
          </div>
        ))}
      </div>
      <p className="mt-5 text-sm leading-relaxed text-[#746B77]">
        Os atendimentos são realizados com horário agendado.
      </p>
    </article>
  );
}
