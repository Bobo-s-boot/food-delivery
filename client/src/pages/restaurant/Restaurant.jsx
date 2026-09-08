import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDishesByRestaurant } from "../../api/dishService";
import { CLIENT_ERROR_MESSAGES } from "../../errors/error";
import { useCart } from "../../features/cart/useCart";
import "./Restaurant.scss";

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
        setDishes(Array.isArray(menuData) ? menuData : []);
      } catch (error) {
        console.error(CLIENT_ERROR_MESSAGES.FAILED_TO_FETCH_MENU, error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchMenu();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="restaurant-menu">
        <div className="restaurant-menu__loading">Loading menu...</div>
      </div>
    );
  }

  return (
    <div className="restaurant-menu">
      <h2 className="restaurant-menu__title">Menu</h2>

      {dishes.length === 0 ? (
        <p className="restaurant-menu__empty-text">
          This restaurant does not have dishes yet.
        </p>
      ) : (
        <div className="restaurant-menu__grid">
          {dishes.map((dish) => (
            <div key={dish._id || dish.id} className="dish-card">
              {dish.image ? (
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="dish-card__image"
                  loading="lazy"
                />
              ) : (
                <div
                  className="dish-card__image"
                  style={{
                    backgroundColor: "#f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#94a3b8",
                    fontSize: "0.875rem",
                  }}
                >
                  No photo
                </div>
              )}

              <h3 className="dish-card__name">{dish.name}</h3>
              <p className="dish-card__description">
                {dish.description || "Freshly prepared menu item."}
              </p>

              <div className="dish-card__footer">
                <span className="dish-card__price">
                  ${Number(dish.price || 0).toFixed(2)}
                </span>

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

