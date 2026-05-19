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
        <ContactForm onContinue={() => completeAndOpen("contact", "delivery")} />
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
    <div className="w-full bg-[#F6F7F9] px-4 py-8 font-['Inter'] md:px-8 md:py-10">
      <div className="mx-auto grid w-full max-w-430 gap-6 xl:grid-cols-[minmax(0,1fr)_520px]">
        <div>
          <div className="mb-8">
            <h1 className="text-4xl font-medium tracking-[-0.04em] text-[#0F1316] md:text-6xl">
              Complete your order
            </h1>
          </div>

          <div className="space-y-4">
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
