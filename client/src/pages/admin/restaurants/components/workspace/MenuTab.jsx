import { useState } from "react";
import { Info, Plus } from "lucide-react";
import { AdminSelect } from "../../../components/ui/AdminSelect/AdminSelect";
import { StatusBadge } from "../../../components/StatusBadge";
import { getMenuItemAvailabilityLabel } from "../../restaurants.utils";
import { WorkspaceSection } from "./WorkspaceSection";
import { formatRestaurantMoney } from "./workspace.formatters";

// Вспомогательная функция для безопасного получения категории блюда
const getCategory = (item) => item?.restaurantCategory || item?.category || "";

function MenuEditor({
  restaurant,
  item,
  onClose,
  onSaveDish,
  onDeleteDish,
}) {
  const isNew = !item;
  const [saved, setSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!onSaveDish) {
      setSaved(true);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const categoryValue = formData.get("restaurantCategory");

    const dishData = {
      name: formData.get("name"),
      restaurantId: restaurant._id || restaurant.id,
      // Добавлено совпадение с Mongoose схемой (category) + сохранение UI категории (restaurantCategory)
      category: categoryValue,
      restaurantCategory: categoryValue,
      platformCategory: formData.get("platformCategory"),
      price: Number(formData.get("price")),
      availability: formData.get("availability"),
      description: formData.get("description"),
      image: formData.get("image"),
    };

    try {
      setIsSubmitting(true);
      await onSaveDish(dishData, item?._id || item?.id);
      onClose();
    } catch (error) {
      console.error("Ошибка при сохранении блюда:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!item || !onDeleteDish) return;
    if (!window.confirm(`Удалить блюдо "${item.name}"?`)) return;

    try {
      setIsSubmitting(true);
      await onDeleteDish(item._id || item.id);
      onClose();
    } catch (error) {
      console.error("Ошибка при удалении блюда:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <WorkspaceSection
      title={isNew ? "Add Menu Item" : `Edit ${item.name}`}
      description={`Restaurant context: ${restaurant.name}`}
    >
      {saved && (
        <div className="restaurants-success" role="status">
          Mock item saved locally for this preview. Backend persistence remains
          a TODO.
        </div>
      )}
      <form className="restaurant-item-form" onSubmit={handleSubmit}>
        <label>
          Item name
          <input
            name="name"
            required
            defaultValue={item?.name || ""}
            disabled={isSubmitting}
          />
        </label>
        <label>
          Restaurant
          <input value={restaurant.name} readOnly disabled />
        </label>
        <label>
          Restaurant menu category
          <input
            name="restaurantCategory"
            required
            defaultValue={getCategory(item)}
            placeholder="Signature Burgers"
            disabled={isSubmitting}
          />
        </label>
        <label>
          Platform category
          <AdminSelect
            name="platformCategory"
            defaultValue={item?.platformCategory || "Burgers"}
            fluid
            disabled={isSubmitting}
          >
            {[
              "Burgers",
              "Pizza",
              "Sushi",
              "Sides",
              "Drinks",
              "Salads",
              "Desserts",
            ].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </AdminSelect>
        </label>
        <label>
          Base price
          <input
            name="price"
            required
            type="number"
            min="0"
            step="0.01"
            defaultValue={item?.price || ""}
            disabled={isSubmitting}
          />
        </label>
        <label>
          Availability
          <AdminSelect
            name="availability"
            defaultValue={item?.availability || "Available"}
            fluid
            disabled={isSubmitting}
          >
            {["Available", "Unavailable", "Sold out"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </AdminSelect>
        </label>
        <label className="restaurant-item-form__wide">
          Description
          <textarea
            name="description"
            required
            defaultValue={item?.description || "Freshly prepared menu item."}
            disabled={isSubmitting}
          />
        </label>
        <label className="restaurant-item-form__wide">
          Image URL
          <input
            name="image"
            required
            defaultValue={item?.image || ""}
            placeholder="https://..."
            disabled={isSubmitting}
          />
        </label>
        <div className="restaurant-item-form__actions">
          {!isNew && (
            <button
              type="button"
              className="is-danger"
              style={{ marginRight: "auto", color: "#e63946" }}
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              Delete item
            </button>
          )}
          <button type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button type="submit" className="is-primary" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : isNew
                ? "Create item"
                : "Save changes"}
          </button>
        </div>
      </form>
    </WorkspaceSection>
  );
}

export function MenuTab({
  restaurant,
  menuItems = [],
  editorItemId,
  onOpenItem,
  onCloseEditor,
  onSaveDish,
  onDeleteDish,
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All menu categories");

  // Фильтрация с учётом безопасной проверки категории (category / restaurantCategory)
  const filtered = menuItems.filter((item) => {
    const itemCategory = getCategory(item);
    const matchesSearch =
      !search || item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      category === "All menu categories" || itemCategory === category;

    return matchesSearch && matchesCategory;
  });

  // Автоматический сбор списка категорий из имеющихся блюд
  const categories = [
    "All menu categories",
    ...new Set(menuItems.map((item) => getCategory(item)).filter(Boolean)),
  ];

  // Поиск редактируемого блюда по _id или id
  const editorItem =
    editorItemId && editorItemId !== "new"
      ? menuItems.find(
          (item) => String(item._id || item.id) === String(editorItemId),
        )
      : null;

  return (
    <div className="restaurant-workspace-stack">
      {editorItemId && (
        <MenuEditor
          restaurant={restaurant}
          item={editorItem}
          onClose={onCloseEditor}
          onSaveDish={onSaveDish}
          onDeleteDish={onDeleteDish}
        />
      )}
      <WorkspaceSection
        title="Menu"
        action={
          <button
            type="button"
            className="restaurants-primary-action"
            onClick={() => onOpenItem("new")}
          >
            <Plus size={16} /> Add Menu Item
          </button>
        }
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
            {categories.map((option) => (
              <option key={option}>{option}</option>
            ))}
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
              <article key={item._id || item.id}>
                <div className="catalog-entity">
                  {item.image ? (
                    <img src={item.image} alt="" />
                  ) : (
                    <span className="catalog-entity__placeholder">
                      No image
                    </span>
                  )}
                  <div>
                    <strong>{item.name}</strong>
                    {item.calories && <span>{item.calories}</span>}
                  </div>
                </div>
                <span>{getCategory(item)}</span>
                <span>{item.platformCategory || "—"}</span>
                <strong>{formatRestaurantMoney(item.price)}</strong>
                <StatusBadge value={getMenuItemAvailabilityLabel(item)} />
                <StatusBadge value={item.contentHealth || "Good"} />
                <span>{item.ordersToday || 0} today</span>
                <button
                  type="button"
                  className="restaurants-action"
                  onClick={() => onOpenItem(item._id || item.id)}
                >
                  Edit
                </button>
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
