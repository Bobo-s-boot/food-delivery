export function CheckoutField({
  label,
  placeholder,
  type = "text",
  className = "",
  value,
  onChange,
  error,
}) {
  return (
    <label className={`checkout-field ${className}`.trim()}>
      <span className="checkout-field__label">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className={`checkout-field__input ${error ? "checkout-field__input--error" : ""}`}
        value={value}
        onChange={onChange}
      />
      {error && <span className="checkout-field__error" style={{ color: "red", fontSize: "12px", marginTop: "4px", display: "block" }}>{error}</span>}
    </label>
  );
}
