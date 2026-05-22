export function SocialLoginButton({ provider, icon, alt, label, onLogin }) {
  return (
    <button
      type="button"
      onClick={() => onLogin(provider)}
      className="social-btn"
    >
      <img src={icon} alt={alt} className="social-btn__icon" />
      <span className="social-btn__label">{label}</span>
    </button>
  );
}
