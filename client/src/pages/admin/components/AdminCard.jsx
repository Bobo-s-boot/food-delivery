export function AdminCard({ children, className = "" }) {
  return (
    <section
      className={`min-w-0 rounded-[24px] border border-[#E3E8F0] bg-white shadow-[0_14px_45px_rgba(13,26,45,0.08)] ${className}`.trim()}
    >
      {children}
    </section>
  );
}
