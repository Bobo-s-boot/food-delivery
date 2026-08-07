import { ChevronRight, Plus } from "lucide-react";
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
  getMenuItemAvailabilityLabel,
  paginateItems,
} from "../restaurants.utils";

const columns = [
  "Item",
  "Restaurant",
  "Platform category",
  "Restaurant category",
  "Price",
  "Availability",
  "Promotion",
  "Content health",
  "Orders today",
  "Action",
];

const quickFilters = [
  "All",
  "Available",
  "Unavailable",
  "Discounted",
  "Missing Images",
  "Content issues",
];

const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;

function CatalogIdentity({ item }) {
  return (
    <div className="catalog-entity">
      {item.image ? (
        <img src={item.image} alt="" />
      ) : (
        <span className="catalog-entity__placeholder">No image</span>
      )}
      <div>
        <strong title={item.name}>{item.name}</strong>
        <span>
          {item.calories || "Menu item"} · {item.platformCategory} /{" "}
          {item.restaurantCategory}
        </span>
      </div>
    </div>
  );
}

function EffectiveAvailability({ item }) {
  const differs =
    item.availability === "Available" && item.customerVisibility === "Hidden";
  return (
    <div className="catalog-availability">
      <StatusBadge value={getMenuItemAvailabilityLabel(item)} />
      {differs && (
        <span>
          Hidden because restaurant is{" "}
          {item.restaurantAvailability.toLowerCase()}
        </span>
      )}
    </div>
  );
}

