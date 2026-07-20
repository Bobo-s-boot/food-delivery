import { useState } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { CheckoutField } from "./CheckoutField";
import { deliveryOptions, paymentOptions } from "../const";

// Базовые стили для текста внутри защищенных iframe-полей Stripe.
// Подстрой цвета (например, color и placeholder) под тему твоего сайта.
const STRIPE_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#1f2937", // серый текст (gray-800)
      fontFamily: "ui-sans-serif, system-ui, sans-serif",
      "::placeholder": {
        color: "#9ca3af", // цвет плейсхолдера (gray-400)
      },
    },
    invalid: {
      color: "#ef4444", // красный цвет при ошибке ввода
    },
  },
};

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
          type="name"
          placeholder="Denys"
          value={formData.firstName}
          onChange={(e) => updateField("firstName", e.target.value)}
          error={errors.firstName}
        />

        <CheckoutField
          label="Last name"
          type="lastName"
          placeholder="Korzhyk"
          value={formData.lastName}
          onChange={(e) => updateField("lastName", e.target.value)}
          error={errors.lastName}
        />
      </div>

      <div className="checkout-form__grid checkout-form__grid--half">
        <CheckoutField
          label="Phone number"
          type="tel"
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

// Изменили PaymentForm: добавили обработку платежа и интеграцию со Stripe
export function PaymentForm({
  formData,
  updateField,
  totalAmount,
  onPaymentSuccess,
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    // Если выбран метод оплаты "Наличными" или любой другой, кроме Карты
    if (formData.paymentMethod !== "Credit / Debit Card") {
      // Сразу подтверждаем заказ (передаем статус наверх родительскому компоненту)
      onPaymentSuccess({ status: "cash_on_delivery" });
      return;
    }

    if (!stripe || !elements) {
      return; // Stripe еще не инициализировался
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      // 1. Делаем запрос к твоему Node.js серверу на создание PaymentIntent
      const response = await fetch(
        "http://localhost:5000/api/stripe/create-payment-intent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: totalAmount }),
        },
      );

      const { clientSecret, error: backendError } = await response.json();

      if (backendError) {
        throw new Error(backendError);
      }

      // 2. Подтверждаем транзакцию через форму Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
          },
        },
      });

      if (result.error) {
        // Stripe вернул ошибку карты (например, отклонена банком)
        setErrorMessage(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        // Успешная оплата картой!
        onPaymentSuccess(result.paymentIntent);
      }
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong during payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handlePaymentSubmit} className="checkout-form">
      {/* Селектор платежных систем */}
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

      {/* Если выбрана карта — рендерим защищенные элементы Stripe */}
      {formData.paymentMethod === "Credit / Debit Card" && (
        <div className="checkout-form__grid checkout-form__grid--half">
          {/* Поле Номера карты */}
          <div className="checkout-field checkout-form__wide">
            <span className="checkout-field__label">Card number</span>
            <div className="checkout-stripe-input">
              <CardNumberElement options={STRIPE_ELEMENT_OPTIONS} />
            </div>
          </div>

          {/* Поле Срока действия */}
          <div className="checkout-field">
            <span className="checkout-field__label">Expiry date</span>
            <div className="checkout-stripe-input">
              <CardExpiryElement options={STRIPE_ELEMENT_OPTIONS} />
            </div>
          </div>

          {/* Поле CVC */}
          <div className="checkout-field">
            <span className="checkout-field__label">CVC</span>
            <div className="checkout-stripe-input">
              <CardCvcElement options={STRIPE_ELEMENT_OPTIONS} />
            </div>
          </div>
        </div>
      )}

      {/* Ошибки валидации карты */}
      {errorMessage && (
        <div
          className="checkout-form__error"
          style={{ color: "#ef4444", marginTop: "1rem" }}
        >
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Финальная кнопка отправки формы */}
      <button
        type="submit"
        disabled={
          isProcessing ||
          (formData.paymentMethod === "Credit / Debit Card" && !stripe)
        }
        className="checkout-button checkout-button--primary"
        style={{ marginTop: "1.5rem" }}
      >
        {isProcessing ? "Processing..." : "Place Order"}
      </button>
    </form>
  );
}
