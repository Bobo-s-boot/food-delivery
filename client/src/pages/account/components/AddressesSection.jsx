import { useState } from "react";
import { SquarePenIcon } from "./AccountActions";

const EMPTY_FORM = {
  title: "",
  street: "",
  apartment: "",
  city: "",
  deliveryNote: "",
  phone: "",
  isDefault: false,
};

export function AddressesSection({
  addresses,
  onAddAddress,
  onUpdateAddress,
  onSetDefaultAddress,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState("");

  const defaultAddress = addresses.find((address) => address.isDefault);
  const otherAddresses = addresses.filter((address) => !address.isDefault);

  const updateField = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (editingAddressId) {
      onUpdateAddress(editingAddressId, form);
    } else {
      onAddAddress(form);
    }
    setForm(EMPTY_FORM);
    setEditingAddressId("");
    setIsFormOpen(false);
  };

  const startEdit = (address) => {
    setForm({
      title: address.title,
      street: address.street,
      apartment: address.apartment,
      city: address.city,
      deliveryNote: address.deliveryNote,
      phone: address.phone,
      isDefault: address.isDefault,
    });
    setEditingAddressId(address.id);
    setIsFormOpen(true);
  };

  const openAddForm = () => {
    setForm(EMPTY_FORM);
    setEditingAddressId("");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setForm(EMPTY_FORM);
    setEditingAddressId("");
    setIsFormOpen(false);
  };

  const getAddressIcon = (title) => {
    const normalizedTitle = title.toLowerCase();

    if (normalizedTitle.includes("university")) {
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m3 9 9-5 9 5-9 5-9-5Z" />
          <path d="M7 11.5v4.25c0 1.24 2.24 2.25 5 2.25s5-1.01 5-2.25V11.5" />
          <path d="M21 9v6" />
        </svg>
      );
    }

    if (normalizedTitle.includes("work")) {
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1" />
          <path d="M4 7h16a1 1 0 0 1 1 1v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a1 1 0 0 1 1-1Z" />
          <path d="M9 13h6" />
        </svg>
      );
    }

    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v10h14V10" />
        <path d="M9 20v-6h6v6" />
      </svg>
    );
  };

  const renderAddressCard = (address, isDefaultCard = false) => (
    <article key={address.id} className="account-address-card">
      <div className="account-address-card__main">
        <div className="account-address-card__top">
          <span className="account-address-card__icon">
            {getAddressIcon(address.title)}
          </span>
          <div>
            <div className="account-address-card__title-row">
              <h3>{address.title}</h3>
              {address.isDefault && (
                <span className="account-pill account-pill--accent account-address-default-badge">
                  Default at checkout
                </span>
              )}
            </div>
            <p className="account-address-card__address">
              {[address.street, address.apartment, address.city]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
        </div>
        <div className="account-address-card__meta">
          <span>Delivery note: {address.deliveryNote || "No note"}</span>
          <span>Phone: {address.phone}</span>
        </div>
      </div>
      <div className="account-address-card__actions">
        {!isDefaultCard && (
          <button
            type="button"
            className="account-button account-button--primary"
            onClick={() => onSetDefaultAddress(address.id)}
          >
            Set as default
          </button>
        )}
        <button
          type="button"
          className="account-button account-button--secondary account-address-edit-button"
          onClick={() => startEdit(address)}
        >
          <SquarePenIcon className="account-address-action-icon" />
          Edit address
        </button>
      </div>
    </article>
  );

  return (
    <div className="account-section">
      <section className="account-page-heading">
        <span className="account-eyebrow">Addresses</span>
        <h1>Delivery Addresses</h1>
        <p>Manage where your orders should be delivered.</p>
      </section>

      {addresses.length === 0 ? (
        <section className="account-card account-empty-state">
          <span className="account-eyebrow">No default address</span>
          <h2>No default delivery address selected.</h2>
          <p>
            Choose a saved address or add a new one to use at checkout.
          </p>
          <button
            type="button"
            className="account-button account-button--primary"
            onClick={openAddForm}
          >
            Add new address
          </button>
        </section>
      ) : (
        <>
          <div className="account-notice account-notice--addresses">
            You have an active delivery. Changes to saved addresses will not
            affect your current order.
          </div>

          {defaultAddress && (
            <section className="account-card">
              <div className="account-card__header">
                <div>
                  <span className="account-eyebrow">Default address</span>
                  <h2>Default delivery address</h2>
                  <p>Used first at checkout.</p>
                </div>
              </div>
              {renderAddressCard(defaultAddress, true)}
            </section>
          )}

          <section className="account-card">
            <div className="account-card__header">
              <div>
                <span className="account-eyebrow">Saved addresses</span>
                <h2>Other delivery places</h2>
              </div>
              <button
                type="button"
                className="account-link-button"
                onClick={openAddForm}
              >
                <span>Add new address</span>
              </button>
            </div>
            {otherAddresses.length > 0 ? (
              <div className="account-list">
                {otherAddresses.map((address) => renderAddressCard(address))}
              </div>
            ) : (
              <div className="account-empty-state account-empty-state--compact">
                <h3>No saved addresses yet.</h3>
                <p>
                  Add places like home, university, or work for faster checkout.
                </p>
                <button
                  type="button"
                  className="account-button account-button--primary"
                  onClick={openAddForm}
                >
                  Add new address
                </button>
              </div>
            )}
          </section>
        </>
      )}

      {isFormOpen && (
        <section className="account-card">
          <div className="account-card__header">
            <div>
              <span className="account-eyebrow">New address</span>
              <h2>{editingAddressId ? "Edit address" : "Add new address"}</h2>
            </div>
          </div>
          <form className="account-form-grid" onSubmit={handleSubmit}>
            <input
              required
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Address title"
            />
            <input
              required
              value={form.street}
              onChange={(event) => updateField("street", event.target.value)}
              placeholder="Street address"
            />
            <input
              value={form.apartment}
              onChange={(event) => updateField("apartment", event.target.value)}
              placeholder="Apartment / floor"
            />
            <input
              required
              value={form.city}
              onChange={(event) => updateField("city", event.target.value)}
              placeholder="City"
            />
            <input
              value={form.deliveryNote}
              onChange={(event) => updateField("deliveryNote", event.target.value)}
              placeholder="Delivery note"
            />
            <input
              required
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              placeholder="Phone number"
            />
            <label className="account-check-row">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(event) => updateField("isDefault", event.target.checked)}
              />
              Make this my default address
            </label>
            <div className="account-form-grid__actions">
              <button
                type="button"
                className="account-button account-button--secondary"
                onClick={closeForm}
              >
                Cancel
              </button>
              <button type="submit" className="account-button account-button--primary">
                Save address
              </button>
            </div>
          </form>
        </section>
      )}

    </div>
  );
}
