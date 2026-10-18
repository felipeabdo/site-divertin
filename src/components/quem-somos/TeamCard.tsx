import Avatar from './Avatar';
import { CARD_JA_TEM_NOME, type TeamMember } from './data';


export default function TeamCard({ member }: { member: TeamMember }) {
  if (member.src && CARD_JA_TEM_NOME) {
    return (
      <article>
        <img src={member.src} alt={`${member.name}, ${member.role.toLowerCase()}`} className="h-auto w-full" />
      </article>
    );
  }

  return (
    <article className="overflow-hidden rounded-[28px] shadow-md" style={{ background: '#fff7f0' }}>
      <div
        className="relative aspect-[16/10] w-full overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${member.tone}, #fff)` }}
      >
        {member.src ? (
          <img src={member.src} alt={member.name} className="absolute inset-0 h-full w-full object-cover object-top" />
        ) : member.icon ? (
          <span aria-hidden className="absolute inset-0 grid place-items-center text-6xl opacity-60">{member.icon}</span>
        ) : (
          <Avatar tone={member.tone} />
        )}
      </div>
      <div className="px-7 pb-7 pt-6">
        <h3 className="text-xl font-bold leading-tight text-gray-800">{member.name}</h3>
        <p className="mt-2 text-base text-gray-600">{member.role}</p>
      </div>
    </article>
  );
}
