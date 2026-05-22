import "./RestaurantCard.scss";

export function RestaurantCard({ data }) {
  const { image, badge, name, category, rating, location } = data;

  return (
    <div className="restaurant-card">
      <span className="restaurant-card__badge">
        <p className="restaurant-card__badge-text">{badge}</p>
      </span>

      <div className="restaurant-card__image-wrapper">
        <img src={image} alt={name} className="restaurant-card__image" />
        <div className="restaurant-card__gradient" />
      </div>

      <div className="restaurant-card__info">
        <h3 className="restaurant-card__name">{name}</h3>
        <p className="restaurant-card__meta">
          {category} <span className="restaurant-card__star">★</span> {rating}
        </p>
        <address className="restaurant-card__location">
          <span>📍</span> {location}
        </address>
      </div>
    </div>
  );
}
