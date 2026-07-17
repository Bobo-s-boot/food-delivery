import { LiveOrdersTable } from "../components/LiveOrdersTable";

const orderFilters = [
  "All",
  "pending",
  "preparing",
  "delivering",
  "delivered",
  "cancelled",
];

export function AdminLiveOrdersPage({ orders, onUpdateStatus }) {
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
      />
    </div>
  );
}
