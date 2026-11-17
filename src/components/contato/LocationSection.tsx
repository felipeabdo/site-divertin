import { CONTATO } from '@/data/contatoData';
import Arrow from '../quem-somos/Arrow';
import InteractiveMap from './InteractiveMap';
import Cloud from '@/components/Cloud';

const mapQuery = encodeURIComponent(`Clínica Divertin, ${CONTATO.address}`);
const mapUrl = `https://www.google.com/maps?q=${mapQuery}&output=embed`;

export default function LocationSection() {
  return (
    <section className="relative w-full bg-white pb-28 pt-20 md:pb-32 md:pt-24">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-9 px-6 lg:grid-cols-[.95fr_1.05fr] lg:gap-12">
        <div data-reveal className="max-w-[520px]">
          <p className="site-eyebrow site-eyebrow--pink">Onde estamos</p>
          <h2 className="site-section-title mt-4">Fácil de encontrar na Asa Sul</h2>
          <p className="site-section-copy mt-4">
            A Divertin fica no Complexo Multiempresarial. Ao chegar ao local, procure o <strong className="text-[#463D49]">Bloco O</strong> e siga para a <strong className="text-[#463D49]">Sala 203</strong>.
          </p>

          <div className="mt-7 rounded-[24px] border border-[#EEE8EE] bg-[#FBF8F4] p-6 sm:p-7">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#8A7E8B]">Endereço</p>
            <p className="mt-3 text-base font-bold leading-relaxed text-[#463D49]">{CONTATO.address}</p>
            <a
              href={CONTATO.routeUrl}
              target="_blank"
              rel="noreferrer"
              className="site-action mt-6 bg-[#A83D78] text-white hover:bg-[#913468]"
            >
              Abrir rota no Google Maps <Arrow />
            </a>
          </div>
        </div>

        <div data-reveal className="overflow-hidden rounded-[28px] border border-[#EEE8EE] bg-[#F8F4F8] p-2 shadow-[0_16px_40px_rgba(59,43,57,.08)]">
          <div className="overflow-hidden rounded-[21px]">
            <InteractiveMap src={mapUrl} title="Mapa da Clínica Divertin" />
          </div>
        </div>
      </div>
      <Cloud position="bottom" color="#FBF8F4" />
    </section>
  );
}
