import { useState } from "react";

export function DishGallery({ dish, className = "" }) {
  const [activeImage, setActiveImage] = useState(dish.gallery[0] ?? dish.image);
  const hasMultipleImages = dish.gallery.length > 1;

  return (
    <section className={`bg-[#F2F4F7] ${className}`.trim()}>
      <div className="relative h-full min-h-[620px] overflow-hidden rounded-[28px] bg-white">
        <img
          src={activeImage}
          alt={dish.name}
          className="h-full w-full object-cover object-center xl:object-[45%_50%]"
        />
        <div className="absolute left-6 top-6 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/85 px-3 py-2 text-[13px] font-medium text-[#071426] shadow-sm backdrop-blur-md">
            Bestseller
          </span>
          <span className="rounded-full bg-[#071426]/90 px-3 py-2 text-[13px] font-medium text-white shadow-sm backdrop-blur-md">
            Chef's choice
          </span>
        </div>
      </div>

      {hasMultipleImages && (
        <div className="absolute bottom-6 left-1/2 z-10 grid -translate-x-1/2 grid-cols-4 gap-3">
          {dish.gallery.map((image) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveImage(image)}
              className={`aspect-square overflow-hidden rounded-2xl border bg-white transition ${
                activeImage === image
                  ? "border-[#0D1A2D]"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
              aria-label={`Show ${dish.name} image`}
            >
              <img
                src={image}
                alt=""
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
