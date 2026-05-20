import { AdminCard } from "./AdminCard";
import { SectionHeader } from "./SectionHeader";
import "../Admin.scss";

export function TopSellingDishes({ dishes }) {
  return (
    <AdminCard className="top-selling">
      <SectionHeader title="Top-Selling Dishes" />
      <div className="top-selling__list">
        {dishes.map((dish, index) => {
          const ordersLabel =
            typeof dish.orders === "number"
              ? `${dish.orders} orders`
              : dish.orders;
          const revenueLabel =
            typeof dish.revenue === "number"
              ? `$${dish.revenue.toFixed(2)}`
              : dish.revenue;

          return (
            <div key={dish.name} className="top-selling-item">
              <span className="top-selling-item__rank">{index + 1}</span>

              <div className="top-selling-item__info">
                <p className="top-selling-item__name">{dish.name}</p>
                <p className="top-selling-item__orders">{ordersLabel}</p>
              </div>

              <strong className="top-selling-item__revenue">
                {revenueLabel}
              </strong>
            </div>
          );
        })}
      </div>
    </AdminCard>
  );
}
