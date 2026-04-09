import React from 'react';

export function RestaurantCard({ data }) {
  // Вытаскиваем данные
  const { image, badge, title, category, rating, location } = data;

  return (
    // Взял классы из Trending.jsx и добавил h-[480px] для красивой высоты
    <div className="rounded-3xl border-[#EDECF1] group relative w-full h-[480px]">
      
      {/* Бейдж из твоего Trending.jsx */}
      <span className="absolute top-4 right-4 z-10 px-4 h-8 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-lg">
        <p className="text-sm text-slate-100">{badge}</p>
      </span>

      {/* Контейнер с картинкой и градиентом */}
      <div className="relative w-full h-full bg-[#EDECF1] overflow-hidden rounded-3xl">
        <img
          src={image}
          alt={title}
          // object-cover лучше, чем object-fill, чтобы картинку не сплющило
          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
        />
        {/* Оригинальный градиент из твоего кода */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
      </div>

      {/* Текстовый блок внизу */}
      <div className="absolute bottom-6 left-6 z-10 flex items-center justify-center">
        <div className="flex flex-col items-start gap-1">
          <h3 className="text-slate-100 font-semibold text-xl">
            {title}
          </h3>
          <p className="flex flex-row text-sm text-slate-200 gap-2 items-center">
            {category} | <span className="text-[#FBBF24] text-xs">★</span> {rating}
          </p>
          <address className="flex flex-row text-slate-200 text-sm gap-2 not-italic items-center">
            <span>📍</span> {location}
          </address>
        </div>
      </div>
      
    </div>
  );
}