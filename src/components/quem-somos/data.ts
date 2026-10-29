


export const CARD_JA_TEM_NOME = false;

export const IMG: Record<string, string | undefined> = {
  ana: '/card_ana.png',
  rafaela: '/card_rafaela.png',
  fernanda: '/Fernanda.png',
  clinicaGrande: '/img1.webp',
  clinica1: '/img2.png',
  clinica2: '/img3.png',
  clinica3: '/img4.png',
  clinica4: '/img5.png',
};


export const PAL = {
  lime: '#c8d93b', limeSoft: '#e6f08f',
  pink: '#d684bf', pinkSoft: '#f4cfe7',
  orange: '#f7931e', orangeSoft: '#fdd5a5',
  green: '#6fbf9f', greenSoft: '#bfe3d2',
};


export const H2 = 'text-3xl md:text-4xl font-medium leading-tight text-gray-800';



export type TeamMember = {
  name: string;
  role: string;
  src?: string;
  tone: string;
  icon?: string;
};


export const TEAM: TeamMember[] = [
  { name: 'Fernanda Lima', role: 'Pediatra', src: IMG.fernanda, tone: PAL.orangeSoft },
  { name: 'Rafaela', role: 'Fonoaudióloga', src: IMG.rafaela, tone: PAL.greenSoft, icon: '🦖' },
  { name: 'Ana Luiza', role: 'Fonoaudióloga', src: IMG.ana, tone: PAL.pinkSoft, icon: '🦖' },
];



export type ClinicPhoto = {
  src?: string;
  alt: string;
  tone: string;
  icon: string;
  radius: string;
};

export const CLINIC_MAIN: ClinicPhoto = {
  src: IMG.clinicaGrande,
  alt: 'Sala de atividades da clínica',
  tone: PAL.pinkSoft,
  icon: '🪑',
  radius: '60px 130px 90px 120px / 50px 90px 110px 90px',
};

export const CLINIC_GALLERY: ClinicPhoto[] = [
  { src: IMG.clinica1, alt: 'Espaço da clínica 1', tone: PAL.orangeSoft, icon: '📚', radius: '90px 60px 110px 50px / 80px 70px 90px 60px' },
  { src: IMG.clinica2, alt: 'Espaço da clínica 2', tone: PAL.greenSoft, icon: '🧗', radius: '60px 100px 50px 90px / 60px 80px 70px 90px' },
  { src: IMG.clinica3, alt: 'Espaço da clínica 3', tone: PAL.limeSoft, icon: '✏️', radius: '110px 60px 80px 40px / 90px 60px 70px 50px' },
  { src: IMG.clinica4, alt: 'Espaço da clínica 4', tone: PAL.pinkSoft, icon: '🪴', radius: '50px 110px 60px 100px / 60px 90px 80px 70px' },
];
