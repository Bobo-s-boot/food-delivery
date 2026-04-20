export function CatalogTab({ categories, activeCategory, onCategorySelect }) {
  return (
    <div className="flex flex-wrap items-center gap-3.25 w-full">
      {categories.map((category, index) => (
        <button
          key={index}
          onClick={() => onCategorySelect(category)}
          className={`px-4 py-2 text-base tracking-[0.01em] leading-none font-medium font-sans rounded-lg border border-black transition-all duration-200 ${
            activeCategory === category
              ? "bg-black text-white"
              : "bg-white text-black hover:bg-gray-100"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
