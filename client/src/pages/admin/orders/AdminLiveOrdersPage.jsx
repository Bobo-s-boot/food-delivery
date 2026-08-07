import { useState } from "react";
import { X, ShoppingBag, MapPin } from "lucide-react";
import { LiveOrdersTable } from "../components/LiveOrdersTable";
import "../Admin.scss";

const orderFilters = [
  "All",
  "pending",
  "preparing",
  "delivering",
  "delivered",
  "cancelled",
];

function OrderDetailsModal({ order, onClose, onUpdateStatus }) {
  if (!order) return null;

  // Безопасно получаем список блюд в заказе
  const orderItems = order.items || order.dishes || [];

  return (
    <div
      className="admin-dialog-backdrop"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        className="admin-dialog-panel"
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          maxWidth: "560px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "24px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Кнопка закрытия */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            border: "none",
            background: "none",
            cursor: "pointer",
            color: "#6b7280",
          }}
        >
          <X size={20} />
        </button>

        {/* Заголовок */}
        <div style={{ marginBottom: "20px" }}>
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "700",
              marginBottom: "4px",
              color: "#111827",
            }}
          >
            Заказ #{order.id}
          </h3>
          <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
            Детальная информация о заказе и его составе
          </p>
        </div>

        {/* Сетка основной информации */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            marginBottom: "20px",
            fontSize: "0.9rem",
          }}
        >
          <div>
            <span style={{ color: "#6b7280", display: "block" }}>Клиент</span>
            <strong>{order.customer || "Не указан"}</strong>
          </div>

          <div>
            <span style={{ color: "#6b7280", display: "block" }}>Ресторан</span>
            <strong>{order.restaurant || "Не указан"}</strong>
          </div>

          <div>
            <span style={{ color: "#6b7280", display: "block" }}>
              Способ оплаты
            </span>
            <span>{order.payment || "Не указан"}</span>
          </div>

          <div>
            <span style={{ color: "#6b7280", display: "block" }}>Курьер</span>
            <span>{order.courier || "Не назначен"}</span>
          </div>
        </div>

        {/* Адрес доставки (если есть) */}
        {(order.address || order.deliveryAddress) && (
          <div
            style={{
              marginBottom: "20px",
              padding: "12px",
              backgroundColor: "#f9fafb",
              borderRadius: "8px",
              display: "flex",
              gap: "10px",
              alignItems: "flex-start",
              fontSize: "0.875rem",
            }}
          >
            <MapPin
              size={18}
              style={{ color: "#6b7280", marginTop: "2px", flexShrink: 0 }}
            />
            <div>
              <span style={{ color: "#6b7280", display: "block" }}>
                Адрес доставки
              </span>
              <strong>{order.address || order.deliveryAddress}</strong>
            </div>
          </div>
        )}

        {/* Состав заказа */}
        <div style={{ marginBottom: "20px" }}>
          <h4
            style={{
              fontSize: "0.95rem",
              fontWeight: "600",
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <ShoppingBag size={18} /> Состав заказа
          </h4>

          {orderItems.length > 0 ? (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {orderItems.map((item, index) => {
                const name =
                  item.dishId?.name ||
                  item.name ||
                  item.title ||
                  "Наименование блюда";

                const qty = item.quantity || item.count || 1;
                const price = item.price || item.dishId?.price || 0;

                return (
                  <div
                    key={item._id || item.id || index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 12px",
                      backgroundColor: "#f9fafb",
                      borderRadius: "8px",
                      fontSize: "0.875rem",
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: "600" }}>{name}</span>
                      <span style={{ color: "#6b7280", marginLeft: "8px" }}>
                        x{qty}
                      </span>
                    </div>
                    <span style={{ fontWeight: "600" }}>
                      ${Number(price).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                padding: "12px",
                backgroundColor: "#f9fafb",
                borderRadius: "8px",
                color: "#6b7280",
                fontSize: "0.875rem",
                fontStyle: "italic",
              }}
            >
              Состав блюд не передан или отсутствует в заказе.
            </div>
          )}
        </div>

        {/* Изменение статуса заказа */}
        <div
          style={{
            padding: "14px",
            backgroundColor: "#f3f4f6",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <label
            style={{
              color: "#374151",
              fontWeight: "600",
              display: "block",
              marginBottom: "8px",
              fontSize: "0.875rem",
            }}
          >
            Статус заказа:
          </label>
          <select
            value={order.status}
            onChange={(e) => onUpdateStatus?.(order.id, e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              backgroundColor: "#fff",
              fontSize: "0.9rem",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            <option value="pending">pending (В ожидании)</option>
            <option value="preparing">preparing (Готовится)</option>
            <option value="delivering">delivering (В пути)</option>
            <option value="delivered">delivered (Доставлен)</option>
            <option value="cancelled">cancelled (Отменен)</option>
          </select>
        </div>

        {/* Подвал с итоговой суммой */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "24px",
          }}
        >
          <div>
            <span style={{ color: "#6b7280", fontSize: "0.875rem" }}>
              Итого:
            </span>
            <div
              style={{
                fontSize: "1.25rem",
                fontWeight: "700",
                color: "#10b981",
              }}
            >
              {order.total}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 20px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              backgroundColor: "#fff",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminLiveOrdersPage({ orders, onUpdateStatus }) {
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div
      className="admin-section-orders"
      style={{ display: "grid", gap: "24px" }}
    >
      <div className="admin-section-header">
        <h2
          style={{
            fontSize: "1.75rem",
            fontWeight: "700",
            color: "var(--color-text-strong)",
          }}
        >
          Управление заказами
        </h2>
        <p style={{ color: "var(--color-text-tertiary)" }}>
          Просматривайте входящие заказы и управляйте их жизненным циклом в
          реальном времени.
        </p>
      </div>

      <LiveOrdersTable
        orders={orders}
        filters={orderFilters}
        onUpdateStatus={onUpdateStatus}
        onViewOrder={(order) => setSelectedOrder(order)}
      />

      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={onUpdateStatus}
      />
    </div>
  );
}
