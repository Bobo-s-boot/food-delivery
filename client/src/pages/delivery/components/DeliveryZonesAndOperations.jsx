import "../Delivery.scss";

export function DeliveryZonesAndOperations({ t, zones, operationItems }) {
  return (
    <section className="delivery-zones">
      <div className="delivery-zones__left">
        <h2 className="delivery-zones__title">{t("delivery.zonesTitle")}</h2>
        <div className="delivery-zones__grid">
          {zones.map((zone) => (
            <div key={zone.areaKey} className="delivery-zones__row">
              <span>{t(zone.areaKey)}</span>
              <span>{t(zone.timeKey)}</span>
              <span>{t(zone.feeKey)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="delivery-zones__right">
        <img
          src="/img/ImageRest2.png"
          alt={t("delivery.restaurantLogic.imageAlt")}
        />
        <div className="delivery-zones__content">
          <p className="delivery-zones__label">
            {t("delivery.restaurantLogic.label")}
          </p>
          <h2 className="delivery-zones__subtitle">
            {t("delivery.restaurantLogic.title")}
          </h2>
          <p className="delivery-zones__text">
            {t("delivery.restaurantLogic.description")}
          </p>
          <div className="delivery-zones__tags">
            {operationItems.map((itemKey) => (
              <span key={itemKey} className="delivery-zones__tag">
                {t(itemKey)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
