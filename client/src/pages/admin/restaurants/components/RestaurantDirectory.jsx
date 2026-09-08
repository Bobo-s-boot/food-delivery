import { ChevronRight, LayoutGrid, List } from "lucide-react";
import { AdminCard } from "../../components/AdminCard";
import { AdminTable } from "../../components/AdminTable";
import { AdminSelect } from "../../components/ui/AdminSelect/AdminSelect";
import {
  AdminKpiCard,
  AdminKpiGrid,
} from "../../components/ui/AdminKpiCard/AdminKpiCard";
import { SectionHeader } from "../../components/SectionHeader";
import { StatusBadge } from "../../components/StatusBadge";
import {
  getRestaurantGridActionLabel,
  getRestaurantInitials,
  getRestaurantPreviewMeta,
  paginateItems,
} from "../restaurants.utils";

const partnershipOptions = [
  "All partnership statuses",
  "Approved",
  "Pending approval",
  "Rejected",
  "Suspended",
  "Archived",
];

const availabilityOptions = [
  "All availability states",
  "Accepting orders",
  "Temporarily paused",
  "Closed by schedule",
  "Offline",
];

const issueOptions = [
  "All issue states",
  "Needs attention",
  "Missing documents",
  "Low item availability",
  "Many cancellations",
  "Missing menu images",
  "Payment issue",
];

const quickFilters = [
  { label: "All", values: { partnership: "All partnership statuses", availability: "All availability states", issue: "All issue states" } },
  { label: "Accepting orders", values: { partnership: "All partnership statuses", availability: "Accepting orders", issue: "All issue states" } },
  { label: "Pending approval", values: { partnership: "Pending approval", availability: "All availability states", issue: "All issue states" } },
  { label: "Temporarily paused", values: { partnership: "All partnership statuses", availability: "Temporarily paused", issue: "All issue states" } },
  { label: "Needs attention", values: { partnership: "All partnership statuses", availability: "All availability states", issue: "Needs attention" } },
];

const columns = [
  "Restaurant",
  "Partnership",
  "Availability",
  "Current issue",
  "Menu health",
  "Orders today",
  "Action",
];

const getActiveQuickFilter = (state) =>
  quickFilters.find(
    (filter) =>
      filter.values.partnership === state.partnership &&
      filter.values.availability === state.availability &&
      filter.values.issue === state.issue,
  )?.label || "";

function RestaurantIdentity({ restaurant, image = false }) {
  return (
    <div className="restaurants-entity">
      {image && restaurant.image ? (
        <img src={restaurant.image} alt="" />
      ) : (
        <span className="restaurants-entity__avatar" aria-hidden="true">
          {getRestaurantInitials(restaurant.name)}
        </span>
      )}
      <div className="restaurants-entity__copy">
        <strong title={restaurant.name}>{restaurant.name}</strong>
        <span>{restaurant.cuisine} · {restaurant.location}</span>
      </div>
    </div>
  );
}

function IssueSummary({ restaurant }) {
  return restaurant.issueStatus === "No active issues" ? (
    <span className="restaurants-muted-state">No active issues</span>
  ) : (
    <StatusBadge value={restaurant.issueStatus} />
  );
}

