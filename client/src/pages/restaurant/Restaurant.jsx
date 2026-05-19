import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getDishesByRestaurant } from "../../api/dishService";
import { CLIENT_ERORR_MESSAGE } from "../../errors/error";
import "./Restaurant.scss";

export function Restaurant() {
  const { id } = useParams();
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

  if (isLoading)
    return (
      <div className="restaurant-menu__loading">
        Загружаем вкусное меню... 🍕
      </div>
    );

  return (
    <div className="restaurant-menu">
      <h2 className="restaurant-menu__title">Меню</h2>

      {dishes.length === 0 ? (
        <p className="restaurant-menu__empty-text">
          В этом ресторане пока нет добавленных блюд.
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
                <span className="dish-card__price">{dish.price} ₴</span>
                <button className="dish-card__btn">В корзину</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
