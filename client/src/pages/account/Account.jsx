import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../../features/cart/useCart";
import { useSupport } from "../../features/support/useSupport";
import { useStudentVerification } from "./studentDiscount/useStudentVerification";
import { getStoredUser } from "../../api/authConfig";
import { getUserProfile } from "../../api/userService"; // Подключаем твою функцию API!
import { AccountSidebar } from "./components/AccountSidebar";
import { AddressesSection } from "./components/AddressesSection";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { DashboardSection } from "./components/DashboardSection";
import { FavoritesSection } from "./components/FavoritesSection";
import { OrdersSection } from "./components/OrdersSection";
import { PaymentsSection } from "./components/PaymentsSection";
import { SettingsSection } from "./components/SettingsSection";
import { ACCOUNT_SECTIONS, MOCK_ACCOUNT } from "./const";
import { createAddressId, setDefaultAddress } from "./accountUtils";
import "./Account.scss";

const ACCOUNT_SECTION_IDS = new Set(ACCOUNT_SECTIONS.map((section) => section.id));

const getAccountSection = (value) =>
  ACCOUNT_SECTION_IDS.has(value) ? value : "dashboard";

export function Account() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem } = useCart();
  const { openSupport: openSupportModal } = useSupport();
  const storedUser = getStoredUser();
  const studentVerification = useStudentVerification(storedUser?.username);

  // Добавляем новые стейты для работы с бэкендом
  const [serverUser, setServerUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [activeSection, setActiveSectionState] = useState(() =>
    getAccountSection(searchParams.get("section")),
  );
  const [addresses, setAddresses] = useState(MOCK_ACCOUNT.addresses);
  const [settings, setSettings] = useState(MOCK_ACCOUNT.settings);
  const [selectedOrderId, setSelectedOrderId] = useState(
    MOCK_ACCOUNT.activeOrder.id,
  );
  const [dialog, setDialog] = useState(null);

  useEffect(() => {
    const requestedSection = getAccountSection(searchParams.get("section"));
    setActiveSectionState(requestedSection);
  }, [searchParams]);

  const setActiveSection = (section) => {
    const nextSection = getAccountSection(section);
    const nextSearchParams = new URLSearchParams(searchParams);

    nextSearchParams.set("section", nextSection);
    nextSearchParams.delete("tab");
    setActiveSectionState(nextSection);
    setSearchParams(nextSearchParams, { replace: true });
  };

  const setPaymentsTab = (tab) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("section", "payments");
    if (tab === "student-discount") {
      nextSearchParams.set("tab", "student-discount");
    } else {
      nextSearchParams.delete("tab");
    }
    setActiveSectionState("payments");
    setSearchParams(nextSearchParams);
  };

  // useEffect для получения профиля при загрузке компонента
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);

        const data = await getUserProfile();
        setServerUser(data); // Сохраняем реальные данные с бэкенда
      } catch (error) {
        console.error(
          "Не удалось загрузить профиль, перенаправляем на авторизацию",
          error,
        );
        navigate("/auth"); // Если токен протух - кидаем на логин
      } finally {
        setIsLoading(false);
      }
    };

    // Если нет токена локально, сразу кидаем на логин, чтобы не делать лишний запрос
    if (!storedUser?.token) {
      navigate("/auth");
    } else {
      fetchProfile();
    }
  }, [navigate, storedUser?.token]);

  // Смешиваем реального юзера с сервера с заглушками (пока нет бэкенда для адресов/заказов)
  const user = useMemo(
    () => ({
      ...MOCK_ACCOUNT.user, // Фолбек на моковые данные (аватарка и т.д.)
      email:
        serverUser?.email || storedUser?.username || MOCK_ACCOUNT.user.email,
      name:
        serverUser?.fullName ||
        serverUser?.username ||
        storedUser?.fullName ||
        MOCK_ACCOUNT.user.name,
      role: serverUser?.role || "user", // Если нужна роль для отображения
    }),
    [serverUser, storedUser],
  );

  const account = useMemo(
    () => ({
      ...MOCK_ACCOUNT, // Пока оставляем моковые заказы и адреса
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
    openSupportModal({
      orderId,
      recentOrders: account.orders.map((order) => ({
        id: order.id,
        restaurantName: order.restaurantName,
      })),
    });
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
          user={user}
          activeTab={
            searchParams.get("tab") === "student-discount"
              ? "student-discount"
              : "payment-methods"
          }
          onTabChange={setPaymentsTab}
          verificationState={studentVerification}
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

  // Показываем прелоадер, пока данные тянутся с сервера
  if (isLoading) {
    return (
      <div className="account-page flex items-center justify-center h-screen">
        <p className="text-xl text-gray-500">Загрузка профиля...</p>
      </div>
    );
  }

  return (
    <div className="account-page">
      <div className="account-page__shell">
        <AccountSidebar
          user={user}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          studentVerificationStatus={studentVerification.verification.status}
          onStudentDiscount={() => setPaymentsTab("student-discount")}
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
