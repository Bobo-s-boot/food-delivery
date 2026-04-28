import { useTranslation } from "react-i18next";
import { DeliveryFAQ } from "./components/DeliveryFAQ";
import { DeliveryHero } from "./components/DeliveryHero";
import { DeliveryOptions } from "./components/DeliveryOptions";
import { DeliveryStats } from "./components/DeliveryStats";
import { DeliveryTimeline } from "./components/DeliveryTimeline";
import { DeliveryZonesAndOperations } from "./components/DeliveryZonesAndOperations";
import {
  DELIVERY_FAQ,
  DELIVERY_OPTIONS,
  DELIVERY_STATS,
  DELIVERY_STEPS,
  DELIVERY_ZONES,
  RESTAURANT_OPERATION_ITEMS,
} from "./const";

export function Delivery() {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-white font-['Inter'] text-[#0D1A2D] px-4 md:px-8 pb-24 flex flex-col items-center">
      <DeliveryHero t={t} />
      <DeliveryStats t={t} stats={DELIVERY_STATS} />
      <DeliveryTimeline t={t} steps={DELIVERY_STEPS} />
      <DeliveryOptions t={t} options={DELIVERY_OPTIONS} />
      <DeliveryZonesAndOperations
        t={t}
        zones={DELIVERY_ZONES}
        operationItems={RESTAURANT_OPERATION_ITEMS}
      />
      <DeliveryFAQ t={t} faq={DELIVERY_FAQ} />
    </div>
  );
}
