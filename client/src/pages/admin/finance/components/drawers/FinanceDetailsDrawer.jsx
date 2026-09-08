import { useState } from "react";
import { StatusBadge } from "../../../components/StatusBadge";
import { getPreviewOnlyMessage } from "../../finance.utils";
import { formatMoney, formatWholeMoney } from "../../finance.formatters";
import { useFinanceDialogFocus } from "../../hooks/useFinanceDialogFocus";
import {
  DrawerActions,
  DrawerGrid,
  DrawerSection,
  DrawerTimeline,
} from "./DrawerPrimitives";

export function FinanceDetailsDrawer({
  drawer,
  onClose,
  onRequestConfirmation,
  confirmationOpen,
}) {
  const [previewMessage, setPreviewMessage] = useState("");
  const panelRef = useFinanceDialogFocus(Boolean(drawer) && !confirmationOpen, onClose);

  if (!drawer) {
    return null;
  }

  const { type, item } = drawer;
  const dangerousActions = new Set([
    "Retry payment",
    "Place on hold",
    "Release hold",
    "Retry payout",
    "Approve refund",
    "Reject refund",
    "Pause promotion",
    "Cancel promotion",
    "End promotion",
  ]);
  const handleAction = (action) => {
    if (dangerousActions.has(action)) {
      onRequestConfirmation({ action, item });
      return;
    }

    setPreviewMessage(`${action}: ${getPreviewOnlyMessage()}`);
  };

  const title =
    type === "transaction"
      ? `Transaction ${item.transactionId}`
      : type === "payout"
        ? `${item.restaurant} Payout`
        : type === "refund"
          ? `Refund ${item.refundId}`
          : item.name;

  return (
    <div className="finance-drawer" role="dialog" aria-modal="true">
      <button
        type="button"
        className="finance-drawer__backdrop"
        aria-label="Close finance details"
        onClick={onClose}
      />
      <aside className="finance-drawer__panel" ref={panelRef}>
        <div className="finance-drawer__header">
          <div>
            <p className="finance-drawer__eyebrow">Finance details</p>
            <h2 className="finance-drawer__title">{title}</h2>
          </div>
          <button
            type="button"
            className="finance-drawer__close"
            aria-label="Close finance details"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        {type === "transaction" && (
          <>
            <DrawerSection title="Order">
              <DrawerGrid rows={[["Order", item.orderId], ["Status", item.orderStatus]]} />
            </DrawerSection>
            <DrawerSection title="Parties">
              <DrawerGrid rows={[["Customer", item.customer], ["Restaurant", item.restaurant]]} />
            </DrawerSection>
            <DrawerSection title="Payment">
              <DrawerGrid
                rows={[
                  ["Status", item.status],
                  ["Payment method", item.paymentMethod],
                  ["Processor reference", item.processorReference],
                  ["Total", formatMoney(item.total)],
                  ["Estimated platform fee", formatMoney(item.platformFee)],
                  ["Restaurant payout", formatMoney(item.restaurantPayout)],
                  ["Refunded amount", formatMoney(item.refundedAmount)],
                  ["Created", item.fullTimestamp],
                ]}
              />
            </DrawerSection>
            {item.failureReason && (
              <DrawerSection title="Payment Error"><p>{item.failureReason}</p></DrawerSection>
            )}
            <DrawerTimeline events={item.timeline} />
            <DrawerActions
              actions={[
                "Open order",
                ...(item.status === "Failed" ? ["Retry payment"] : []),
                ...(item.status === "Refunded" ? ["Review refund"] : []),
                "Copy transaction ID",
              ]}
              onAction={handleAction}
            />
          </>
        )}

        {type === "payout" && (
          <>
            <DrawerSection title="Period">
              <p>{item.period}</p>
            </DrawerSection>
            <DrawerSection title="Summary">
              <DrawerGrid
                rows={[
                  ["Orders", `${item.orders} orders`],
                  ["Gross sales", formatWholeMoney(item.grossSales)],
                  ["Platform fee", formatWholeMoney(item.platformFee)],
                  [
                    "Restaurant promo share",
                    formatWholeMoney(item.restaurantPromoShare),
                  ],
                  [
                    "Restaurant-covered refunds",
                    formatMoney(item.restaurantCoveredRefunds),
                  ],
                  ["Net payout", formatMoney(item.netPayout)],
                  ["Expected payment", item.expectedDate],
                  ["Actual payment", item.paidDate || "Not paid"],
                  ["Status", item.status],
                  ["Issue reason", item.holdReason || item.failureReason || "None"],
                ]}
              />
            </DrawerSection>
            <DrawerTimeline events={item.timeline} />
            <DrawerActions
              actions={[
                ...(item.status === "On hold" ? ["Release hold"] : ["Place on hold"]),
                ...(item.status === "Failed" ? ["Retry payout"] : []),
                "Open restaurant",
                "Copy payout reference",
              ]}
              onAction={handleAction}
            />
          </>
        )}

        {type === "refund" && (
          <>
            <DrawerSection title="Order">
              <p>
                {item.orderId} — {item.restaurant}
              </p>
            </DrawerSection>
            <DrawerSection title="Customer">
              <p>{item.customer}</p>
            </DrawerSection>
            <DrawerSection title="Refund">
              <DrawerGrid
                rows={[
                  ["Amount", formatMoney(item.amount)],
                  ["Type", item.refundType],
                  ["Reason", item.reason],
                  ["Request age", item.requestAge],
                  ["Status", item.status],
                  ["Impact", item.impact],
                  ["Priority", item.priority],
                ]}
              />
            </DrawerSection>
            <DrawerSection title="Customer description"><p>{item.customerDescription}</p></DrawerSection>
            <DrawerSection title="Order items">
              {item.orderItems?.map((orderItem) => <p key={orderItem}>{orderItem}</p>)}
            </DrawerSection>
            <DrawerSection title="Related support case"><p>{item.supportCase || "No linked case"}</p></DrawerSection>
            {item.rejectionReason && <DrawerSection title="Decision reason"><p>{item.rejectionReason}</p></DrawerSection>}
            <DrawerTimeline events={item.timeline} />
            <DrawerActions
              actions={[
                "Approve refund",
                "Reject refund",
                "Request more information",
                "Open order",
                "Open support case",
              ]}
              onAction={handleAction}
            />
          </>
        )}

        {type === "promotion" && (
          <>
            <div className="finance-drawer__badges">
              <StatusBadge value={item.status} />
              <StatusBadge value={item.funding} />
            </div>
            <DrawerSection title="Rules">
              <DrawerGrid
                rows={[
                  ["Code", item.code],
                  ["Minimum order", item.minimumOrder],
                  ["Maximum discount", item.maximumDiscount],
                ]}
              />
            </DrawerSection>
            <DrawerSection title="Audience & Funding">
              <DrawerGrid
                rows={[
                  ["Audience", item.audience],
                  ["Funding", item.funding],
                  ["Restaurant", item.restaurant || "—"],
                ]}
              />
            </DrawerSection>
            <DrawerSection title="Usage">
              <DrawerGrid
                rows={[
                  ["Today", `${item.usageToday} redemptions today`],
                  ["Total", `${item.usageTotal} total redemptions`],
                  ["Cost today", item.costToday],
                  ["Redemption limit", item.redemptionLimit],
                  ["Budget", formatWholeMoney(item.totalBudget)],
                  ["Spent", formatWholeMoney(item.spentBudget)],
                  ["Remaining", formatWholeMoney(item.totalBudget - item.spentBudget)],
                  ["Platform funding", formatWholeMoney(item.platformFunding)],
                  ["Restaurant funding", formatWholeMoney(item.restaurantFunding)],
                ]}
              />
            </DrawerSection>
            <DrawerSection title="Validity">
              <DrawerGrid
                rows={[
                  ["Start date", item.startDate],
                  ["End date", item.endDate],
                  ["Created by", item.createdBy],
                  ["Created", item.createdDate],
                ]}
              />
            </DrawerSection>
            <DrawerActions
              actions={
                item.status === "Active"
                  ? ["Pause promotion", "Edit promotion", "End promotion", "Duplicate promotion"]
                  : item.status === "Scheduled"
                    ? ["Edit promotion", "Cancel promotion", "Duplicate promotion"]
                    : item.status === "Paused"
                      ? ["Resume promotion", "Edit promotion", "End promotion"]
                      : ["Details", "Duplicate promotion"]
              }
              onAction={handleAction}
            />
          </>
        )}

        {previewMessage && (
          <p className="finance-drawer__preview-message">{previewMessage}</p>
        )}
      </aside>
    </div>
  );
}
