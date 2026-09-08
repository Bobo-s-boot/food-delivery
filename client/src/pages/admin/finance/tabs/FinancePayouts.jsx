import { useMemo, useState } from "react";
import { AdminTable } from "../../components/AdminTable";
import { StatusBadge } from "../../components/StatusBadge";
import {
  financePayoutsMockData,
  payoutStatusFilters,
} from "../finance.data";
import {
  filterFinancePayouts,
  getFinanceRecordsForPeriod,
  getPayoutActionLabel,
} from "../finance.utils";
import { formatMoney, formatWholeMoney } from "../finance.formatters";
import { FinanceFilters } from "../components/FinanceFilters";
import { FinanceTableCard } from "../components/FinanceTableCard";

const payoutColumns = [
  "Restaurant",
  "Payout Period",
  "Gross Sales",
  "Fees & Adjustments",
  "Net Payout",
  "Expected / Paid Date",
  "Status",
  "Action",
];

export function FinancePayouts({ initialStatusFilter = "All", onOpenDrawer, period }) {
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
  const payouts = useMemo(
    () => filterFinancePayouts(getFinanceRecordsForPeriod(financePayoutsMockData, period), { searchValue, statusFilter }),
    [period, searchValue, statusFilter],
  );

  return (
    <>
      <FinanceFilters
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search by restaurant..."
        selects={[
          {
            label: "Payout status filter",
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: "All", label: "All payout statuses" },
              ...payoutStatusFilters.slice(1),
            ],
          },
        ]}
        chips={payoutStatusFilters}
        statusValue={statusFilter}
        onStatusChange={setStatusFilter}
      />
      <FinanceTableCard
        title="Restaurant Payouts"
        emptyMessage="No payouts found. All restaurant payouts may already be processed for this period."
        isEmpty={!payouts.length}
        onClearFilters={() => {
          setSearchValue("");
          setStatusFilter("All");
        }}
      >
        <AdminTable
          columns={payoutColumns}
          rows={payouts}
          renderRow={(payout) => (
            <tr key={payout.restaurant} className="admin-finance-row">
              <td data-label="Restaurant" className="admin-finance-row__cell admin-finance-row__cell--first">
                <strong>{payout.restaurant}</strong>
                <span>{payout.orders} orders</span>
              </td>
              <td data-label="Payout Period" className="admin-finance-row__cell">
                <strong>{payout.period}</strong>
                <span>Daily payout</span>
              </td>
              <td data-label="Gross Sales" className="admin-finance-row__cell">
                <strong>{formatWholeMoney(payout.grossSales)}</strong>
              </td>
              <td data-label="Fees & Adjustments" className="admin-finance-row__cell">
                <span>Platform fee: {formatWholeMoney(payout.platformFee)}</span>
                <span>
                  Restaurant promo share:{" "}
                  {formatWholeMoney(payout.restaurantPromoShare)}
                </span>
                {payout.restaurantCoveredRefunds > 0 && (
                  <span>Refunds: {formatMoney(payout.restaurantCoveredRefunds)}</span>
                )}
              </td>
              <td data-label="Net Payout" className="admin-finance-row__cell">
                <strong>{formatMoney(payout.netPayout)}</strong>
              </td>
              <td data-label="Expected / Paid Date" className="admin-finance-row__cell">
                <strong>{payout.paidDate || payout.expectedDate}</strong>
              </td>
              <td data-label="Status" className="admin-finance-row__cell">
                <StatusBadge value={payout.status} />
                {(payout.holdReason || payout.failureReason) && (
                  <span className="admin-finance-row__reason">
                    {payout.holdReason || payout.failureReason}
                  </span>
                )}
              </td>
              <td data-label="Action" className="admin-finance-row__cell admin-finance-row__cell--action admin-finance-row__cell--last">
                <button
                  type="button"
                  className="live-orders-btn"
                  onClick={() => onOpenDrawer("payout", payout)}
                >
                  {getPayoutActionLabel(payout.status)}
                </button>
              </td>
            </tr>
          )}
        />
      </FinanceTableCard>
    </>
  );
}
