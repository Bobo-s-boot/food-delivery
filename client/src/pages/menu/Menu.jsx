import { useState } from "react";
import { MENU_CATEGORIES, MOCK_MENU_ITEMS } from "./const.js";
import { ProductCard } from "./ProductCard";
import searchIcon from "../../assets/search.svg";

export function Menu() {
  const [activeCategory, setActiveCategory] = useState("Fast Food");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = MOCK_MENU_ITEMS.filter((item) => {
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full mx-auto px-4 md:px-8 pb-30 bg-[#FFFFFF] font-['Inter'] flex flex-col items-center pt-0">
      <div className="relative w-full h-112.5 rounded-[64px] overflow-hidden mt-0 shadow-sm shrink-0">
        <img
          src="/img/menu_background.png"
          alt="Menu Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute left-20.25 bottom-14.5 w-full max-w-98.25 flex flex-col gap-3 z-10 text-left">
          <h1 className="text-white text-[36px] md:text-[48px] font-normal tracking-[-0.04em] leading-11 m-0">
            Free Delivery Weekend
          </h1>
          <p className="text-white text-[16px] font-normal leading-[140%] m-0">
            Stay in and treat yourself. Enjoy $0 delivery fees on all orders
            from top-rated restaurants this weekend.
          </p>
        </div>
        <button className="absolute right-20.25 bottom-12.5 w-32.5 h-10.5 border-2 border-white rounded-[100px] flex items-center justify-center text-white text-[18px] tracking-[-0.02em] hover:bg-white hover:text-[#0D1A2D] transition-colors cursor-pointer z-10">
          Order Now
        </button>
      </div>

      <div className="w-full flex flex-col xl:flex-row justify-between items-start mt-30 gap-10 shrink-0">
        <h2 className="m-0 text-[#000000] text-[40px] xl:text-[64px] font-normal tracking-[-0.04em] leading-19.25 max-w-210 text-left">
          What are you in the mood for?
        </h2>

        <div className="w-full xl:w-181.75 h-67.5 relative rounded-4xl overflow-hidden bg-[#0D1A2D] group shrink-0">
          <img
            src="/img/mood_background.png"
            alt="Mood Background"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/40 to-transparent z-0" />
          <div className="absolute right-6 top-6 px-4 py-2 bg-white/25 backdrop-blur-[10px] rounded-[100px] z-10 border border-white/20 flex items-center justify-center text-white text-[12px] font-medium tracking-[0.02em]">
            New Arrival
          </div>
          <div className="absolute left-8.75 top-[50%] -translate-y-1/2 w-full max-w-103.25 flex flex-col items-start gap-3 z-10 text-left">
            <h3 className="text-white text-[24px] font-normal tracking-[-0.04em] leading-7.25 m-0">
              Meet Our New Partner: Luigi's Woodfire
            </h3>
            <p className="text-white text-[16px] font-normal leading-[140%] opacity-100 w-67.25 m-0">
              Authentic Neapolitan pizza is finally here. Taste the crisp, smoky
              crust baked in a real wood-fired oven.
            </p>
            <button className="w-32.75 h-7.75 border-2 border-white rounded-[100px] flex items-center justify-center text-white text-[16px] hover:bg-white hover:text-[#0D1A2D] transition-colors cursor-pointer mt-1">
              Explore Menu
            </button>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-row justify-between items-center gap-4 mt-22.5">
        {MENU_CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={`relative flex-1 min-w-45 h-87.5 rounded-2xl overflow-hidden group text-left cursor-pointer transition-all border-[3px] outline-none ${
              activeCategory === cat.name
                ? "border-[#E9EE5D] shadow-lg"
                : "border-transparent"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundImage: `url(${cat.imageUrl})` }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent z-0" />
            <div className="absolute bottom-6 w-full text-center z-10 px-2">
              <span
                className={`text-[20px] xl:text-[24px] tracking-[-0.04em] ${
                  activeCategory === cat.name
                    ? "text-[#E9EE5D] font-medium"
                    : "text-white font-normal"
                }`}
              >
                {cat.name}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="w-full h-13.5 xl:h-16 bg-[#EFEFF1] rounded-[100px] flex items-center justify-center mt-13.5 px-10 shrink-0">
        <div className="relative flex items-center justify-center">
          <input
            type="text"
            placeholder="What are you craving today?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-[18px] xl:text-[20px] tracking-[-0.04em] text-center text-[#0F1316] placeholder:text-[rgba(15,19,22,0.5)] focus:outline-none"
          />
          <img
            src={searchIcon}
            alt="Search"
            className="w-5 h-5 ml-4 opacity-40 grayscale brightness-0"
          />
        </div>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-16">
        {filteredItems.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
