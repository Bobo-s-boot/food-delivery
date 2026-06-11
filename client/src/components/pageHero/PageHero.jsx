import "./PageHero.scss";

export function PageHero({
  image,
  imageAlt = "",
  title,
  description,
  buttonLabel,
  onButtonClick,
  className = "",
}) {
  return (
    <div className={`page-hero ${className}`.trim()}>
      <img src={image} alt={imageAlt} className="page-hero__image" />
      <div className="page-hero__overlay" />

      <div className="page-hero__content">
        <h1 className="page-hero__title">{title}</h1>
        <p className="page-hero__description">{description}</p>
      </div>

      {buttonLabel && (
        <div className="page-hero__button-wrapper">
          <button
            type="button"
            onClick={onButtonClick}
            className="page-hero__button"
          >
            {buttonLabel}
          </button>
        </div>
      )}
    </div>
  );
}
