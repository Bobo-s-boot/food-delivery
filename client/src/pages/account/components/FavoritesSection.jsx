import { useState } from "react";
import { ProductCard } from "../../menu/ProductCard";

const toRestaurantProductItem = (restaurant) => ({
  id: restaurant.id,
  title: restaurant.name,
  description: `${restaurant.category} favorite place near ${restaurant.location}.`,
  price: 0,
  priceLabel: restaurant.badge,
  category: restaurant.category,
  weight: restaurant.location,
  calories: restaurant.badge,
  rating: restaurant.rating,
  reviews: "saved",
  restaurant: restaurant.name,
  imageUrl: restaurant.image,
});

const toProductCardItem = (dish) => ({
  id: dish.id,
  title: dish.name,
  description: dish.description,
  price: dish.price,
  category: dish.category,
  weight: dish.weight || "Favorite",
  calories: dish.calories || "Saved",
  rating: dish.rating || 4.8,
  reviews: dish.reviews || 120,
  restaurant: dish.restaurant,
  imageUrl: dish.image,
});

export function FavoritesSection({
  favorites,
  onBrowseRestaurants,
}) {
  const [activeTab, setActiveTab] = useState("restaurants");
  const hasFavorites =
    favorites.restaurants.length > 0 || favorites.dishes.length > 0;

  return (
    <div className="account-section">
      <section className="account-page-heading">
        <span className="account-eyebrow">Favorites</span>
        <h1>Favorites</h1>
        <p>Your saved restaurants and dishes are collected here for faster ordering.</p>
      </section>

      <section className="account-card">
        <div className="account-favorites-summary">
          <div>
            <span className="account-eyebrow">Saved for faster ordering</span>
            <h2>
              {favorites.restaurants.length} saved restaurants ·{" "}
              {favorites.dishes.length} saved dishes
            </h2>
          </div>
          <div className="account-tabs">
            <button
              type="button"
              onClick={() => setActiveTab("restaurants")}
              className={activeTab === "restaurants" ? "is-active" : ""}
            >
              Restaurants
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("dishes")}
              className={activeTab === "dishes" ? "is-active" : ""}
            >
              Dishes
            </button>
          </div>
        </div>
      </section>

      {!hasFavorites && (
        <section className="account-card account-empty-state">
          <h2>No favorites yet</h2>
          <p>Tap the heart icon on restaurants or dishes to save them here.</p>
          <button
            type="button"
            className="account-button account-button--primary"
            onClick={onBrowseRestaurants}
          >
            Explore Restaurants
          </button>
        </section>
      )}

      {activeTab === "restaurants" && (
        <section className="account-card">
          <div className="account-favorites-grid">
            {favorites.restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="account-reused-card"
              >
                <ProductCard
                  item={toRestaurantProductItem(restaurant)}
                  actionLabel="View"
                  onActionClick={onBrowseRestaurants}
                  onCardClick={onBrowseRestaurants}
                  variant="minimal"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === "dishes" && (
        <section className="account-card">
          <div className="account-favorites-grid">
            {favorites.dishes.map((dish) => (
              <div key={dish.id} className="account-reused-card">
                <ProductCard
                  item={toProductCardItem(dish)}
                  variant="minimal"
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
