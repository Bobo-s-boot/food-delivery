export function MenuCategoryList({
  categories,
  activeCategory,
  getCategoryLabel,
  onCategorySelect,
}) {
  return (
    <div className="w-full flex flex-row justify-between items-center gap-4 mt-22.5">
      {categories.map((category) => (
        <button
          key={category.key}
          onClick={() => onCategorySelect(category.key)}
          className={`relative flex-1 min-w-45 h-87.5 rounded-2xl overflow-hidden group text-left cursor-pointer transition-all border-[3px] outline-none ${
            activeCategory === category.key
              ? "border-[#E9EE5D] shadow-lg"
              : "border-transparent"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url(${category.imageUrl})` }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent z-0" />
          <div className="absolute bottom-6 w-full text-center z-10 px-2">
            <span
              className={`text-[20px] xl:text-[24px] tracking-[-0.04em] ${
                activeCategory === category.key
                  ? "text-[#E9EE5D] font-medium"
                  : "text-white font-normal"
              }`}
            >
              {getCategoryLabel(category.key)}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
