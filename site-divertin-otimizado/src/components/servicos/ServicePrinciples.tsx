import SectionDashes from "./SectionDashes";

const PRINCIPLES = [
  {
    title: "Olhar individualizado",
    text: "Cada criança tem seu próprio ritmo, necessidades, interesses e formas de se comunicar.",
    icon: "◔",
    color: "#D684BF",
  },
  {
    title: "Família por perto",
    text: "As orientações fazem sentido quando conseguem chegar à rotina real da criança e de quem cuida dela.",
    icon: "♡",
    color: "#6FBF9F",
  },
  {
    title: "Equipe em diálogo",
    text: "Quando diferentes profissionais participam do cuidado, a comunicação entre eles ajuda a construir caminhos mais completos.",
    icon: "✦",
    color: "#F7931E",
  },
];

export default function ServicePrinciples() {
  return (
    <section className="relative overflow-hidden bg-[#FFF0DE] py-20 md:py-24">
      
      <SectionDashes
        color="#6FBF9F"
        className="bottom-9 left-[6%] rotate-180"
      />
      <SectionDashes color="#D684BF" className="right-[6%] top-10 rotate-45" />

      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#D684BF]">
            Nosso jeito de cuidar
          </p>
          <h2 className="mt-3 text-3xl font-black leading-tight text-gray-800 sm:text-4xl">
            Especialidade sem deixar de enxergar a criança inteira
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PRINCIPLES.map((item) => (
            <article
              key={item.title}
              className="rounded-[28px] bg-white/80 p-7 shadow-sm"
            >
              <div
                className="grid h-12 w-12 place-items-center rounded-2xl text-2xl font-black"
                style={{
                  backgroundColor: `${item.color}22`,
                  color: item.color,
                }}
                aria-hidden
              >
                {item.icon}
              </div>
              <h3 className="mt-5 text-xl font-black text-gray-800">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </div>

    </section>
  );
}
