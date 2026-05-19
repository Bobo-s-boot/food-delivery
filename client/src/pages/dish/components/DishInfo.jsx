import { useState } from "react";
import { COMBO_ADD_ONS, CUSTOMIZATION_GROUPS } from "../const";
import { calculateDishOrderTotal } from "../dishUtils";

export function DishInfo({ dish, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({
    patty: "single",
    cheese: "aged-cheddar",
    sauce: "truffle-mayo",
  });
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [openSections, setOpenSections] = useState({
    customize: false,
    combo: false,
  });

  const decrease = () => setQuantity((value) => Math.max(1, value - 1));
  const increase = () => setQuantity((value) => value + 1);
  const selectedOptionObjects = CUSTOMIZATION_GROUPS.map((group) =>
    group.options.find((option) => option.id === selectedOptions[group.id]),
  ).filter(Boolean);
  const selectedAddOnObjects = COMBO_ADD_ONS.filter((addOn) =>
    selectedAddOns.includes(addOn.id),
  );
  const orderTotal = calculateDishOrderTotal({
    basePrice: dish.price,
    quantity,
    optionPrices: selectedOptionObjects.map((option) => option.price),
    addOnPrices: selectedAddOnObjects.map((addOn) => addOn.price),
  });

  const toggleAddOn = (id) => {
    setSelectedAddOns((items) =>
      items.includes(id) ? items.filter((item) => item !== id) : [...items, id],
    );
  };
  const toggleSection = (section) => {
    setOpenSections((sections) => ({
      ...sections,
      [section]: !sections[section],
    }));
  };

  return (
    <section className="sticky top-24 flex h-full min-h-[620px] flex-col rounded-[28px] border border-[#E1E7F0] bg-white p-6 shadow-[0_16px_40px_rgba(7,20,38,0.06)] md:p-8">
      <div>
        <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-[#8A96A8]">
          {dish.restaurant}
        </p>
        <h1 className="mt-2 text-[40px] font-medium leading-[1.05] tracking-[-0.04em] text-[#071426] md:text-[52px]">
          {dish.name}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-[#6B7890]">
          <span className="rounded-full bg-[#EAF24D] px-3 py-1.5 font-semibold text-[#071426]">
            {dish.rating.toFixed(1)} ★
          </span>
          <span className="rounded-full border border-[#E1E7F0] bg-[#F5F7FA] px-3 py-1.5">
            {dish.reviews} reviews
          </span>
          <span className="rounded-full border border-[#E1E7F0] bg-[#F5F7FA] px-3 py-1.5">
            25-35 min
          </span>
          {dish.weight && (
            <span className="rounded-full border border-[#E1E7F0] bg-[#F5F7FA] px-3 py-1.5">
              {dish.weight}
            </span>
          )}
          {dish.calories && (
            <span className="rounded-full border border-[#E1E7F0] bg-[#F5F7FA] px-3 py-1.5">
              {dish.calories}
            </span>
          )}
        </div>

        <p className="mt-5 text-base leading-[150%] text-[#39445A]">
          Black Angus beef patty with aged cheddar, smoked bacon, fresh lettuce,
          pickles, tomato, red onion and creamy truffle mayo in a toasted
          brioche bun.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-[#EAF24D] px-3 py-1.5 text-sm font-medium text-[#071426]">
            Bestseller
          </span>
          <span className="rounded-full bg-[#EDF4D8] px-3 py-1.5 text-sm font-medium text-[#071426]">
            Student deal
          </span>
          <span className="rounded-full border border-[#E1E7F0] bg-[#F5F7FA] px-3 py-1.5 text-sm font-medium text-[#071426]">
            Packed for delivery
          </span>
        </div>
      </div>

      <div className="mt-7 grid gap-3 border-t border-[#E1E7F0] pt-5">
        <section className="overflow-hidden rounded-[24px] border border-[#E1E7F0] bg-white">
          <button
            type="button"
            onClick={() => toggleSection("customize")}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-[#F8FAFC]"
          >
            <span>
              <span className="block text-base font-semibold tracking-[-0.02em] text-[#071426]">
                Customize your burger
              </span>
              <span className="mt-1 block text-sm text-[#8A96A8]">
                Patty, cheese and sauce preferences
              </span>
            </span>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F5F7FA] text-xl font-medium text-[#071426]">
              {openSections.customize ? "-" : "+"}
            </span>
          </button>

          {openSections.customize && (
            <div className="grid gap-4 border-t border-[#E1E7F0] px-5 py-4">
              {CUSTOMIZATION_GROUPS.map((group) => (
                <div key={group.id}>
                  <p className="mb-2 text-sm font-medium text-[#6B7890]">
                    {group.title}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.options.map((option) => {
                      const isSelected =
                        selectedOptions[group.id] === option.id;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() =>
                            setSelectedOptions((values) => ({
                              ...values,
                              [group.id]: option.id,
                            }))
                          }
                          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                            isSelected
                              ? "border-[#071426] bg-[#071426] text-white"
                              : "border-[#E1E7F0] bg-[#F5F7FA] text-[#071426] hover:border-[#071426]"
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-[24px] border border-[#E1E7F0] bg-white">
          <button
            type="button"
            onClick={() => toggleSection("combo")}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-[#F8FAFC]"
          >
            <span>
              <span className="block text-base font-semibold tracking-[-0.02em] text-[#071426]">
                Make it a combo
              </span>
              <span className="mt-1 block text-sm text-[#8A96A8]">
                Add fries, drink or wings if you want
              </span>
            </span>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F5F7FA] text-xl font-medium text-[#071426]">
              {openSections.combo ? "-" : "+"}
            </span>
          </button>

          {openSections.combo && (
            <div className="grid gap-2 border-t border-[#E1E7F0] bg-[#F8FAFC] px-5 py-4">
              {COMBO_ADD_ONS.map((addOn) => {
                const isSelected = selectedAddOns.includes(addOn.id);

                return (
                  <label
                    key={addOn.id}
                    className={`flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 text-sm transition ${
                      isSelected
                        ? "border-[#071426] bg-white shadow-sm"
                        : "border-[#E1E7F0] bg-white/80 hover:border-[#071426]"
                    }`}
                  >
                    <span className="flex items-center gap-3 font-medium text-[#071426]">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleAddOn(addOn.id)}
                        className="h-4 w-4 accent-[#071426]"
                      />
                      {addOn.label}
                    </span>
                    <span className="text-[#6B7890]">
                      +${addOn.price.toFixed(2)}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <div className="mt-auto pt-7">
        <div className="mb-5 flex w-full items-center justify-between gap-6 border-y border-[#E1E7F0] py-4">
          <span className="text-xl font-semibold uppercase tracking-[0.08em] text-[#071426]">
            {quantity > 1 ? "CURRENT TOTAL" : "REGULAR PRICE"}
          </span>
          <span className="text-[36px] font-semibold leading-none tracking-[-0.04em] text-[#071426]">
            ${orderTotal.toFixed(2)}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-[160px_1fr]">
          <div className="flex h-16 items-center overflow-hidden rounded-full border border-[#D8DDE7] bg-white">
            <button
              type="button"
              onClick={decrease}
              className="flex h-16 w-13 items-center justify-center text-xl text-[#071426] transition hover:bg-[#EEF2F7]"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="flex h-16 min-w-13 flex-1 items-center justify-center border-x border-[#D8DDE7] text-lg font-semibold text-[#071426]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={increase}
              className="flex h-16 w-13 items-center justify-center text-xl text-[#071426] transition hover:bg-[#EEF2F7]"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={() =>
              onAddToCart({
                quantity,
                unitPrice: orderTotal / quantity,
                selectedOptions: selectedOptionObjects,
                selectedAddOns: selectedAddOnObjects,
              })
            }
            className="h-16 rounded-full bg-[#071426] px-7 text-lg font-semibold text-white transition hover:bg-black"
          >
            Add to cart
          </button>
        </div>

      </div>
    </section>
  );
}
