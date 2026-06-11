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
import "./Checkout.scss";

export function Checkout() {
  const [activeStep, setActiveStep] = useState("contact");
  const [completedSteps, setCompletedSteps] = useState([]);
  const [errors, setErrors] = useState({});
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

    return <PaymentForm formData={formData} updateField={updateField} />;
  };

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
        />
      </div>
    </div>
  );
}
