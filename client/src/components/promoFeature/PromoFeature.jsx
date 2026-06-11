import "./PromoFeature.scss";

export function PromoFeature({
  heading,
  image,
  imageAlt = "",
  badge,
  title,
  description,
  buttonLabel,
  onButtonClick,
  className = "",
}) {
  return (
    <section className={`promo-feature ${className}`.trim()}>
      <div className="promo-feature__heading-wrapper">
        <h2 className="promo-feature__heading">{heading}</h2>
      </div>

      <div className="promo-feature__card">
        <img src={image} alt={imageAlt} className="promo-feature__image" />

        <div className="promo-feature__overlay" />

        {badge && (
          <div className="promo-feature__badge-wrapper">
            <span className="promo-feature__badge">{badge}</span>
          </div>
        )}

        <div className="promo-feature__content">
          <h3 className="promo-feature__title">{title}</h3>
          <p className="promo-feature__text">{description}</p>
          {buttonLabel && (
            <button
              type="button"
              onClick={onButtonClick}
              className="promo-feature__button"
            >
              {buttonLabel}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
