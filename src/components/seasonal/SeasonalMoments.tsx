'use client';

import { useState } from 'react';
import { useSiteTheme } from '@/components/auth/SiteExperienceProvider';
import { useSeasonalExperience } from './SeasonalExperienceProvider';

type Placement = 'hero' | 'home-features' | 'team' | 'principles' | 'contact' | 'reviews';

type Copy = {
  eyebrow: string;
  title: string;
  description: string;
  photo: string;
  photoAlt: string;
  credit: string;
  photoHref: string;
};

const CARNIVAL_COPY: Record<Placement, Copy> = {
  hero: {
    eyebrow: 'Carnaval brasileiro',
    title: 'A alegria também está no caminho.',
    description: 'Um tema que celebra movimento, encontros e cada pequena conquista.',
    photo: 'https://images.pexels.com/photos/31022399/pexels-photo-31022399/free-photo-of-vibrant-carnival-celebration-in-brasilia-streets.jpeg?auto=compress&dpr=1&h=750&w=1260',
    photoAlt: 'Foliões dançando em um bloco de Carnaval nas ruas de Brasília.',
    credit: 'Mendez · Pexels',
    photoHref: 'https://www.pexels.com/photo/vibrant-carnival-celebration-in-brasilia-streets-31022399/',
  },
  'home-features': {
    eyebrow: 'Nossa bateria de conquistas',
    title: 'Cada avanço merece aplausos.',
    description: 'No ritmo de cada criança, celebramos os passos que fazem a diferença.',
    photo: 'https://images.pexels.com/photos/15372412/pexels-photo-15372412/free-photo-of-dancers-dancing-samba-at-parade.jpeg?auto=compress&dpr=1&h=750&w=1260',
    photoAlt: 'Desfile de Carnaval com dançarinos e fantasias coloridas em movimento.',
    credit: 'Joel Garcia · Pexels',
    photoHref: 'https://www.pexels.com/photo/dancers-dancing-samba-at-parade-15372412/',
  },
  team: {
    eyebrow: 'Todo mundo no mesmo compasso',
    title: 'Uma equipe, muitos talentos.',
    description: 'Como em um bom bloco, cada pessoa contribui com seu jeito único de fazer acontecer.',
    photo: 'https://images.pexels.com/photos/36203648/pexels-photo-36203648/free-photo-of-vibrant-carnival-celebration-with-musicians.jpeg?auto=compress&dpr=1&h=750&w=1260',
    photoAlt: 'Grupo em desfile de rua com fantasias coloridas e bandeira brasileira.',
    credit: 'Olavi Anttila · Pexels',
    photoHref: 'https://www.pexels.com/photo/vibrant-carnival-celebration-with-musicians-36203648/',
  },
  principles: {
    eyebrow: 'No ritmo de cada criança',
    title: 'Cuidado em sintonia com a família.',
    description: 'Escuta, parceria e conhecimento se encontram para construir novas possibilidades.',
    photo: 'https://images.pexels.com/photos/30757849/pexels-photo-30757849/free-photo-of-vibrant-street-carnival-drummers-in-action.jpeg?auto=compress&dpr=1&h=750&w=1260',
    photoAlt: 'Percussionistas tocando tambores em um desfile de rua com fantasias coloridas.',
    credit: 'Ligia Camargo · Pexels',
    photoHref: 'https://www.pexels.com/photo/vibrant-street-carnival-drummers-in-action-30757849/',
  },
  contact: {
    eyebrow: 'Chegue mais, a casa é sua',
    title: 'Todo encontro pode começar com alegria.',
    description: 'Um primeiro contato acolhedor é o convite para construirmos uma nova história juntos.',
    photo: 'https://images.pexels.com/photos/31022399/pexels-photo-31022399/free-photo-of-vibrant-carnival-celebration-in-brasilia-streets.jpeg?auto=compress&dpr=1&h=750&w=1260',
    photoAlt: 'Foliã em fantasia tradicional durante uma celebração de Carnaval em Foz do Iguaçu.',
    credit: 'Kaká Souza · Pexels',
    photoHref: 'https://www.pexels.com/photo/vibrant-carnival-celebration-in-brasilia-streets-31022399/',
  },
  reviews: {
    eyebrow: 'Uma festa de boas histórias',
    title: 'Conquistas compartilhadas ficam ainda mais bonitas.',
    description: 'Cada família faz parte dessa roda de cuidado, confiança e celebração.',
    photo: 'https://images.pexels.com/photos/36203648/pexels-photo-36203648/free-photo-of-vibrant-carnival-celebration-with-musicians.jpeg?auto=compress&dpr=1&h=750&w=1260',
    photoAlt: 'Grupo de foliões celebrando o Carnaval com fantasias e instrumentos musicais.',
    credit: 'Carina Gonçalves · Pexels',
    photoHref: 'https://www.pexels.com/photo/vibrant-carnival-celebration-with-musicians-36203648/',
  },
};

