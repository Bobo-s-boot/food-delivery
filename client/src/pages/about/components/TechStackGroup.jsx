export function TechStackGroup({ group }) {
  return (
    <div className="rounded-4xl bg-white p-8">
      <h3 className="text-[28px] font-normal tracking-[-0.04em] text-[#0D1A2D]">
        {group.title}
      </h3>
      <div className="mt-6 flex flex-wrap gap-3">
        {group.items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-[#DDE3EA] px-4 py-2 text-[14px] text-[#3A4656]"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
