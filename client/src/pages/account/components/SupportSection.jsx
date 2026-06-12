export function SupportSection({ supportContext, onClearContext }) {
  const contextText = supportContext
    ? `Support context: Order #${supportContext}`
    : "Choose a topic and our support team will help you from here.";

  return (
    <div className="account-section">
      <section className="account-page-heading">
        <span className="account-eyebrow">Support</span>
        <h1>Help & Support</h1>
        <p>{contextText}</p>
      </section>

      {supportContext && (
        <section className="account-card account-support-context">
          <div>
            <span className="account-eyebrow">Context attached</span>
            <h2>Order #{supportContext}</h2>
            <p>This support request will include the selected order reference.</p>
          </div>
          <button type="button" onClick={onClearContext}>
            Clear context
          </button>
        </section>
      )}

      <div className="account-two-column">
        <section className="account-card">
          <div className="account-card__header">
            <div>
              <span className="account-eyebrow">FAQ</span>
              <h2>Common questions</h2>
            </div>
          </div>
          <div className="account-list">
            <article className="account-help-card">
              <h3>Where is my courier?</h3>
              <p>Open active order tracking to see the latest delivery status.</p>
            </article>
            <article className="account-help-card">
              <h3>Can I request a refund?</h3>
              <p>Use Refund request and include your order number.</p>
            </article>
            <article className="account-help-card">
              <h3>How do student discounts work?</h3>
              <p>Active student accounts receive exclusive eligible offers.</p>
            </article>
          </div>
        </section>

        <section className="account-card">
          <div className="account-card__header">
            <div>
              <span className="account-eyebrow">Contact support</span>
              <h2>Report a problem</h2>
            </div>
          </div>
          <form className="account-form-grid">
            <select defaultValue="Delivery issue">
              <option>Delivery issue</option>
              <option>Payment issue</option>
              <option>Refund request</option>
              <option>Restaurant problem</option>
            </select>
            <textarea placeholder="Describe what happened" rows="5"></textarea>
            <button type="button" className="account-button account-button--primary">
              Send Support Request
            </button>
          </form>
        </section>
      </div>

      <section className="account-card">
        <div className="account-card__header">
          <div>
            <span className="account-eyebrow">Recent requests</span>
            <h2>Support history</h2>
          </div>
        </div>
        <div className="account-list">
          <article className="account-receipt-row">
            <div>
              <h3>Refund request</h3>
              <p>Order #DF-2018 · Resolved</p>
            </div>
            <span className="account-status account-status--delivered">Closed</span>
          </article>
        </div>
      </section>
    </div>
  );
}
