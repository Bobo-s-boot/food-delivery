import { AdminCard } from "../../components/AdminCard";
import { AdminTable } from "../../components/AdminTable";
import { SectionHeader } from "../../components/SectionHeader";
import { StatusBadge } from "../../components/StatusBadge";
import {
  getPrimaryIssue,
  getUserInitials,
  getUserTableActionLabel,
} from "../users.utils";

const userColumns = [
  "User",
  "Status",
  "Student Status",
  "Orders & Spend",
  "Issue",
  "Action",
];

const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;

export function UsersTableCard({ users, onSelectUser }) {
  return (
    <AdminCard className="admin-users-table-card">
      <div className="admin-users-table-card__header">
        <SectionHeader title="Customer Accounts" />
      </div>

      <div className="admin-users-table-card__table">
        <AdminTable
          columns={userColumns}
          rows={users}
          renderRow={(user) => {
            const primaryIssue = getPrimaryIssue(user);
            return (
              <tr key={user.id} className="admin-users-row">
                <td className="admin-users-row__cell admin-users-row__cell--first">
                  <div className="admin-users-entity">
                    <span className="admin-users-avatar">{getUserInitials(user.name)}</span>
                    <div>
                      <strong>
                        {user.name}
                        {user.isNew && <span className="admin-users-entity__tag">New</span>}
                      </strong>
                      <span>{user.email}</span>
                    </div>
                  </div>
                </td>
                <td className="admin-users-row__cell admin-users-row__status">
                  <StatusBadge value={user.status} />
                  <span className="admin-users-row__compact-student"><StatusBadge value={user.studentStatus} /></span>
                </td>
                <td className="admin-users-row__cell admin-users-row__student">
                  <StatusBadge value={user.studentStatus} />
                </td>
                <td className="admin-users-row__cell admin-users-row__activity">
                  <strong>{user.orders} orders · {formatMoney(user.totalSpent)}</strong>
                  <span>{user.orders ? `Last order: ${user.lastOrder}` : "No orders yet"}</span>
                </td>
                <td className="admin-users-row__cell admin-users-row__issue-cell">
                  {primaryIssue ? (
                    <StatusBadge value={primaryIssue} />
                  ) : (
                    <span className="admin-users-row__empty">No open issues</span>
                  )}
                </td>
                <td className="admin-users-row__cell admin-users-row__cell--action admin-users-row__cell--last">
                  <button
                    type="button"
                    className="live-orders-btn"
                    onClick={() => onSelectUser(user.id)}
                  >
                    {getUserTableActionLabel(user)}
                  </button>
                </td>
              </tr>
            );
          }}
        />
      </div>

      {users.length === 0 && <div className="admin-users-empty">No users match this filter.</div>}

      <div className="admin-users-table-card__footer">
        <p>Showing 1–10 of 1,248 users</p>
        <div className="admin-users-table-card__pagination">
          <button type="button">Previous</button>
          <button type="button">Next</button>
        </div>
      </div>
    </AdminCard>
  );
}