function DirectoryPagination({ pagination, pageSizeOptions, onPageChange, onPageSizeChange }) {
  return (
    <div className="restaurants-pagination">
      <p>
        Showing {pagination.start}–{pagination.end} of {pagination.totalItems} restaurants
      </p>
      <div className="restaurants-pagination__controls">
        <label>
          Per page
          <AdminSelect
            value={String(pagination.pageSize)}
            onChange={(event) => onPageSizeChange(event.target.value)}
            aria-label="Restaurants per page"
          >
            {pageSizeOptions.map((size) => <option key={size} value={size}>{size}</option>)}
          </AdminSelect>
        </label>
        <button type="button" disabled={pagination.page === 1} onClick={() => onPageChange(pagination.page - 1)}>
          Previous
        </button>
        <span aria-live="polite">Page {pagination.page} of {pagination.totalPages}</span>
        <button type="button" disabled={pagination.page === pagination.totalPages} onClick={() => onPageChange(pagination.page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

export function RestaurantDirectory({
  restaurants,
  cuisineOptions,
  state,
  onStateChange,
  onOpenRestaurant,
}) {
  const pageSizeOptions = state.view === "grid" ? [12, 24, 48] : [10, 25, 50];
  const pagination = paginateItems(restaurants, state.page, state.pageSize);
  const activeQuickFilter = getActiveQuickFilter(state);
  const total = restaurants.length;
  const kpis = [
    { label: "Total Restaurants", value: "48", helper: `${total} in current view`, tone: "total", quick: "All" },
    { label: "Accepting Orders", value: "36", helper: "operational now", tone: "active", quick: "Accepting orders" },
    { label: "Pending Approval", value: "4", helper: "needs review", tone: "pending", quick: "Pending approval" },
    { label: "Needs Attention", value: "3", helper: "operational issues", tone: "warning", quick: "Needs attention" },
  ];

  const applyQuickFilter = (label) => {
    const filter = quickFilters.find((entry) => entry.label === label);
    if (filter) onStateChange({ ...filter.values, page: 1 });
  };

  return (
    <>
      <AdminKpiGrid className="restaurants-kpi-grid">
        {kpis.map((card) => (
          <AdminKpiCard
            key={card.label}
            {...card}
            interactive
            active={activeQuickFilter === card.quick}
            onClick={() => applyQuickFilter(card.quick)}
          />
        ))}
      </AdminKpiGrid>

      <AdminCard className="restaurants-filters">
        <div className="restaurants-filters__fields">
          <input
            type="search"
            value={state.search}
            onChange={(event) => onStateChange({ search: event.target.value, page: 1 })}
            placeholder="Search by restaurant name, cuisine or location..."
            aria-label="Search restaurants"
          />
          <AdminSelect value={state.partnership} onChange={(event) => onStateChange({ partnership: event.target.value, page: 1 })} aria-label="Partnership status">
            {partnershipOptions.map((option) => <option key={option}>{option}</option>)}
          </AdminSelect>
          <AdminSelect value={state.availability} onChange={(event) => onStateChange({ availability: event.target.value, page: 1 })} aria-label="Operational availability">
            {availabilityOptions.map((option) => <option key={option}>{option}</option>)}
          </AdminSelect>
          <AdminSelect value={state.issue} onChange={(event) => onStateChange({ issue: event.target.value, page: 1 })} aria-label="Issue status">
            {issueOptions.map((option) => <option key={option}>{option}</option>)}
          </AdminSelect>
          <AdminSelect value={state.cuisine} onChange={(event) => onStateChange({ cuisine: event.target.value, page: 1 })} aria-label="Cuisine">
            {cuisineOptions.map((option) => <option key={option}>{option}</option>)}
          </AdminSelect>
        </div>
        <div className="restaurants-filters__quick-row">
          <span>Quick filters</span>
          <div>
            {quickFilters.map((filter) => (
              <button
                key={filter.label}
                type="button"
                className={activeQuickFilter === filter.label ? "is-active" : ""}
                aria-pressed={activeQuickFilter === filter.label}
                onClick={() => applyQuickFilter(filter.label)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </AdminCard>

      <AdminCard className="restaurants-directory">
        <div className="restaurants-directory__header">
          <SectionHeader title="Restaurant Directory" />
          <div className="restaurants-view-switcher" role="group" aria-label="Restaurant directory view">
            <button type="button" aria-label="List view" aria-pressed={state.view === "list"} className={state.view === "list" ? "is-active" : ""} onClick={() => onStateChange({ view: "list", page: 1, pageSize: 10 })}>
              <List size={18} aria-hidden="true" />
            </button>
            <button type="button" aria-label="Grid view" aria-pressed={state.view === "grid"} className={state.view === "grid" ? "is-active" : ""} onClick={() => onStateChange({ view: "grid", page: 1, pageSize: 12 })}>
              <LayoutGrid size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        {pagination.totalItems === 0 ? (
          <div className="restaurants-empty"><strong>No restaurants found</strong><span>Try changing the current filters.</span></div>
        ) : state.view === "grid" ? (
          <div className="restaurants-grid">
            {pagination.items.map((restaurant) => {
              const actionLabel = getRestaurantGridActionLabel(restaurant);
              return (
                <article key={restaurant.id} className="restaurant-grid-card">
                  <img src={restaurant.image} alt="" className="restaurant-grid-card__image" />
                  <div className="restaurant-grid-card__body">
                    <div className="restaurant-grid-card__title-row">
                      <div><h3>{restaurant.name}</h3><p>{restaurant.cuisine} · {restaurant.location}</p></div>
                      <StatusBadge value={restaurant.partnershipStatus} />
                    </div>
                    <button type="button" onClick={() => onOpenRestaurant(restaurant.id)}>
                      {actionLabel} <ChevronRight size={16} aria-hidden="true" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <>
            <div className="restaurants-desktop-table">
              <AdminTable
                columns={columns}
                rows={pagination.items}
                className="restaurants-table"
                renderRow={(restaurant) => {
                  const meta = getRestaurantPreviewMeta(restaurant);
                  return (
                    <tr key={restaurant.id}>
                      <td><RestaurantIdentity restaurant={restaurant} /></td>
                      <td><StatusBadge value={restaurant.partnershipStatus} /></td>
                      <td><StatusBadge value={restaurant.operationalAvailability} /></td>
                      <td><IssueSummary restaurant={restaurant} /></td>
                      <td><span className="restaurants-menu-health">{meta.menuItemsLabel}</span></td>
                      <td><strong>{restaurant.ordersToday}</strong><span className="restaurants-secondary"> today</span></td>
                      <td><button type="button" className="restaurants-action" onClick={() => onOpenRestaurant(restaurant.id)}>{meta.actionLabel}</button></td>
                    </tr>
                  );
                }}
              />
            </div>
            <div className="restaurants-compact-list">
              {pagination.items.map((restaurant) => {
                const meta = getRestaurantPreviewMeta(restaurant);
                return (
                  <article key={restaurant.id}>
                    <div className="restaurants-compact-list__top">
                      <RestaurantIdentity restaurant={restaurant} />
                      <button type="button" aria-label={`${meta.actionLabel} ${restaurant.name}`} onClick={() => onOpenRestaurant(restaurant.id)}><ChevronRight size={20} /></button>
                    </div>
                    <div className="restaurants-compact-list__badges"><StatusBadge value={restaurant.partnershipStatus} /><StatusBadge value={restaurant.operationalAvailability} /></div>
                    <div className="restaurants-compact-list__meta"><span>{meta.menuItemsLabel}</span><span>{restaurant.ordersToday} orders today</span></div>
                    <IssueSummary restaurant={restaurant} />
                  </article>
                );
              })}
            </div>
          </>
        )}

        <DirectoryPagination
          pagination={pagination}
          pageSizeOptions={pageSizeOptions}
          onPageChange={(page) => onStateChange({ page })}
          onPageSizeChange={(pageSize) => onStateChange({ pageSize: Number(pageSize), page: 1 })}
        />
      </AdminCard>
    </>
  );
}
