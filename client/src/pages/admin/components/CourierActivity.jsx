import { AdminCard } from "./AdminCard";
import { SectionHeader } from "./SectionHeader";
import { StatusBadge } from "./StatusBadge";
import "../Admin.scss";

export function CourierActivity({ couriers }) {
  return (
    <AdminCard className="courier-activity">
      <SectionHeader
        title="Courier Activity"
        description="Track courier availability, active deliveries and estimated arrival time."
      />
      <div className="courier-activity__list">
        {couriers.map((courier) => (
          <div key={courier.courier} className="courier-card">
            <div className="courier-card__header">
              <div className="courier-card__info">
                <p className="courier-card__name">{courier.courier}</p>
                <p className="courier-card__details">
                  {courier.order} - {courier.area}
                </p>
              </div>
              <StatusBadge value={courier.status} />
            </div>

            <div className="courier-card__footer">
              <span className="courier-card__eta">ETA {courier.eta}</span>
              <button className="courier-card__btn">{courier.action}</button>
            </div>
          </div>
        ))}
      </div>
    </AdminCard>
  );
}
