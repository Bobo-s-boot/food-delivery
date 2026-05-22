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
          aria-label={type === "password" ? "Show password" : "Hide password"}
        >
          <span className="auth-input__toggle-text">
            {type === "password" ? "Show" : "Hide"}
          </span>
        </button>
      )}
    </div>
  );
}
