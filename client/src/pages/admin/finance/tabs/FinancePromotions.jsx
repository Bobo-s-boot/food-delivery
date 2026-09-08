import { useMemo, useState } from "react";
import { AdminTable } from "../../components/AdminTable";
import { StatusBadge } from "../../components/StatusBadge";
import {
  financePromotionsMockData,
  promotionAudienceFilters,
  promotionStatusFilters,
  promotionTypeFilters,
} from "../finance.data";
import {
  filterFinancePromotions,
  getFinanceRecordsForPeriod,
  getPromotionActionLabel,
} from "../finance.utils";
import { formatWholeMoney } from "../finance.formatters";
import { FinanceFilters } from "../components/FinanceFilters";
import { FinanceTableCard } from "../components/FinanceTableCard";

const promotionColumns = [
  "Promotion",
  "Value",
  "Audience",
  "Period",
  "Status",
  "Usage",
  "Budget",
  "Cost / Funding",
  "Action",
];

export function FinancePromotions({
  initialStatusFilter = "All",
  onOpenDrawer,
  onCreate,
  period,
}) {
  const [searchValue, setSearchValue] = useState("");
  const [typeFilter, setTypeFilter] = useState("All types");
  const [audienceFilter, setAudienceFilter] = useState("All audiences");
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
  const promotions = useMemo(
    () =>
      filterFinancePromotions(getFinanceRecordsForPeriod(financePromotionsMockData, period), {
        searchValue,
        typeFilter,
        audienceFilter,
        statusFilter,
      }),
    [audienceFilter, period, searchValue, statusFilter, typeFilter],
  );

  return (
    <FinanceTableCard
      className="admin-finance-promotion-catalog"
      title="Promotion Catalog"
      headerAction={(
        <button
          type="button"
          className="admin-finance__create-btn"
          onClick={onCreate}
        >
          Create promotion
        </button>
      )}
      toolbar={(
        <FinanceFilters
          embedded
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search by promotion name, code, restaurant..."
          selects={[
            {
              label: "Promotion type filter",
              value: typeFilter,
              onChange: setTypeFilter,
              options: promotionTypeFilters,
            },
            {
              label: "Promotion audience filter",
              value: audienceFilter,
              onChange: setAudienceFilter,
              options: promotionAudienceFilters,
            },
          ]}
          chips={promotionStatusFilters}
          statusValue={statusFilter}
          onStatusChange={setStatusFilter}
        />
      )}
      emptyMessage="No promotions found. Create a promotion or clear the current filters."
      isEmpty={!promotions.length}
      onClearFilters={() => {
        setSearchValue("");
        setTypeFilter("All types");
        setAudienceFilter("All audiences");
        setStatusFilter("All");
      }}
    >
      <AdminTable
        columns={promotionColumns}
        rows={promotions}
        renderRow={(promotion) => (
            <tr key={promotion.name} className="admin-finance-row">
              <td data-label="Promotion" className="admin-finance-row__cell admin-finance-row__cell--first">
                <strong>{promotion.name}</strong>
                <span>
                  {promotion.type} • {promotion.restaurant || promotion.funding}
                </span>
              </td>
              <td data-label="Value" className="admin-finance-row__cell">
                <strong>{promotion.value}</strong>
              </td>
              <td data-label="Audience" className="admin-finance-row__cell">
                <span>{promotion.audience}</span>
              </td>
              <td data-label="Period" className="admin-finance-row__cell">
                <strong>{promotion.validity}</strong>
              </td>
              <td data-label="Status" className="admin-finance-row__cell">
                <StatusBadge value={promotion.status} />
              </td>
              <td data-label="Usage" className="admin-finance-row__cell">
                <strong>{promotion.usageToday} this period</strong>
                <span>{promotion.usageTotal} of {promotion.redemptionLimit} total uses</span>
              </td>
              <td data-label="Budget" className="admin-finance-row__cell">
                <strong>{formatWholeMoney(promotion.spentBudget)} of {formatWholeMoney(promotion.totalBudget)}</strong>
                <span>{formatWholeMoney(promotion.totalBudget - promotion.spentBudget)} remaining</span>
              </td>
              <td data-label="Cost / Funding" className="admin-finance-row__cell">
                <strong>{promotion.costToday}</strong>
                {promotion.funding === "Shared" && (
                  <span>
                    Platform {formatWholeMoney(promotion.periodPlatformFunding)} · Restaurant {formatWholeMoney(promotion.periodRestaurantFunding)}
                  </span>
                )}
              </td>
              <td data-label="Action" className="admin-finance-row__cell admin-finance-row__cell--action admin-finance-row__cell--last">
                <button
                  type="button"
                  className="live-orders-btn"
                  onClick={() => onOpenDrawer("promotion", promotion)}
                >
                  {getPromotionActionLabel(promotion.status)}
                </button>
              </td>
            </tr>
        )}
      />
    </FinanceTableCard>
  );
}
