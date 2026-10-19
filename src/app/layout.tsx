import type { Metadata } from "next";
import type { ReactNode } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

import ScreenSaver from "@/components/ScreenSaver";
import "./globals.css";


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
    images: [{ url: "/logo%20(1).png", alt: "Logo da Clínica Divertin" }],
  },
};


export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-full flex-col">
        
        <ScreenSaver src="/descanso.gif" idleMinutes={0.5} width={220} />
        {children}
        <GoogleAnalytics gaId="G-14VEB6PD4R" />
      </body>
    </html>
  );
}