export function MenuCatalog({
  items,
  restaurants,
  platformCategories,
  restaurantCategories,
  state,
  onStateChange,
  onOpenItem,
  onAddItem,
}) {
  const pagination = paginateItems(items, state.page, state.pageSize);

  const kpis = [
    {
      label: "Total Items",
      value: "184",
      helper: `${items.length} in current view`,
      tone: "total",
      filter: "All",
    },
    {
      label: "Available",
      value: "156",
      helper: "item availability",
      tone: "available",
      filter: "Available",
    },
    {
      label: "Unavailable",
      value: "18",
      helper: "not orderable",
      tone: "unavailable",
      filter: "Unavailable",
    },
    {
      label: "Content Issues",
      value: "6",
      helper: "needs update",
      tone: "warning",
      filter: "Content issues",
    },
  ];

  return (
    <>
      <AdminKpiGrid className="restaurants-kpi-grid">
        {kpis.map((card) => (
          <AdminKpiCard
            key={card.label}
            {...card}
            interactive
            active={state.quick === card.filter}
            onClick={() => onStateChange({ quick: card.filter, page: 1 })}
          />
        ))}
      </AdminKpiGrid>

      <AdminCard className="restaurants-filters restaurants-catalog-filters">
        <div className="restaurants-filters__fields catalog-filters__fields">
          <input
            type="search"
            value={state.search}
            onChange={(event) =>
              onStateChange({ search: event.target.value, page: 1 })
            }
            placeholder="Search menu items..."
            aria-label="Search menu items"
          />
          <AdminSelect
            value={state.restaurant}
            onChange={(event) =>
              onStateChange({ restaurant: event.target.value, page: 1 })
            }
            aria-label="Restaurant"
          >
            <option>All restaurants</option>
            {restaurants.map((restaurant) => (
              <option key={restaurant.id}>{restaurant.name}</option>
            ))}
          </AdminSelect>

          <AdminSelect
            value={state.platformCategory}
            onChange={(event) =>
              onStateChange({ platformCategory: event.target.value, page: 1 })
            }
            aria-label="Platform category"
          >
            {platformCategories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </AdminSelect>

          <AdminSelect
            value={state.restaurantCategory}
            onChange={(event) =>
              onStateChange({ restaurantCategory: event.target.value, page: 1 })
            }
            aria-label="Restaurant menu category"
          >
            {restaurantCategories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </AdminSelect>
          <AdminSelect
            value={state.availability}
            onChange={(event) =>
              onStateChange({ availability: event.target.value, page: 1 })
            }
            aria-label="Item availability"
          >
            {[
              "All availability states",
              "Available",
              "Unavailable",
              "Sold out",
            ].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </AdminSelect>
          <AdminSelect
            value={state.visibility}
            onChange={(event) =>
              onStateChange({ visibility: event.target.value, page: 1 })
            }
            aria-label="Customer visibility"
          >
            {["All customer visibility", "Visible", "Hidden"].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </AdminSelect>
          <AdminSelect
            value={state.promotion}
            onChange={(event) =>
              onStateChange({ promotion: event.target.value, page: 1 })
            }
            aria-label="Promotion"
          >
            {[
              "All promotion states",
              "Active promotion",
              "No active promotion",
            ].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </AdminSelect>
          <AdminSelect
            value={state.content}
            onChange={(event) =>
              onStateChange({ content: event.target.value, page: 1 })
            }
            aria-label="Content issue"
          >
            {[
              "All content states",
              "Complete",
              "Missing image",
              "Missing description",
              "Content issues",
            ].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </AdminSelect>
        </div>
        <div className="restaurants-filters__quick-row">
          <span>Quick filters</span>
          <div>
            {quickFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={state.quick === filter ? "is-active" : ""}
                aria-pressed={state.quick === filter}
                onClick={() => onStateChange({ quick: filter, page: 1 })}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </AdminCard>

      <AdminCard className="restaurants-directory catalog-directory">
        <div className="restaurants-directory__header">
          <SectionHeader
            title="Menu Catalog"
            description="Browse and manage menu items across all restaurant partners."
          />
          <button
            type="button"
            className="restaurants-primary-action"
            onClick={onAddItem}
          >
            <Plus size={17} aria-hidden="true" /> Add Menu Item
          </button>
        </div>

        {pagination.totalItems === 0 ? (
          <div className="restaurants-empty">
            <strong>No menu items found</strong>
            <span>Select another restaurant or category.</span>
          </div>
        ) : (
          <>
            <div className="catalog-desktop-table">
              <AdminTable
                columns={columns}
                rows={pagination.items}
                className="catalog-table"
                renderRow={(item) => (
                  <tr key={`${item.restaurantId}-${item.id}`}>
                    <td>
                      <CatalogIdentity item={item} />
                    </td>
                    <td>
                      <strong>{item.restaurant}</strong>
                      <span className="restaurants-secondary">
                        {item.restaurantAvailability}
                      </span>
                    </td>
                    <td>{item.platformCategory}</td>
                    <td>{item.restaurantCategory}</td>
                    <td>
                      <strong>{formatMoney(item.price)}</strong>
                    </td>
                    <td>
                      <EffectiveAvailability item={item} />
                    </td>
                    <td>
                      {item.promotion === "No active promotion" ? (
                        <span className="restaurants-muted-state">
                          No active promotion
                        </span>
                      ) : (
                        <StatusBadge value={item.promotion} />
                      )}
                    </td>
                    <td>
                      <StatusBadge value={item.contentHealth} />
                    </td>
                    <td>
                      <strong>{item.ordersToday}</strong>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="restaurants-action"
                        onClick={() => onOpenItem(item)}
                      >
                        Open
                      </button>
                    </td>
                  </tr>
                )}
              />
            </div>
            <div className="catalog-compact-list">
              {pagination.items.map((item) => (
                <article key={`${item.restaurantId}-${item.id}`}>
                  <div className="catalog-compact-list__top">
                    <CatalogIdentity item={item} />
                    <button
                      type="button"
                      aria-label={`Open ${item.name} in ${item.restaurant}`}
                      onClick={() => onOpenItem(item)}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                  <p className="catalog-compact-list__restaurant">
                    {item.restaurant}
                  </p>
                  <div className="catalog-compact-list__meta">
                    <span>
                      {item.platformCategory} · {item.restaurantCategory}
                    </span>
                    <strong>{formatMoney(item.price)}</strong>
                  </div>
                  <div className="catalog-compact-list__badges">
                    <StatusBadge value={getMenuItemAvailabilityLabel(item)} />
                    <StatusBadge value={item.contentHealth} />
                    {item.promotion !== "No active promotion" && (
                      <StatusBadge value={item.promotion} />
                    )}
                  </div>
                  {item.availability === "Available" &&
                    item.customerVisibility === "Hidden" && (
                      <span className="catalog-compact-list__visibility">
                        Hidden because restaurant is{" "}
                        {item.restaurantAvailability.toLowerCase()}
                      </span>
                    )}
                </article>
              ))}
            </div>
          </>
        )}

        <div className="restaurants-pagination">
          <p>
            Showing {pagination.start}–{pagination.end} of{" "}
            {pagination.totalItems} menu items
          </p>
          <div className="restaurants-pagination__controls">
            <label>
              Per page
              <AdminSelect
                value={String(pagination.pageSize)}
                onChange={(event) =>
                  onStateChange({
                    pageSize: Number(event.target.value),
                    page: 1,
                  })
                }
                aria-label="Menu items per page"
              >
                {[10, 25, 50].map((size) => (
                  <option key={size}>{size}</option>
                ))}
              </AdminSelect>
            </label>
            <button
              type="button"
              disabled={pagination.page === 1}
              onClick={() => onStateChange({ page: pagination.page - 1 })}
            >
              Previous
            </button>
            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              type="button"
              disabled={pagination.page === pagination.totalPages}
              onClick={() => onStateChange({ page: pagination.page + 1 })}
            >
              Next
            </button>
          </div>
        </div>
      </AdminCard>
    </>
  );
}
