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
  const [selectedDelivery, setSelectedDelivery] = useState("pickup");

  const completeAndOpen = (currentStep, nextStep) => {
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
        />
      );
    }

    if (stepId === "delivery") {
      return (
        <DeliveryForm
          selectedDelivery={selectedDelivery}
          onSelect={setSelectedDelivery}
          onContinue={() => completeAndOpen("delivery", "details")}
        />
      );
    }

    if (stepId === "details") {
      return (
        <DetailsForm onContinue={() => completeAndOpen("details", "payment")} />
      );
    }

    return <PaymentForm />;
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

        <CheckoutOrderSummary />
      </div>
    </div>
  );
}
