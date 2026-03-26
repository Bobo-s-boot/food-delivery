import { useEffect, useState } from "react";
import { getRestauranst } from "../../api/restaurantService";
import { CLIENT_ERORR_MESSAGE } from "../../errors/error";

export function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [isloading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRestauranst();
        setRestaurants(data);
        setLoading(false);
      } catch (error) {
        console.error(CLIENT_ERORR_MESSAGE.FIELD_TO_FETCH, error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-20 space-y-8">
      {/* <div className="relative max-w-xl mx-auto">
        <input
          type="text"
          name="search"
          placeholder="Шукайте ресторани..."
          className="w-full p-4 pl-12 rounded-2xl border border-green-200 shadow-sm focus:ring-2 focus:ring-green-500 outline-none bg-white text-black"
        />
        <span className="absolute left-4 top-4">🔍</span>
      </div> */}

      {/* {isloading ? (
        <div className="text-center text-gray-500 text-xl mt-10">
          Завантаження ресторанів з сервера...
        </div>
      ) : (
        <RestaurantList items={restaurants} />
      )} */}

      {/* === СЕКЦИЯ 1: HERO БАННЕР === */}
      {/* Замени URL в backgroundImage на свою картинку из Figma */}
      <section className="max-w-450 mx-auto px-4 pt-4">
        <div
          className="relative w-full h-150 rounded-4xl overflow-hidden flex flex-col justify-center px-12"
          style={{
            backgroundImage: 'url("client/public/img/backgroundImage.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Темный оверлей для читаемости текста */}
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Контент баннера */}
          <div className="relative z-10 flex flex-col items-center  columns-1 text-white">
            <h1 className="text-6xl font-bold leading-tight mb-6">
              Explore Remarkable Restaurants Today
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl text-center mx-auto">
              Join the ultimate dining experience - where taste meets
              convenience. Your next culinary adventure is just a click away.
            </p>
            <button className="bg-gray-900 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-800 transition-colors">
              Start your culinary journey
            </button>
          </div>

          {/* Соцсети (справа) */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-10">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/40">
              <span className="text-white">In</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/40">
              <span className="text-white">Fb</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/40">
              <span className="text-white">Tw</span>
            </div>
          </div>
        </div>
      </section>

      {/* === СЕКЦИЯ 2: ПРЕИМУЩЕСТВА И СТАТИСТИКА === */}
      <section className="max-w-300 mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Левая часть: Текст и цифры */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Thousands Of People Choose Us?
            </h2>
            <p className="text-gray-600 mb-10 text-lg">
              Join a community of food lovers who trust us to provide the best
              dining recommendations, exclusive offers, and a seamless booking
              process every time.
            </p>

            <div className="flex gap-12">
              <div>
                <p className="text-3xl font-bold text-gray-900">300+</p>
                <p className="text-gray-500 mt-1">Partners</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">20+</p>
                <p className="text-gray-500 mt-1">Cities</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">100K+</p>
                <p className="text-gray-500 mt-1">Users</p>
              </div>
            </div>
          </div>

          {/* Правая часть: Карточки преимуществ */}
          <div className="space-y-4">
            <div className="flex items-center gap-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-2xl">
                📅
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Easy Booking
                </h3>
                <p className="text-gray-500">
                  Book your table in just a few clicks.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              {/* ml-8 делает лесенку */}
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                ⚡
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Fast Delivery
                </h3>
                <p className="text-gray-500">
                  Get your food delivered hot and fresh.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                ⭐
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Best Quality
                </h3>
                <p className="text-gray-500">
                  We partner with top-rated restaurants only.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === СЕКЦИЯ 3: КАТАЛОГ (TRENDING NEAR YOU) === */}
      <section className="max-w-300 mx-auto px-4 py-10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Trending Near You
            </h2>
            <p className="text-gray-500">
              Discover the most popular restaurants in your area.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">
              ←
            </button>
            <button className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-800">
              →
            </button>
          </div>
        </div>

        {/* Сетка карточек ресторанов */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Пример 1 Карточки */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group relative">
            <button className="absolute top-4 right-4 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow">
              ❤️
            </button>
            <div className="h-48 bg-gray-200 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop"
                alt="Food"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-900">Spicy Haven</h3>
                <span className="flex items-center text-sm font-bold">
                  ⭐ 4.8
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-4">
                📍 123 Main Street, City
              </p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">$20 - $40</span>
                <button className="text-orange-600 font-bold text-sm hover:underline">
                  View Menu
                </button>
              </div>
            </div>
          </div>

          {/* Пример 2 Карточки */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group relative">
            <button className="absolute top-4 right-4 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow">
              ❤️
            </button>
            <div className="h-48 bg-gray-200 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop"
                alt="Food"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-900">
                  Sushi Master
                </h3>
                <span className="flex items-center text-sm font-bold">
                  ⭐ 4.9
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-4">
                📍 45 Ocean Drive, City
              </p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">$30 - $60</span>
                <button className="text-orange-600 font-bold text-sm hover:underline">
                  View Menu
                </button>
              </div>
            </div>
          </div>

          {/* Сюда можно добавить еще карточки... */}
        </div>
      </section>
    </div>
  );
}
