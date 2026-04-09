import { useEffect, useState } from "react";
import { getRestaurants } from "../../api/restaurantService";
import { CLIENT_ERORR_MESSAGE } from "../../errors/error";
import { CatalogTab } from "./CatalogTab";
import { CATEGORIES } from "./const";

// ВОТ ОН - ПРАВИЛЬНЫЙ ИМПОРТ КАРТОЧКИ ИЗ ТВОЕГО СКРИНШОТА!
// Мы не импортируем RestaurantList, мы берем сразу RestaurantCard
import { RestaurantCard } from "../../components/cardListRestaurant/RestaurantCard";

export function Catalog() {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(data);
        setLoading(false);
      } catch (error) {
        console.error(CLIENT_ERORR_MESSAGE.FIELD_TO_FETCH, error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const nameToSearch = restaurant.title || restaurant.name || "";
    const matchesSearch = nameToSearch.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || restaurant.category?.includes(activeCategory);
    
    return matchesSearch && matchesCategory;
  });

  const formattedRestaurants = filteredRestaurants.map((restaurant, index) => {
    return {
      ...restaurant,
      title: restaurant.title || restaurant.name || "A Delicious Place",
      badge: restaurant.badge || (index % 2 === 0 ? "Free Delivery" : `${(index + 2) * 10}-${(index + 3) * 10} min`),
      image: restaurant.image || `/img/card-${(index % 4) + 1}.png`,
      location: restaurant.location || "Downtown District",
      rating: restaurant.rating || (4 + (index % 10) / 10).toFixed(1),
    };
  });

  return (
    <div className="w-full max-w-[1840px] mx-auto px-4 md:px-8 pb-12">
      
      {/* 1. HERO BANNER */}
      <section 
        className="relative w-full h-[450px] mt-0 rounded-[64px] overflow-hidden mb-16 bg-cover bg-center"
        style={{ backgroundImage: `url('/img/Image_Rest1.png')` }}
      >
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        
        <div className="absolute left-[80px] bottom-[58px] z-20 w-[393px] flex flex-col gap-[12px] text-white">
          <h1 className="text-[36px] font-medium tracking-[-0.04em] font-sans">
            Free Delivery Weekend
          </h1>
          <p className="text-[16px] leading-[1.4] tracking-normal text-gray-200 font-sans">
            Stay in and treat yourself. Enjoy $0 delivery fees on all orders from top-rated restaurants this weekend.
          </p>
        </div>

        <div className="absolute right-[80px] bottom-[58px] z-20">
          <button className="flex items-center justify-center w-[130px] h-[42px] rounded-[100px] border-2 border-white text-white text-[18px] tracking-[-0.02em] font-sans hover:bg-white hover:text-black transition duration-300 whitespace-nowrap">
            Order Now
          </button>
        </div>
      </section>

      {/* 2. PROMO SECTION (Explore Local Flavors) */}
      <section className="mt-[180px] mb-16 flex flex-col md:flex-row justify-between items-start w-full">
        <div className="w-full md:w-auto">
          <h2 className="text-[64px] font-medium tracking-[-0.04em] font-sans leading-none text-black">
            Explore Local Flavors
          </h2>
        </div>

        <div 
          className="relative w-full max-w-[727px] h-[270px] rounded-[32px] overflow-hidden bg-cover bg-center shrink-0"
          style={{ backgroundImage: `url('/img/ImageRest2.png')` }}
        >
          <div className="absolute inset-0 bg-black/20 z-10"></div>
          
          <div className="absolute top-[24px] right-[24px] z-20">
            <span className="bg-white/20 backdrop-blur-md border border-white/40 text-white text-[12px] px-[16px] py-[6px] rounded-[100px] font-sans">
              New Arrival
            </span>
          </div>

          <div className="absolute left-[32px] top-1/2 -translate-y-1/2 z-20 w-full max-w-[420px] text-white flex flex-col">
            <h3 className="text-[24px] font-medium font-sans tracking-[-0.04em] mb-[12px]">
              Meet Our New Partner: Luigi's Woodfire
            </h3>
            <p className="text-[16px] font-sans tracking-normal leading-[1.4] text-gray-100 mb-[24px]">
              Authentic Neapolitan pizza is finally here. Taste the crisp, smoky crust baked in a real wood-fired oven.
            </p>
            <div>
              <button className="border border-white text-white px-[20px] py-[6px] rounded-[100px] text-[14px] font-sans hover:bg-white hover:text-black transition duration-300">
                Explore Menu
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATALOG SECTION */}
      <section className="w-full mt-[180px]">
        
        <h2 className="text-[48px] font-medium tracking-[-0.02em] font-sans text-black mb-[128px]">
          Explore Local Restaurants
        </h2>

        <div className="w-full flex justify-center">
          <div className="flex flex-col lg:flex-row justify-between items-start w-full max-w-[1692px] gap-[120px]">
            
            <div className="flex flex-col gap-[20px] w-full max-w-[845px] items-start">
              <CatalogTab 
                categories={["All", ...CATEGORIES]}
                activeCategory={activeCategory}
                onCategorySelect={setActiveCategory}
              />
              
              <div className="relative w-full h-[53px]">
                <input
                  type="text"
                  placeholder="What are you craving right now?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-full px-[24px] py-[16px] rounded-[100px] bg-[#EFEFF1] border-none outline-none text-center text-[18px] tracking-[-0.04em] font-sans text-gray-700 placeholder-gray-400"
                />
                <span className="absolute right-[24px] top-1/2 -translate-y-1/2 text-[20px] text-black">
                  🔍
                </span>
              </div>
            </div>

            <div className="w-full max-w-[727px] shrink-0 mt-0">
              <p className="text-[16px] font-sans tracking-normal leading-[1.4] text-gray-800">
                Browse our carefully curated list of top-rated local spots. Whether you are looking for a quick bite, a healthy lunch, or a premium dinner, we deliver the best food in the city straight to your door, fast and fresh.
              </p>
            </div>
          </div>
        </div>

        {/* СЕТКА РЕСТОРАНОВ (БЕЗ RestaurantList) */}
        <div className="w-full flex justify-center mt-[128px] mb-[100px]">
          <div className="w-full max-w-[1692px]">
            {isLoading ? (
              <div className="text-center text-gray-500 text-[20px] mt-20">
                Завантаження ресторанів...
              </div>
            ) : formattedRestaurants.length > 0 ? (
              
              /* ЗДЕСЬ МАГИЯ: Жесткая сетка на 4 колонки, как на макете */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px] w-full">
                {formattedRestaurants.map((restaurant, index) => (
                  <RestaurantCard key={restaurant.id || index} data={restaurant} />
                ))}
              </div>

            ) : (
              <div className="text-center text-gray-500 text-[20px] mt-20">
                Нічого не знайдено
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}