import { useState } from "react";
import { AdminSelect } from "../components/ui/AdminSelect/AdminSelect";
import { financeDateFilters } from "./finance.data";
import { getFinanceAttentionShortcut } from "./finance.utils";
import { FinanceConfirmationDialog } from "./components/FinanceConfirmationDialog";
import { FinanceKpiCards } from "./components/FinanceKpiCards";
import { FinanceTabs } from "./components/FinanceTabs";
import { FinanceOverview } from "./components/overview/FinanceOverview";
import { CreatePromotionDrawer } from "./components/drawers/CreatePromotionDrawer";
import { FinanceDetailsDrawer } from "./components/drawers/FinanceDetailsDrawer";
import { FinanceTransactions } from "./tabs/FinanceTransactions";
import { FinancePayouts } from "./tabs/FinancePayouts";
import { FinanceRefunds } from "./tabs/FinanceRefunds";
import { FinancePromotions } from "./tabs/FinancePromotions";
import "./FinanceBase.scss";
import "./FinancePage.scss";

export function AdminFinancePage() {
  const [tabRequest, setTabRequest] = useState({
    tab: "Overview",
    statusFilter: "All",
    nonce: 0,
  });
  const [dateContext, setDateContext] = useState("Today");
  const [customRange, setCustomRange] = useState({ start: "2026-07-01", end: "2026-07-13" });
  const [drawer, setDrawer] = useState(null);
  const [confirmationRequest, setConfirmationRequest] = useState(null);
  const [mockActionMessage, setMockActionMessage] = useState("");
  const [isCreatePromotionOpen, setIsCreatePromotionOpen] = useState(false);

  const activeTab = tabRequest.tab;
  const openDrawer = (type, item) => setDrawer({ type, item });
  const changeTab = (tab) =>
    setTabRequest((current) => ({
      tab,
      statusFilter: "All",
      nonce: current.nonce + 1,
    }));
  const followAttentionShortcut = (shortcutKey) => {
    const shortcut = getFinanceAttentionShortcut(shortcutKey);
    setTabRequest((current) => ({
      tab: shortcut.tab,
      statusFilter: shortcut.statusFilter,
      nonce: current.nonce + 1,
    }));
  };

  return (
    <div className="admin-finance">
      <div className="admin-finance__intro">
        <div className="admin-page-intro admin-page-intro--nested">
          <h1>Finance</h1>
          <p>Monitor revenue, payouts, refunds and promotion impact.</p>
        </div>
        <AdminSelect
          value={dateContext}
          onChange={(event) => setDateContext(event.target.value)}
          aria-label="Finance date context"
        >
          {financeDateFilters.map((filter) => (
            <option key={filter} value={filter}>
              {filter}
            </option>
          ))}
        </AdminSelect>
        {dateContext === "Custom range" && (
          <div className="admin-finance__custom-range" aria-label="Custom finance date range">
            <label>
              Start
              <input
                type="date"
                value={customRange.start}
                onChange={(event) => setCustomRange((range) => ({ ...range, start: event.target.value }))}
              />
            </label>
            <label>
              End
              <input
                type="date"
                value={customRange.end}
                onChange={(event) => setCustomRange((range) => ({ ...range, end: event.target.value }))}
              />
            </label>
          </div>
        )}
      </div>

      <FinanceKpiCards period={dateContext} />
      <FinanceTabs activeTab={activeTab} onTabChange={changeTab} />

      {activeTab === "Overview" && (
        <FinanceOverview onShortcut={followAttentionShortcut} period={dateContext} />
      )}
      {activeTab === "Transactions" && (
        <FinanceTransactions
          key={`transactions-${tabRequest.nonce}`}
          initialStatusFilter={tabRequest.statusFilter}
          onOpenDrawer={openDrawer}
          period={dateContext}
        />
      )}
      {activeTab === "Payouts" && (
        <FinancePayouts
          key={`payouts-${tabRequest.nonce}`}
          initialStatusFilter={tabRequest.statusFilter}
          onOpenDrawer={openDrawer}
          period={dateContext}
        />
      )}
      {activeTab === "Refunds" && (
        <FinanceRefunds
          key={`refunds-${tabRequest.nonce}`}
          initialStatusFilter={tabRequest.statusFilter}
          onOpenDrawer={openDrawer}
          period={dateContext}
        />
      )}
      {activeTab === "Promotions" && (
        <FinancePromotions
          key={`promotions-${tabRequest.nonce}`}
          initialStatusFilter={tabRequest.statusFilter}
          onOpenDrawer={openDrawer}
          onCreate={() => setIsCreatePromotionOpen(true)}
          period={dateContext}
        />
      )}

      <FinanceDetailsDrawer
        drawer={drawer}
        onClose={() => setDrawer(null)}
        onRequestConfirmation={setConfirmationRequest}
        confirmationOpen={Boolean(confirmationRequest)}
      />
      {isCreatePromotionOpen && (
        <CreatePromotionDrawer onClose={() => setIsCreatePromotionOpen(false)} />
      )}
      <FinanceConfirmationDialog
        request={confirmationRequest}
        onClose={() => setConfirmationRequest(null)}
        onConfirm={({ action }) => {
          // TODO(finance-api): send the confirmed action and administrative reason to the backend.
          setMockActionMessage(`${action} was not executed — backend integration is required.`);
          setConfirmationRequest(null);
        }}
      />
      {mockActionMessage && (
        <div className="admin-finance__mock-notice" role="status">
          <span>{mockActionMessage}</span>
          <button type="button" onClick={() => setMockActionMessage("")}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

