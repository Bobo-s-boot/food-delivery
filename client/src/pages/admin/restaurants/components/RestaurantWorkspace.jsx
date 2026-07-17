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

const workspaceTabs = ["Overview", "Menu", "Operations", "Promotions", "Settings"];

export function RestaurantWorkspace({
  restaurant,
  menuItems,
  orders,
  promotions,
  activeTab,
  editorItemId,
  onTabChange,
  onBack,
  onNavigate,
  basePath,
  returnQuery,
}) {
  const [confirmation, setConfirmation] = useState(null);
  const [notice, setNotice] = useState("");
  const [focusSettingsDetails, setFocusSettingsDetails] = useState(false);
  const restaurantOrders = useMemo(
    () => orders.filter((order) => order.restaurant.name === restaurant.name),
    [orders, restaurant.name],
  );
  const restaurantPromotions = useMemo(
    () => promotions.filter(
      (promotion) => !promotion.restaurant || promotion.restaurant === restaurant.name,
    ),
    [promotions, restaurant.name],
  );
  const returnSuffix = returnQuery ? `&return=${encodeURIComponent(returnQuery)}` : "";
  const openItem = (itemId) => {
    onNavigate(`${basePath}/restaurants/${restaurant.id}/menu/${itemId}?tab=menu${returnSuffix}`);
  };

  const confirmAction = (action) => {
    setNotice(`${action} is represented as a mock UI state. Backend mutation remains a TODO.`);
    setConfirmation(null);
  };

  const navigateToOrders = (orderId) => {
    onNavigate(
      `${basePath}/orders?restaurant=${encodeURIComponent(restaurant.name)}` +
      `${orderId ? `&order=${encodeURIComponent(orderId)}` : ""}`,
    );
  };

  const closeMenuEditor = () => {
    onNavigate(`${basePath}/restaurants/${restaurant.id}?tab=menu${returnSuffix}`);
  };

  const openFinancePromotions = () => {
    onNavigate(`${basePath}/finance?tab=promotions&restaurant=${restaurant.id}`);
  };

  const editRestaurant = () => {
    setFocusSettingsDetails(true);
    onTabChange("Settings");
  };

  return (
    <div className="restaurant-workspace">
      <button type="button" className="restaurant-workspace__back" onClick={onBack}>
        <ArrowLeft size={17} /> Restaurants
      </button>
      <div className="restaurant-workspace__breadcrumb">
        <span>Restaurants</span><ChevronRight size={14} /><strong>{restaurant.name}</strong>
      </div>
      <AdminCard className="restaurant-workspace__hero">
        <div className="restaurant-workspace__identity">
          <span className="restaurant-workspace__logo">{getRestaurantInitials(restaurant.name)}</span>
          <div>
            <h1>{restaurant.name}</h1>
            <p>{restaurant.cuisine} · {restaurant.location}</p>
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
            onClick={() => setConfirmation(
              restaurant.operationalAvailability === "Accepting orders" ? "Pause orders" : "Resume orders",
            )}
          >
            {restaurant.operationalAvailability === "Accepting orders"
              ? <Pause size={16} />
              : <Play size={16} />}
            {restaurant.operationalAvailability === "Accepting orders" ? "Pause orders" : "Resume orders"}
          </button>
          <button type="button" onClick={editRestaurant}>Edit restaurant</button>
          <button type="button" aria-label="More restaurant actions"><MoreHorizontal size={18} /></button>
        </div>
      </AdminCard>
      {notice && (
        <div className="restaurants-notice" role="status">
          {notice}<button type="button" onClick={() => setNotice("")}>Dismiss</button>
        </div>
      )}
      <nav className="restaurant-workspace__tabs" aria-label="Restaurant workspace tabs">
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
          menuItems={menuItems}
          editorItemId={editorItemId}
          onOpenItem={openItem}
          onCloseEditor={closeMenuEditor}
        />
      )}
      {activeTab === "Operations" && <OperationsTab restaurant={restaurant} />}
      {activeTab === "Promotions" && (
        <PromotionsTab promotions={restaurantPromotions} onOpenFinance={openFinancePromotions} />
      )}
      {activeTab === "Settings" && (
        <SettingsTab
          key={restaurant.id}
          restaurant={restaurant}
          onConfirm={setConfirmation}
          focusDetails={focusSettingsDetails}
          onDetailsFocused={() => setFocusSettingsDetails(false)}
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
