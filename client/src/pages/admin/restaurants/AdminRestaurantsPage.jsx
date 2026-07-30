import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { AdminSelect } from "../components/ui/AdminSelect/AdminSelect";
import { getAdminBasePath } from "../admin.routes";
import { financePromotionsMockData } from "../shared/promotions.data";
import {
  menuItemsMockData,
  restaurantCategoryFilters,
  restaurantsMockData,
} from "./restaurants.data";
import {
  enrichMenuItem,
  enrichRestaurant,
  filterMenuItems,
  filterRestaurants,
  parseRestaurantRouteTail,
} from "./restaurants.utils";
import { MenuCatalog } from "./components/MenuCatalog";
import { RestaurantDirectory } from "./components/RestaurantDirectory";
import { RestaurantWorkspace } from "./components/RestaurantWorkspace";
import "./RestaurantsPage.scss";

const readNumber = (params, key, fallback) => {
  const value = Number(params.get(key));
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

function RestaurantCreateDialog({
  restaurants,
  mode,
  onClose,
  onContinue,
  onCreateRestaurant,
  previewMode,
}) {
  const [selectedRestaurant, setSelectedRestaurant] = useState(
    restaurants[0]?.id || "",
  );
  const [saved, setSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!mode) return null;
  const isMenuItem = mode === "menu-item";

  const handleCreateSubmit = async (event) => {
    event.preventDefault();

    if (previewMode || !onCreateRestaurant) {
      setSaved(true);
      return;
    }

    const formData = new FormData(event.target);
    const newRestaurantData = {
      name: formData.get("name"),
      cuisine: formData.get("cuisine"),
      location: formData.get("location"),
      category: formData.get("category"),
      status: formData.get("status") || "Pending approval",
    };

    try {
      setIsSubmitting(true);
      await onCreateRestaurant(newRestaurantData);
      onClose();
    } catch (error) {
      console.error("Ошибка при создании ресторана:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="restaurants-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="restaurants-create-title"
    >
      <button
        type="button"
        className="restaurants-dialog__backdrop"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div className="restaurants-dialog__panel restaurants-dialog__panel--form">
        <h2 id="restaurants-create-title">
          {isMenuItem ? "Add Menu Item" : "Add Restaurant"}
        </h2>
        <p>
          {isMenuItem
            ? "Choose the restaurant that will own this item."
            : "Create a direct admin-managed restaurant partner record."}
        </p>

        {saved && (
          <div className="restaurants-success" role="status">
            Restaurant preview created. Backend persistence remains a TODO.
          </div>
        )}

        {isMenuItem ? (
          <div className="restaurants-dialog__form">
            <label>
              Restaurant
              <AdminSelect
                value={selectedRestaurant}
                onChange={(event) => setSelectedRestaurant(event.target.value)}
                fluid
              >
                {restaurants.map((restaurant) => (
                  <option key={restaurant.id} value={restaurant.id}>
                    {restaurant.name}
                  </option>
                ))}
              </AdminSelect>
            </label>
            <div className="restaurants-dialog__actions">
              <button type="button" onClick={onClose}>
                Cancel
              </button>
              <button
                type="button"
                className="is-primary"
                disabled={!selectedRestaurant}
                onClick={() => onContinue(selectedRestaurant)}
              >
                Continue
              </button>
            </div>
          </div>
        ) : (
          <form
            className="restaurants-dialog__form"
            onSubmit={handleCreateSubmit}
          >
            <label>
              Restaurant name
              <input
                name="name"
                required
                placeholder="Restaurant name"
                disabled={isSubmitting}
              />
            </label>
            <label>
              Cuisine
              <input
                name="cuisine"
                required
                placeholder="Cuisine"
                disabled={isSubmitting}
              />
            </label>
            <label>
              Category
              <input
                name="category"
                required
                placeholder="Category (e.g. Fast Food)"
                defaultValue="Fast Food"
                disabled={isSubmitting}
              />
            </label>
            <label>
              Location
              <input
                name="location"
                required
                placeholder="Location"
                disabled={isSubmitting}
              />
            </label>
            <label>
              Partnership status
              <AdminSelect
                name="status"
                defaultValue="Pending approval"
                fluid
                disabled={isSubmitting}
              >
                <option value="Pending approval">Pending approval</option>
                <option value="Approved">Approved</option>
              </AdminSelect>
            </label>
            <div className="restaurants-dialog__actions">
              <button type="button" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </button>
              <button
                type="submit"
                className="is-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create restaurant"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export function AdminRestaurantsPage({
  restaurants: liveRestaurants = [],
  dishes: liveDishes = [],
  orders: liveOrders = [],
  onCreateRestaurant,
  onUpdateRestaurant,
  onDeleteRestaurant,
  previewMode = false,
  workspace,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [dialogMode, setDialogMode] = useState(null);
  const wildcardRoute = parseRestaurantRouteTail(params["*"]);
  const restaurantId = params.restaurantId || wildcardRoute.restaurantId;
  const menuItemId = params.menuItemId || wildcardRoute.menuItemId;
  const basePath = getAdminBasePath(location.pathname);

  const rawRestaurants = useMemo(() => {
    if (!previewMode && liveRestaurants && liveRestaurants.length > 0) {
      return liveRestaurants.map((r) => ({ ...r, id: r.id || r._id }));
    }
    return restaurantsMockData;
  }, [previewMode, liveRestaurants]);

  const rawMenuItems = useMemo(() => {
    if (!previewMode && liveDishes && liveDishes.length > 0) {
      return liveDishes.map((d) => ({ ...d, id: d.id || d._id }));
    }
    return menuItemsMockData;
  }, [previewMode, liveDishes]);

  const restaurants = useMemo(
    () => rawRestaurants.map(enrichRestaurant),
    [rawRestaurants],
  );

  const menuItems = useMemo(
    () => rawMenuItems.map((item) => enrichMenuItem(item, restaurants)),
    [rawMenuItems, restaurants],
  );

  const selectedRestaurant = restaurants?.find(
    (restaurant) =>
      String(restaurant.id) === String(restaurantId) ||
      String(restaurant._id) === String(restaurantId),
  );

  const updateSearchParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === "" || value == null) next.delete(key);
      else next.set(key, String(value));
    });
    setSearchParams(next, { replace: true });
  };

  const section =
    searchParams.get("section") === "catalog" ? "catalog" : "restaurants";
  const directoryState = {
    search: searchParams.get("search") || "",
    partnership: searchParams.get("partnership") || "All partnership statuses",
    availability: searchParams.get("availability") || "All availability states",
    issue: searchParams.get("issue") || "All issue states",
    cuisine: searchParams.get("cuisine") || "All cuisines",
    view: searchParams.get("view") === "grid" ? "grid" : "list",
    page: readNumber(searchParams, "page", 1),
    pageSize: readNumber(
      searchParams,
      "pageSize",
      searchParams.get("view") === "grid" ? 12 : 10,
    ),
  };
  const catalogState = {
    search: searchParams.get("search") || "",
    restaurant: searchParams.get("restaurant") || "All restaurants",
    platformCategory:
      searchParams.get("platformCategory") || "All platform categories",
    restaurantCategory:
      searchParams.get("restaurantCategory") || "All restaurant categories",
    availability: searchParams.get("availability") || "All availability states",
    visibility: searchParams.get("visibility") || "All customer visibility",
    promotion: searchParams.get("promotion") || "All promotion states",
    content: searchParams.get("content") || "All content states",
    quick: searchParams.get("quick") || "All",
    page: readNumber(searchParams, "page", 1),
    pageSize: readNumber(searchParams, "pageSize", 10),
  };

  const filteredRestaurants = useMemo(
    () =>
      filterRestaurants(restaurants, {
        searchValue: directoryState.search,
        partnershipFilter: directoryState.partnership,
        availabilityFilter: directoryState.availability,
        issueFilter: directoryState.issue,
        cuisineFilter: directoryState.cuisine,
      }),
    [
      restaurants,
      directoryState.search,
      directoryState.partnership,
      directoryState.availability,
      directoryState.issue,
      directoryState.cuisine,
    ],
  );
  const filteredMenuItems = useMemo(
    () =>
      filterMenuItems(
        menuItems,
        {
          searchValue: catalogState.search,
          restaurantFilter: catalogState.restaurant,
          platformCategoryFilter: catalogState.platformCategory,
          restaurantCategoryFilter: catalogState.restaurantCategory,
          availabilityFilter:
            catalogState.quick === "All"
              ? catalogState.availability
              : catalogState.quick,
          visibilityFilter: catalogState.visibility,
          promotionFilter: catalogState.promotion,
          contentIssueFilter: catalogState.content,
        },
        restaurants,
      ),
    [
      menuItems,
      restaurants,
      catalogState.search,
      catalogState.restaurant,
      catalogState.platformCategory,
      catalogState.restaurantCategory,
      catalogState.availability,
      catalogState.visibility,
      catalogState.promotion,
      catalogState.content,
      catalogState.quick,
    ],
  );

  const cuisineOptions = [
    "All cuisines",
    ...restaurantCategoryFilters.filter(
      (option) => option !== "All categories",
    ),
  ];
  const platformCategories = [
    "All platform categories",
    ...new Set(menuItems.map((item) => item.platformCategory)),
  ];
  const restaurantCategories = [
    "All restaurant categories",
    ...new Set(menuItems.map((item) => item.restaurantCategory)),
  ];

  const openRestaurant = (id) => {
    const returnState = searchParams.toString();
    navigate(
      `${basePath}/restaurants/${id}?return=${encodeURIComponent(returnState)}`,
    );
  };
  const openCatalogItem = (item) => {
    const returnState = searchParams.toString();
    navigate(
      `${basePath}/restaurants/${item.restaurantId}/menu/${item.id}?tab=menu&return=${encodeURIComponent(returnState)}`,
    );
  };

  if (restaurantId) {
    if (!selectedRestaurant) {
      return (
        <div className="restaurants-empty">
          <strong>Restaurant not found</strong>
          <span>Return to the directory and choose another partner.</span>
          <button
            type="button"
            onClick={() => navigate(`${basePath}/restaurants`)}
          >
            Back to Restaurants
          </button>
        </div>
      );
    }
    const activeTab =
      menuItemId || searchParams.get("tab") === "menu"
        ? "Menu"
        : ["overview", "operations", "promotions", "settings"].includes(
              searchParams.get("tab"),
            )
          ? `${searchParams.get("tab")[0].toUpperCase()}${searchParams.get("tab").slice(1)}`
          : "Overview";

    const returnQuery = searchParams.get("return") || "";

    return (
      <RestaurantWorkspace
        restaurant={selectedRestaurant}
        menuItems={menuItems}
        orders={liveOrders}
        promotions={financePromotionsMockData}
        activeTab={activeTab}
        editorItemId={menuItemId}
        basePath={basePath}
        returnQuery={returnQuery}
        onNavigate={navigate}
        onBack={() =>
          navigate(
            `${basePath}/restaurants${returnQuery ? `?${returnQuery}` : ""}`,
          )
        }
        onTabChange={(tab) =>
          navigate(
            `${basePath}/restaurants/${selectedRestaurant.id}?tab=${tab.toLowerCase()}${returnQuery ? `&return=${encodeURIComponent(returnQuery)}` : ""}`,
          )
        }
        onUpdateRestaurant={onUpdateRestaurant}
        onDeleteRestaurant={onDeleteRestaurant}
        onSaveDish={workspace?.handleSaveDish}
        onDeleteDish={workspace?.handleDeleteDish}
      />
    );
  }

  const setSection = (nextSection) => {
    const next = new URLSearchParams();
    if (nextSection === "catalog") next.set("section", "catalog");
    setSearchParams(next);
  };
  const updateDirectoryState = (updates) =>
    updateSearchParams({ section: "restaurants", ...updates });
  const updateCatalogState = (updates) => {
    const next = { section: "catalog", ...updates };
    if (
      Object.hasOwn(updates, "availability") ||
      Object.hasOwn(updates, "content") ||
      Object.hasOwn(updates, "promotion")
    )
      next.quick = "All";
    updateSearchParams(next);
  };

  return (
    <div className="restaurants-page">
      <div className="admin-page-intro restaurants-page__intro">
        <h1>Restaurants</h1>
        <p>Manage restaurant partners, menus and operational availability.</p>
      </div>
      <div className="restaurants-page__toolbar">
        <div
          className="restaurants-page__tabs"
          role="tablist"
          aria-label="Restaurants section"
        >
          <button
            type="button"
            role="tab"
            aria-selected={section === "restaurants"}
            className={section === "restaurants" ? "is-active" : ""}
            onClick={() => setSection("restaurants")}
          >
            Restaurants
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={section === "catalog"}
            className={section === "catalog" ? "is-active" : ""}
            onClick={() => setSection("catalog")}
          >
            Menu Catalog
          </button>
        </div>
        <button
          type="button"
          className="restaurants-primary-action"
          onClick={() =>
            setDialogMode(
              section === "restaurants" ? "restaurant" : "menu-item",
            )
          }
        >
          <Plus size={17} aria-hidden="true" />
          {section === "restaurants" ? "Add Restaurant" : "Add Menu Item"}
        </button>
      </div>
      {section === "restaurants" ? (
        <RestaurantDirectory
          restaurants={filteredRestaurants}
          cuisineOptions={cuisineOptions}
          state={directoryState}
          onStateChange={updateDirectoryState}
          onOpenRestaurant={openRestaurant}
          onDeleteRestaurant={onDeleteRestaurant}
        />
      ) : (
        <MenuCatalog
          items={filteredMenuItems}
          restaurants={restaurants}
          platformCategories={platformCategories}
          restaurantCategories={restaurantCategories}
          state={catalogState}
          onStateChange={updateCatalogState}
          onOpenItem={openCatalogItem}
          onAddItem={() => setDialogMode("menu-item")}
        />
      )}

      <RestaurantCreateDialog
        restaurants={restaurants}
        mode={dialogMode}
        onClose={() => setDialogMode(null)}
        onContinue={(id) =>
          navigate(`${basePath}/restaurants/${id}/menu/new?tab=menu`)
        }
        onCreateRestaurant={onCreateRestaurant}
        previewMode={previewMode}
      />
    </div>
  );
}
