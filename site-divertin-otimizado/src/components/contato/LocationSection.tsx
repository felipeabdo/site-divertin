import { CONTATO } from '@/data/contatoData';
import Arrow from '../quem-somos/Arrow';

const mapQuery = encodeURIComponent(`Clínica Divertin, ${CONTATO.address}`);
const mapUrl = `https://www.google.com/maps?q=${mapQuery}&output=embed`;

export default function LocationSection() {
  return (
    <section className="relative w-full bg-white py-20 md:py-24">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 lg:grid-cols-[1.05fr_.95fr] lg:items-start">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#D684BF]">Onde estamos</p>
          <h2 className="mt-3 text-3xl font-black leading-tight text-gray-800 sm:text-4xl">
            Fácil de encontrar na Asa Sul
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-600">
            A Divertin fica no Complexo Multiempresarial. Ao chegar ao local, procure o <strong>Bloco O</strong> e siga para a <strong>Sala 203</strong>.
          </p>

          <div className="mt-7 rounded-[34px] bg-[#F6F1E8] p-7">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-gray-500">Endereço</p>
            <p className="mt-3 text-base font-bold leading-relaxed text-gray-800">{CONTATO.address}</p>
            <a
              href={CONTATO.routeUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center rounded-full bg-[#D95F80] px-6 py-6 text-sm font-black text-white transition hover:opacity-90"
            >
              Abrir rota no Google Maps <Arrow />
            </a>
          </div>
        </div>

        <div className="overflow-hidden rounded-[38px] border-8 border-[#FDD5A5] bg-[#F6F1E8] shadow-sm">
          <iframe
            title="Mapa da Clínica Divertin"
            src={mapUrl}
            className="h-[380px] w-full md:h-[470px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
