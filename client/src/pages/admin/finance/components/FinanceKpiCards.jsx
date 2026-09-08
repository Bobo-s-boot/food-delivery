import {
  AdminKpiCard,
  AdminKpiGrid,
} from "../../components/ui/AdminKpiCard/AdminKpiCard";
import { financeSummaryCards } from "../finance.data";
import { getFinanceKpisForPeriod } from "../finance.utils";

export function FinanceKpiCards({ period }) {
  const cards = getFinanceKpisForPeriod(financeSummaryCards, period);

  return (
    <section className="admin-finance-kpi-section" aria-label={`Finance KPIs for ${period}`}>
      <AdminKpiGrid>
        {cards.map((card) => (
          <AdminKpiCard
            key={card.label}
            label={card.label}
            value={card.value}
            helper={card.helper}
            tone={card.tone}
          />
        ))}
      </AdminKpiGrid>
    </section>
  );
}
