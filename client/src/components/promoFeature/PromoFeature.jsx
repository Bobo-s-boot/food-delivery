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
    <section
      className={`mt-30 flex flex-col md:flex-row justify-between items-start w-full gap-10 ${className}`.trim()}
    >
      <div className="w-full md:w-auto">
        <h2 className="text-[64px] font-normal tracking-[-0.04em] leading-none text-black">
          {heading}
        </h2>
      </div>

      <div className="relative w-full max-w-181.75 h-67.5 rounded-4xl overflow-hidden shrink-0">
        <img
          src={image}
          alt={imageAlt}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/20 z-10"></div>

        {badge && (
          <div className="absolute top-6 right-6 z-20">
            <span className="bg-white/20 backdrop-blur-md border border-white/40 text-white text-[12px] px-4 py-1.5 rounded-[100px] font-sans">
              {badge}
            </span>
          </div>
        )}

        <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20 w-full max-w-105 text-white flex flex-col gap-3">
          <h3 className="text-[24px] font-normal tracking-[-0.04em] leading-7.25 mb-3">
            {title}
          </h3>

          <p className="text-[16px] font-normal leading-[140%] text-gray-100 mb-6">
            {description}
          </p>

          {buttonLabel && (
            <div>
              <button
                type="button"
                onClick={onButtonClick}
                className="border border-white text-white px-5 py-1.5 rounded-[100px] text-[16px] hover:bg-white hover:text-black transition duration-300"
              >
                {buttonLabel}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
