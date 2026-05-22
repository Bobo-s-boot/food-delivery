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
    <section className="dish-info">
      <div className="dish-info__head">
        <p className="dish-info__restaurant">{dish.restaurant}</p>
        <h1 className="dish-info__title">{dish.name}</h1>

        <div className="dish-info__tags">
          <span className="dish-tag dish-tag--highlight">{dish.rating.toFixed(1)} ★</span>
          <span className="dish-tag dish-tag--pill">{dish.reviews} reviews</span>
          <span className="dish-tag dish-tag--pill">25-35 min</span>
          {dish.weight && <span className="dish-tag dish-tag--pill">{dish.weight}</span>}
          {dish.calories && <span className="dish-tag dish-tag--pill">{dish.calories}</span>}
        </div>

        <p className="dish-info__description">
          Black Angus beef patty with aged cheddar, smoked bacon, fresh lettuce,
          pickles, tomato, red onion and creamy truffle mayo in a toasted
          brioche bun.
        </p>

        <div className="dish-info__badges">
          <span className="dish-info__badge dish-info__badge--success">Bestseller</span>
          <span className="dish-info__badge dish-info__badge--soft">Student deal</span>
          <span className="dish-info__badge dish-info__badge--pill">Packed for delivery</span>
        </div>
      </div>

      <div className="dish-info__sections">
        <section className="dish-card">
          <button
            type="button"
            onClick={() => toggleSection("customize")}
            className="dish-card__header"
          >
            <span>
              <span className="dish-card__title">Customize your burger</span>
              <span className="dish-card__subtext">Patty, cheese and sauce preferences</span>
            </span>
            <span className="dish-card__toggle">{openSections.customize ? "-" : "+"}</span>
          </button>

          {openSections.customize && (
            <div className="dish-card__content">
              {CUSTOMIZATION_GROUPS.map((group) => (
                <div key={group.id} className="dish-card__group">
                  <p className="dish-card__group-label">{group.title}</p>
                  <div className="dish-card__group-options">
                    {group.options.map((option) => {
                      const isSelected = selectedOptions[group.id] === option.id;

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
                          className={`dish-pill ${isSelected ? "dish-pill--active" : "dish-pill--default"}`}
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

        <section className="dish-card">
          <button
            type="button"
            onClick={() => toggleSection("combo")}
            className="dish-card__header"
          >
            <span>
              <span className="dish-card__title">Make it a combo</span>
              <span className="dish-card__subtext">Add fries, drink or wings if you want</span>
            </span>
            <span className="dish-card__toggle">{openSections.combo ? "-" : "+"}</span>
          </button>

          {openSections.combo && (
            <div className="dish-card__combo-content">
              {COMBO_ADD_ONS.map((addOn) => {
                const isSelected = selectedAddOns.includes(addOn.id);

                return (
                  <label
                    key={addOn.id}
                    className={`dish-check ${isSelected ? "dish-check--selected" : "dish-check--default"}`}
                  >
                    <span className="dish-check__label">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleAddOn(addOn.id)}
                        className="dish-check__input"
                      />
                      {addOn.label}
                    </span>
                    <span className="dish-check__price">+${addOn.price.toFixed(2)}</span>
                  </label>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <div className="dish-info__actions">
        <div className="dish-info__summary">
          <span className="dish-info__summary-label">
            {quantity > 1 ? "CURRENT TOTAL" : "REGULAR PRICE"}
          </span>
          <span className="dish-info__summary-value">${orderTotal.toFixed(2)}</span>
        </div>

        <div className="dish-info__controls">
          <div className="dish-counter">
            <button
              type="button"
              onClick={decrease}
              className="dish-counter__button"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="dish-counter__value">{quantity}</span>
            <button
              type="button"
              onClick={increase}
              className="dish-counter__button"
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
            className="dish-button dish-button--primary dish-button--large"
          >
            Add to cart
          </button>
        </div>
      </div>
    </section>
  );
}
