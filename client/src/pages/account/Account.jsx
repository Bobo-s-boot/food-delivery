import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../features/cart/useCart";
import { getStoredUser } from "../../api/authConfig";
import { AccountSidebar } from "./components/AccountSidebar";
import { AddressesSection } from "./components/AddressesSection";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { DashboardSection } from "./components/DashboardSection";
import { FavoritesSection } from "./components/FavoritesSection";
import { OrdersSection } from "./components/OrdersSection";
import { PaymentsSection } from "./components/PaymentsSection";
import { SettingsSection } from "./components/SettingsSection";
import { SupportSection } from "./components/SupportSection";
import { MOCK_ACCOUNT } from "./const";
import {
  createAddressId,
  setDefaultAddress,
} from "./accountUtils";
import "./Account.scss";

export function Account() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const storedUser = getStoredUser();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [addresses, setAddresses] = useState(MOCK_ACCOUNT.addresses);
  const [settings, setSettings] = useState(MOCK_ACCOUNT.settings);
  const [selectedOrderId, setSelectedOrderId] = useState(
    MOCK_ACCOUNT.activeOrder.id,
  );
  const [supportContext, setSupportContext] = useState("");
  const [dialog, setDialog] = useState(null);

  const user = useMemo(
    () => ({
      ...MOCK_ACCOUNT.user,
      email: storedUser?.username || MOCK_ACCOUNT.user.email,
      name: storedUser?.fullName || MOCK_ACCOUNT.user.name,
    }),
    [storedUser],
  );

  const account = useMemo(
    () => ({
      ...MOCK_ACCOUNT,
      user,
      addresses,
      settings,
    }),
    [addresses, settings, user],
  );

  const userBasePath = storedUser?.username
    ? `/${encodeURIComponent(storedUser.username)}`
    : "";

  const browseRestaurants = () => {
    navigate(`${userBasePath}/catalog`);
  };

  const reorder = (order) => {
    order.items.forEach((item) => addItem(item));
  };

  const trackOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setActiveSection("orders");
  };

  const openSupport = (orderId = "") => {
    setSupportContext(orderId);
    setActiveSection("support");
  };

  const addAddress = (addressData) => {
    const nextAddress = {
      ...addressData,
      id: createAddressId(addressData.title),
    };

    setAddresses((currentAddresses) => {
      const withDefault = nextAddress.isDefault
        ? setDefaultAddress(currentAddresses, nextAddress.id)
        : currentAddresses;

      return nextAddress.isDefault
        ? [...withDefault, nextAddress]
        : [...currentAddresses, nextAddress];
    });
  };

  const logout = () => {
    localStorage.removeItem("user");
    setDialog(null);
    navigate("/");
  };

  const renderSection = () => {
    if (activeSection === "orders") {
      return (
        <OrdersSection
          orders={account.orders}
          activeOrder={account.activeOrder}
          selectedOrderId={selectedOrderId}
          onSelectOrder={setSelectedOrderId}
          onReorder={reorder}
          onSupport={openSupport}
        />
      );
    }

    if (activeSection === "favorites") {
      return (
        <FavoritesSection
          favorites={account.favorites}
          onBrowseRestaurants={browseRestaurants}
        />
      );
    }

    if (activeSection === "addresses") {
      return (
        <AddressesSection
          addresses={addresses}
          onAddAddress={addAddress}
          onUpdateAddress={(addressId, addressData) =>
            setAddresses((currentAddresses) => {
              const currentAddress = currentAddresses.find(
                (address) => address.id === addressId,
              );
              const nextAddressData = {
                ...addressData,
                isDefault:
                  Boolean(currentAddress?.isDefault) ||
                  Boolean(addressData.isDefault),
              };
              const nextAddresses = currentAddresses.map((address) =>
                address.id === addressId
                  ? { ...address, ...nextAddressData }
                  : address,
              );

              return nextAddressData.isDefault
                ? setDefaultAddress(nextAddresses, addressId)
                : nextAddresses;
            })
          }
          onSetDefaultAddress={(addressId) =>
            setAddresses((currentAddresses) =>
              setDefaultAddress(currentAddresses, addressId),
            )
          }
        />
      );
    }

    if (activeSection === "payments") {
      return (
        <PaymentsSection
          payments={account.payments}
          promoCodes={account.promoCodes}
          receipts={account.receipts}
        />
      );
    }

    if (activeSection === "settings") {
      return (
        <SettingsSection
          user={user}
          settings={settings}
          setSettings={setSettings}
          onManageBenefits={() => setActiveSection("payments")}
          onDeleteAccount={() =>
            setDialog({
              title: "Are you sure you want to delete your account?",
              text: "This action cannot be undone. For this preview, no backend data will be deleted.",
              confirmLabel: "Delete Account",
              tone: "danger",
              onConfirm: () => setDialog(null),
            })
          }
        />
      );
    }

    if (activeSection === "support") {
      return (
        <SupportSection
          supportContext={supportContext}
          onClearContext={() => setSupportContext("")}
        />
      );
    }

    return (
      <DashboardSection
        account={account}
        onSectionChange={setActiveSection}
        onReorder={reorder}
        onTrackOrder={trackOrder}
        onSupport={openSupport}
        onBrowseRestaurants={browseRestaurants}
      />
    );
  };

  return (
    <div className="account-page">
      <div className="account-page__shell">
        <AccountSidebar
          user={user}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onSupport={() => openSupport("")}
          onLogout={() =>
            setDialog({
              title: "Are you sure you want to log out?",
              text: "You will return to the landing page and the profile icon will lead to Log In again.",
              confirmLabel: "Log Out",
              onConfirm: logout,
            })
          }
        />

        <main className="account-page__content">{renderSection()}</main>
      </div>

      {dialog && (
        <ConfirmDialog
          title={dialog.title}
          text={dialog.text}
          confirmLabel={dialog.confirmLabel}
          tone={dialog.tone}
          onCancel={() => setDialog(null)}
          onConfirm={dialog.onConfirm}
        />
      )}
    </div>
  );
}
