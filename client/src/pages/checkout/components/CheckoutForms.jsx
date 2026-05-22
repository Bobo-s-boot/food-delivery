import { CheckoutField } from "./CheckoutField";
import { deliveryOptions, paymentOptions } from "../const";

export function ContactForm({ onContinue }) {
  return (
    <div className="checkout-form">
      <div className="checkout-form__grid">
        <CheckoutField label="First name" placeholder="Denys" />
        <CheckoutField label="Last name" placeholder="Korzhyk" />
      </div>
      <div className="checkout-form__grid">
        <CheckoutField label="Phone number" placeholder="+38 (067) 573-57-30" />
        <CheckoutField
          label="Email"
          type="email"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <p className="checkout-form__subtitle">Отримувач замовлення</p>
        <div className="checkout-form__grid checkout-form__grid--half">
          <label className="checkout-toggle">
            <input
              type="radio"
              name="recipient"
              defaultChecked
              className="checkout-toggle__input"
            />
            Я отримувач замовлення
          </label>
          <label className="checkout-toggle">
            <input
              type="radio"
              name="recipient"
              className="checkout-toggle__input"
            />
            Інший отримувач замовлення
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

export function DeliveryForm({ selectedDelivery, onSelect, onContinue }) {
  return (
    <div className="checkout-form checkout-form--spaced">
      <div className="checkout-form__grid">
        <CheckoutField
          label="Delivery address"
          placeholder="Street, building, apartment"
          className="checkout-form__wide"
        />
        <CheckoutField label="City" placeholder="Kyiv" />
        <CheckoutField
          label="Entrance / floor"
          placeholder="Entrance 2, floor 6"
        />
      </div>

      <div className="checkout-form__grid checkout-form__grid--stacked">
        {deliveryOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            className={`checkout-option ${
              selectedDelivery === option.id
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

export function DetailsForm({ onContinue }) {
  return (
    <div className="checkout-form">
      <label className="checkout-field checkout-field--textarea">
        <span className="checkout-field__label">Order notes</span>
        <textarea
          rows={4}
          placeholder="Gate code, leave at door, no onion, extra napkins..."
          className="checkout-textarea"
        />
      </label>

      <div className="checkout-form__grid checkout-form__grid--stacked">
        {["Add cutlery", "Call before arrival"].map((label) => (
          <label key={label} className="checkout-toggle">
            <input type="checkbox" className="checkout-toggle__input" />
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

export function PaymentForm() {
  return (
    <div className="checkout-form">
      <div className="checkout-form__grid checkout-form__grid--row-gap">
        {paymentOptions.map((option, index) => (
          <label
            key={option}
            className="checkout-toggle checkout-toggle--radio"
          >
            <input
              type="radio"
              name="payment"
              defaultChecked={index === 0}
              className="checkout-toggle__input"
            />
            {option}
          </label>
        ))}
      </div>

      <div className="checkout-form__grid">
        <CheckoutField
          label="Card number"
          placeholder="1234 5678 9012 3456"
          className="checkout-form__wide"
        />
        <CheckoutField label="Expiry date" placeholder="MM / YY" />
        <CheckoutField label="CVC" placeholder="123" />
      </div>
    </div>
  );
}
