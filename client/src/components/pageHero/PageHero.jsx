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
    <div
      className={`relative w-full h-112.5 rounded-[64px] overflow-hidden mt-0 shadow-sm shrink-0 ${className}`.trim()}
    >
      <img
        src={image}
        alt={imageAlt}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30 z-10"></div>

      <div className="absolute left-20 bottom-14.5 z-20 w-98.25 flex flex-col gap-3 text-white">
        <h1 className="text-[36px] md:text-[48px] font-normal tracking-[-0.04em] leading-11">
          {title}
        </h1>

        <p className="text-[16px] font-normal leading-[140%]">{description}</p>
      </div>

      {buttonLabel && (
        <div className="absolute right-20 bottom-14.5 z-20">
          <button
            type="button"
            onClick={onButtonClick}
            className="flex items-center justify-center w-32.5 h-10.5 rounded-[100px] border-2 border-white text-white text-[18px] tracking-[-0.02em] hover:bg-white hover:text-black transition duration-300 whitespace-nowrap"
          >
            {buttonLabel}
          </button>
        </div>
      )}
    </div>
  );
}
