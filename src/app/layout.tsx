import type { Metadata } from "next";
import type { ReactNode } from "react";
import DeferredAnalytics from "@/components/DeferredAnalytics";
import DeferredScreenSaver from "@/components/DeferredScreenSaver";
import OfflineExperience from "@/components/offline/OfflineExperience";
import ScrollRevealController from "@/components/ScrollRevealController";
import SeasonalExperienceProvider from "@/components/seasonal/SeasonalExperienceProvider";
import SiteExperienceProvider from "@/components/auth/SiteExperienceProvider";
import { getSiteSettings, type SiteSettings } from "@/lib/auth";
import "./globals.css";


export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL("https://site-divertin.vercel.app"),
  title: "Clínica Divertin | Fonoaudiologia Infantil",
  description:
    "Fonoaudiologia infantil e acompanhamento especializado para crianças, com cuidado individualizado, acolhimento e parceria com a família.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Clínica Divertin",
    url: "/",
    title: "Clínica Divertin | Fonoaudiologia Infantil",
    description:
      "Fonoaudiologia infantil com atendimento acolhedor, lúdico e individualizado para crianças e suas famílias.",
    // O arquivo anterior não consta no inventário de public/ enviado; use um logo existente.
    images: [{ url: "/logo%20(1).webp", alt: "Logo da Clínica Divertin" }],
  },
};


export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  let initialSettings: SiteSettings = {
    theme: "padrao",
    announcement: { enabled: false, title: "", message: "" },
  };
  try {
    initialSettings = await getSiteSettings();
  } catch (error) {
    // O site continua acessível, mas o tema conhecido não é substituído por um falso sucesso.
    console.error("[Divertin] Não foi possível carregar as configurações do site no servidor.", error);
  }

  return (
    <html lang="pt-BR" data-site-theme={initialSettings.theme}>
      <body className="flex min-h-full flex-col">
        
      <SiteExperienceProvider initialSettings={initialSettings}>
      <SeasonalExperienceProvider>
      <OfflineExperience>
        <DeferredScreenSaver
          sources={[
            '/descanso.webp',
            '/descanso2.webp',
            '/descanso3.webp',
            '/descanso4.webp'
          ]}
          idleMinutes={5}
        />
        {children}
        <ScrollRevealController />
        <DeferredAnalytics gaId="G-14VEB6PD4R" />
      </OfflineExperience>
      </SeasonalExperienceProvider>
      </SiteExperienceProvider>
      </body>
    </html>
  );
}
