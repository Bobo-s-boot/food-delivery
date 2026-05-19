import "./ProductCard.scss";

export function ProductCard({ item }) {
  return (
    <div className="product-card">
      <div
        className="product-card__image"
        style={{ backgroundImage: `url(${item.imageUrl})` }}
      />

      <div className="product-card__backdrop" />

      <div className="product-card__price">{item.price} $</div>

      <div className="product-card__body">
        <h3 className="product-card__title">{item.title}</h3>

        <div className="product-card__meta">
          <span>{item.category}</span>
          <span className="product-card__divider">|</span>
          <span>{item.weight}</span>
          <span className="product-card__divider">|</span>
          <span>{item.calories}</span>
        </div>

        <div className="product-card__rating">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="#E9EE5D"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 1.7L14.7 8.9H22.3L16.2 13.5L18.9 20.7L12 16.1L5.1 20.7L7.8 13.5L1.7 8.9H9.3L12 1.7Z" />
          </svg>
          <span>{item.rating}</span>
          <span className="product-card__divider">({item.reviews})</span>
        </div>

        <p className="product-card__description">{item.description}</p>
      </div>
    </div>
  );
}
