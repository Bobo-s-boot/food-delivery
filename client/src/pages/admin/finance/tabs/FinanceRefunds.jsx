import { useMemo, useState } from "react";
import { AdminTable } from "../../components/AdminTable";
import { StatusBadge } from "../../components/StatusBadge";
import {
  financeRefundsMockData,
  refundReasonFilters,
  refundStatusFilters,
  refundTypeFilters,
} from "../finance.data";
import {
  filterFinanceRefunds,
  getFinanceRecordsForPeriod,
  getRefundActionLabel,
} from "../finance.utils";
import { formatMoney } from "../finance.formatters";
import { FinanceFilters } from "../components/FinanceFilters";
import { FinanceTableCard } from "../components/FinanceTableCard";

const refundColumns = [
  "Refund",
  "Order",
  "Customer",
  "Amount",
  "Type",
  "Reason",
  "Request Age",
  "Status",
  "Action",
];

export function FinanceRefunds({ initialStatusFilter = "All", onOpenDrawer, period }) {
  const [searchValue, setSearchValue] = useState("");
  const [reasonFilter, setReasonFilter] = useState("All reasons");
  const [typeFilter, setTypeFilter] = useState("All refund types");
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
  const refunds = useMemo(
    () =>
      filterFinanceRefunds(getFinanceRecordsForPeriod(financeRefundsMockData, period), {
        searchValue,
        reasonFilter,
        typeFilter,
        statusFilter,
      }),
    [period, reasonFilter, searchValue, statusFilter, typeFilter],
  );

  return (
    <>
      <FinanceFilters
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search by refund ID, order ID, customer or restaurant..."
        selects={[
          {
            label: "Refund reason filter",
            value: reasonFilter,
            onChange: setReasonFilter,
            options: refundReasonFilters,
          },
          {
            label: "Refund type filter",
            value: typeFilter,
            onChange: setTypeFilter,
            options: refundTypeFilters,
          },
          {
            label: "Refund status filter",
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: "All", label: "All refund statuses" },
              ...refundStatusFilters.slice(1),
            ],
          },
        ]}
        chips={refundStatusFilters}
        statusValue={statusFilter}
        onStatusChange={setStatusFilter}
      />
      <FinanceTableCard
        title="Refunds"
        emptyMessage="No refunds found. All refund requests may be processed or the active filters are too narrow."
        isEmpty={!refunds.length}
        onClearFilters={() => {
          setSearchValue("");
          setReasonFilter("All reasons");
          setTypeFilter("All refund types");
          setStatusFilter("All");
        }}
      >
        <AdminTable
          columns={refundColumns}
          rows={refunds}
          renderRow={(refund) => (
            <tr key={refund.refundId} className="admin-finance-row">
              <td data-label="Refund" className="admin-finance-row__cell admin-finance-row__cell--first">
                <strong>{refund.refundId}</strong>
                <span>{refund.requested}</span>
              </td>
              <td data-label="Order" className="admin-finance-row__cell">
                <strong>{refund.orderId}</strong>
                <span>{refund.restaurant}</span>
              </td>
              <td data-label="Customer" className="admin-finance-row__cell">
                <strong>{refund.customer}</strong>
              </td>
              <td data-label="Amount" className="admin-finance-row__cell">
                <strong>{formatMoney(refund.amount)}</strong>
              </td>
              <td data-label="Type" className="admin-finance-row__cell">
                <strong>{refund.refundType}</strong>
              </td>
              <td data-label="Reason" className="admin-finance-row__cell">
                <span>{refund.reason}</span>
              </td>
              <td data-label="Request Age" className="admin-finance-row__cell">
                <strong>{refund.requestAge}</strong>
                {refund.overdue && (
                  <span
                    className="admin-finance-row__overdue"
                    title="Review target: within 60 minutes"
                  >
                    Overdue
                  </span>
                )}
              </td>
              <td data-label="Status" className="admin-finance-row__cell">
                <StatusBadge value={refund.status} />
              </td>
              <td data-label="Action" className="admin-finance-row__cell admin-finance-row__cell--action admin-finance-row__cell--last">
                <button
                  type="button"
                  className="live-orders-btn"
                  onClick={() => onOpenDrawer("refund", refund)}
                >
                  {getRefundActionLabel(refund.status)}
                </button>
              </td>
            </tr>
          )}
        />
      </FinanceTableCard>
    </>
  );
}
