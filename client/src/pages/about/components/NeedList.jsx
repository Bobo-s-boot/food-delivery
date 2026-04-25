export function NeedList({ title, items }) {
  return (
    <div className="rounded-4xl border border-[#DDE3EA] bg-white p-7">
      <h3 className="text-[24px] font-semibold tracking-[-0.03em] text-[#0D1A2D]">
        {title}
      </h3>
      <ul className="mt-5 grid gap-3">
        {items.map((item) => (
          <li
            key={item}
            className="border-t border-[#DDE3EA] pt-3 text-[15px] leading-[145%] text-[#3A4656]"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
