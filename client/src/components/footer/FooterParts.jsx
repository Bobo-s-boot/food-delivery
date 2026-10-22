import { Link } from "react-router-dom";

export function FooterBrand({ model }) {
  return <div className="ft-brand">
    <Link to={model.home} className="ft-logo" aria-label={model.copy.home}>Defilicious</Link>
  </div>;
}

export function FooterNavigation({ model }) {
  return <nav className="ft-navigation" aria-label={model.copy.navigation}>
    {model.groups.map((group) => <section className="ft-group" key={group.key} aria-labelledby={`ft-${group.key}`}>
      <h2 id={`ft-${group.key}`}>{group.title}</h2>
      <ul>{group.items.map((item) => <li key={item.key}>
        {item.action
          ? <button type="button" className="ft-link" onClick={item.action}>{item.label}</button>
          : <Link className="ft-link" to={item.to} onClick={item.onClick}>{item.label}</Link>}
      </li>)}</ul>
    </section>)}
  </nav>;
}

export function FooterNewsletter({ model }) {
  const { copy } = model;
  const { email, status, message, inputRef, onEmailChange, onSubscribe } = model.newsletter;
  const invalid = status === "invalid";
  return <section className="ft-newsletter" aria-labelledby="ft-newsletter-title">
    <div className="ft-newsletter__intro">
      <h2 id="ft-newsletter-title">{copy.newsletter}</h2>
      <p className="ft-offer">{copy.offer}</p>
    </div>
    <form noValidate onSubmit={onSubscribe} aria-busy={status === "submitting"} data-state={status}>
      <label htmlFor="ft-email" className="ft-sr-only">{copy.email}</label>
      <div className="ft-email-row">
        <input ref={inputRef} id="ft-email" type="email" name="email" autoComplete="email"
          placeholder="you@example.com" value={email} required readOnly={status === "submitting"}
          aria-invalid={invalid} aria-describedby="ft-newsletter-message"
          onChange={(event) => onEmailChange(event.target.value)} />
        <button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? copy.submitting : copy.subscribe}
        </button>
      </div>
      <p id="ft-newsletter-message" className="ft-message" data-tone={invalid || status === "network" ? "error" : status}
        aria-live="polite" aria-atomic="true">{message}</p>
      {/* FOOTER-PLACEHOLDER: no published rules for the approved 15% newsletter offer exist. */}
    </form>
  </section>;
}

export function FooterLegal({ model }) {
  return <div className="ft-bottom">
    <small>© {new Date().getFullYear()} Defilicious. {model.copy.rights}</small>
    <nav aria-label={model.copy.legal} className="ft-legal">
      <Link to={model.privacyTo}>{model.t("footer.links.privacyPolicy")}</Link>
      {/* FOOTER-PLACEHOLDER: Terms of Service and Cookie Policy have no router destinations. */}
      {["termsOfService", "cookiePolicy"].map((key) => <span key={key} data-footer-placeholder="FOOTER-PLACEHOLDER">
        {model.t(`footer.links.${key}`)} <small>({model.copy.unavailable})</small>
      </span>)}
    </nav>
  </div>;
}

export function TableDecor() {
  return <svg className="ft-table-decor" viewBox="0 0 440 180" fill="none" aria-hidden="true" focusable="false">
    <ellipse cx="104" cy="90" rx="100" ry="77" stroke="currentColor" strokeWidth="2" />
    <ellipse cx="104" cy="90" rx="78" ry="57" stroke="currentColor" strokeWidth="2" />
    <ellipse cx="234" cy="90" rx="100" ry="77" stroke="currentColor" strokeWidth="2" />
    <ellipse cx="234" cy="90" rx="78" ry="57" stroke="currentColor" strokeWidth="2" />
    <path d="M369 15V72M355 15V55Q355 72 369 72Q383 72 383 55V15M369 72V165M418 15V165M418 15Q396 52 418 77" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>;
}
