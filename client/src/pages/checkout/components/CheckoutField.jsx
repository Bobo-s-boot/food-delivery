export function CheckoutField({
  label,
  placeholder,
  type = "text",
  className = "",
}) {
  return (
    <label className={`flex flex-col gap-2 ${className}`.trim()}>
      <span className="text-sm font-medium text-[#5F6878]">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="h-12 rounded-2xl border border-[#DDE2EB] bg-white px-4 text-base text-[#0F1316] outline-none transition placeholder:text-[#A3ACBA] focus:border-[#0D1A2D] focus:ring-4 focus:ring-[#0D1A2D]/10"
      />
    </label>
  );
}
