import { useState } from "react";
import { checkoutSteps } from "./const";
import { CheckoutStep } from "./components/CheckoutStep";
import {
  ContactForm,
  DeliveryForm,
  DetailsForm,
  PaymentForm,
} from "./components/CheckoutForms";
import { CheckoutOrderSummary } from "./components/CheckoutOrderSummary";
import { useCart } from "../../features/cart/useCart";
import "./Checkout.scss";
import axios from "axios";

// --- ИМПОРТЫ ДЛЯ STRIPE ---
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// Инициализируем Stripe с твоим публичным ключом из .env
const stripePromise = loadStripe(import.meta.env.VITE_API_STRIPE_PUBLISHER_KEY);

export function Checkout() {
  const { items, totals, clearCart } = useCart();
  const [activeStep, setActiveStep] = useState("contact");
  const [completedSteps, setCompletedSteps] = useState([]);
  const [errors, setErrors] = useState({});
  const [isOrdered, setIsOrdered] = useState(false); // Стейт для успешного завершения заказа

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    recipientType: "me",
    address: "",
    city: "",
    entrance: "",
    deliveryMethod: "delivery",
    notes: "",
    deliveryPreferences: [],
    paymentMethod: "Credit / Debit Card",
  });

  const totalAmount = Math.round((totals?.total ?? 0) * 100);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateAll = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\+?[0-9\s()\\-]+$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number format";
    }

    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep = (stepId) => {
    const newErrors = { ...errors };
    let isValid = true;

    if (stepId === "contact") {
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required";
        isValid = false;
      } else delete newErrors.firstName;

      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required";
        isValid = false;
      } else delete newErrors.lastName;

      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
        isValid = false;
      } else if (!/^\+?[0-9\s()\\-]+$/.test(formData.phone)) {
        newErrors.phone = "Invalid phone number format";
        isValid = false;
      } else delete newErrors.phone;
    } else if (stepId === "delivery") {
      if (!formData.address.trim()) {
        newErrors.address = "Address is required";
        isValid = false;
      } else delete newErrors.address;

      if (!formData.city.trim()) {
        newErrors.city = "City is required";
        isValid = false;
      } else delete newErrors.city;
    }

    setErrors(newErrors);
    return isValid;
  };

  const completeAndOpen = (currentStep, nextStep) => {
    if (!validateStep(currentStep)) return;

    setCompletedSteps((steps) =>
      steps.includes(currentStep) ? steps : [...steps, currentStep],
    );
    setActiveStep(nextStep);
  };

  // --- ОБРАБОТЧИК УСПЕШНОГО ПЛАТЕЖА И ОТПРАВКИ ЗАКАЗА ---
  const handlePaymentSuccess = async (paymentDetails) => {
    let orderPayload = null;

    try {
      console.log("Сырые товары в корзине (items):", items);

      orderPayload = {
        customerName: `${formData.firstName} ${formData.lastName}`.trim(),
        customerPhone: formData.phone,
        // Подстраховка: если email пустой, отправляем хотя бы заглушку, чтобы пройти валидатор
        customerEmail: formData.email || "no-email@test.com",
        address: `${formData.city}, ${formData.address}${
          formData.entrance ? `, ${formData.entrance}` : ""
        }`,
        notes: formData.notes,
        deliveryPreferences: formData.deliveryPreferences,
        paymentMethod: formData.paymentMethod,
        paymentStatus:
          paymentDetails.status === "succeeded"
            ? "paid"
            : paymentDetails.status || "pending",
        stripePaymentIntentId: paymentDetails.id || null,
        deliveryMethod: formData.deliveryMethod,
        totalPrice: Number((totals?.total ?? 0).toFixed(2)),

        items: items.map((item) => {
          // 1. Берем сырой ID со склейкой
          const rawId = String(item.id || item._id || item.foodId);
          // 2. Отрезаем всё, что идет после дефиса (оставляем только '11' вместо '11-Single...')
          const realFoodId = rawId.includes("-") ? rawId.split("-")[0] : rawId;

          return {
            id: realFoodId, // Теперь тут будет чистое число/строка ID
            _id: realFoodId, // Дублируем для MongoDB
            name: item.name,
            quantity: Number(item.quantity),
            price: Number(item.price),
            // Оставляем как есть, либо поменяй на жесткий ID, если сервер ждет цифру
            restaurantId: item.restaurantId || item.restaurant || null,
          };
        }),
      };

      console.log("Финальный Payload, улетающий на бэкенд:", orderPayload);

      const response = await axios.post("http://localhost:5000/api/orders", {
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Failed to save order on the server");
      }

      console.log("Order saved successfully in backend database:", data);

      clearCart();
      setIsOrdered(true);
    } catch (error) {
      console.error("Error saving order:", error);

      alert(
        `Оплата прошла успешно, но бэкенд отклонил заказ!\n\n` +
          `Сообщение от сервера: ${error.message}\n\n` +
          `Вот что мы фактически отправили в items:\n` +
          JSON.stringify(orderPayload?.items, null, 2),
      );
    }
  };

  const renderStepContent = (stepId) => {
    if (stepId === "contact") {
      return (
        <ContactForm
          onContinue={() => completeAndOpen("contact", "delivery")}
          formData={formData}
          updateField={updateField}
          errors={errors}
        />
      );
    }

    if (stepId === "delivery") {
      return (
        <DeliveryForm
          onContinue={() => completeAndOpen("delivery", "details")}
          formData={formData}
          updateField={updateField}
          errors={errors}
        />
      );
    }

    if (stepId === "details") {
      return (
        <DetailsForm
          onContinue={() => completeAndOpen("details", "payment")}
          formData={formData}
          updateField={updateField}
        />
      );
    }

    // --- ОБОРАЧИВАЕМ ПОСЛЕДНИЙ ШАГ ОПЛАТЫ В ELEMENTS ---
    if (stepId === "payment") {
      return (
        <Elements stripe={stripePromise}>
          <PaymentForm
            formData={formData}
            updateField={updateField}
            totalAmount={totalAmount}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </Elements>
      );
    }

    return null;
  };

  // Экран успешного оформления заказа
  if (isOrdered) {
    return (
      <div
        className="checkout-success"
        style={{ textAlign: "center", padding: "4rem 2rem" }}
      >
        <span style={{ fontSize: "5rem" }}>🎉</span>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            margin: "1.5rem 0 0.5rem",
          }}
        >
          Thank you for your order!
        </h1>
        <p style={{ color: "#6b7280" }}>
          We've received your payment and are already preparing your food.
        </p>
      </div>
    );
  }

  return (
    <div className="checkout">
      <div className="checkout__container">
        <div>
          <div className="checkout__heading">
            <h1 className="checkout__title">Complete your order</h1>
          </div>

          <div className="checkout__steps">
            {checkoutSteps.map((step) => (
              <CheckoutStep
                key={step.id}
                step={step}
                isActive={activeStep === step.id}
                isComplete={completedSteps.includes(step.id)}
                onToggle={() => setActiveStep(step.id)}
              >
                {renderStepContent(step.id)}
              </CheckoutStep>
            ))}
          </div>
        </div>

        <CheckoutOrderSummary
          formData={formData}
          validateAll={validateAll}
          setErrors={setErrors}
          onContinueToPayment={() => {
            if (!validateAll()) {
              return;
            }

            setCompletedSteps((steps) =>
              steps.includes("details") ? steps : [...steps, "details"],
            );
            setActiveStep("payment");
          }}
        />
      </div>
    </div>
  );
}
