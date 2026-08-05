import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActionLink, SquarePenIcon } from "./AccountActions";
import { StudentDiscountPanel } from "../studentDiscount/StudentDiscountPanel";

const GOOGLE_PAY_METHOD = {
  id: "google-pay",
  type: "Wallet",
  label: "Google Pay",
  maskedInfo: "Connected",
  isDefault: false,
};

const ensureGooglePay = (payments) => {
  if (payments.some((payment) => payment.id === GOOGLE_PAY_METHOD.id)) {
    return payments;
  }

  return [...payments, GOOGLE_PAY_METHOD];
};

export function PaymentsSection({
  payments,
  promoCodes,
  receipts,
  user,
  activeTab,
  onTabChange,
  verificationState,
}) {
  const { t } = useTranslation();
  const [paymentMethods, setPaymentMethods] = useState(() =>
    ensureGooglePay(payments),
  );
  const [managedMethodId, setManagedMethodId] = useState("");
  const [removeMethodId, setRemoveMethodId] = useState("");
  const [isAddMethodOpen, setIsAddMethodOpen] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromoCode, setAppliedPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState("");

  const managedMethod = paymentMethods.find(
    (method) => method.id === managedMethodId,
  );
  const removeMethod = paymentMethods.find(
    (method) => method.id === removeMethodId,
  );

  const visiblePromoCodes = useMemo(
    () =>
      promoCodes.map((promo) =>
        promo.code === appliedPromoCode
          ? { ...promo, status: "applied", validUntil: "Applied" }
          : promo,
      ),
    [appliedPromoCode, promoCodes],
  );

  const setDefaultMethod = (methodId) => {
    setPaymentMethods((currentMethods) =>
      currentMethods.map((method) => ({
        ...method,
        isDefault: method.id === methodId,
      })),
    );
    setManagedMethodId("");
  };

  const removePaymentMethod = () => {
    setPaymentMethods((currentMethods) => {
      const nextMethods = currentMethods.filter(
        (method) => method.id !== removeMethodId,
      );
      const removedDefault = currentMethods.find(
        (method) => method.id === removeMethodId,
      )?.isDefault;

      if (!removedDefault || nextMethods.length === 0) return nextMethods;

      return nextMethods.map((method, index) => ({
        ...method,
        isDefault: index === 0,
      }));
    });
    setRemoveMethodId("");
    setManagedMethodId("");
  };

  const addMockMethod = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const makeDefault = formData.get("makeDefault") === "on";
    const nextMethod = {
      id: `card-${Date.now()}`,
      type: "Card",
      label: "Card ending in 2222",
      maskedInfo: "**** 2222",
      isDefault: makeDefault || paymentMethods.length === 0,
    };

    setPaymentMethods((currentMethods) => {
      const methods = makeDefault
        ? currentMethods.map((method) => ({ ...method, isDefault: false }))
        : currentMethods;
      return [...methods, nextMethod];
    });
    setIsAddMethodOpen(false);
  };

  const applyPromo = (promo) => {
    if (promo.status === "expired") return;
    if (promo.status === "applied") {
      setAppliedPromoCode("");
      setPromoMessage("Promo code removed.");
      return;
    }
    setAppliedPromoCode(promo.code);
    setPromoMessage("Promo code applied.");
  };

  const applyManualPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    if (code === "SAVE15" || code === "STUDENT15") {
      setAppliedPromoCode(code === "SAVE15" ? "" : code);
      setPromoMessage("Promo code applied.");
      setPromoInput("");
      return;
    }

    setPromoMessage("This promo code is not valid.");
  };

  const handleTabKeyDown = (event) => {
    const tabs = ["payment-methods", "student-discount"];
    const currentIndex = tabs.indexOf(activeTab);
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
    else if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = tabs.length - 1;
    else return;

    event.preventDefault();
    const nextTab = tabs[nextIndex];
    onTabChange(nextTab);
    requestAnimationFrame(() => document.getElementById(`${nextTab}-tab`)?.focus());
  };

  return (
    <div className="account-section">
      <section className="account-page-heading">
        <span className="account-eyebrow">{t("studentDiscount.page.eyebrow")}</span>
        <h1>{t("studentDiscount.page.title")}</h1>
        <p>{t("studentDiscount.page.description")}</p>
        <div className="account-payments-tabs" role="tablist" aria-label={t("studentDiscount.tabs.label")}>
          <button
            id="payment-methods-tab"
            type="button"
            role="tab"
            aria-selected={activeTab === "payment-methods"}
            aria-controls="payment-methods-panel"
            tabIndex={activeTab === "payment-methods" ? 0 : -1}
            onClick={() => onTabChange("payment-methods")}
            onKeyDown={handleTabKeyDown}
          >
            {t("studentDiscount.tabs.paymentMethods")}
          </button>
          <button
            id="student-discount-tab"
            type="button"
            role="tab"
            aria-selected={activeTab === "student-discount"}
            aria-controls="student-discount-panel"
            tabIndex={activeTab === "student-discount" ? 0 : -1}
            onClick={() => onTabChange("student-discount")}
            onKeyDown={handleTabKeyDown}
          >
            {t("studentDiscount.tabs.studentDiscount")}
          </button>
        </div>
      </section>

      {activeTab === "student-discount" ? (
        <StudentDiscountPanel user={user} verificationState={verificationState} />
      ) : (
        <div id="payment-methods-panel" role="tabpanel" aria-labelledby="payment-methods-tab" className="account-payment-methods-content">
      <div className="account-payment-methods-layout">
        <section className="account-card account-payments-card">
          <div className="account-card__header">
            <div>
              <span className="account-eyebrow">Payment methods</span>
              <h2>Saved methods</h2>
            </div>
            <ActionLink onClick={() => setIsAddMethodOpen(true)}>
              Add Payment Method
            </ActionLink>
          </div>

          {paymentMethods.length > 0 ? (
            <div className="account-list">
              {paymentMethods.map((payment) => (
                <article key={payment.id} className="account-payment-card">
                  <div>
                    <div className="account-payment-card__title">
                      <h3>{payment.label}</h3>
                      {payment.isDefault && (
                        <span className="account-pill">Default</span>
                      )}
                    </div>
                    <p>{payment.maskedInfo}</p>
                  </div>
                  <button
                    type="button"
                    className="account-payment-manage-button"
                    aria-label={`Manage ${payment.label}`}
                    onClick={() => setManagedMethodId(payment.id)}
                  >
                    <span className="account-payment-manage-button__icon">
                      <SquarePenIcon />
                    </span>
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="account-empty-state">
              <h3>No payment methods yet</h3>
              <p>Add a payment method for faster checkout.</p>
              <button
                type="button"
                className="account-button account-button--primary"
                onClick={() => setIsAddMethodOpen(true)}
              >
                Add Payment Method
              </button>
            </div>
          )}
        </section>

      </div>

      <div className="account-two-column">
        <section className="account-card account-promos-card">
          <div className="account-card__header">
            <div>
              <span className="account-eyebrow">Promo codes</span>
              <h2>Available discounts</h2>
              <p>Apply available promo codes or enter your own code.</p>
            </div>
          </div>
          {visiblePromoCodes.length > 0 ? (
            <div className="account-list">
              {visiblePromoCodes.map((promo) => {
                const isExpired = promo.status === "expired";
                const isApplied = promo.status === "applied";
                return (
                  <article
                    key={promo.code}
                    className={`account-promo-card account-promo-card--${promo.status}`}
                  >
                    <div>
                      <h3>{promo.code}</h3>
                      <p>{promo.description}</p>
                      <span>
                        {isExpired
                          ? "Expired"
                          : isApplied
                            ? "Applied"
                            : `Valid until ${promo.validUntil}`}
                      </span>
                    </div>
                    <button
                      type="button"
                      disabled={isExpired}
                      onClick={() => applyPromo(promo)}
                    >
                      {isApplied ? "Remove" : "Apply"}
                    </button>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="account-empty-state">
              <h3>No available promo codes right now</h3>
              <p>Check back later for new discounts.</p>
            </div>
          )}
          <div className="account-inline-form">
            <input
              value={promoInput}
              placeholder="Enter promo code"
              onChange={(event) => setPromoInput(event.target.value)}
            />
            <button
              type="button"
              className="account-button account-button--primary"
              disabled={!promoInput.trim()}
              onClick={applyManualPromo}
            >
              Apply Code
            </button>
          </div>
          {promoMessage && (
            <p className="account-settings-note">{promoMessage}</p>
          )}
        </section>

        <section className="account-card account-receipts-card">
          <div className="account-card__header">
            <div>
              <span className="account-eyebrow">Receipts</span>
              <h2>Previous receipts</h2>
              <p>Download receipts from your completed paid orders.</p>
            </div>
          </div>
          {receipts.length > 0 ? (
            <div className="account-list">
              {receipts.map((receipt) => (
                <article key={receipt.id} className="account-receipt-row">
                  <div>
                    <h3>Order #{receipt.id}</h3>
                    <p>
                      {receipt.restaurantName} - {receipt.date} - $
                      {receipt.total.toFixed(2)}
                    </p>
                  </div>
                  <ActionLink>Download</ActionLink>
                </article>
              ))}
            </div>
          ) : (
            <div className="account-empty-state">
              <h3>No receipts yet</h3>
              <p>Receipts from completed paid orders will appear here.</p>
            </div>
          )}
        </section>
      </div>

      {managedMethod && (
        <div className="account-modal" role="dialog" aria-modal="true">
          <div className="account-modal__panel account-payment-modal">
            <h2>Manage {managedMethod.label}</h2>
            <p>{managedMethod.maskedInfo}</p>
            <div className="account-settings-list">
              <button type="button">
                {managedMethod.type === "Wallet"
                  ? "Manage connection"
                  : "Edit details"}
              </button>
              {!managedMethod.isDefault && (
                <button
                  type="button"
                  onClick={() => setDefaultMethod(managedMethod.id)}
                >
                  Set as default
                </button>
              )}
              <button
                type="button"
                className="account-payment-modal__danger"
                onClick={() => {
                  setRemoveMethodId(managedMethod.id);
                  setManagedMethodId("");
                }}
              >
                Remove method
              </button>
            </div>
            <div className="account-actions-row">
              <button
                type="button"
                className="account-button account-button--secondary"
                onClick={() => setManagedMethodId("")}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {removeMethod && (
        <div className="account-modal" role="dialog" aria-modal="true">
          <div className="account-modal__panel">
            <h2>Remove this payment method?</h2>
            <p>You can add it again later.</p>
            <div className="account-actions-row">
              <button
                type="button"
                className="account-button account-button--secondary"
                onClick={() => setRemoveMethodId("")}
              >
                Cancel
              </button>
              <button
                type="button"
                className="account-button account-button--danger"
                onClick={removePaymentMethod}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddMethodOpen && (
        <div className="account-modal" role="dialog" aria-modal="true">
          <form className="account-modal__panel account-password-form" onSubmit={addMockMethod}>
            <h2>Add payment method</h2>
            <input placeholder="Card number" />
            <input placeholder="Cardholder name" />
            <input placeholder="Expiration date" />
            <input placeholder="CVV" />
            <label className="account-check-row">
              <input type="checkbox" name="makeDefault" />
              Make this my default payment method
            </label>
            <div className="account-actions-row">
              <button
                type="button"
                className="account-button account-button--secondary"
                onClick={() => setIsAddMethodOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="account-button account-button--primary">
                Add Method
              </button>
            </div>
          </form>
        </div>
      )}
        </div>
      )}
    </div>
  );
}
