import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
  MoreHorizontal,
  Pause,
  Play,
} from "lucide-react";
import { AdminCard } from "../../components/AdminCard";
import { StatusBadge } from "../../components/StatusBadge";
import { getRestaurantInitials } from "../restaurants.utils";
import { MenuTab } from "./workspace/MenuTab";
import { OperationsTab } from "./workspace/OperationsTab";
import { OverviewTab } from "./workspace/OverviewTab";
import { PromotionsTab } from "./workspace/PromotionsTab";
import { RestaurantConfirmationDialog } from "./workspace/RestaurantConfirmationDialog";
import { SettingsTab } from "./workspace/SettingsTab";

const workspaceTabs = [
  "Overview",
  "Menu",
  "Operations",
  "Promotions",
  "Settings",
];

export function RestaurantWorkspace({
  restaurant,
  menuItems = [],
  orders = [],
  promotions = [],
  activeTab,
  editorItemId,
  onTabChange,
  onBack,
  onNavigate,
  basePath,
  returnQuery,
  onUpdateRestaurant,
  onDeleteRestaurant,
  onSaveDish,
  onDeleteDish,
}) {
  const [confirmation, setConfirmation] = useState(null);
  const [notice, setNotice] = useState("");
  const [focusSettingsDetails, setFocusSettingsDetails] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Получаем приоритетный ObjectId ресторана
  const activeRestaurantId = restaurant?._id || restaurant?.id;

  // Безопасный фильтр блюд именно для текущего ресторана
  const currentRestaurantMenuItems = useMemo(() => {
    if (!Array.isArray(menuItems)) return [];

    return menuItems.filter((dish) => {
      const dishRestId = String(
        dish.restaurantId?._id || dish.restaurantId?.id || dish.restaurantId || "",
      );
      const targetRestId = String(activeRestaurantId || "");
      const targetRestMongoId = String(restaurant?._id || "");
      const targetRestCustomId = String(restaurant?.id || "");

      return (
        !dishRestId ||
        dishRestId === targetRestId ||
        dishRestId === targetRestMongoId ||
        dishRestId === targetRestCustomId ||
        (dish.restaurant && dish.restaurant === restaurant.name)
      );
    });
  }, [menuItems, activeRestaurantId, restaurant]);

  const restaurantOrders = useMemo(
    () => orders.filter((order) => order.restaurant?.name === restaurant.name),
    [orders, restaurant.name],
  );

  const restaurantPromotions = useMemo(
    () =>
      promotions.filter(
        (promotion) =>
          !promotion.restaurant || promotion.restaurant === restaurant.name,
      ),
    [promotions, restaurant.name],
  );

  const returnSuffix = returnQuery
    ? `&return=${encodeURIComponent(returnQuery)}`
    : "";

  const openItem = (itemId) => {
    onNavigate(
      `${basePath}/restaurants/${activeRestaurantId}/menu/${itemId}?tab=menu${returnSuffix}`,
    );
  };

  const confirmAction = async (action) => {
    setConfirmation(null);

    try {
      setIsUpdating(true);

      if (action === "Pause orders") {
        await onUpdateRestaurant?.(activeRestaurantId, {
          ...restaurant,
          operationalAvailability: "Paused",
        });
        setNotice("Приём заказов для ресторана приостановлен.");
      } else if (action === "Resume orders") {
        await onUpdateRestaurant?.(activeRestaurantId, {
          ...restaurant,
          operationalAvailability: "Accepting orders",
        });
        setNotice("Ресторан снова принимает заказы!");
      } else if (
        action.toLowerCase().includes("delete") ||
        action.toLowerCase().includes("удалить")
      ) {
        await onDeleteRestaurant?.(activeRestaurantId);
        onBack();
      } else {
        setNotice(`Действие "${action}" выполнено.`);
      }
    } catch (error) {
      console.error("Ошибка при выполнении действия:", error);
      setNotice("Произошла ошибка при сохранении изменений в БД.");
    } finally {
      setIsUpdating(false);
    }
  };

  const navigateToOrders = (orderId) => {
    onNavigate(
      `${basePath}/orders?restaurant=${encodeURIComponent(restaurant.name)}` +
        `${orderId ? `&order=${encodeURIComponent(orderId)}` : ""}`,
    );
  };

  const closeMenuEditor = () => {
    onNavigate(
      `${basePath}/restaurants/${activeRestaurantId}?tab=menu${returnSuffix}`,
    );
  };

  const openFinancePromotions = () => {
    onNavigate(
      `${basePath}/finance?tab=promotions&restaurant=${activeRestaurantId}`,
    );
  };

  const editRestaurant = () => {
    setFocusSettingsDetails(true);
    onTabChange("Settings");
  };

  return (
    <div className="restaurant-workspace">
      <button
        type="button"
        className="restaurant-workspace__back"
        onClick={onBack}
        disabled={isUpdating}
      >
        <ArrowLeft size={17} /> Restaurants
      </button>

      <div className="restaurant-workspace__breadcrumb">
        <span>Restaurants</span>
        <ChevronRight size={14} />
        <strong>{restaurant.name}</strong>
      </div>

      <AdminCard className="restaurant-workspace__hero">
        <div className="restaurant-workspace__identity">
          <span className="restaurant-workspace__logo">
            {getRestaurantInitials(restaurant.name)}
          </span>
          <div>
            <h1>{restaurant.name}</h1>
            <p>
              {restaurant.cuisine} · {restaurant.location}
            </p>

            <div>
              <StatusBadge value={restaurant.partnershipStatus} />
              <StatusBadge value={restaurant.operationalAvailability} />
            </div>
          </div>
        </div>

        <div className="restaurant-workspace__actions">
          <button
            type="button"
            className="restaurants-primary-action"
            disabled={isUpdating}
            onClick={() =>
              setConfirmation(
                restaurant.operationalAvailability === "Accepting orders"
                  ? "Pause orders"
                  : "Resume orders",
              )
            }
          >
            {restaurant.operationalAvailability === "Accepting orders" ? (
              <Pause size={16} />
            ) : (
              <Play size={16} />
            )}
            {restaurant.operationalAvailability === "Accepting orders"
              ? "Pause orders"
              : "Resume orders"}
          </button>

          <button type="button" onClick={editRestaurant} disabled={isUpdating}>
            Edit restaurant
          </button>

          <button
            type="button"
            aria-label="More restaurant actions"
            disabled={isUpdating}
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
      </AdminCard>

      {notice && (
        <div className="restaurants-notice" role="status">
          {notice}
          <button type="button" onClick={() => setNotice("")}>
            Dismiss
          </button>
        </div>
      )}
      <nav
        className="restaurant-workspace__tabs"
        aria-label="Restaurant workspace tabs"
      >
        {workspaceTabs.map((tab) => (
          <button
            type="button"
            key={tab}
            className={activeTab === tab ? "is-active" : ""}
            aria-current={activeTab === tab ? "page" : undefined}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>
      {activeTab === "Overview" && (
        <OverviewTab
          restaurant={restaurant}
          orders={restaurantOrders}
          promotions={restaurantPromotions}
          navigateToOrders={navigateToOrders}
          onTabChange={onTabChange}
        />
      )}
      {activeTab === "Menu" && (
        <MenuTab
          restaurant={restaurant}
          menuItems={currentRestaurantMenuItems}
          editorItemId={editorItemId}
          onOpenItem={openItem}
          onCloseEditor={closeMenuEditor}
          onSaveDish={onSaveDish}
          onDeleteDish={onDeleteDish}
        />
      )}
      {activeTab === "Operations" && <OperationsTab restaurant={restaurant} />}
      {activeTab === "Promotions" && (
        <PromotionsTab
          promotions={restaurantPromotions}
          onOpenFinance={openFinancePromotions}
        />
      )}
      {activeTab === "Settings" && (
        <SettingsTab
          key={activeRestaurantId}
          restaurant={restaurant}
          onConfirm={setConfirmation}
          focusDetails={focusSettingsDetails}
          onDetailsFocused={() => setFocusSettingsDetails(false)}
          onUpdateRestaurant={onUpdateRestaurant}
          onDeleteRestaurant={onDeleteRestaurant}
        />
      )}
      <RestaurantConfirmationDialog
        action={confirmation}
        restaurant={restaurant}
        onClose={() => setConfirmation(null)}
        onConfirm={confirmAction}
      />
    </div>
  );
}
