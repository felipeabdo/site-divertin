import Image from 'next/image';
import Avatar from './Avatar';
import { CARD_JA_TEM_NOME, type TeamMember } from './data';

export default function TeamCard({ member }: { member: TeamMember }) {
  if (member.src && CARD_JA_TEM_NOME) {
    return (
      <article data-reveal className="overflow-hidden rounded-[24px] border border-[#EEE7ED] bg-white shadow-[0_12px_30px_rgba(59,43,57,.07)]">
        <img src={member.src} alt={`${member.name}, ${member.role.toLowerCase()}`} loading="lazy" decoding="async" className="h-auto w-full" />
      </article>
    );
  }

  return (
    <article data-reveal className="group h-full overflow-hidden rounded-[24px] border border-[#EEE7ED] bg-white shadow-[0_12px_30px_rgba(59,43,57,.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(59,43,57,.12)]">
      <div className="relative aspect-[4/4.3] w-full overflow-hidden" style={{ background: `linear-gradient(135deg, ${member.tone}, #fff)` }}>
        {member.src ? (
          <Image src={member.src} alt={member.name} fill sizes="(max-width: 639px) 50vw, (max-width: 1023px) 50vw, 25vw" className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.025]" />
        ) : member.icon ? (
          <span aria-hidden className="absolute inset-0 grid place-items-center text-6xl opacity-60">{member.icon}</span>
        ) : (
          <Avatar tone={member.tone} />
        )}
      </div>
      <div className="min-h-[106px] px-5 pb-5 pt-5 text-center">
        <h3 className="text-lg font-extrabold leading-tight text-[#3F3544]">{member.name}</h3>
        <p className="mt-2 text-sm font-medium text-[#756C78]">{member.role}</p>
      </div>
    </article>
  );
}
