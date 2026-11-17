'use client';

import { usePathname } from 'next/navigation';

function Bar({ className = '' }: { className?: string }) {
  return <span className={`ds-bar ${className}`} />;
}

function BrandHeader({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`ds-header ${dark ? 'ds-header--dark' : ''}`}>
      <div className="ds-nav-links" aria-hidden="true"><Bar /><Bar /><Bar /><Bar /></div>
      <Bar className="ds-nav-action" />
      <div className="ds-mobile-menu"><i /><i /><i /></div>
    </div>
  );
}

function HeroCopy({ variant = 'home' }: { variant?: 'home' | 'services' | 'contact' | 'about' }) {
  return (
    <div className={`ds-hero-copy ds-hero-copy--${variant}`}>
      <Bar className="ds-eyebrow" />
      <div className="ds-title-lines"><Bar /><Bar /><Bar className="ds-title-short" /></div>
      <div className="ds-paragraph"><Bar /><Bar /><Bar className="ds-line-short" /></div>
      <Bar className="ds-cta" />
    </div>
  );
}

function HomeSkeleton() {
  return <>
    <section className="ds-hero ds-hero--home">
      <div className="ds-home-art" aria-hidden="true"><i /><i /><i /></div>
      <BrandHeader />
      <HeroCopy />
      <div className="ds-cloud-edge" />
    </section>
    <section className="ds-section ds-home-intro">
      <div className="ds-intro-copy"><Bar className="ds-heading-line" /><Bar className="ds-heading-line short" /><div className="ds-paragraph"><Bar /><Bar /><Bar className="ds-line-short" /></div><Bar className="ds-cta" /></div>
      <div className="ds-feature-grid">{[0,1,2].map((n) => <article key={n}><Bar className="ds-feature-icon" /><Bar className="ds-feature-title" /><div className="ds-paragraph"><Bar /><Bar /><Bar className="ds-line-short" /></div></article>)}</div>
    </section>
    <section className="ds-section ds-reviews"><Bar className="ds-heading-line short" /><Bar className="ds-heading-line" /><div className="ds-review-grid">{[0,1,2].map(n=><div key={n}><Bar className="ds-review-stars"/><Bar/><Bar/><Bar className="ds-line-short"/></div>)}</div></section>
  </>;
}

function ServicesSkeleton() {
  return <>
    <section className="ds-hero ds-hero--photo"><BrandHeader /><HeroCopy variant="services" /><div className="ds-cloud-edge" /></section>
    <section className="ds-section ds-services"><Bar className="ds-eyebrow"/><Bar className="ds-heading-line"/><Bar className="ds-heading-line short"/><div className="ds-paragraph"><Bar/><Bar/><Bar className="ds-line-short"/></div><div className="ds-service-grid">{[0,1].map(n=><article key={n}><Bar className="ds-service-image"/><Bar className="ds-heading-line"/><div className="ds-paragraph"><Bar/><Bar/><Bar className="ds-line-short"/></div><Bar className="ds-cta"/></article>)}</div></section>
  </>;
}

function ContactSkeleton() {
  return <>
    <section className="ds-hero ds-hero--photo"><BrandHeader/><HeroCopy variant="contact"/><div className="ds-mascot-placeholder"/><div className="ds-cloud-edge"/></section>
    <section className="ds-contact-band"><div className="ds-contact-grid"><article className="ds-contact-card lime"><Bar className="ds-eyebrow"/><Bar className="ds-heading-line"/><Bar className="ds-heading-line short"/><div className="ds-paragraph"><Bar/><Bar/><Bar className="ds-line-short"/></div><Bar className="ds-cta"/></article><article className="ds-contact-card"><Bar className="ds-eyebrow"/><Bar className="ds-heading-line"/><Bar className="ds-heading-line short"/>{[0,1,2,3].map(n=><Bar key={n} className="ds-hours-row"/>)}</article></div></section>
    <section className="ds-section ds-location"><div><Bar className="ds-eyebrow"/><Bar className="ds-heading-line"/><Bar className="ds-heading-line short"/><div className="ds-paragraph"><Bar/><Bar/><Bar className="ds-line-short"/></div><Bar className="ds-address-card"/></div><Bar className="ds-map"/></section>
    <section className="ds-section ds-form"><Bar className="ds-heading-line short"/><Bar className="ds-heading-line"/><div className="ds-form-grid">{[0,1,2,3,4].map(n=><Bar key={n} className="ds-input"/>)}</div></section>
  </>;
}

function AboutSkeleton() {
  return <>
    <section className="ds-hero ds-hero--about"><BrandHeader/><HeroCopy variant="about"/><div className="ds-cloud-edge"/></section>
    <section className="ds-section ds-about-split"><div className="ds-about-photo"/><div><Bar className="ds-eyebrow"/><Bar className="ds-heading-line"/><Bar className="ds-heading-line short"/><div className="ds-paragraph"><Bar/><Bar/><Bar/><Bar className="ds-line-short"/></div></div></section>
    <section className="ds-section ds-team"><Bar className="ds-heading-line short"/><Bar className="ds-heading-line"/><div className="ds-team-grid">{[0,1,2].map(n=><div key={n}><Bar className="ds-team-photo"/><Bar className="ds-feature-title"/><Bar className="ds-line-short"/></div>)}</div></section>
  </>;
}

function AuthSkeleton({ settings = false }: { settings?: boolean }) {
  return <main className={`ds-auth-page ${settings ? 'ds-auth-page--settings' : ''}`}><div className="ds-auth-top"><Bar/>{settings && <Bar/>}</div>{settings ? <><div className="ds-settings-intro"><Bar className="ds-eyebrow"/><Bar className="ds-heading-line"/><Bar className="ds-line-short"/></div><div className="ds-settings-card"><div className="ds-settings-card-title"><Bar/><div><Bar/><Bar className="ds-line-short"/></div></div>{[0,1,2,3].map(n=><Bar key={n} className="ds-input"/>)}<Bar className="ds-cta"/></div><div className="ds-settings-card compact"><Bar className="ds-heading-line short"/><Bar/></div></> : <div className="ds-login-card"><Bar className="ds-eyebrow"/><Bar className="ds-heading-line"/><div className="ds-paragraph"><Bar/><Bar/></div><Bar className="ds-field-label"/><Bar className="ds-input"/><Bar className="ds-field-label"/><Bar className="ds-input"/><Bar className="ds-cta full"/></div>}</main>;
}

export default function Loading() {
  const pathname = usePathname() || '/';
  const isSettings = pathname.startsWith('/configuracoes');
  const isLogin = pathname.startsWith('/login');
  const isContact = pathname.startsWith('/contato');
  const isAbout = pathname.startsWith('/quem-somos');
  const isServices = pathname.startsWith('/servicos');
  return <main className="divertin-page-skeleton" aria-busy="true" aria-label="Carregando página" data-route={pathname}>
    <div className="ds-shimmer-layer" aria-hidden="true">
      {isSettings ? <AuthSkeleton settings/> : isLogin ? <AuthSkeleton/> : isContact ? <ContactSkeleton/> : isAbout ? <AboutSkeleton/> : isServices ? <ServicesSkeleton/> : <HomeSkeleton/>}
    </div>
    <span className="ds-loading-status">Carregando</span>
  </main>;
}
