export function CheckoutStep({
  step,
  isActive,
  isComplete,
  onToggle,
  children,
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-[#E8EAF0] bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition hover:bg-[#F8FAFC] md:px-8"
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8F9BB1]">
            {step.eyebrow}
          </p>
          <h2 className="mt-1 text-2xl font-medium tracking-[-0.03em] text-[#0F1316]">
            {step.title}
          </h2>
          <p className="mt-2 text-sm leading-[145%] text-[#5F6878]">
            {step.summary}
          </p>
        </div>

        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-lg transition ${
            isActive
              ? "border-[#0D1A2D] bg-[#0D1A2D] text-white"
              : "border-[#D8DDE7] text-[#0D1A2D]"
          }`}
        >
          {isComplete ? "✓" : isActive ? "-" : "+"}
        </span>
      </button>

      {isActive && (
        <div className="border-t border-[#E8EAF0] px-6 py-6 md:px-8">
          {children}
        </div>
      )}
    </section>
  );
}
