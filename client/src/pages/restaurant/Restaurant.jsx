import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDishesByRestaurant } from "../../api/dishService";
import { CLIENT_ERORR_MESSAGE } from "../../errors/error";
import { useCart } from "../../features/cart/useCart";

export function Restaurant() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [dishes, setDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        const menuData = await getDishesByRestaurant(id);
        setDishes(menuData);
      } catch (error) {
        console.error(CLIENT_ERORR_MESSAGE.FIELD_TO_FETCH_MENU, error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchMenu();
    }
  }, [id]);

  if (isLoading) {
    return <div className="text-amber-300">Loading menu...</div>;
  }

  return (
    <div className="mt-8 w-full">
      <h2 className="mb-6 text-2xl font-bold text-[#0F1316]">Menu</h2>

      {dishes.length === 0 ? (
        <p className="text-gray-500">
          This restaurant does not have dishes yet.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dishes.map((dish) => (
            <div
              key={dish._id}
              className="flex flex-col rounded-3xl border border-[#EDECF1] bg-white p-4 shadow-sm"
            >
              {dish.image && (
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="mb-4 h-40 w-full rounded-2xl object-cover"
                />
              )}

              <h3 className="text-lg font-bold text-[#0F1316]">{dish.name}</h3>
              <p className="mt-1 flex-grow text-sm text-gray-600">
                {dish.description}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xl font-bold text-[#0D1A2D]">
                  ${Number(dish.price || 0).toFixed(2)}
                </span>
                <button
                  type="button"
                  onClick={() => addItem(dish)}
                  className="rounded-full bg-[#0D1A2D] px-5 py-2 text-white transition hover:bg-black"
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
