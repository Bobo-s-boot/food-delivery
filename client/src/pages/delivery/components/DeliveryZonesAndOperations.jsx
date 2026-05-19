import "../Delivery.scss";

export function DeliveryZonesAndOperations({ t, zones, operationItems }) {
  return (
    <section className="delivery-zones">
      {/* 1. Выносим заголовок ДО обертки и задаем ему правильный класс */}
      <h2 className="delivery-zones__title">{t("delivery.zonesTitle")}</h2>
      {/* 2. Добавляем wrapper, который включит grid-template-columns: 1fr 1fr из SCSS */}
      <div className="delivery-zones__wrapper">
        {/* ЛЕВАЯ КОЛОНКА: Таблица зон */}
        <div className="delivery-zones__grid">
          {zones.map((zone) => (
            <div key={zone.areaKey} className="delivery-zones__row">
              <span>{t(zone.areaKey)}</span>
              <span>{t(zone.timeKey)}</span>
              <strong>{t(zone.feeKey)}</strong>{" "}
              {/* Сделал strong, как было в стилях, чтобы цена выделялась */}
            </div>
          ))}
        </div>

        {/* ПРАВАЯ КОЛОНКА: Темная карточка ресторана */}
        <div className="delivery-restaurant-card">
          <img
            src="/img/ImageRest2.png"
            alt={t("delivery.restaurantLogic.imageAlt")}
          />
          <div className="delivery-restaurant-card__content">
            <p className="delivery-restaurant-label">
              {t("delivery.restaurantLogic.label")}
            </p>
            <h2 className="delivery-restaurant-title">
              {t("delivery.restaurantLogic.title")}
            </h2>
            <p className="delivery-restaurant-text">
              {t("delivery.restaurantLogic.description")}
            </p>
            <div className="delivery-restaurant-tags">
              {operationItems.map((itemKey) => (
                <span key={itemKey} className="delivery-restaurant-tag">
                  {t(itemKey)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
