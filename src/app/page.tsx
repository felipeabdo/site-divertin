import Image from 'next/image';
import Botao from '@/components/Botao';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Logo from '@/components/Logo';
import HeroBackground from '@/components/HeroBackground';
import Cloud from '@/components/Cloud';
import Arrow from '@/components/quem-somos/Arrow';
import { CONTATO } from '@/data/contatoData';
import StaticGoogleReviewsSection from '@/components/home/StaticGoogleReviewsSection';
import { SeasonalSectionMoment } from '@/components/seasonal/SeasonalMoments';
import SeasonalHeroBackdrop from '@/components/seasonal/SeasonalHeroBackdrop';

const FEATURES = [
  {
    icon: '/Group 1.svg',
    alt: 'Ícone de avaliação personalizada',
    title: 'Avaliação e Plano Terapêutico Personalizados',
    text: 'Cada criança é única — por isso, criamos planos de desenvolvimento individualizados, com atividades lúdicas que estimulam linguagem, comunicação e socialização de forma divertida.',
    tone: 'bg-[#FCEAF4]',
  },
  {
    icon: '/Group 1 (1).svg',
    alt: 'Ícone de desenvolvimento infantil',
    title: 'Desenvolvimento na Primeira Infância',
    text: 'Nossa abordagem é focada nas fases iniciais da vida. Trabalhamos com estratégias que fortalecem a comunicação, o brincar e o aprendizado desde os primeiros anos.',
    tone: 'bg-[#EAF5EF]',
  },
  {
    icon: '/Group 1 (2).svg',
    alt: 'Ícone de equipe especializada',
    title: 'Equipe Experiente e Especializada',
    text: 'Contamos com profissionais experientes em distúrbios da comunicação infantil, sempre com raciocínio clínico assertivo, oferecendo acolhimento, escuta ativa e um acompanhamento terapêutico de confiança.',
    tone: 'bg-[#FFF1E2]',
  },
];

export default function Home() {
  return (
    <div className="site-page min-h-screen overflow-x-hidden bg-white">
      <section className="site-hero site-hero--home relative min-h-[760px] w-full lg:min-h-[820px]">
        <div className="absolute inset-0">
          <HeroBackground />
          <div className="absolute inset-0 bg-gradient-to-r from-[#35243A]/90 via-[#4B2B45]/64 to-[#4B2B45]/12" />
          <div className="site-hero-glow absolute inset-0" />
          <SeasonalHeroBackdrop placement="home" />
        </div>

        <header className="absolute inset-x-0 top-5 z-30 h-24 px-5 sm:px-7">
          <div className="min-[1301px]:absolute min-[1301px]:left-1/2 min-[1301px]:top-5 min-[1301px]:-translate-x-1/2">
            <NavBar />
          </div>
        </header>

        <div className="site-hero-inner relative z-10 mx-auto flex min-h-[760px] w-full max-w-6xl items-end px-6 pb-28 pt-36 lg:min-h-[820px] lg:pb-32">
          <div data-reveal-load className="site-hero-copy max-w-[720px] text-white">
            <Logo className="mb-7" />
            <p className="site-hero-eyebrow">Fonoaudiologia infantil e pediatria</p>
            <h1 className="site-hero-title mt-4 font-avenir">
              Diversa em cuidado, única em conexão.
            </h1>
            <p className="site-hero-lead mt-5 max-w-[620px]">
              Na Divertin, oferecemos atendimento personalizado em terapia infantil, com foco em comunicação, linguagem e desenvolvimento.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Botao cor="rosinha" href={CONTATO.whatsappUrl} target="_blank" rel="noreferrer">
                Quero agendar uma avaliação <Arrow />
              </Botao>
            </div>
          </div>
        </div>

        <Cloud position="bottom" color="#FFFFFF" />
      </section>

      <section className="site-section relative mx-auto w-full max-w-6xl px-6 pb-28 pt-16 md:pb-32 md:pt-20">
        <div data-reveal className="mx-auto max-w-3xl text-center">
          <p className="site-eyebrow site-eyebrow--pink">Cuidado que acompanha cada descoberta</p>
          <h2 className="site-section-title mt-4">
            Seu filho apresenta dificuldades na fala, comunicação ou aprendizado?
          </h2>
          <p className="site-section-copy mx-auto mt-5 max-w-[710px]">
            Esses sinais podem indicar distúrbios de linguagem ou comunicação que precisam de atenção especializada. Quanto antes for iniciado o acompanhamento, maiores são as chances de sucesso.
          </p>
          <p className="mx-auto mt-4 max-w-[710px] text-base font-semibold leading-relaxed text-[#514956] md:text-lg">
            Na Divertin, realizamos avaliação, diagnóstico e intervenção especializada, com abordagem lúdica, empática e eficiente.
          </p>
          <div className="mt-7 flex justify-center">
            <Botao cor="laranja_escuro" href={CONTATO.whatsappUrl} target="_blank" rel="noreferrer">
              Quero agendar uma avaliação <Arrow />
            </Botao>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {FEATURES.map((feature, index) => (
            <article
              key={feature.title}
              data-reveal
              data-reveal-delay={String(index * 100)}
              className="site-feature-card flex h-full flex-col items-center text-center"
            >
              <div className={`site-feature-icon ${feature.tone}`}>
                <Image src={feature.icon} alt={feature.alt} width={80} height={80} className="h-12 w-12 object-contain" />
              </div>
              <h3 className="mt-5 max-w-[19rem] text-lg font-extrabold leading-snug text-[#3F3544] md:text-xl">
                {feature.title}
              </h3>
              <p className="mt-3 max-w-[21rem] text-sm leading-[1.8] text-[#6D6570] md:text-[15px]">
                {feature.text}
              </p>
            </article>
          ))}
        </div>
        <SeasonalSectionMoment placement="home-features" />
        <Cloud position="bottom" color="#FFF4E8" />
      </section>

      <div className="seasonal-reviews-slot">
        <SeasonalSectionMoment placement="reviews" />
      </div>
      <StaticGoogleReviewsSection />
      <Footer />
    </div>
  );
}
