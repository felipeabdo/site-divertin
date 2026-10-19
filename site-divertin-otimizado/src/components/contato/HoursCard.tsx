import { CONTATO } from '@/data/contatoData';

export default function HoursCard() {
  return (
    <article className="rounded-[34px] bg-white p-8 shadow-sm md:p-10">
      <p className="text-sm font-black uppercase tracking-[0.14em] text-gray-700">Horário de atendimento</p>
      <h2 className="mt-3 text-3xl font-black leading-tight text-gray-800 md:text-4xl">
        Quando nos encontrar
      </h2>
      <div className="mt-7 overflow-hidden rounded-3xl bg-white/75">
        {CONTATO.hours.map((item, index) => (
          <div
            key={item.day}
            className={`flex items-center justify-between gap-5 px-5 py-4 text-sm md:text-base ${
              index !== CONTATO.hours.length - 1 ? 'border-b border-black/10' : ''
            }`}
          >
            <span className="font-bold text-gray-800">{item.day}</span>
            <span className="font-semibold text-gray-600">{item.time}</span>
          </div>
        ))}
      </div>
      <p className="mt-5 text-sm leading-relaxed text-gray-600">
        Atendimentos são realizados com horário agendado.
      </p>
    </article>
  );
}
