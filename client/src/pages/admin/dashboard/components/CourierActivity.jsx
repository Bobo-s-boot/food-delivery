import { AdminCard } from "../../components/AdminCard";
import { SectionHeader } from "../../components/SectionHeader";
import { StatusBadge } from "../../components/StatusBadge";

export function CourierActivity({ couriers }) {
  return (
    <AdminCard className="courier-activity">
      <SectionHeader title="Active Deliveries" />

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
      <div className="courier-activity__footer">
        <button type="button" className="courier-card__btn">
          View delivery orders {"->"}
        </button>
      </div>
    </AdminCard>
  );
}
