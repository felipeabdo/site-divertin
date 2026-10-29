import Image from 'next/image';
import Botao from '@/components/Botao';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Logo from '@/components/Logo';
import HeroBackground from '@/components/HeroBackground';
import Arrow from '@/components/quem-somos/Arrow';
import { CONTATO } from '@/data/contatoData';

export default function Home() {
  return (
    <div className="overflow-x-hidden min-h-screen bg-white">
      
      <section className="relative min-h-[580px] w-full overflow-hidden lg:min-h-[650px]">
        <div aria-hidden="true" className="absolute inset-0">
          <HeroBackground />
        </div>
        <header className="absolute inset-x-0 top-[25px] z-30 h-24 px-6">
          <div className="min-[1301px]:absolute min-[1301px]:left-1/2 min-[1301px]:top-8 min-[1301px]:-translate-x-1/2">
            <NavBar />
          </div>
        </header>

        <div className="relative z-10 mx-auto flex min-h-[580px] w-full max-w-6xl items-end px-6 pb-20 pt-36 lg:min-h-[650px] lg:pb-24 mb-[20]">
          <div className="max-w-2xl text-white">
            <Logo />

            <h1 className="mt-4 text-4xl font-black font-avenir leading-tight sm:text-5xl lg:text-6xl">
              <span className="text-[#F18B1F]">&quot;</span>Diversa em cuidado, única em conexão.<span className="text-[#F18B1F]">&quot;</span>
            </h1>

            <p className="mt-5 max-w-xl text-base font-semibold leading-relaxed text-white/90 sm:text-lg">
              Na Divertin, oferecemos atendimento personalizado em terapia infantil, com foco em comunicação, linguagem e desenvolvimento.
            </p>

            <div className="mt-7 w-full sm:w-auto">
              <Botao cor="rosinha" href={CONTATO.whatsappUrl} target="_blank" rel="noreferrer">
                Quero agendar uma avaliação <Arrow />
              </Botao>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 mb-[20] left-0 z-20 h-[55px] w-full translate-y-0 md:h-[70px] md:translate-y-[20%]]">
          <div
            className="h-full w-full bg-repeat-x bg-bottom bg-[length:auto_100%]  mt-[57]"
            style={{ backgroundImage: "url('/cloud (1).png')" }}
            aria-hidden="true"
          />
        </div>
      </section>

      
      <section className="w-full flex flex-col items-center px-6 py-12 max-w-7xl mx-auto gap-6 mt-6 md:mt-12">
        
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 w-full">
          <Image src="/Jessica.png" alt="Jéssica Del Corso" width={640} height={640} sizes="(min-width: 640px) 384px, calc(100vw - 48px)" className='w-full max-w-sm rounded-4xl h-auto object-cover shadow-md'/>
          
          <div className='flex flex-col items-center lg:items-start gap-6 text-center lg:text-left max-w-2xl'>
            <h2 className='text-3xl md:text-4xl font-medium leading-tight text-gray-800'>
              Seu filho apresenta dificuldades na fala, comunicação ou aprendizado?
            </h2>
            <p className='text-gray-600 text-base md:text-lg'>
              Esses sinais podem indicar distúrbios de linguagem ou comunicação que precisam de atenção especializada. Quanto antes for iniciado o acompanhamento, maiores são as chances de sucesso.
            </p>
            <p className='font-semibold text-gray-800 text-base md:text-lg'>
              Na Divertin, realizamos avaliação, diagnóstico e intervenção especializada, com abordagem lúdica, empática e eficiente.
            </p>
            <Botao cor='laranja_escuro' href={CONTATO.whatsappUrl} target="_blank" rel="noreferrer">
              Quero agendar uma avaliação <Arrow />
            </Botao>
          </div>
        </div>

        
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-8'>
          <div className='flex flex-col items-center text-center p-4 xl:w-[406] xl:text-justify xl:[text-align-last:center]'>
            <Image src="/Group 1.svg" alt="Ícone avaliação" width={80} height={80} className='mb-6 h-20 w-auto'/>
            <h3 className='font-bold text-lg mb-2 text-gray-800'>Avaliação e Plano Terapêutico Personalizados</h3>
            <p className='text-gray-600 text-sm leading-relaxed'>Cada criança é única — por isso, criamos planos de desenvolvimento individualizados, com atividades lúdicas que estimulam linguagem, comunicação e socialização de forma divertida.</p>
          </div>
          
          <div className='flex flex-col items-center text-center p-4 xl:w-[368] xl:ml-[25] xl:text-justify xl:[text-align-last:center]'>
            <Image src="/Group 1 (1).svg" alt="Ícone desenvolvimento" width={80} height={80} className='mb-6 h-20 w-auto'/>
            <h3 className='font-bold text-lg mb-2 text-gray-800'>Desenvolvimento na Primeira Infância</h3>
            <p className='text-gray-600 text-sm leading-relaxed'>Nossa abordagem é focada nas fases iniciais da vida. Trabalhamos com estratégias que fortalecem a comunicação, o brincar e o aprendizado desde os primeiros anos.</p>
          </div>
          
          <div className='flex flex-col items-center text-center p-4 xk:w-[406] xl:text-justify xl:[text-align-last:center]'>
            <Image src="/Group 1 (2).svg" alt="Ícone equipe" width={80} height={80} className='mb-6 h-20 w-auto'/>
            <h3 className='font-bold text-lg mb-2 text-gray-800'>Equipe Experiente e Especializada</h3>
            <p className='text-gray-600 text-sm leading-relaxed'>Contamos com profissionais experientes em distúrbios da comunicação infantil, sempre com raciocínio clínico assertivo, oferecendo acolhimento, escuta ativa e um acompanhamento terapêutico de confiança.</p>
          </div>
        </div>
      </section>
     
      <Footer></Footer>

    </div>
  );
}
