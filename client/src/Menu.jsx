import { useState } from "react";
import { MENU_CATEGORIES, MOCK_MENU_ITEMS } from "./const";
import { ProductCard } from "./ProductCard";
import searchIcon from "./assets/search.svg";

export function Menu() {
  const [activeCategory, setActiveCategory] = useState("Fast Food");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = MOCK_MENU_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full bg-[#FFFFFF] font-['Inter'] flex flex-col items-center pb-[120px] px-4 lg:px-[39px] pt-0">
      
      {/* 1. HERO BANNER */}
      <div className="relative w-full max-w-[1841px] h-[450px] rounded-[64px] overflow-hidden mt-0 shadow-sm shrink-0">
        <img 
          src="/img/menu_background.png" 
          alt="Menu Background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute left-[81px] bottom-[58px] w-full max-w-[393px] flex flex-col gap-[12px] z-10 text-left">
          <h1 className="text-white text-[36px] md:text-[48px] font-normal tracking-[-0.04em] leading-[44px] m-0">
            Free Delivery Weekend
          </h1>
          <p className="text-white text-[16px] font-normal leading-[140%] m-0">
            Stay in and treat yourself. Enjoy $0 delivery fees on all orders from top-rated restaurants this weekend.
          </p>
        </div>
        <button className="absolute right-[81px] bottom-[50px] w-[130px] h-[42px] border-[2px] border-white rounded-[100px] flex items-center justify-center text-white text-[18px] tracking-[-0.02em] hover:bg-white hover:text-[#0D1A2D] transition-colors cursor-pointer z-10">
          Order Now
        </button>
      </div>

      {/* 2. MOOD SECTION */}
      <div className="w-full max-w-[1841px] flex flex-col xl:flex-row justify-between items-start mt-[120px] gap-[40px] shrink-0">
        <h2 className="m-0 text-[#000000] text-[40px] xl:text-[64px] font-normal tracking-[-0.04em] leading-[77px] max-w-[840px] text-left">
          What are you in the mood for?
        </h2>
        
        <div className="w-full xl:w-[727px] h-[270px] relative rounded-[32px] overflow-hidden bg-[#0D1A2D] group flex-shrink-0">
          <img 
            src="/img/mood_background.png" 
            alt="Mood Background" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-0" />
          <div className="absolute right-[24px] top-[24px] px-[16px] py-[8px] bg-white/25 backdrop-blur-[10px] rounded-[100px] z-10 border border-white/20 flex items-center justify-center text-white text-[12px] font-medium tracking-[0.02em]">
            New Arrival
          </div>
          <div className="absolute left-[35px] top-[50%] -translate-y-1/2 w-full max-w-[413px] flex flex-col items-start gap-[12px] z-10 text-left">
            <h3 className="text-white text-[24px] font-normal tracking-[-0.04em] leading-[29px] m-0">
              Meet Our New Partner: Luigi's Woodfire
            </h3>
            <p className="text-white text-[16px] font-normal leading-[140%] opacity-100 w-[269px] m-0">
              Authentic Neapolitan pizza is finally here. Taste the crisp, smoky crust baked in a real wood-fired oven.
            </p>
            <button className="w-[131px] h-[31px] border-[2px] border-white rounded-[100px] flex items-center justify-center text-white text-[16px] hover:bg-white hover:text-[#0D1A2D] transition-colors cursor-pointer mt-1">
              Explore Menu
            </button>
          </div>
        </div>
      </div>

      {/* 3. CATEGORIES */}
      <div className="w-full max-w-[1680px] flex flex-row justify-between items-center gap-[16px] mt-[90px]">
        {MENU_CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={`relative flex-1 min-w-[180px] h-[350px] rounded-[16px] overflow-hidden group text-left cursor-pointer transition-all border-[3px] outline-none ${
              activeCategory === cat.name ? 'border-[#E9EE5D] shadow-lg' : 'border-transparent'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundImage: `url(${cat.imageUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-0" />
            <div className="absolute bottom-[24px] w-full text-center z-10 px-2">
              <span className={`text-[20px] xl:text-[24px] tracking-[-0.04em] ${
                activeCategory === cat.name ? 'text-[#E9EE5D] font-medium' : 'text-white font-normal'
              }`}>
                {cat.name}
              </span>
            </div>
          </button>
        ))}
      </div>

{/* 4. SEARCH BAR */}
      <div className="w-full max-w-[1680px] h-[54px] xl:h-[64px] bg-[#EFEFF1] rounded-[100px] flex items-center justify-center mt-[54px] px-10 shrink-0">
        <div className="relative flex items-center justify-center">
          <input
            type="text"
            placeholder="What are you craving today?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[350px] bg-transparent text-[18px] xl:text-[20px] tracking-[-0.04em] text-center text-[#0F1316] placeholder:text-[rgba(15,19,22,0.5)] focus:outline-none"
          />
          <img 
            src={searchIcon} 
            alt="Search" 
            className="w-[20px] h-[20px] ml-4 opacity-40 grayscale brightness-0" 
          />
        </div>
      </div>

      {/* 5. PRODUCT GRID */}
      <div className="w-full max-w-[1841px] grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[24px] mt-[64px]">
        {filteredItems.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>

    </div>
  );
}