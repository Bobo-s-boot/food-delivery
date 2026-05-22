import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../../features/cart/useCart";
import { MOCK_MENU_ITEMS } from "../menu/const";
import { RESTAURANT_RELATED_ITEMS } from "./const";
import { DishGallery } from "./components/DishGallery";
import { DishInfo } from "./components/DishInfo";
import { DishProductDetails } from "./components/DishProductDetails";
import { DishRecommendations } from "./components/DishRecommendations";
import { DishReviews } from "./components/DishReviews";
import {
  findDishById,
  getRestaurantRecommendations,
  normalizeDish,
} from "./dishUtils";
import "./Dish.scss";

export function Dish() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const stateDish = location.state?.dish;
  const dishSource = [...MOCK_MENU_ITEMS, ...RESTAURANT_RELATED_ITEMS];
  const dish =
    stateDish && String(stateDish.id ?? stateDish._id) === String(id)
      ? normalizeDish(stateDish)
      : findDishById(dishSource, id);

  if (!dish) {
    return (
      <div className="dish-page dish-page--empty">
        <div className="dish-page__empty-card">
          <p className="dish-page__empty-label">Dish not found</p>
          <h1 className="dish-page__empty-title">
            This dish is not on the menu yet
          </h1>
          <button
            type="button"
            onClick={() => navigate("/menu")}
            className="dish-button dish-button--primary"
          >
            Back to menu
          </button>
        </div>
      </div>
    );
  }

  const recommendations = getRestaurantRecommendations(
    MOCK_MENU_ITEMS,
    dish,
    RESTAURANT_RELATED_ITEMS,
    4,
  );

  const handleAddToCart = ({
    quantity,
    unitPrice,
    selectedOptions = [],
    selectedAddOns = [],
  }) => {
    const optionSummary = [...selectedOptions, ...selectedAddOns]
      .map((item) => item.label)
      .join(", ");
    const configuredDish = {
      ...dish,
      id: `${dish.id}-${optionSummary || "classic"}`,
      price: unitPrice,
      description: optionSummary
        ? `${dish.description} Selected: ${optionSummary}.`
        : dish.description,
    };

    Array.from({ length: quantity }).forEach(() => addItem(configuredDish));
  };

  return (
    <div className="dish-page">
      <div className="dish-page__container">
        <nav className="dish-breadcrumb">
          <button
            type="button"
            onClick={() => navigate("/catalog")}
            className="dish-breadcrumb__link"
          >
            Restaurants
          </button>
          <span className="dish-breadcrumb__separator">{">"}</span>
          <span className="dish-breadcrumb__text">{dish.restaurant}</span>
          <span className="dish-breadcrumb__separator">{">"}</span>
          <button
            type="button"
            onClick={() => navigate("/menu")}
            className="dish-breadcrumb__link"
          >
            Menu
          </button>
          <span className="dish-breadcrumb__separator">{">"}</span>
          <span className="dish-breadcrumb__current">{dish.name}</span>
        </nav>
      </div>

      <div className="dish-page__container dish-page__content">
        <section className="dish-page__hero">
          <DishGallery dish={dish} className="dish-page__gallery" />
          <DishInfo dish={dish} onAddToCart={handleAddToCart} />
        </section>

        <div className="dish-page__details">
          <DishProductDetails />
          <DishReviews dish={dish} />
          <DishRecommendations
            dishes={recommendations}
            restaurant={dish.restaurant}
          />
        </div>
      </div>
    </div>
  );
}
