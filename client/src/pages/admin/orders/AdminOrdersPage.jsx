import { useMemo, useState } from "react";
import { AdminCard } from "../components/AdminCard";
import {
  AdminKpiCard,
  AdminKpiGrid,
} from "../components/ui/AdminKpiCard/AdminKpiCard";
import { AdminSelect } from "../components/ui/AdminSelect/AdminSelect";
import { AdminOrderQueue } from "./components/AdminOrderQueue/AdminOrderQueue";
import { OrderDetailsDrawer } from "./components/OrderDetailsDrawer";
import {
  dateFilters,
  orderStatusFilters,
  orderSummaryCards,
  ordersMockData,
  paymentFilters,
} from "./orders.data";
import { filterOrders, getOrderStatusToneClass } from "./orders.utils";
import "./OrdersPage.scss";

export function AdminOrdersPage() {
  const [searchValue, setSearchValue] = useState("");
  const [dateFilter, setDateFilter] = useState("Today");
  const [paymentFilter, setPaymentFilter] = useState("All payments");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = useMemo(() => {
    return filterOrders(ordersMockData, {
      searchValue,
      paymentFilter,
      statusFilter,
    });
  }, [paymentFilter, searchValue, statusFilter]);

  return (
    <div className="admin-orders">
      <div className="admin-orders__intro admin-page-intro">
        <h1>Orders</h1>
        <p>Track, manage and resolve customer orders.</p>
      </div>

      <AdminKpiGrid>
        {orderSummaryCards.map((card) => (
          <AdminKpiCard
            key={card.label}
            label={card.label}
            value={card.value}
            helper={card.helper}
            tone={card.tone}
            interactive
            active={statusFilter === card.filter}
            onClick={() => setStatusFilter(card.filter)}
          />
        ))}
      </AdminKpiGrid>

      <AdminCard className="admin-orders-filters">
        <div className="admin-orders-filters__top">
          <input
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search by order ID, customer, restaurant..."
            className="admin-orders-filters__search"
          />

          <AdminSelect
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
            aria-label="Date filter"
          >
            {dateFilters.map((filter) => (
              <option key={filter} value={filter}>
                {filter}
              </option>
            ))}
          </AdminSelect>

          <AdminSelect
            value={paymentFilter}
            onChange={(event) => setPaymentFilter(event.target.value)}
            aria-label="Payment filter"
          >
            {paymentFilters.map((filter) => (
              <option key={filter} value={filter}>
                {filter}
              </option>
            ))}
          </AdminSelect>
        </div>

        <div className="admin-orders-filters__status-row">
          <span className="admin-orders-filters__status-label">Status</span>
          <div className="admin-orders-filters__chips">
            {orderStatusFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setStatusFilter(filter)}
                className={`admin-orders-filters__chip ${getOrderStatusToneClass(
                  filter,
                )} ${
                  statusFilter === filter
                    ? "admin-orders-filters__chip--active"
                    : ""
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </AdminCard>

      <AdminOrderQueue
        orders={filteredOrders}
        totalCount={128}
        onViewOrder={setSelectedOrder}
      />

      <OrderDetailsDrawer
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
