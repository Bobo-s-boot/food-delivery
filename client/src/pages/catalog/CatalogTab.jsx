export function CatalogTab({ categories, activeCategory, onCategorySelect }) {
  return (
    // Обертка табов: gap 13px
    <div className="flex flex-wrap items-center gap-[13px] w-full">
      {categories.map((category, index) => (
        <button
          key={index}
          onClick={() => onCategorySelect(category)}
          // 16px, LetSpa 1% (0.01em), LineHeight 100% (leading-none), Medium
          // Паддинги: px-16, py-8. Скругление: rounded-[8px]. Бордер 1px: border border-black
          className={`px-[16px] py-[8px] text-[16px] tracking-[0.01em] leading-none font-medium font-sans rounded-[8px] border border-black transition-all duration-200 ${
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