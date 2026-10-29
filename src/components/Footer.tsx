import { CONTATO } from '@/data/contatoData';

export default function Footer() {
  return (
    <footer 
      className="w-full relative mt-[100px] bg-top bg-repeat-x flex flex-col justify-center items-center pt-[150px] md:pt-[240px] pb-20 px-6" 
      style={{ 
        backgroundImage: `url('/cloud bottom.png')`, 
        backgroundSize: 'cover' 
      }}
    >
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center relative z-10">
        
        {/* Seção de Certificações / Selos */}
        <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-8 md:gap-12 mb-10 opacity-85 hover:opacity-100 transition-opacity duration-300">
          
          {/* Certificação 1: MultiGestos (.webm em loop como se fosse GIF) */}
          <div className="h-30 md:h-30 flex items-center justify-center">
            <img 
              src="/multigestos.webp" 
              alt="Logo da Certificação PROMPT Institute" 
              className="h-full w-auto object-contain select-none"
            />
          </div>
          <div className="h-12 md:h-12 flex items-center justify-center">
            <img 
              src="/unb-fce.png" 
              alt="Logo da Universidade de Brasília, Campus Ceilândia." 
              className="h-full w-auto object-contain select-none"
            />
          </div>

          {/* Certificação 2: PROMPT Institute (.png) */}
          <div className="h-14 md:h-18 flex items-center justify-center">
            <img 
              src="/prompt-institute.png" 
              alt="Logo da Certificação PROMPT Institute" 
              className="h-full w-auto object-contain select-none"
            />
          </div>

          {/* Espaço reservado para o futuro selo de pediatria (opcional, remova se não quiser o contorno sumindo por enquanto) */}
          {/* <div className="h-14 md:h-18 px-4 flex items-center justify-center border border-dashed border-gray-400 rounded-lg text-gray-400 text-xs font-normal">
            Espaço Pediatria
          </div> */}

        </div>

        {/* Textos de Cópia e Informações Legais */}
        <div className="text-center font-medium text-xs md:text-[16px] text-gray-900 flex flex-col gap-2 mb-10">
          <p>© 2026 DIVERTIN - SRTVS Quadra 701, Centro Empresarial Multiempresarial, Bloco O, Sala 203 - Asa Sul, Brasília - DF</p>
          <p>CEP: 70340-000 - Telefone: {CONTATO.phoneDisplay} - CNPJ: 35.602.615/0001-72</p>
        </div>

      </div>
    </footer>
  );
}
