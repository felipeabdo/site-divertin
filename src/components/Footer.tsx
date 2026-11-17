import Image from 'next/image';
import { CONTATO } from '@/data/contatoData';

const CREDENTIALS = [
  { src: '/unb-fce.webp', alt: 'Universidade de Brasília, Faculdade de Ceilândia', className: 'max-w-[150px]' },
  { src: '/lgpd.webp', alt: 'Selo de conformidade com a LGPD', className: 'max-w-[104px]' },
  { src: '/multigestos.webp', alt: 'Certificação Multigestos', className: 'max-w-[118px]' },
  { src: '/prompt-institute.webp', alt: 'Certificação PROMPT Institute', className: 'max-w-[150px]' },
];

export default function Footer() {
  return (
    <footer className="site-footer relative mt-0 w-full overflow-visible px-6 pb-10 pt-28 md:mt-0 md:pt-32">

      <div data-reveal className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center">
        <Image
          src="/logo-divertin-horizontal.webp"
          alt="Clínica Divertin — Terapia Infantil"
          width={689}
          height={286}
          className="mb-8 h-auto w-44 object-contain sm:w-52"
        />

        <p className="site-eyebrow site-eyebrow--pink mb-5">Formação e práticas reconhecidas</p>
        <div className="flex w-full flex-wrap items-center justify-center gap-x-8 gap-y-6 border-b border-[#EEDFE8] pb-9 md:gap-x-12">
          {CREDENTIALS.map((credential) => (
            <div key={credential.src} className="flex h-[66px] w-[150px] items-center justify-center">
              <Image
                src={credential.src}
                alt={credential.alt}
                width={180}
                height={90}
                sizes="150px"
                className={`max-h-[58px] h-auto w-auto object-contain ${credential.className}`}
              />
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          <p className="max-w-3xl text-sm font-semibold leading-relaxed text-[#514956] md:text-[15px]">
            SRTVS Quadra 701, Centro Empresarial Multiempresarial, Bloco O, Sala 203 — Asa Sul, Brasília — DF
          </p>
          <p className="text-xs leading-relaxed text-[#7B727D] md:text-sm">
            CEP: 70340-000 <span aria-hidden="true">·</span> Telefone: {CONTATO.phoneDisplay}
          </p>
          <p className="mt-2 text-[11px] font-semibold tracking-[0.06em] text-[#938A94]">
            © 2026 DIVERTIN <span aria-hidden="true">·</span> CNPJ: 35.602.615/0001-72
          </p>
        </div>
      </div>
    </footer>
  );
}
