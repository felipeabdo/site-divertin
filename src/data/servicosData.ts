

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
  areas: ServiceArea[];
};

export const SERVICOS: Service[] = [
  {
    slug: 'fonoaudiologia-infantil',
    title: 'Fonoaudiologia Infantil & Linguagem',
    shortTitle: 'Fonoaudiologia Infantil',
    eyebrow: 'Fala • linguagem • comunicação',
    description:
      'Avaliação e acompanhamento fonoaudiológico para crianças de 2 a 14 anos, com estratégias individualizadas, acolhedoras e adequadas a cada fase do desenvolvimento.',
    audience: 'Crianças de 2 a 14 anos',
    heroImage: '/Jessica.jpeg',
    accent: '#D684BF',
    softAccent: '#F4CFE7',
    areas: [
      {
        title: 'Atraso de fala e linguagem',
        description:
          'Investigação e intervenção para crianças que demoraram a falar ou apresentam dificuldades para organizar e ampliar a comunicação.',
        icon: 'speech',
      },
      {
        title: 'Trocas de sons na fala',
        description:
          'Acompanhamento das alterações de pronúncia que podem deixar a fala pouco compreensível para outras pessoas.',
        icon: 'speech',
      },
      {
        title: 'Gagueira',
        description:
          'Acolhimento e orientação para compreender a fluência da fala e construir uma comunicação mais segura e funcional.',
        icon: 'speech',
      },
      {
        title: 'Desenvolvimento neurodivergente',
        description:
          'Foco em comunicação funcional, participação social e recursos que ajudem a criança a se expressar e interagir no dia a dia.',
        icon: 'brain',
      },
      {
        title: 'Motricidade orofacial e funções vitais',
        description:
          'Avaliação de aspectos ligados à mastigação, respiração oral e outras funções orofaciais, conforme a necessidade de cada criança.',
        icon: 'mouth',
      },
      {
        title: 'Integração com a equipe e a família',
        description:
          'O acompanhamento considera a rotina da criança e dialoga com família e outros profissionais quando necessário.',
        icon: 'sensory',
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
