import { CheckoutField } from "./CheckoutField";
import { deliveryOptions, paymentOptions } from "../const";

export function ContactForm({ onContinue }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <CheckoutField label="First name" placeholder="Denys" />
        <CheckoutField label="Last name" placeholder="Korzhyk" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <CheckoutField label="Phone number" placeholder="+38 (067) 573-57-30" />
        <CheckoutField
          label="Email"
          type="email"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-[#5F6878]">
          Отримувач замовлення
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="flex h-12 items-center gap-3 rounded-2xl border border-[#E8EAF0] px-4 text-sm font-medium text-[#0F1316]">
            <input
              type="radio"
              name="recipient"
              defaultChecked
              className="h-4 w-4 accent-[#0D1A2D]"
            />
            Я отримувач замовлення
          </label>
          <label className="flex h-12 items-center gap-3 rounded-2xl border border-[#E8EAF0] px-4 text-sm font-medium text-[#0F1316]">
            <input
              type="radio"
              name="recipient"
              className="h-4 w-4 accent-[#0D1A2D]"
            />
            Інший отримувач замовлення
          </label>
        </div>
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="h-12 rounded-full bg-[#0D1A2D] px-7 text-base font-medium text-white transition hover:bg-black"
      >
        Continue
      </button>
    </div>
  );
}

export function DeliveryForm({ selectedDelivery, onSelect, onContinue }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <CheckoutField
          label="Delivery address"
          placeholder="Street, building, apartment"
          className="md:col-span-2"
        />
        <CheckoutField label="City" placeholder="Kyiv" />
        <CheckoutField label="Entrance / floor" placeholder="Entrance 2, floor 6" />
      </div>

      <div className="grid gap-3">
        {deliveryOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            className={`flex items-center justify-between gap-4 rounded-3xl border p-4 text-left transition ${
              selectedDelivery === option.id
                ? "border-[#0D1A2D] bg-[#F8FAFC]"
                : "border-[#E8EAF0] hover:border-[#B7C0CE]"
            }`}
          >
            <div>
              <h3 className="text-base font-medium text-[#0F1316]">
                {option.title}
              </h3>
              <p className="mt-1 text-sm text-[#5F6878]">
                {option.description}
              </p>
            </div>
            <span className="rounded-full bg-[#EEF2F7] px-4 py-2 text-sm font-medium text-[#0D1A2D]">
              {option.meta}
            </span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="h-12 rounded-full bg-[#0D1A2D] px-7 text-base font-medium text-white transition hover:bg-black"
      >
        Continue
      </button>
    </div>
  );
}

export function DetailsForm({ onContinue }) {
  return (
    <div className="space-y-5">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-[#5F6878]">
          Order notes
        </span>
        <textarea
          rows={4}
          placeholder="Gate code, leave at door, no onion, extra napkins..."
          className="resize-none rounded-3xl border border-[#DDE2EB] bg-white px-4 py-3 text-base text-[#0F1316] outline-none transition placeholder:text-[#A3ACBA] focus:border-[#0D1A2D] focus:ring-4 focus:ring-[#0D1A2D]/10"
        />
      </label>

      <div className="grid gap-3 md:grid-cols-2">
        {["Add cutlery", "Call before arrival"].map((label) => (
          <label
            key={label}
            className="flex h-12 items-center gap-3 rounded-2xl border border-[#E8EAF0] px-4 text-sm font-medium text-[#0F1316]"
          >
            <input type="checkbox" className="h-4 w-4 accent-[#0D1A2D]" />
            {label}
          </label>
        ))}
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="h-12 rounded-full bg-[#0D1A2D] px-7 text-base font-medium text-white transition hover:bg-black"
      >
        Continue
      </button>
    </div>
  );
}

export function PaymentForm() {
  return (
    <div className="space-y-5">
      <div className="grid gap-3">
        {paymentOptions.map((option, index) => (
          <label
            key={option}
            className="flex h-13 items-center gap-3 rounded-2xl border border-[#E8EAF0] px-4 text-sm font-medium text-[#0F1316]"
          >
            <input
              type="radio"
              name="payment"
              defaultChecked={index === 0}
              className="h-4 w-4 accent-[#0D1A2D]"
            />
            {option}
          </label>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <CheckoutField
          label="Card number"
          placeholder="1234 5678 9012 3456"
          className="md:col-span-2"
        />
        <CheckoutField label="Expiry date" placeholder="MM / YY" />
        <CheckoutField label="CVC" placeholder="123" />
      </div>
    </div>
  );
}
