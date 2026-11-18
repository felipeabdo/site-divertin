import SectionDashes from "./SectionDashes";
import ScrollReveal from "./ScrollReveal";
import Cloud from "@/components/Cloud";
import { SeasonalSectionMoment } from "@/components/seasonal/SeasonalMoments";

const PRINCIPLES = [
  {
    title: "Olhar individualizado",
    text: "Cada criança tem seu próprio ritmo, necessidades, interesses e formas de se comunicar.",
    color: "#D684BF",
    tone: "#F9EAF3",
    icon: "child",
  },
  {
    title: "Família por perto",
    text: "As orientações fazem sentido quando conseguem chegar à rotina real da criança e de quem cuida dela.",
    color: "#4F9B82",
    tone: "#E8F4EE",
    icon: "heart",
  },
  {
    title: "Equipe em diálogo",
    text: "Quando diferentes profissionais participam do cuidado, a comunicação entre eles ajuda a construir caminhos mais completos.",
    color: "#C66A24",
    tone: "#FFF0E1",
    icon: "conversation",
  },
] as const;

function PrincipleIcon({ name, color }: { name: (typeof PRINCIPLES)[number]['icon']; color: string }) {
  const common = {
    viewBox: "0 0 48 48",
    fill: "none",
    stroke: color,
    strokeWidth: 2.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-7 w-7",
    "aria-hidden": true,
  };

  if (name === "child") {
    return <svg {...common}><circle cx="24" cy="15" r="7" /><path d="M11 39c1.5-8 6-12 13-12s11.5 4 13 12M18 16h.1M30 16h.1M21 20c2 1.5 4 1.5 6 0" /></svg>;
  }
  if (name === "heart") {
    return <svg {...common}><path d="M24 39S7 29 7 17a9 9 0 0 1 17-4 9 9 0 0 1 17 4c0 12-17 22-17 22Z" /><path d="M15 24h6l3-5 4 10 3-5h3" /></svg>;
  }
  return <svg {...common}><path d="M8 11h32v21H22l-9 7v-7H8z" /><path d="M16 20h.1M24 20h.1M32 20h.1M16 26h16" /></svg>;
}

export default function ServicePrinciples() {
  return (
    <section className="site-principles relative overflow-visible bg-[#FFF4E8] pb-28 pt-20 md:pb-32 md:pt-24">
      <SectionDashes color="#6FBF9F" className="bottom-12 left-[6%] rotate-180" />
      <SectionDashes color="#D684BF" className="right-[6%] top-12 rotate-45" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <p className="site-eyebrow site-eyebrow--pink">Nosso jeito de cuidar</p>
          <h2 className="site-section-title mt-4">
            Especialidade sem deixar de enxergar a criança inteira
          </h2>
        </ScrollReveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3 md:gap-6">
          {PRINCIPLES.map((item, index) => (
            <ScrollReveal key={item.title} delay={index * 110}>
              <article className="site-principle-card h-full">
                <div className="grid h-14 w-14 place-items-center rounded-[18px]" style={{ backgroundColor: item.tone }} aria-hidden="true">
                  <PrincipleIcon name={item.icon} color={item.color} />
                </div>
                <h3 className="mt-5 text-xl font-extrabold leading-snug text-[#3F3544]">{item.title}</h3>
                <p className="mt-3 text-sm leading-[1.8] text-[#706773]">{item.text}</p>
              </article>
            </ScrollReveal>
          ))}
        </div>
        <SeasonalSectionMoment placement="principles" />
      </div>
      <Cloud position="bottom" color="#ffbdde" />
    </section>
  );
}
