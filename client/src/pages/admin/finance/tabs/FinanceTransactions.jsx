import { useMemo, useState } from "react";
import { AdminTable } from "../../components/AdminTable";
import { StatusBadge } from "../../components/StatusBadge";
import {
  financeTransactionsMockData,
  transactionPaymentMethodFilters,
  transactionStatusFilters,
} from "../finance.data";
import {
  filterFinanceTransactions,
  getFinanceRecordsForPeriod,
} from "../finance.utils";
import { formatMoney } from "../finance.formatters";
import { FinanceFilters } from "../components/FinanceFilters";
import { FinanceTableCard } from "../components/FinanceTableCard";

const transactionColumns = [
  "Transaction",
  "Order",
  "Customer / Restaurant",
  "Amount Breakdown",
  "Status",
  "Time",
  "Action",
];

export function FinanceTransactions({ initialStatusFilter = "All", onOpenDrawer, period }) {
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("All payment methods");
  const transactions = useMemo(
    () =>
      filterFinanceTransactions(getFinanceRecordsForPeriod(financeTransactionsMockData, period), {
        searchValue,
        statusFilter,
        paymentMethodFilter,
      }),
    [paymentMethodFilter, period, searchValue, statusFilter],
  );

  return (
    <>
      <FinanceFilters
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search by transaction ID, order ID, customer or restaurant..."
        selects={[
          {
            label: "Payment method filter",
            value: paymentMethodFilter,
            onChange: setPaymentMethodFilter,
            options: transactionPaymentMethodFilters,
          },
        ]}
        chips={transactionStatusFilters}
        statusValue={statusFilter}
        onStatusChange={setStatusFilter}
      />
      <FinanceTableCard
        title="Transactions"
        emptyMessage="No transactions found. Try adjusting the global period or clear the active filters."
        isEmpty={!transactions.length}
        onClearFilters={() => {
          setSearchValue("");
          setStatusFilter("All");
          setPaymentMethodFilter("All payment methods");
        }}
      >
        <AdminTable
          columns={transactionColumns}
          rows={transactions}
          renderRow={(transaction) => (
            <tr key={transaction.transactionId} className="admin-finance-row">
              <td data-label="Transaction" className="admin-finance-row__cell admin-finance-row__cell--first">
                <strong>{transaction.transactionId}</strong>
                <span>{transaction.paymentMethod} payment</span>
              </td>
              <td data-label="Order" className="admin-finance-row__cell">
                <strong>{transaction.orderId}</strong>
                <span>{transaction.orderStatus}</span>
              </td>
              <td data-label="Customer / Restaurant" className="admin-finance-row__cell">
                <strong>{transaction.customer}</strong>
                <span>{transaction.restaurant}</span>
              </td>
              <td data-label="Amount Breakdown" className="admin-finance-row__cell">
                <strong>Total: {formatMoney(transaction.total)}</strong>
                <span>
                  Fee: {formatMoney(transaction.platformFee)} • Payout:{" "}
                  {formatMoney(transaction.restaurantPayout)}
                </span>
              </td>
              <td data-label="Status" className="admin-finance-row__cell">
                <StatusBadge value={transaction.status} />
              </td>
              <td data-label="Time" className="admin-finance-row__cell">
                <span title={transaction.fullTimestamp}>{transaction.time}</span>
              </td>
              <td data-label="Action" className="admin-finance-row__cell admin-finance-row__cell--action admin-finance-row__cell--last">
                <button
                  type="button"
                  className="live-orders-btn"
                  onClick={() => onOpenDrawer("transaction", transaction)}
                >
                  Details
                </button>
              </td>
            </tr>
          )}
        />
      </FinanceTableCard>
    </>
  );
}
