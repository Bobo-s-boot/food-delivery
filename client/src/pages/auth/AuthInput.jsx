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
    <div className="auth-input-wrapper">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        placeholder={placeholder}
        className="auth-input"
      />

      {showPasswordToggle && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="auth-input__toggle-btn"
        >
          <svg fill="none" stroke="#0F1316" viewBox="0 0 24 24">
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
