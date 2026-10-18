import { CONTATO } from '@/data/contatoData';
export default function Footer() {
  return (
    <footer 
      className="w-full relative mt-[-45px] bg-top bg-repeat-x flex flex-col justify-center items-center pt-[150px] md:pt-[240px] pb-20 px-6" 
      style={{ 
        backgroundImage: `url('/cloud bottom.png')`, 
        backgroundSize: 'cover' 
      }}
    >
      
      <div className="w-full max-w-4xl mx-auto text-center font-medium text-xs md:text-sm text-gray-700 flex flex-col gap-2 relative z-10 mb-20">
        <p>© 2026 DIVERTIN - SRTVS Quadra 701, Centro Empresarial Multiempresarial, Bloco O, Sala 203 - Asa Sul, Brasília - DF</p>
        <p>CEP: 70340-000 - Telefone: {CONTATO.phoneDisplay} - CNPJ: 35.602.615/0001-72</p>
      </div>
    </footer>
  );
}