const EASTER_COPY: Record<Placement, Copy> = {
  hero: {
    eyebrow: 'Páscoa: tempo de renovar',
    title: 'Toda descoberta pode florescer.',
    description: 'Um carinho de primavera para celebrar recomeços, afeto e novas conquistas.',
    photo: 'https://images.pexels.com/photos/2072163/pexels-photo-2072163.jpeg?auto=compress&cs=tinysrgb&w=1500',
    photoAlt: 'Coelho de chocolate, ovos coloridos e flores em uma composição de Páscoa.',
    credit: 'George Dolgikh · Pexels',
    photoHref: 'https://www.pexels.com/photo/white-flowers-between-brown-rabbit-figure-and-eggs-2072163/',
  },
  'home-features': {
    eyebrow: 'Tradição de Páscoa: a caça aos ovos',
    title: 'Pequenas descobertas, grandes alegrias.',
    description: 'Os ovos simbolizam vida nova. Escondemos um carinho por aqui: encontre os três ovinhos ao longo das páginas.',
    photo: 'https://images.pexels.com/photos/36616829/pexels-photo-36616829/free-photo-of-colorful-easter-egg-basket-with-flowers.jpeg?auto=compress&dpr=1&h=750&w=1260',
    photoAlt: 'Cesta de Páscoa com ovos decorados e flores da estação.',
    credit: 'TLK GentooExpressions · Pexels',
    photoHref: 'https://www.pexels.com/photo/colorful-easter-egg-basket-with-flowers-36616829/',
  },
  team: {
    eyebrow: 'Carinho que floresce em equipe',
    title: 'Cuidado feito de presença e parceria.',
    description: 'Família e profissionais lado a lado, cultivando novas possibilidades — como a vida que renasce na Páscoa.',
    photo: 'https://images.pexels.com/photos/7392776/pexels-photo-7392776.jpeg?auto=compress&cs=tinysrgb&w=1200',
    photoAlt: 'Ovos coloridos e flores em uma composição tradicional de Páscoa.',
    credit: 'Eleonora Sky · Pexels',
    photoHref: 'https://www.pexels.com/photo/decorative-easter-eggs-beside-flowers-during-easter-7392776/',
  },
  principles: {
    eyebrow: 'Um novo começo a cada encontro',
    title: 'Crescer também é descobrir.',
    description: 'O coelhinho, os ovos e as flores lembram a renovação. Nosso cuidado respeita o tempo de cada criança.',
    photo: 'https://images.pexels.com/photos/4108593/pexels-photo-4108593.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=750&w=1260',
    photoAlt: 'Cesta com ovos de Páscoa e coelho de chocolate em uma mesa clara.',
    credit: 'Polina Zimmerman · Pexels',
    photoHref: 'https://www.pexels.com/photo/pastel-colored-easter-eggs-and-chocolate-rabbit-4108593/',
  },
  contact: {
    eyebrow: 'Compartilhar também é celebrar',
    title: 'Um convite para começar algo novo.',
    description: 'Na tradição da Páscoa, carinho e partilha caminham juntos. Estamos prontas para ouvir sua família.',
    photo: 'https://images.pexels.com/photos/7392776/pexels-photo-7392776.jpeg?auto=compress&cs=tinysrgb&w=1200',
    photoAlt: 'Ovos decorados e flores em uma mesa de celebração da Páscoa.',
    credit: 'Eleonora Sky · Pexels',
    photoHref: 'https://www.pexels.com/photo/decorative-easter-eggs-beside-flowers-during-easter-7392776/',
  },
  reviews: {
    eyebrow: 'Histórias que renascem',
    title: 'Cada conquista abre espaço para a próxima.',
    description: 'A confiança das famílias nos inspira a seguir florescendo juntos, um passo de cada vez.',
    photo: 'https://images.pexels.com/photos/2072163/pexels-photo-2072163.jpeg?auto=compress&cs=tinysrgb&w=1200',
    photoAlt: 'Coelho de chocolate e ovos de Páscoa entre flores brancas.',
    credit: 'George Dolgikh · Pexels',
    photoHref: 'https://www.pexels.com/photo/white-flowers-between-brown-rabbit-figure-and-eggs-2072163/',
  },
};

function CarnivalBeatButton() {
  const [burst, setBurst] = useState(0);
  const [message, setMessage] = useState('Toque para celebrar uma conquista.');

  const celebrate = () => {
    setBurst((current) => current + 1);
    setMessage('Tum, tá, tum! Cada conquista merece ser celebrada.');
  };

  return (
    <div className="seasonal-moment-action-wrap">
      <button type="button" className="seasonal-moment-action seasonal-moment-action--carnival" onClick={celebrate}>
        <span aria-hidden="true">♫</span> Soltar confetes
      </button>
      <span className="seasonal-moment-feedback" role="status" aria-live="polite">{message}</span>
      {burst > 0 && (
        <span key={burst} className="seasonal-burst" aria-hidden="true">
          {Array.from({ length: 12 }, (_, index) => <i key={index} />)}
        </span>
      )}
    </div>
  );
}

