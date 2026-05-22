import { useState } from "react";

export function DishGallery({ dish, className = "" }) {
  const [activeImage, setActiveImage] = useState(dish.gallery[0] ?? dish.image);
  const hasMultipleImages = dish.gallery.length > 1;

  return (
    <section className={`dish-gallery ${className}`.trim()}>
      <div className="dish-gallery__media">
        <img
          src={activeImage}
          alt={dish.name}
          className="dish-gallery__image"
        />

        <div className="dish-gallery__badges">
          <span className="dish-gallery__badge">Bestseller</span>
          <span className="dish-gallery__badge dish-gallery__badge--dark">Chef's choice</span>
        </div>
      </div>

      {hasMultipleImages && (
        <div className="dish-gallery__thumbs">
          {dish.gallery.map((image) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveImage(image)}
              className={`dish-gallery__thumb ${activeImage === image ? "dish-gallery__thumb--active" : "dish-gallery__thumb--inactive"}`}
              aria-label={`Show ${dish.name} image`}
            >
              <img src={image} alt="" className="dish-gallery__thumb-image" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
