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
      <div className="w-full bg-[#F6F7F9] px-4 py-20 font-['Inter'] md:px-8">
        <div className="mx-auto max-w-180 rounded-[40px] bg-white p-8 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#8F9BB1]">
            Dish not found
          </p>
          <h1 className="mt-3 text-[48px] font-normal tracking-[-0.05em] text-[#0F1316]">
            This dish is not on the menu yet
          </h1>
          <button
            type="button"
            onClick={() => navigate("/menu")}
            className="mt-8 h-12 rounded-full bg-[#0D1A2D] px-7 text-base font-medium text-white transition hover:bg-black"
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
    <div className="w-full bg-[#F5F7FA] font-['Inter'] text-[#071426]">
      <div className="mx-auto w-full max-w-[1824px] px-5 pb-5 pt-6 md:px-10 xl:px-12">
        <div className="flex flex-wrap items-center gap-2 text-sm tracking-[0.08em] text-[#8F8F93]">
          <button
            type="button"
            onClick={() => navigate("/catalog")}
            className="transition hover:text-[#0D1A2D]"
          >
            Restaurants
          </button>
          <span>{">"}</span>
          <span>{dish.restaurant}</span>
          <span>{">"}</span>
          <button
            type="button"
            onClick={() => navigate("/menu")}
            className="transition hover:text-[#0D1A2D]"
          >
            Menu
          </button>
          <span>{">"}</span>
          <span className="tracking-[0.05em] text-[#0D1A2D]">{dish.name}</span>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1824px] px-5 md:px-10 xl:px-12">
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.18fr)_minmax(420px,0.82fr)] 2xl:grid-cols-[minmax(0,1.2fr)_minmax(520px,0.8fr)]">
          <DishGallery dish={dish} className="relative min-h-[620px]" />
          <DishInfo dish={dish} onAddToCart={handleAddToCart} />
        </section>

        <div className="pb-20">
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
