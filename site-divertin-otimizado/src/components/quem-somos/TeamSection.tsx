import { Dashes } from "./Decor";
import TeamCard from "./TeamCard";
import { H2, PAL, TEAM } from "./data";

export default function TeamSection() {
  return (
    <section className="relative mx-auto mt-24 max-w-6xl px-6">
      
      <h2 className={`${H2} text-center md:text-left`}>Nossa equipe</h2>

      <div className="relative mt-10 grid gap-8 sm:grid-cols-3">
        <Dashes
          color={PAL.orange}
          className="-left-15 top-[40%] hidden xl:block"
          size={42}
          rotate={-15}
        />
        <Dashes
          color={PAL.orange}
          className="-right-15 top-[36%] hidden xl:block"
          size={42}
          rotate={165}
        />
        {TEAM.map((member) => (
          <TeamCard key={member.name} member={member} />
        ))}
      </div>
    </section>
  );
}
