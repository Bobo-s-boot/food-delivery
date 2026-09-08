export function DrawerSection({ title, children }) {
  return (
    <section className="finance-drawer__section">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

export function DrawerGrid({ rows }) {
  return (
    <div className="finance-drawer__grid">
      {rows.map(([label, value]) => (
        <div key={`${label}-${value}`}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
}

export function DrawerTimeline({ events }) {
  return (
    <DrawerSection title="Timeline">
      {events?.length ? (
        <div className="finance-drawer__timeline">
          {events.map((event) => (
            <p key={event}>{event}</p>
          ))}
        </div>
      ) : (
        <p>No timeline events.</p>
      )}
    </DrawerSection>
  );
}

export function DrawerActions({ actions, onAction }) {
  return (
    <DrawerSection title="Preview Actions">
      <div className="finance-drawer__actions">
        {actions.map((action) => (
          <button key={action} type="button" onClick={() => onAction(action)}>
            {action}
          </button>
        ))}
      </div>
    </DrawerSection>
  );
}
