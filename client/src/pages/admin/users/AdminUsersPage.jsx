import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { AdminCard } from "../components/AdminCard";
import {
  AdminKpiCard,
  AdminKpiGrid,
} from "../components/ui/AdminKpiCard/AdminKpiCard";
import { AdminSelect } from "../components/ui/AdminSelect/AdminSelect";
import {
  studentStatusFilters,
  userIssueFilters,
  userStatusFilters,
  userSummaryCards,
  usersMockData,
} from "./users.data";
import {
  applyUserSummaryFilter,
  defaultUserFilters,
  filterUsers,
} from "./users.utils";
import { UserDetailsDrawer } from "./components/UserDetailsDrawer";
import { UsersTableCard } from "./components/UsersTableCard";
import { getAdminBasePath } from "../admin.routes";
import "./UsersPage.scss";

const getToneClass = (value) =>
  `admin-users-tone--${String(value || "all")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")}`;

export function AdminUsersPage() {
  const location = useLocation();
  const adminBasePath = getAdminBasePath(location.pathname);
  const [users, setUsers] = useState(() => usersMockData);
  const [filters, setFilters] = useState(defaultUserFilters);
  const [selectedUserId, setSelectedUserId] = useState("");

  const filteredUsers = useMemo(() => filterUsers(users, filters), [filters, users]);
  const selectedUser = users.find((user) => user.id === selectedUserId);

  const setManualFilter = (partialFilters) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      ...partialFilters,
      summaryFilter: "",
    }));
  };

  const handleSummaryFilter = (cardLabel) => {
    setFilters((currentFilters) =>
      currentFilters.summaryFilter === cardLabel
        ? { ...defaultUserFilters, summaryFilter: "" }
        : applyUserSummaryFilter(cardLabel),
    );
  };

  const updateUser = (userId, updater) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) => (user.id === userId ? updater(user) : user)),
    );
  };

  const handleStatusChange = (userId, status) => {
    updateUser(userId, (user) => ({ ...user, status }));
  };

  const handleAddInternalNote = (userId, message) => {
    // TODO(users-api): persist the private administrator note.
    updateUser(userId, (user) => ({
      ...user,
      notes: [...(user.notes || []), { message, timestamp: "Just now" }],
    }));
  };

  return (
    <div className="admin-users">
      <div className="admin-users__intro admin-page-intro">
        <h1>Users</h1>
        <p>Manage customer accounts, activity and support status.</p>
      </div>

      <AdminKpiGrid>
        {userSummaryCards.map((card) => (
          <AdminKpiCard
            key={card.label}
            label={card.label}
            value={card.value}
            helper={card.helper}
            tone={card.tone}
            interactive
            active={filters.summaryFilter === card.label}
            onClick={() => handleSummaryFilter(card.label)}
          />
        ))}
      </AdminKpiGrid>

      <AdminCard className="admin-users-filters">
        <div className="admin-users-filters__top">
          <input
            type="search"
            value={filters.searchValue}
            onChange={(event) => setManualFilter({ searchValue: event.target.value })}
            placeholder="Search by name or email..."
            className="admin-users-filters__search"
          />

          <AdminSelect
            value={filters.studentFilter}
            onChange={(event) => setManualFilter({ studentFilter: event.target.value })}
            aria-label="Verification status filter"
          >
            {studentStatusFilters.map((filter) => <option key={filter} value={filter}>{filter}</option>)}
          </AdminSelect>

          <AdminSelect
            value={filters.issueFilter}
            onChange={(event) => setManualFilter({ issueFilter: event.target.value })}
            aria-label="Issue filter"
          >
            {userIssueFilters.map((filter) => <option key={filter} value={filter}>{filter}</option>)}
          </AdminSelect>
        </div>

        <div className="admin-users-filters__status-row">
          <span className="admin-users-filters__status-label">Status</span>
          <div className="admin-users-filters__chips">
            {userStatusFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setManualFilter({ statusFilter: filter, newOnly: false })}
                aria-pressed={filters.statusFilter === filter && !filters.newOnly}
                className={`admin-users-filters__chip ${getToneClass(filter)} ${
                  filters.statusFilter === filter && !filters.newOnly
                    ? "admin-users-filters__chip--active"
                    : ""
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </AdminCard>

      <UsersTableCard users={filteredUsers} onSelectUser={setSelectedUserId} />

      <UserDetailsDrawer
        key={selectedUser?.id || "closed"}
        user={selectedUser}
        adminBasePath={adminBasePath}
        onAddInternalNote={handleAddInternalNote}
        onClose={() => setSelectedUserId("")}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
