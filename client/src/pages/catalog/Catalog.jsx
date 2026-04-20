import { useState } from "react";
import { CatalogTab } from "./CatalogTab";
import { CATEGORIES } from "./const";
import { RestaurantList } from "../../components/cardListRestaurant/RestaurantList";
import { useDebounce } from "../../hooks/useDebounce";

export function Catalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  return (
    <div className="w-full max-w-460 mx-auto px-4 md:px-8 pb-12">
      <section
        className="relative w-full h-112.5 mt-0 rounded-[64px] overflow-hidden mb-16 bg-cover bg-center"
        style={{ backgroundImage: `url('/img/Image_Rest1.png')` }}
      >
        <div className="absolute inset-0 bg-black/30 z-10"></div>

        <div className="absolute left-20 bottom-14.5 z-20 w-98.25 flex flex-col gap-3 text-white">
          <h1 className="text-[36px] font-medium tracking-[-0.04em] font-sans">
            Free Delivery Weekend
          </h1>
          <p className="text-[16px] leading-[1.4] tracking-normal text-gray-200 font-sans">
            Stay in and treat yourself. Enjoy $0 delivery fees on all orders
            from top-rated restaurants this weekend.
          </p>
        </div>

        <div className="absolute right-20 bottom-14.5 z-20">
          <button className="flex items-center justify-center w-32.5 h-10.5 rounded-[100px] border-2 border-white text-white text-[18px] tracking-[-0.02em] font-sans hover:bg-white hover:text-black transition duration-300 whitespace-nowrap">
            Order Now
          </button>
        </div>
      </section>

      <section className="mt-45 mb-16 flex flex-col md:flex-row justify-between items-start w-full">
        <div className="w-full md:w-auto">
          <h2 className="text-[64px] font-medium tracking-[-0.04em] font-sans leading-none text-black">
            Explore Local Flavors
          </h2>
        </div>

        <div
          className="relative w-full max-w-181.75 h-67.5 rounded-4xl overflow-hidden bg-cover bg-center shrink-0"
          style={{ backgroundImage: `url('/img/ImageRest2.png')` }}
        >
          <div className="absolute inset-0 bg-black/20 z-10"></div>

          <div className="absolute top-6 right-6 z-20">
            <span className="bg-white/20 backdrop-blur-md border border-white/40 text-white text-[12px] px-4 py-1.5 rounded-[100px] font-sans">
              New Arrival
            </span>
          </div>

          <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20 w-full max-w-105 text-white flex flex-col">
            <h3 className="text-[24px] font-medium font-sans tracking-[-0.04em] mb-3">
              Meet Our New Partner: Luigi's Woodfire
            </h3>
            <p className="text-[16px] font-sans tracking-normal leading-[1.4] text-gray-100 mb-6">
              Authentic Neapolitan pizza is finally here. Taste the crisp, smoky
              crust baked in a real wood-fired oven.
            </p>
            <div>
              <button className="border border-white text-white px-5 py-1.5 rounded-[100px] text-[14px] font-sans hover:bg-white hover:text-black transition duration-300">
                Explore Menu
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full mt-45">
        <h2 className="text-[48px] font-medium tracking-[-0.02em] font-sans text-black mb-32">
          Explore Local Restaurants
        </h2>

        <div className="w-full flex justify-center">
          <div className="flex flex-col lg:flex-row justify-between items-start w-full max-w-423 gap-30">
            <div className="flex flex-col gap-5 w-full max-w-211.25 items-start">
              <CatalogTab
                categories={["All", ...CATEGORIES]}
                activeCategory={activeCategory}
                onCategorySelect={setActiveCategory}
              />

              <div className="relative w-full h-13.25">
                <input
                  type="text"
                  placeholder="What are you craving right now?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-full px-6 py-4 rounded-[100px] bg-[#EFEFF1] border-none outline-none text-center text-[18px] tracking-[-0.04em] font-sans text-gray-700 placeholder-gray-400"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[20px] text-black">
                  🔍
                </span>
              </div>
            </div>

            <div className="w-full max-w-181.75 shrink-0 mt-0">
              <p className="text-[16px] font-sans tracking-normal leading-[1.4] text-gray-800">
                Browse our carefully curated list of top-rated local spots.
                Whether you are looking for a quick bite, a healthy lunch, or a
                premium dinner, we deliver the best food in the city straight to
                your door, fast and fresh.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center mt-32 mb-25">
          <div className="w-full max-w-423">
            <RestaurantList
              searchQuery={debouncedSearchQuery}
              activeCategory={activeCategory}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
