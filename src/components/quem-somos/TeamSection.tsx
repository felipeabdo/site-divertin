import { Dashes } from "./Decor";
import TeamCard from "./TeamCard";
import { H2, PAL, TEAM } from "./data";
import Cloud from "@/components/Cloud";

export default function TeamSection() {
  return (
    <section className="relative mt-20 w-full bg-white px-6 pb-28 pt-4 md:mt-24 md:pb-32">
      <div className="mx-auto w-full max-w-6xl">
      <div data-reveal className="mx-auto max-w-3xl text-center">
        <p className="site-eyebrow site-eyebrow--pink">Quem acompanha cada conquista</p>
        <h2 className={`${H2} site-section-title mt-4`}>Nossa equipe</h2>
        <p className="site-section-copy mx-auto mt-4 max-w-2xl">
          Profissionais que unem conhecimento, escuta e parceria com a família para cuidar de cada criança de forma próxima e individualizada.
        </p>
      </div>

      <div className="relative mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        <Dashes color={PAL.orange} className="-left-14 top-[40%] hidden xl:block" size={38} rotate={-15} />
        <Dashes color={PAL.orange} className="-right-14 top-[36%] hidden xl:block" size={38} rotate={165} />
        {TEAM.map((member) => <TeamCard key={member.name} member={member} />)}
      </div>
      </div>
      <Cloud position="bottom" color="#FFF9FC" />
    </section>
  );
}
