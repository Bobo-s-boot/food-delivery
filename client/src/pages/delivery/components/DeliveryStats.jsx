import "../Delivery.scss";

export function DeliveryStats({ t, stats }) {
  return (
    <section className="delivery-stats">
      {stats.map((stat) => (
        <article
          key={stat.value || stat.valueKey}
          className="delivery-stat-card"
        >
          <h2>{stat.value || t(stat.valueKey)}</h2>
          <p>{t(stat.labelKey)}</p>
        </article>
      ))}
    </section>
  );
}
