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
  paymentFilters,
} from "./orders.data";
import {
  buildOrderSummaryCards,
  filterOrders,
  getOrderStatusToneClass,
  normalizeLiveOrders,
} from "./orders.utils";
import "./OrdersPage.scss";

export function AdminOrdersPage({ orders = [], onUpdateStatus }) {
  const [searchValue, setSearchValue] = useState("");
  const [dateFilter, setDateFilter] = useState("Today");
  const [paymentFilter, setPaymentFilter] = useState("All payments");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const sourceOrders = useMemo(
    () => normalizeLiveOrders(orders),
    [orders],
  );

  const summaryCards = useMemo(
    () => buildOrderSummaryCards(sourceOrders, orderSummaryCards),
    [sourceOrders],
  );

  const filteredOrders = useMemo(() => {
    return filterOrders(sourceOrders, {
      searchValue,
      paymentFilter,
      statusFilter,
    });
  }, [paymentFilter, searchValue, sourceOrders, statusFilter]);

  const handleUpdateStatus = async (orderId, status) => {
    if (!onUpdateStatus) return;

    await onUpdateStatus(orderId, status);
    setSelectedOrder(null);
  };

  return (
    <div className="admin-orders">
      <div className="admin-orders__intro admin-page-intro">
        <h1>Orders</h1>
        <p>Track, manage and resolve customer orders.</p>
      </div>

      <AdminKpiGrid>
        {summaryCards.map((card) => (
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
        totalCount={sourceOrders.length}
        onViewOrder={setSelectedOrder}
      />

      <OrderDetailsDrawer
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
