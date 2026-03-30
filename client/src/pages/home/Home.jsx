import { useEffect, useState } from "react";
import { getRestaurants } from "../../api/restaurantService";
import { RestaurantList } from "../../components/cardListRestaurant/RestaurantList";
import { CLIENT_ERORR_MESSAGE } from "../../errors/error";

export function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [isloading, setLoading] = useState(true);

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

  return (
    <div className="space-y-8">
      <div className="relative max-w-xl mx-auto">
        <input
          type="text"
          name="search"
          placeholder="Шукайте ресторани..."
          className="w-full p-4 pl-12 rounded-2xl border border-green-200 shadow-sm focus:ring-2 focus:ring-green-500 outline-none bg-white text-black"
        />
        <span className="absolute left-4 top-4">🔍</span>
      </div>

      {isloading ? (
        <div className="text-center text-gray-500 text-xl mt-10">
          Завантаження ресторанів з сервера...
        </div>
      ) : (
        <RestaurantList items={restaurants} />
      )}
    </div>
  );
}
