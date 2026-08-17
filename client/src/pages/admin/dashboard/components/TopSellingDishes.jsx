import { AdminCard } from "../../components/AdminCard";
import { SectionHeader } from "../../components/SectionHeader";

export function TopSellingDishes({ dishes = [] }) {
  return (
    <AdminCard className="top-selling">
      <SectionHeader title="Top Selling Dishes" />
      <div className="top-selling__list">
        {dishes.length === 0 ? (
          <p className="text-gray-400 text-sm py-4">No top selling dishes data available</p>
        ) : (
          dishes.map((dish, index) => {
            const ordersLabel =
              typeof dish.orders === "number"
                ? `${dish.orders} ${dish.orders === 1 ? "order" : "orders"}`
                : dish.orders;
            const revenueLabel =
              typeof dish.revenue === "number"
                ? `$${dish.revenue.toFixed(2)}`
                : dish.revenue;

            return (
              <div key={`${dish.name}-${index}`} className="top-selling-item">
                <span className="top-selling-item__rank">{index + 1}</span>

                <div className="top-selling-item__info">
                  <p className="top-selling-item__name">{dish.name}</p>
                  <p className="top-selling-item__orders">
                    {dish.restaurant ? `${dish.restaurant} · ` : ""}
                    {ordersLabel}
                  </p>
                </div>

                <strong className="top-selling-item__revenue">
                  {revenueLabel}
                </strong>
              </div>
            );
          })
        )}
      </div>
    </AdminCard>
  );
}
