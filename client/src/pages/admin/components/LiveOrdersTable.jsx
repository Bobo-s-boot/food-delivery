import { useMemo, useState } from "react";
import { AdminCard } from "./AdminCard";
import { AdminTable } from "./AdminTable";
import { SectionHeader } from "./SectionHeader";
import { StatusBadge } from "./StatusBadge";

export function LiveOrdersTable({ orders, filters }) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredOrders = useMemo(() => {
    if (activeFilter === "All") {
      return orders;
    }

    return orders.filter((order) => order.status === activeFilter);
  }, [activeFilter, orders]);

  return (
    <AdminCard className="p-5 md:p-6 xl:col-span-2">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <SectionHeader
          title="Live Orders"
          description="Monitor new, preparing, ready and active delivery orders in real time."
        />
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full px-3 py-1.5 text-xs transition ${
                activeFilter === filter
                  ? "bg-[#0D1A2D] text-white"
                  : "bg-[#EEF2F7] text-[#5E6A7A] hover:bg-[#E3E8F0]"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      <AdminTable
        minWidth="min-w-210"
        columns={[
          "Order ID",
          "Customer",
          "Restaurant",
          "Status",
          "Payment",
          "Courier",
          "Total",
          "Time",
          "Action",
        ]}
        rows={filteredOrders}
        renderRow={(order) => (
          <tr
            key={order.id}
            className="bg-[#F7F9FC] transition hover:bg-[#EEF2F7]"
          >
            <td className="rounded-l-2xl px-3 py-3 font-medium text-[#0D1A2D]">
              {order.id}
            </td>
            <td className="px-3 py-3 text-[#3B4756]">{order.customer}</td>
            <td className="px-3 py-3 text-[#3B4756]">{order.restaurant}</td>
            <td className="px-3 py-3">
              <StatusBadge value={order.status} />
            </td>
            <td className="px-3 py-3 text-[#5E6A7A]">{order.payment}</td>
            <td className="px-3 py-3 text-[#5E6A7A]">{order.courier}</td>
            <td className="px-3 py-3 font-medium">{order.total}</td>
            <td className="px-3 py-3 text-[#7B8794]">{order.time}</td>
            <td className="rounded-r-2xl px-3 py-3">
              <button className="rounded-full bg-[#0D1A2D] px-4 py-2 text-xs text-white">
                View
              </button>
            </td>
          </tr>
        )}
      />
    </AdminCard>
  );
}
