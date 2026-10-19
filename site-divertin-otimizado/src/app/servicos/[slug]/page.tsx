import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Footer from '@/components/Footer';
import AreaGrid from '@/components/servicos/AreaGrid';
import ServiceCTA from '@/components/servicos/ServiceCTA';
import ServiceDetailHero from '@/components/servicos/ServiceDetailHero';
import { SERVICOS, getServicoBySlug } from '@/data/servicosData';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return SERVICOS.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServicoBySlug(slug);

  if (!service) {
    return { title: 'Especialidade não encontrada | Divertin' };
  }

  return {
    title: `${service.title} | Divertin`,
    description: service.description,
  };
}

export default async function ServicoDetalhePage({ params }: PageProps) {
  const { slug } = await params;
  const service = getServicoBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <ServiceDetailHero service={service} />
      <AreaGrid service={service} />
      <ServiceCTA accent={service.accent} />
      <Footer />
    </div>
  );
}
