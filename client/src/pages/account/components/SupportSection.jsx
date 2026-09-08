import { useEffect, useState } from "react";
import {
  createSupportTicket,
  getUserSupportTickets,
} from "../../../api/supportService";

const categoryMap = {
  "Delivery issue": { key: "order_delivery", label: "Order or delivery" },
  "Payment issue": { key: "payment_refund", label: "Payment or refund" },
  "Refund request": { key: "payment_refund", label: "Payment or refund" },
  "Restaurant problem": {
    key: "restaurant_information",
    label: "Restaurant information",
  },
  "Technical problem": {
    key: "technical_problem",
    label: "Technical problem",
  },
  Other: { key: "other", label: "Other" },
};

export function SupportSection({ supportContext, onClearContext }) {
  const [selectedTopic, setSelectedTopic] = useState("Delivery issue");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [tickets, setTickets] = useState([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(true);

  const loadTickets = async () => {
    try {
      setIsLoadingTickets(true);
      const data = await getUserSupportTickets();
      setTickets(Array.isArray(data) ? data : []);
    } catch {
      // Ignored for unauthenticated or network error
    } finally {
      setIsLoadingTickets(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!description.trim() || description.trim().length < 20) {
      setMessage({
        text: "Please describe what happened in at least 20 characters.",
        type: "error",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage({ text: "", type: "" });

      const categoryObj = categoryMap[selectedTopic] || {
        key: "other",
        label: "Other",
      };
      const payload = {
        category: categoryObj.key,
        subject: supportContext
          ? `${selectedTopic} regarding order #${supportContext}`
          : `${selectedTopic} issue`,
        description: description.trim(),
        relatedOrderId: supportContext || "",
      };

      await createSupportTicket(payload);
      setMessage({
        text: "Your support request has been submitted successfully!",
        type: "success",
      });
      setDescription("");
      if (onClearContext) onClearContext();
      await loadTickets();
    } catch (error) {
      setMessage({
        text:
          typeof error === "string"
            ? error
            : error?.response?.data?.message ||
              "Failed to submit support request. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <p>
              This support request will include the selected order reference.
            </p>
          </div>
          <button type="button" onClick={onClearContext}>
            Clear context
          </button>
        </section>
      )}

      {message.text && (
        <div
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "0.5rem",
            marginBottom: "1rem",
            fontSize: "0.875rem",
            fontWeight: 500,
            backgroundColor:
              message.type === "success" ? "#ecfdf5" : "#fef2f2",
            color: message.type === "success" ? "#065f46" : "#991b1b",
            border: `1px solid ${message.type === "success" ? "#a7f3d0" : "#fecaca"}`,
          }}
          role="status"
        >
          {message.text}
        </div>
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
              <p>
                Open active order tracking to see the latest delivery status.
              </p>
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
          <form className="account-form-grid" onSubmit={handleSubmit}>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              disabled={isSubmitting}
            >
              <option>Delivery issue</option>
              <option>Payment issue</option>
              <option>Refund request</option>
              <option>Restaurant problem</option>
              <option>Technical problem</option>
              <option>Other</option>
            </select>
            <textarea
              placeholder="Describe what happened in detail (minimum 20 characters)"
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              required
            />
            <button
              type="submit"
              className="account-button account-button--primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Support Request"}
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
        {isLoadingTickets ? (
          <p style={{ color: "#64748b", padding: "1rem 0" }}>
            Loading support history...
          </p>
        ) : tickets.length === 0 ? (
          <p style={{ color: "#64748b", padding: "1rem 0" }}>
            You haven't submitted any support requests yet.
          </p>
        ) : (
          <div className="account-list">
            {tickets.map((ticket) => (
              <article
                key={ticket.ticketId || ticket._id}
                className="account-receipt-row"
              >
                <div>
                  <h3>{ticket.subject || ticket.categoryLabel}</h3>
                  <p>
                    {ticket.ticketId}
                    {ticket.relatedOrderId
                      ? ` · Order #${ticket.relatedOrderId}`
                      : ""}{" "}
                    · {new Date(ticket.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`account-status ${
                    ticket.status === "Resolved"
                      ? "account-status--delivered"
                      : "account-status--pending"
                  }`}
                >
                  {ticket.status}
                </span>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

