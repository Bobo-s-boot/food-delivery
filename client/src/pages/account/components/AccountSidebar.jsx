import { ACCOUNT_SECTIONS } from "../const";

export function AccountSidebar({
  user,
  activeSection,
  onSectionChange,
  onSupport,
  onLogout,
}) {
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <aside className="account-sidebar">
      <div className="account-sidebar__profile">
        <div className="account-sidebar__avatar">{initials}</div>
        <div className="account-sidebar__profile-info">
          <h2 className="account-sidebar__name">{user.name}</h2>
          {user.studentDiscountActive && (
            <span className="account-pill account-pill--accent">
              Student Discount
            </span>
          )}
        </div>
      </div>

      <nav className="account-sidebar__nav" aria-label="Account sections">
        {ACCOUNT_SECTIONS.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => onSectionChange(section.id)}
            className={`account-sidebar__nav-button ${
              activeSection === section.id
                ? "account-sidebar__nav-button--active"
                : ""
            }`}
          >
            {section.label}
          </button>
        ))}
      </nav>

      <div className="account-sidebar__bottom">
        <button
          type="button"
          onClick={onSupport}
          className="account-sidebar__secondary-button"
        >
          Help & Support
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="account-sidebar__logout-button"
        >
          Log Out
        </button>
      </div>
    </aside>
  );
}
