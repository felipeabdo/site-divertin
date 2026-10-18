import type { Metadata } from "next";
import type { ReactNode } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

import ScreenSaver from "@/components/ScreenSaver";
import "./globals.css";


export const metadata: Metadata = {
  title: "Clínica Divertin | Fonoaudiologia Infantil",
  description:
    "Pacotes e condições especiais para acompanhamento terapêutico infantil com horários fixos.",
  openGraph: {
    title: "Clínica Divertin | Fonoaudiologia Infantil",
    description:
      "Acompanhamento terapêutico lúdico e especializado para crianças.",
    
    images: ["/logo-compartilhamento.png"],
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
