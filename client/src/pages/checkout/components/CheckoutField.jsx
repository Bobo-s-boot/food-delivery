export function CheckoutField({
  label,
  placeholder,
  type = "text",
  className = "",
}) {
  return (
    <label className={`checkout-field ${className}`.trim()}>
      <span className="checkout-field__label">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="checkout-field__input"
      />
    </label>
  );
}
