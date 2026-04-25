export function AuthInput({
  type,
  name,
  value,
  onChange,
  placeholder,
  showPasswordToggle = false,
  onTogglePassword,
}) {
  return (
    <div className="relative w-full h-13.5">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        placeholder={placeholder}
        className="w-full h-full bg-[#EFEFF1] rounded-[100px] px-6 text-[16px] lg:text-[18px] text-[#0F1316] placeholder:text-[rgba(15,19,22,0.5)] tracking-[-0.04em] focus:outline-none focus:ring-2 focus:ring-[#0D1A2D]"
      />

      {showPasswordToggle && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-6 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="#0F1316"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            ></path>
          </svg>
        </button>
      )}
    </div>
  );
}
