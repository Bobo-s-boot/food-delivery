import { financeTabs } from "../finance.data";

export function FinanceTabs({ activeTab, onTabChange }) {
  return (
    <div className="admin-finance__tabs" aria-label="Finance section tabs">
      {financeTabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onTabChange(tab)}
          className={
            activeTab === tab
              ? "admin-finance__tab is-active"
              : "admin-finance__tab"
          }
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
