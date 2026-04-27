export function TeamCard({ member, index }) {
  return (
    <article className="group grid gap-6 border-t border-[#DDE3EA] pt-6 lg:grid-cols-[240px_0.95fr_1fr]">
      <div className="relative h-80 overflow-hidden rounded-4xl bg-[#EDECF1]">
        <img
          src={member.image}
          alt={member.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-5 top-5 rounded-full bg-white/80 px-4 py-2 text-[12px] text-[#0D1A2D] backdrop-blur">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="flex flex-col justify-between gap-8">
        <div>
          <p className="text-[14px] uppercase tracking-[0.16em] text-[#6E7D93]">
            {member.role}
          </p>
          <h3 className="mt-3 text-[40px] font-normal leading-none tracking-[-0.04em] text-[#0D1A2D]">
            {member.name}
          </h3>
        </div>

        <p className="text-[16px] leading-[150%] text-[#3A4656]">
          {member.summary}
        </p>
      </div>

      <div className="flex items-end text-[16px] leading-[150%] text-[#3A4656]">
        <p>{member.details[0]}</p>
      </div>
    </article>
  );
}
