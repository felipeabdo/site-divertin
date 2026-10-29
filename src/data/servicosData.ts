export type ServiceArea = {
  title: string;
  description: string;
  icon: 'speech' | 'brain' | 'mouth' | 'sensory' | 'pediatric';
};

export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  audience: string;
  heroImage: string;
  accent: string;
  softAccent: string;
  eyebrow: string;
  professionalName:string;
  professionalBio:string;
  education: string[],
  areas: ServiceArea[];
};

export const SERVICOS: Service[] = [
  {
    slug: 'fonoaudiologia-infantil',
    title: 'Fonoaudiologia Infantil & Linguagem',
    shortTitle: 'Fonoaudiologia Infantil',
    eyebrow: 'Fala • linguagem • comunicação',
    description: 'Avaliação e acompanhamento fonoaudiológico para crianças de 1 a 14 anos, com estratégias individualizadas, acolhedoras e adequadas a cada fase do desenvolvimento.',
    professionalName: 'JÉSSICA DEL CORSO',
    professionalBio: 'Com objetivos claros e adequados à criança. Abaixo as principais buscas da clínica que não são etapas prontas: elas são pontos de partida para uma avaliação que considera a história, a rotina e as necessidades de cada criança.',
    audience: 'Crianças de 1 a 14 anos',
    heroImage: '/Jessica.jpeg',
    accent: '#D684BF',
    softAccent: '#F4CFE7',
    education: [
    "Graduada em Fonoaudiologia",
    "Especialista em Desenvolvimento Infantil",
    "Aprimoramento em Linguagem e Fala"
    ],
    areas: [
      {
        title: 'Linguagem',
        description:
          'Sistema de símbolos e regras para construir sentido (significado, frases, narrativa e diálogo). O fonoaudiólogo atua no desenvolvimento e reabilitação da compreensão e expressão oral, leitura e escrita, vocabulário, gramática e consciência fonológica.',
        icon: 'speech',
      },
      {
        title: 'Fala',
        description:
          'Parte física e motora de colocar a linguagem para fora por meio de sons, voz e articulação. A intervenção atua no treino e coordenação dos movimentos necessários para que a emissão ocorra de forma fluida, precisa e clara.',
        icon: 'speech',
      },
      {
        title: 'Processamento Auditivo Central (PAC)',
        description:
          'Capacidade de interpretar e organizar os sons que ouvimos. Suas alterações causam dificuldades para compreender a fala (principalmente no ruído), seguir instruções e discriminar sons, impactando a leitura, escrita e linguagem.',
        icon: 'brain',
      },
      {
        title: 'Motricidade Orofacial',
        description:
          'Avalia e trata as estruturas e funções dos órgãos orofaciais (lábios, língua, bochechas e mandíbula). Atua nas funções vitais de respiração, mastigação, deglutição, sucção e fala, corrigindo alterações que comprometem a comunicação.',
        icon: 'mouth',
      },
      {
        title: 'Comunicação Aumentativa e Alternativa (CAA)',
        description:
          'Utiliza gestos, símbolos, pranchas ou dispositivos eletrônicos para complementar ou substituir a fala. Uma ferramenta essencial que favorece a comunicação funcional, a autonomia e a participação social da criança.',
        icon: 'sensory',
      },
      {
        title: 'Atraso de Fala',
        description:
          'Condição em que a criança apresenta um ritmo de expressão verbal abaixo do esperado para sua idade. A intervenção precoce visa estimular a intenção comunicativa, expandir o vocabulário e estruturar as bases da linguagem.',
        icon: 'speech',
      },
      {
        title: 'Trocas na Fala',
        description:
          'Desvios fonológicos ou fonéticos onde a criança realiza substituições, omissões ou distorções de sons além da idade esperada. A terapia foca na percepção auditiva dos fonemas e na coordenação motora para a articulação correta.',
        icon: 'speech',
      },
      {
        title: 'Apraxia de Fala na Infância',
        description:
          'Distúrbio neurológico que afeta a precisão e constância dos movimentos da fala. A criança planeja a linguagem, mas o cérebro falha ao enviar os comandos motores para a boca. Tratamento baseado em pistas visuais, táteis e repetição.',
        icon: 'brain',
      },
      {
        title: 'Autismo (TEA)',
        description:
          'Transtorno do desenvolvimento com desafios na comunicação social, interação e comportamento. O acompanhamento fonoaudiológico expande as habilidades de comunicação funcional, promovendo independência e conexão com a família e escola.',
        icon: 'brain',
      },
      {
        title: 'Dislexia',
        description:
          'Transtorno específico de aprendizagem, de origem neurobiológica, caracterizado pela dificuldade na fluência correta da leitura, decodificação e soletração. Intervenção focada no fortalecimento das habilidades auditivas e visuais.',
        icon: 'brain',
      },
      {
        title: 'Disgrafia',
        description:
          'Dificuldade que afeta a qualidade da escrita manual, ligada a disfunções na coordenação motora fina ou integração viso-motora. Auxilia no desenvolvimento do tônus, na preensão do lápis e na organização das letras no papel.',
        icon: 'brain',
      },
      {
        title: 'Respiração Bucal',
        description:
          'Alteração onde o padrão respiratório nasal é substituído pelo bucal, comprometendo a mastigação, a deglutição e o tônus facial. O tratamento realiza a reabilitação muscular para restabelecer a respiração adequada.',
        icon: 'mouth',
      },
      {
        title: 'Seletividade Alimentar',
        description:
          'Recusa, restrição ou aversão severa a alimentos por textura, cor, cheiro ou temperatura. A atuação fonoaudiológica promove a dessensibilização sensorial oral e a adequação mastigatória para uma alimentação segura e confortável.',
        icon: 'sensory',
      },
      {
        title: 'Síndrome de Down',
        description:
          'Condição genética que cursa com hipotonia muscular global. O acompanhamento precoce adequa as funções de sucção, mastigação, deglutição e respiração, potencializando o desenvolvimento da linguagem e a clareza da fala.',
        icon: 'brain',
      },
      {
        title: 'Síndrome de Rett',
        description:
          'Desordem neurológica complexa que causa perda progressiva das habilidades motoras e verbais. A abordagem fonoaudiológica prioriza a manutenção da comunicação por vias não verbais e o uso de tecnologias assistivas e CAA.',
        icon: 'brain',
      },
    ],
  },
  {
    slug: 'pediatria',
    title: 'Pediatria',
    shortTitle: 'Pediatria',
    eyebrow: 'saúde • desenvolvimento • prevenção',
    description:
      'Acompanhamento pediátrico com olhar atento ao crescimento, desenvolvimento e às necessidades individuais da criança e da família.',
    audience: 'Atendimento infantil',
    heroImage: '/card_fernanda.png',
    accent: '#F7931E',
    softAccent: '#FDD5A5',
    professionalName: "FERNANDA LIMA",
  professionalBio: "Texto personalizado para a pediatria focado no acompanhamento do crescimento e bem-estar integral da criança desde os primeiros dias de vida.",
  education: [
    "Médica - graduada pelo Centro Universitário de Brasília (UniCEUB)",
    "MR2 de Pediatria - residência médica em Pediatria pelo Hospital Universitário de Brasília (HUB/UnB)",
    "Atendimento ambulatorial em Pediatria",
    "Atenção à pessoa com Síndrome de Down, com Transtorno do Espectro Autista,  com doenças raras e Puericultura geral",
    "Promoção, prevenção e atenção integral à saúde de crianças e adolescentes"
    ],
    areas: [
      {
        title: 'Acompanhamento do desenvolvimento',
        description:
          'Observação contínua de marcos do desenvolvimento, crescimento e bem-estar infantil.',
        icon: 'pediatric',
      },
      {
        title: 'Orientação para a família',
        description:
          'Escuta e orientação para dúvidas comuns da infância, rotina, cuidados e sinais que merecem atenção.',
        icon: 'pediatric',
      },
      {
        title: 'Cuidado em conjunto',
        description:
          'Quando necessário, o olhar pediátrico pode dialogar com a equipe terapêutica para favorecer um cuidado mais integrado.',
        icon: 'pediatric',
      },
    ],
  },
];

export const getServicoBySlug = (slug: string) =>
  SERVICOS.find((servico) => servico.slug === slug);
