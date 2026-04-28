export function SectionHeader({ title, description }) {
  return (
    <div>
      <h2 className="text-lg font-semibold tracking-[-0.03em] text-[#0D1A2D]">
        {title}
      </h2>
      {description && (
        <p className="mt-1 max-w-170 text-sm leading-[145%] text-[#5E6A7A]">
          {description}
        </p>
      )}
    </div>
  );
}
