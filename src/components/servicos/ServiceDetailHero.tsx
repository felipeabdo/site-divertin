import Image from 'next/image';
import Link from 'next/link';
import type { Service } from '@/data/servicosData';
import ServiceHeader from './ServiceHeader';
import SectionDashes from './SectionDashes';

export default function ServiceDetailHero({ service }: { service: Service }) {
  return (
    <section className="relative min-h-[720px] overflow-hidden lg:min-h-[1000px]">
      <div aria-hidden className="absolute inset-0">
        <div className="absolute -inset-6">
          <Image
            src="/bg-hero.png"
            alt=""
            fill
            priority // Alterado de preload para priority (padrão correto do Next.js)
            sizes="100vw"
            className="object-cover object-top blur-md"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, rgba(72,33,65,.94), ${service.accent}99 55%, ${service.accent}55)`,
          }}
        />
      </div>

      <ServiceHeader />

      <div className="relative z-10 mx-auto grid min-h-[720px] w-full max-w-6xl items-center gap-10 px-6 pb-32 pt-28 lg:grid-cols-[1.05fr_.95fr] lg:pb-28">
        <div className="max-w-2xl text-white">
          <Link
            href="/servicos"
            className="inline-flex items-center gap-2 text-sm font-bold text-white/85 transition-opacity hover:opacity-70"
          >
            ← Voltar para especialidades
          </Link>
          <p className="mt-8 text-sm font-black uppercase tracking-[0.18em] text-[#FDD5A5]">
            {service.eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            {service.title}
          </h1>
          
          {/* TEXTO INSTITUCIONAL DINÂMICO DA PROFISSIONAL */}
          <p className="mt-6 max-w-xl text-base font-semibold leading-relaxed text-white/90 sm:text-lg">
            {service.professionalBio || service.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full bg-white/12 px-5 py-3 text-sm font-bold ring-1 ring-white/20 backdrop-blur">
              {service.audience}
            </span>
            <span className="rounded-full bg-white/12 px-5 py-3 text-sm font-bold ring-1 ring-white/20 backdrop-blur">
              Atendimento individualizado
            </span>
          </div>
        </div>

        <figure className="relative mx-auto w-full max-w-[470px]">
          <div
            className="absolute -inset-4 rounded-[38%_28%_34%_30%/24%_32%_25%_34%]"
            style={{ backgroundColor: `${service.softAccent}cc` }}
            aria-hidden
          />
          <div className="relative overflow-hidden rounded-[36px] bg-white p-3 shadow-2xl">
            <div className="overflow-hidden rounded-[28px]">
              <Image
                src={service.heroImage}
                alt=""
                width={600}
                height={750}
                sizes="(max-width: 1023px) 90vw, 470px"
                className="aspect-[4/5] w-full object-cover object-top"
              />
            </div>
          </div>
          <div
            className="absolute -bottom-5 -right-3 hidden h-20 w-20 rounded-full sm:block"
            style={{ backgroundColor: service.accent }}
            aria-hidden
          />
          <SectionDashes color="#FDD5A5" className="-right-8 -top-8 rotate-45" />

          {/* CONTAINER DO NOME E DA FORMAÇÃO DA PROFISSIONAL CORRIGIDO */}
          <div 
            className="absolute left-1/2 bottom-0 z-50 w-full text-center px-4" 
            style={{ transform: `translate(-50%, ${service.translateY ?? 64}px)` }}
          >
            {/* Nome Dinâmico */}
            <h2 className="text-xl font-black uppercase tracking-wider text-white whitespace-nowrap">
              {service.professionalName}
            </h2>
            
            {/* Lista de Formações Acadêmicas com design sutil em formato de tags pequenas */}
            {service.education && (
              <div className="mt-2 flex flex-wrap justify-center gap-1.5 max-w-[380px] mx-auto">
                {service.education.map((item, idx) => (
                  <span 
                    key={idx} 
                    className="text-[10px] sm:text-xs font-medium text-[#FDD5A5] bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>
        </figure>
      </div>
    </section>
  );
}

