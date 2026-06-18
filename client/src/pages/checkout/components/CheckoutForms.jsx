import { CheckoutField } from "./CheckoutField";
import { deliveryOptions, paymentOptions } from "../const";

export function ContactForm({
  onContinue,
  formData,
  updateField,
  errors = {},
}) {
  return (
    <div className="checkout-form">
      <div className="checkout-form__grid checkout-form__grid--half">
        <CheckoutField
          label="First name"
          placeholder="Denys"
          value={formData.firstName}
          onChange={(e) => updateField("firstName", e.target.value)}
          error={errors.firstName}
        />
        <CheckoutField
          label="Last name"
          placeholder="Korzhyk"
          value={formData.lastName}
          onChange={(e) => updateField("lastName", e.target.value)}
          error={errors.lastName}
        />
      </div>
      <div className="checkout-form__grid checkout-form__grid--half">
        <CheckoutField
          label="Phone number"
          placeholder="+38 (067) 573-57-30"
          value={formData.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          error={errors.phone}
        />
        <CheckoutField
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => updateField("email", e.target.value)}
          error={errors.email}
        />
      </div>

      <div>
        <p className="checkout-form__subtitle">Order recipient</p>
        <div className="checkout-form__grid checkout-form__grid--half">
          <label className="checkout-toggle">
            <input
              type="radio"
              name="recipient"
              checked={formData.recipientType === "me"}
              onChange={() => updateField("recipientType", "me")}
              className="checkout-toggle__input"
            />
            I am the recipient
          </label>
          <label className="checkout-toggle">
            <input
              type="radio"
              name="recipient"
              checked={formData.recipientType === "other"}
              onChange={() => updateField("recipientType", "other")}
              className="checkout-toggle__input"
            />
            Another recipient
          </label>
        </div>
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="checkout-button checkout-button--primary"
      >
        Continue
      </button>
    </div>
  );
}

export function DeliveryForm({
  onContinue,
  formData,
  updateField,
  errors = {},
}) {
  return (
    <div className="checkout-form checkout-form--spaced">
      <div className="checkout-form__grid checkout-form__grid--half">
        <CheckoutField
          label="Delivery address"
          placeholder="Street, building, apartment"
          className="checkout-form__wide"
          value={formData.address}
          onChange={(e) => updateField("address", e.target.value)}
          error={errors.address}
        />
        <CheckoutField
          label="City"
          placeholder="Kyiv"
          value={formData.city}
          onChange={(e) => updateField("city", e.target.value)}
          error={errors.city}
        />
        <CheckoutField
          label="Entrance / floor"
          placeholder="Entrance 2, floor 6"
          value={formData.entrance}
          onChange={(e) => updateField("entrance", e.target.value)}
        />
      </div>

      <div className="checkout-form__grid checkout-form__grid--stacked">
        {deliveryOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => updateField("deliveryMethod", option.id)}
            className={`checkout-option ${
              formData.deliveryMethod === option.id
                ? "checkout-option--selected"
                : "checkout-option--default"
            }`}
          >
            <div>
              <h3 className="checkout-option__title">{option.title}</h3>
              <p className="checkout-option__description">
                {option.description}
              </p>
            </div>
            <span className="checkout-option__meta">{option.meta}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="checkout-button checkout-button--primary"
      >
        Continue
      </button>
    </div>
  );
}

export function DetailsForm({ onContinue, formData, updateField }) {
  const togglePreference = (pref) => {
    const prefs = formData.deliveryPreferences;
    const newPrefs = prefs.includes(pref)
      ? prefs.filter((p) => p !== pref)
      : [...prefs, pref];
    updateField("deliveryPreferences", newPrefs);
  };

  return (
    <div className="checkout-form">
      <label className="checkout-field checkout-field--textarea">
        <span className="checkout-field__label">Order notes</span>
        <textarea
          rows={4}
          placeholder="Gate code, leave at door, no onion, extra napkins..."
          className="checkout-textarea"
          value={formData.notes}
          onChange={(e) => updateField("notes", e.target.value)}
        />
      </label>

      <div className="checkout-form__grid checkout-form__grid--stacked">
        {["Add cutlery", "Call before arrival"].map((label) => (
          <label key={label} className="checkout-toggle">
            <input
              type="checkbox"
              className="checkout-toggle__input"
              checked={formData.deliveryPreferences.includes(label)}
              onChange={() => togglePreference(label)}
            />
            {label}
          </label>
        ))}
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="checkout-button checkout-button--primary"
      >
        Continue
      </button>
    </div>
  );
}

export function PaymentForm({ formData, updateField }) {
  return (
    <div className="checkout-form">
      <div className="checkout-form__grid checkout-form__grid--row-gap">
        {paymentOptions.map((option) => (
          <label
            key={option}
            className="checkout-toggle checkout-toggle--payment"
          >
            <input
              type="radio"
              name="payment"
              checked={formData.paymentMethod === option}
              onChange={() => updateField("paymentMethod", option)}
              className="checkout-toggle__input"
            />
            {option}
          </label>
        ))}
      </div>

      {formData.paymentMethod === "Credit / Debit Card" && (
        <div className="checkout-form__grid checkout-form__grid--half">
          <CheckoutField
            label="Card number"
            placeholder="1234 5678 9012 3456"
            className="checkout-form__wide"
          />
          <CheckoutField label="Expiry date" placeholder="MM / YY" />
          <CheckoutField label="CVC" placeholder="123" />
        </div>
      )}
    </div>
  );
}
