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
        <div className="restaurant-menu__grid">
          {dishes.map((dish) => (
            <div key={dish._id} className="dish-card">
              {dish.image && (
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="dish-card__image"
                />
              )}

              <h3 className="dish-card__name">{dish.name}</h3>
              <p className="dish-card__description">{dish.description}</p>

              <div className="dish-card__footer">
                {/* Возвращаем твое форматирование цены */}
                <span className="dish-card__price">
                  ${Number(dish.price || 0).toFixed(2)}
                </span>

                {/* Возвращаем onClick и твой текст на кнопку */}
                <button
                  type="button"
                  onClick={() => addItem(dish)}
                  className="dish-card__btn"
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