function EasterEgg({ id, message, className = '' }: { id: string; message: string; className?: string }) {
  const { foundEggIds, discoverEgg } = useSeasonalExperience();
  const found = foundEggIds.includes(id);

  return (
    <div className={`seasonal-easter-egg ${className}`}>
      <button
        type="button"
        className={`seasonal-easter-egg__button ${found ? 'is-found' : ''}`}
        aria-label={found ? 'Ovinho encontrado' : 'Encontrar o ovinho escondido nesta fotografia'}
        aria-pressed={found}
        title={found ? 'Ovinho encontrado!' : 'Psst… tem um ovinho escondido aqui'}
        onClick={() => discoverEgg(id)}
        disabled={found}
      >
        <span aria-hidden="true" />
      </button>
      {found && <span className="seasonal-easter-egg__note" role="status">{message}</span>}
    </div>
  );
}

function EasterProgress() {
  const { foundEggCount } = useSeasonalExperience();
  return (
    <div className="seasonal-easter-progress" aria-live="polite">
      <span className="seasonal-easter-progress__eggs" aria-hidden="true">{[0, 1, 2].map((index) => <i key={index} className={index < foundEggCount ? 'is-found' : ''} />)}</span>
      <span>{foundEggCount === 3 ? 'Você encontrou os três ovinhos!' : `Caça aos ovinhos: ${foundEggCount} de 3`}</span>
    </div>
  );
}

function SeasonalMomentCard({ placement }: { placement: Placement }) {
  const { settings } = useSiteTheme();
  if (settings.theme !== 'carnaval' && settings.theme !== 'pascoa') return null;

  const isCarnival = settings.theme === 'carnaval';
  const copy = (isCarnival ? CARNIVAL_COPY : EASTER_COPY)[placement];

  return (
    <aside
      className={`seasonal-moment seasonal-moment--${settings.theme} seasonal-moment--${placement}`}
      aria-label={isCarnival ? 'Momento de Carnaval' : 'Momento de Páscoa'}
      data-seasonal-placement={placement}
    >
      <div className="seasonal-moment__photo-wrap">
        {/* Imagens fotográficas reais do Pexels; não são ilustrações geradas. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="seasonal-moment__photo"
          src={copy.photo}
          alt={copy.photoAlt}
          loading={placement === 'hero' ? 'eager' : 'lazy'}
          decoding="async"
          width="1200"
          height="800"
          onError={(event) => {
            const image = event.currentTarget;
            if (image.dataset.fallbackApplied === 'true') return;
            image.dataset.fallbackApplied = 'true';
            image.src = isCarnival
              ? 'https://images.pexels.com/photos/30757849/pexels-photo-30757849/free-photo-of-vibrant-street-carnival-drummers-in-action.jpeg?auto=compress&dpr=1&h=750&w=1260'
              : 'https://images.pexels.com/photos/2072163/pexels-photo-2072163.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=750&w=1260';
          }}
        />
        <a className="seasonal-moment__photo-credit" href={copy.photoHref} target="_blank" rel="noreferrer" aria-label={`Ver fotografia de ${copy.credit}`}>
          {copy.credit}
        </a>
        {isCarnival && (placement === 'hero' || placement === 'team') && <span className="seasonal-moment__ribbon seasonal-moment__ribbon--one" aria-hidden="true" />}
        {isCarnival && (placement === 'hero' || placement === 'team') && <span className="seasonal-moment__ribbon seasonal-moment__ribbon--two" aria-hidden="true" />}
        {isCarnival && placement === 'principles' && <span className="seasonal-moment__photo-beat" aria-hidden="true"><i /><i /><i /></span>}
        {settings.theme === 'pascoa' && placement === 'home-features' && <EasterEgg id="home-features" message="Uma descoberta linda! Continue procurando nas próximas páginas." className="seasonal-easter-egg--home" />}
        {settings.theme === 'pascoa' && placement === 'team' && <EasterEgg id="team" message="Encontrou mais um! O cuidado floresce em conjunto." className="seasonal-easter-egg--team" />}
        {settings.theme === 'pascoa' && placement === 'principles' && <EasterEgg id="principles" message="Último ovinho! Que novas descobertas venham por aí." className="seasonal-easter-egg--principles" />}
      </div>
      <div className="seasonal-moment__copy">
        <span className="seasonal-moment__eyebrow">{copy.eyebrow}</span>
        <h3>{copy.title}</h3>
        <p>{copy.description}</p>
        {isCarnival && placement === 'home-features' && <CarnivalBeatButton />}
        {settings.theme === 'pascoa' && <EasterProgress />}
      </div>
      {isCarnival && <span className="seasonal-moment__confetti" aria-hidden="true"><i /><i /><i /><i /><i /><i /></span>}
    </aside>
  );
}

export function SeasonalHeroMoment() {
  return <SeasonalMomentCard placement="hero" />;
}

export function SeasonalSectionMoment({ placement }: { placement: Exclude<Placement, 'hero'> }) {
  return <SeasonalMomentCard placement={placement} />;
}
