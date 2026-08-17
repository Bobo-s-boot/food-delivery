import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRestaurantById } from "../../api/restaurantService";
import { getDishesByRestaurant } from "../../api/dishService";
import { CLIENT_ERROR_MESSAGES } from "../../errors/error";
import { useCart } from "../../features/cart/useCart";
import { ArrowLeft, MapPin, Plus, Star } from "lucide-react";
import "./Restaurant.scss";

export function Restaurant() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        setIsLoading(true);
        const [restaurantData, menuData] = await Promise.all([
          getRestaurantById(id),
          getDishesByRestaurant(id),
        ]);

        if (restaurantData) {
          setRestaurant(restaurantData);
        } else {
          setRestaurant({
            name: `Restaurant #${id}`,
            description: "Delicious dishes prepared with love.",
            category: "Restaurant",
            rating: 5.0,
            location: "Available in your area",
          });
        }

        setDishes(Array.isArray(menuData) ? menuData : []);
      } catch (err) {
        console.error(CLIENT_ERROR_MESSAGES.UNKNOWN_ERROR, err);
        setRestaurant({
          name: `Restaurant #${id}`,
          description: "Delicious dishes prepared with love.",
          category: "Restaurant",
          rating: 5.0,
          location: "Available in your area",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurantData();
  }, [id]);

  const handleAddToCart = (e, dish) => {
    e.stopPropagation();
    addItem(dish);
  };

  const handleDishClick = (dish) => {
    const dishId = dish._id || dish.id;
    if (dishId) {
      navigate(`/dish/${dishId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="restaurant-loading">
        <div className="restaurant-loading__spinner"></div>
        <p>Loading restaurant menu...</p>
      </div>
    );
  }

  return (
    <div className="restaurant-page">
      <button
        type="button"
        className="restaurant-page__back-btn"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={18} />
        <span>Back</span>
      </button>

      {restaurant && (
        <section className="restaurant-hero">
          {restaurant.image && (
            <div className="restaurant-hero__bg">
              <img src={restaurant.image} alt={restaurant.name} />
              <div className="restaurant-hero__overlay"></div>
            </div>
          )}
          <div className="restaurant-hero__content">
            <div className="restaurant-hero__badge">
              {restaurant.category || "Restaurant"}
            </div>
            <h1 className="restaurant-hero__title">{restaurant.name}</h1>
            {restaurant.description && (
              <p className="restaurant-hero__description">
                {restaurant.description}
              </p>
            )}

            <div className="restaurant-hero__meta">
              {restaurant.rating !== undefined && (
                <div className="restaurant-hero__meta-item restaurant-hero__rating">
                  <Star size={16} fill="#f59e0b" color="#f59e0b" />
                  <span>{restaurant.rating}</span>
                </div>
              )}
              {restaurant.location && (
                <div className="restaurant-hero__meta-item">
                  <MapPin size={16} />
                  <span>{restaurant.location}</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="restaurant-menu">
        <div className="restaurant-menu__header">
          <h2 className="restaurant-menu__title">Menu & Dishes</h2>
          <span className="restaurant-menu__count">
            {dishes.length} {dishes.length === 1 ? "dish" : "dishes"} available
          </span>
        </div>

        {dishes.length === 0 ? (
          <div className="restaurant-menu__empty">
            <p>No dishes found for this restaurant yet.</p>
          </div>
        ) : (
          <div className="restaurant-menu__grid">
            {dishes.map((dish) => (
              <div
                key={dish._id || dish.id}
                className="dish-card"
                onClick={() => handleDishClick(dish)}
              >
                <div className="dish-card__image-wrap">
                  <img
                    src={dish.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                    alt={dish.name}
                    className="dish-card__image"
                    loading="lazy"
                  />
                  {dish.category && (
                    <span className="dish-card__category">{dish.category}</span>
                  )}
                </div>

                <div className="dish-card__content">
                  <div className="dish-card__header">
                    <h3 className="dish-card__title">{dish.name}</h3>
                    {dish.rating && (
                      <span className="dish-card__rating">
                        <Star size={14} fill="#f59e0b" color="#f59e0b" />
                        {dish.rating}
                      </span>
                    )}
                  </div>

                  <p className="dish-card__description">
                    {dish.description || "Prepared with fresh ingredients."}
                  </p>

                  <div className="dish-card__footer">
                    <span className="dish-card__price">
                      ${Number(dish.price || 0).toFixed(2)}
                    </span>
                    <button
                      type="button"
                      className="dish-card__btn"
                      onClick={(e) => handleAddToCart(e, dish)}
                    >
                      <Plus size={16} />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
