import Botao from '@/components/Botao';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { CONTATO } from '@/data/contatoData';

export default function Home() {
  return (
    <div className="overflow-x-hidden min-h-screen bg-white">
      
      <section className="relative w-full min-h-[550px] md:min-h-[600px] lg:min-h-[920px] bg-[url(/bg-hero.png)] bg-cover bg-top bg-no-repeat pt-6 pb-20 flex flex-col justify-start items-start">
        
        
        <header className="w-full px-6 flex justify-between items-center h-24 relative z-20 min-[1301px]:justify-center">
          
          
          <div className="min-[1301px]:hidden mt-49">
            <img src="/logo (1).png" alt="Logo Divertin" className="w-48 h-auto object-contain"/>
          </div>

          
          <div className="min-[1301px]:absolute min-[1301px]:left-1/2 min-[1301px]:-translate-x-1/2 min-[1301px]:top-8 ">
            <NavBar />
          </div>
        </header>

        
        
        <div className="w-full px-6  flex flex-col items-start text-left pt-12 md:pt-24 min-[1301px]:pt-0 z-10 mt-25">
          
          
          <div className="w-full max-w-[250px] md:w-1/2 md:max-w-none lg:w-[45%] min-[1301px]:max-w-[500px] min-[1301px]:absolute min-[1301px]:top-15">
            
            
            <img src="/logo (1).png" alt="Logo Divertin" className="w-48 lg:w-60 h-auto hidden min-[1301px]:block mb-6 object-contain"/>
            
            <h1 className="text-white font-black font-avenir leading-tight max-[640px]:w-40 text-[26px] sm:text-[32px] md:text-[36px] lg:text-[40px] min-[1301px]:text-[44px] min-[1301px]:w-120 mb-4">
              <span className='text-[#F18B1F]'>"</span>Diversa em cuidado, única em conexão.<span className='text-[#F18B1F]'>"</span>
            </h1>
            
            <p className='text-white font-semibold font-avenir leading-relaxed text-[16px] md:text-base lg:text-lg mb-6 min-[1301px]:w-120'>
              Na Divertin, oferecemos atendimento personalizado em terapia infantil, com foco em comunicação, linguagem e desenvolvimento.
            </p>
            
            <div className="w-full sm:w-auto">
              <Botao cor="rosinha" href={CONTATO.whatsappUrl} target="_blank" rel="noreferrer">
                Quero agendar uma avaliação <img src="/arrow_forward.svg" alt="Seta do botão" className='inline ml-2'/>
              </Botao>
            </div>
          </div>
        </div>

        
        <div className="absolute bottom-0 left-0 w-full h-[30px] md:h-[70px] translate-y-[50%] z-10">
          <div className="w-full h-full bg-repeat-x bg-contain bg-bottom" style={{ backgroundImage: `url('/cloud (1).png')` }} aria-label="Divisor de seção" />
        </div>
      </section>

      
      <section className="w-full flex flex-col items-center px-6 py-12 max-w-7xl mx-auto gap-6 mt-6 md:mt-12">
        
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 w-full">
          <img src="/Jessica.jpeg" alt="Jéssica Del Corso" className='w-full max-w-sm rounded-4xl h-auto object-cover shadow-md'/>
          
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
              Quero agendar uma avaliação <img src="/arrow_forward.svg" alt="Seta do botão" className='inline ml-2'/>
            </Botao>
          </div>
        </div>

        
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-8'>
          <div className='flex flex-col items-center text-center p-4'>
            <img src="/Group 1.svg" alt="Ícone avaliação" className='mb-6 h-20 w-auto'/>
            <h3 className='font-bold text-lg mb-2 text-gray-800'>Avaliação e Atividades Personalizadas</h3>
            <p className='text-gray-600 text-sm leading-relaxed'>Cada criança é única — por isso, criamos planos de desenvolvimento individualizados, com atividades lúdicas que estimulam linguagem, comunicação e socialização de forma divertida.</p>
          </div>
          
          <div className='flex flex-col items-center text-center p-4'>
            <img src="/Group 1 (1).svg" alt="Ícone desenvolvimento" className='mb-6 h-20 w-auto'/>
            <h3 className='font-bold text-lg mb-2 text-gray-800'>Desenvolvimento na Primeira Infância</h3>
            <p className='text-gray-600 text-sm leading-relaxed'>Nossa abordagem é focada nas fases iniciais da vida. Trabalhamos com estratégias que fortalecem a comunicação, o brincar e o aprendizado desde os primeiros anos.</p>
          </div>
          
          <div className='flex flex-col items-center text-center p-4'>
            <img src="/Group 1 (2).svg" alt="Ícone equipe" className='mb-6 h-20 w-auto'/>
            <h3 className='font-bold text-lg mb-2 text-gray-800'>Equipe Especializada e Afetuosa</h3>
            <p className='text-gray-600 text-sm leading-relaxed'>Contamos com profissionais experientes em distúrbios da comunicação infantil, oferecendo acolhimento, escuta ativa e um acompanhamento terapêutico de confiança.</p>
          </div>
        </div>
      </section>
     
      <Footer></Footer>

    </div>
  );
}
