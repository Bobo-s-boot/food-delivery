import { ExternalLink, X } from "lucide-react";
import { Link } from "react-router-dom";
import { StatusBadge } from "../../components/StatusBadge";
import {
  getAverageOrderValue,
  getUserInitials,
} from "../users.utils";
import { UserDrawerActions } from "./UserDrawerActions";

const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;

export function UserDetailsDrawer({
  user,
  adminBasePath,
  onAddInternalNote,
  onClose,
  onStatusChange,
}) {
  if (!user) return null;

  const averageOrderValue = getAverageOrderValue(user);
  const hasSupportIssue = Boolean(user.issues?.length);
  const firstSupportIssue = user.issues?.[0];
  const ordersRoute = `${adminBasePath}/orders?customer=${encodeURIComponent(user.name)}`;
  const supportRoute = `${adminBasePath}/support${
    firstSupportIssue?.ticketId
      ? `?ticket=${encodeURIComponent(firstSupportIssue.ticketId)}`
      : ""
  }`;

  return (
    <div className="user-drawer" role="dialog" aria-modal="true" aria-labelledby="user-drawer-title">
      <button
        type="button"
        className="user-drawer__backdrop"
        aria-label="Close user details"
        onClick={onClose}
      />

      <aside className="user-drawer__panel">
        <header className="user-drawer__header">
          <div className="user-drawer__identity">
            <span className="admin-users-avatar admin-users-avatar--drawer">
              {getUserInitials(user.name)}
            </span>
            <div className="user-drawer__identity-copy">
              <h2 id="user-drawer-title" className="user-drawer__title">{user.name}</h2>
              <p className="user-drawer__email">{user.email}</p>
              <div className="user-drawer__badges">
                <StatusBadge value={user.status} />
                <StatusBadge value={user.studentStatus} />
              </div>
            </div>
          </div>

          <button
            type="button"
            className="user-drawer__close"
            aria-label="Close user details"
            onClick={onClose}
          >
            <X aria-hidden="true" size={18} strokeWidth={2} />
          </button>
        </header>

        <section className="user-drawer__section">
          <h3>Account</h3>
          <dl className="user-drawer__detail-list">
            <div><dt>Phone</dt><dd>{user.phone}</dd></div>
            <div><dt>Joined</dt><dd>{user.joined}</dd></div>
          </dl>
        </section>

        <section className="user-drawer__section">
          <h3>Activity</h3>
          <div className="user-drawer__metric-grid">
            <div><strong>{user.orders} orders</strong><span>Order count</span></div>
            <div><strong>{formatMoney(user.totalSpent)}</strong><span>Total spent</span></div>
            <div><strong>{user.lastOrder}</strong><span>Last order</span></div>
            <div><strong>{averageOrderValue}</strong><span>Average order value</span></div>
          </div>
        </section>

        <section className="user-drawer__section user-drawer__section--secondary">
          <h3>Student & Discounts</h3>
          <dl className="user-drawer__detail-list">
            <div><dt>Verification</dt><dd>{user.studentStatus}</dd></div>
            {user.discounts.map((discount) => (
              <div key={`${user.id}-${discount.name}-${discount.status}`}>
                <dt>{discount.name}</dt>
                <dd>{discount.status || "Not used"}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="user-drawer__section">
          <div className="user-drawer__section-heading">
            <h3>Recent Orders</h3>
            <Link to={ordersRoute} className="user-drawer__text-link">View all orders</Link>
          </div>
          {user.recentOrders.length ? (
            <div className="user-drawer__items">
              {user.recentOrders.slice(0, 3).map((order) => (
                <Link
                  key={`${user.id}-${order.id}`}
                  to={`${ordersRoute}&order=${encodeURIComponent(order.id)}`}
                  className="user-drawer__order-link"
                >
                  <span>{order.id} · {order.restaurant} · {formatMoney(order.total)}</span>
                  <strong>{order.status}</strong>
                  <ExternalLink aria-hidden="true" size={14} />
                </Link>
              ))}
            </div>
          ) : (
            <p>No recent orders.</p>
          )}
        </section>

        <section className="user-drawer__section">
          <h3>Support Issues</h3>
          {hasSupportIssue ? (
            <div className="user-drawer__issues">
              {user.issues.map((issue) => (
                <div key={`${user.id}-${issue.ticketId}-${issue.type}`} className="user-drawer__issue-row">
                  <div>
                    <strong>{issue.ticketId || "Support case"} · {issue.type}</strong>
                    <StatusBadge value={issue.status} />
                  </div>
                  <Link
                    to={`${adminBasePath}/support${
                      issue.ticketId ? `?ticket=${encodeURIComponent(issue.ticketId)}` : ""
                    }`}
                    className="user-drawer__text-link"
                  >
                    Open
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p>No open support issues.</p>
          )}
        </section>

        <UserDrawerActions
          user={user}
          hasSupportIssue={hasSupportIssue}
          ordersRoute={ordersRoute}
          supportRoute={supportRoute}
          onAddInternalNote={onAddInternalNote}
          onStatusChange={onStatusChange}
        />
      </aside>
    </div>
  );
}
