import { useState } from "react";
import { Info, Plus } from "lucide-react";
import { AdminSelect } from "../../../components/ui/AdminSelect/AdminSelect";
import { StatusBadge } from "../../../components/StatusBadge";
import { getMenuItemAvailabilityLabel } from "../../restaurants.utils";
import { WorkspaceSection } from "./WorkspaceSection";
import { formatRestaurantMoney } from "./workspace.formatters";

function MenuEditor({ restaurant, item, onClose }) {
  const isNew = !item;
  const [saved, setSaved] = useState(false);

  return (
    <WorkspaceSection
      title={isNew ? "Add Menu Item" : `Edit ${item.name}`}
      description={`Restaurant context: ${restaurant.name}`}
    >
      {saved && (
        <div className="restaurants-success" role="status">
          Mock item saved locally for this preview. Backend persistence remains a TODO.
        </div>
      )}
      <form
        className="restaurant-item-form"
        onSubmit={(event) => {
          event.preventDefault();
          setSaved(true);
        }}
      >
        <label>Item name<input required defaultValue={item?.name || ""} /></label>
        <label>Restaurant<input value={restaurant.name} readOnly /></label>
        <label>
          Restaurant menu category
          <input required defaultValue={item?.restaurantCategory || ""} placeholder="Signature Burgers" />
        </label>
        <label>
          Platform category
          <AdminSelect defaultValue={item?.platformCategory || "Burgers"} fluid>
            {["Burgers", "Pizza", "Sushi", "Sides", "Drinks", "Salads", "Desserts"].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </AdminSelect>
        </label>
        <label>
          Base price
          <input required type="number" min="0" step="0.01" defaultValue={item?.price || ""} />
        </label>
        <label>
          Availability
          <AdminSelect defaultValue={item?.availability || "Available"} fluid>
            {["Available", "Unavailable", "Sold out"].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </AdminSelect>
        </label>
        <label className="restaurant-item-form__wide">
          Description
          <textarea required defaultValue={item?.description || "Freshly prepared menu item."} />
        </label>
        <label className="restaurant-item-form__wide">
          Image URL
          <input required defaultValue={item?.image || ""} placeholder="https://..." />
        </label>
        <div className="restaurant-item-form__actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" className="is-primary">{isNew ? "Create item" : "Save changes"}</button>
        </div>
      </form>
    </WorkspaceSection>
  );
}

export function MenuTab({ restaurant, menuItems, editorItemId, onOpenItem, onCloseEditor }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All menu categories");
  const filtered = menuItems.filter(
    (item) =>
      (!search || item.name.toLowerCase().includes(search.toLowerCase())) &&
      (category === "All menu categories" || item.restaurantCategory === category),
  );
  const categories = ["All menu categories", ...new Set(menuItems.map((item) => item.restaurantCategory))];
  const editorItem =
    editorItemId && editorItemId !== "new"
      ? menuItems.find((item) => item.id === editorItemId)
      : null;

  return (
    <div className="restaurant-workspace-stack">
      {editorItemId && (
        <MenuEditor restaurant={restaurant} item={editorItem} onClose={onCloseEditor} />
      )}
      <WorkspaceSection
        title="Menu"
        action={(
          <button type="button" className="restaurants-primary-action" onClick={() => onOpenItem("new")}>
            <Plus size={16} /> Add Menu Item
          </button>
        )}
      >
        <div className="restaurant-menu-filters">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search menu items..."
          />
          <AdminSelect
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Restaurant menu category"
          >
            {categories.map((option) => <option key={option}>{option}</option>)}
          </AdminSelect>
        </div>
        {filtered.length ? (
          <div className="restaurant-menu-list">
            <div className="restaurant-menu-list__header">
              <span>Item</span>
              <span>Menu Category</span>
              <span
                className="restaurant-menu-list__platform-heading"
                title="Platform categories group similar items across restaurants in the global Menu Catalog."
              >
                Platform Category <Info size={13} aria-hidden="true" />
              </span>
              <span>Price</span>
              <span>Availability</span>
              <span>Content</span>
              <span>Orders Today</span>
              <span>Action</span>
            </div>
            {filtered.map((item) => (
              <article key={item.id}>
                <div className="catalog-entity">
                  {item.image
                    ? <img src={item.image} alt="" />
                    : <span className="catalog-entity__placeholder">No image</span>}
                  <div><strong>{item.name}</strong><span>{item.calories}</span></div>
                </div>
                <span>{item.restaurantCategory}</span>
                <span>{item.platformCategory}</span>
                <strong>{formatRestaurantMoney(item.price)}</strong>
                <StatusBadge value={getMenuItemAvailabilityLabel(item)} />
                <StatusBadge value={item.contentHealth} />
                <span>{item.ordersToday} today</span>
                <button type="button" className="restaurants-action" onClick={() => onOpenItem(item.id)}>Edit</button>
              </article>
            ))}
          </div>
        ) : (
          <div className="restaurants-empty">
            <strong>No menu items found</strong>
            <span>Try another search or category.</span>
          </div>
        )}
      </WorkspaceSection>
    </div>
  );
}
