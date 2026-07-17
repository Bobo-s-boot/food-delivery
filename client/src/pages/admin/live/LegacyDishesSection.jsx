import { AdminCard } from "../components/AdminCard";
import { MenuAvailabilityTable } from "../components/MenuAvailabilityTable";
import { AdminSelect } from "../components/ui/AdminSelect/AdminSelect";

const createEmptyDishForm = () => ({
  name: "",
  description: "",
  price: "",
  image: "",
  category: "",
  restaurantId: "",
});

export function LegacyDishesSection({ previewMode, menuAvailabilityView, workspace }) {
  const {
    restaurantsRaw,
    isDishFormOpen,
    editingDish,
    dishFormData,
    setIsDishFormOpen,
    setEditingDish,
    setDishFormData,
    handleSaveDish,
    handleEditDishClick,
    handleDeleteDish,
  } = workspace;

  const toggleDishForm = () => {
    setEditingDish(null);
    setDishFormData(createEmptyDishForm());
    setIsDishFormOpen(!isDishFormOpen);
  };

  const closeDishForm = () => {
    setIsDishFormOpen(false);
    setEditingDish(null);
  };

  return (
    <div className="admin-section-dishes" style={{ display: "grid", gap: "24px" }}>
      <div
        className="admin-section-header"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: "700", color: "var(--color-text-strong)" }}>
            Управление блюдами (Меню)
          </h2>
          <p style={{ color: "var(--color-text-tertiary)" }}>
            Добавляйте новые блюда и привязывайте их к ресторанам.
          </p>
        </div>
        <button
          onClick={toggleDishForm}
          className="admin-layout__btn-generate"
          style={{ backgroundColor: "var(--color-bg-brand)", color: "white" }}
        >
          {isDishFormOpen ? "Закрыть форму" : "+ Добавить блюдо"}
        </button>
      </div>

      {isDishFormOpen && (
        <AdminCard style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "16px" }}>
            {editingDish ? "Редактировать блюдо" : "Добавить новое блюдо"}
          </h3>
          <form onSubmit={handleSaveDish} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "0.875rem", fontWeight: "500" }}>Название блюда</label>
                <input
                  type="text"
                  required
                  value={dishFormData.name}
                  onChange={(event) => setDishFormData({ ...dishFormData, name: event.target.value })}
                  style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--color-border-card)" }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "0.875rem", fontWeight: "500" }}>Ресторан</label>
                <AdminSelect
                  required
                  value={dishFormData.restaurantId}
                  onChange={(event) => setDishFormData({ ...dishFormData, restaurantId: event.target.value })}
                  fluid
                >
                  <option value="">-- Выберите ресторан --</option>
                  {restaurantsRaw.map((restaurant) => (
                    <option key={restaurant._id} value={restaurant._id}>
                      {restaurant.name}
                    </option>
                  ))}
                </AdminSelect>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: "500" }}>Описание блюда</label>
              <textarea
                value={dishFormData.description}
                onChange={(event) => setDishFormData({ ...dishFormData, description: event.target.value })}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--color-border-card)",
                  minHeight: "80px",
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "0.875rem", fontWeight: "500" }}>Цена ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={dishFormData.price}
                  onChange={(event) => setDishFormData({ ...dishFormData, price: event.target.value })}
                  style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--color-border-card)" }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "0.875rem", fontWeight: "500" }}>Категория блюда</label>
                <input
                  type="text"
                  placeholder="Burgers, Sushi, Pizza"
                  value={dishFormData.category}
                  onChange={(event) => setDishFormData({ ...dishFormData, category: event.target.value })}
                  style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--color-border-card)" }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "0.875rem", fontWeight: "500" }}>Ссылка на фото (Image URL)</label>
                <input
                  type="text"
                  value={dishFormData.image}
                  onChange={(event) => setDishFormData({ ...dishFormData, image: event.target.value })}
                  style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--color-border-card)" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button
                type="submit"
                className="admin-layout__btn-generate"
                style={{ backgroundColor: "var(--color-text-strong)", color: "white", border: "none" }}
              >
                {editingDish ? "Сохранить" : "Добавить"}
              </button>
              <button
                type="button"
                onClick={closeDishForm}
                className="admin-layout__btn-generate"
                style={{ backgroundColor: "var(--color-bg-soft)", color: "var(--color-text-strong)" }}
              >
                Отмена
              </button>
            </div>
          </form>
        </AdminCard>
      )}

      <MenuAvailabilityTable
        items={menuAvailabilityView.length ? menuAvailabilityView : []}
        onDelete={previewMode ? undefined : handleDeleteDish}
        onEdit={previewMode ? undefined : handleEditDishClick}
      />
    </div>
  );
}
