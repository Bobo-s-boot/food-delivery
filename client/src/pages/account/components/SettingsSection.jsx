import { useState } from "react";
import { ActionLink } from "./AccountActions";

const CUISINES = [
  "Asian",
  "Italian",
  "Healthy",
  "Fast Food",
  "European",
  "Bakery & Sweets",
  "Beverages",
];

const DIETARY_OPTIONS = [
  "No restrictions",
  "Vegetarian",
  "Vegan",
  "Gluten-free",
  "Low calorie",
  "High protein",
];

const SPICE_LEVELS = ["Mild", "Medium", "Hot"];

const PRIORITIES = [
  "Fast delivery",
  "Student discounts",
  "Healthy meals",
  "Popular near me",
];

const NOTIFICATION_ROWS = [
  {
    id: "orderUpdates",
    label: "Order updates",
    description: "Get updates about order confirmation and preparation.",
  },
  {
    id: "promotions",
    label: "Promotions",
    description: "Receive offers, discounts, and seasonal deals.",
  },
  {
    id: "studentDiscounts",
    label: "Student discounts",
    description: "Get notified about student-only deals.",
  },
  {
    id: "restaurantRecommendations",
    label: "Restaurant recommendations",
    description: "Receive personalized restaurant suggestions.",
  },
  {
    id: "deliveryStatus",
    label: "Delivery status",
    description: "Get alerts when your courier is nearby or your order status changes.",
  },
];

const CHANNELS = ["email", "push", "sms"];

export function SettingsSection({
  user,
  settings,
  setSettings,
  onManageBenefits,
  onDeleteAccount,
}) {
  const [profile, setProfile] = useState({
    name: user.name,
    email: "officedencripta@gmail.com",
    phone: user.phone || "+380 XX XXX XX XX",
  });
  const [profileDraft, setProfileDraft] = useState(profile);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [downloadState, setDownloadState] = useState("idle");

  const toggleNotification = (type, channel) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      notifications: {
        ...currentSettings.notifications,
        [type]: {
          ...currentSettings.notifications[type],
          [channel]: !currentSettings.notifications[type][channel],
        },
      },
    }));
  };

  const toggleCuisine = (cuisine) => {
    setSettings((currentSettings) => {
      const hasCuisine =
        currentSettings.foodPreferences.cuisines.includes(cuisine);
      return {
        ...currentSettings,
        foodPreferences: {
          ...currentSettings.foodPreferences,
          cuisines: hasCuisine
            ? currentSettings.foodPreferences.cuisines.filter(
                (item) => item !== cuisine,
              )
            : [...currentSettings.foodPreferences.cuisines, cuisine],
        },
      };
    });
  };

  const getDietarySelections = () => {
    const dietary = settings.foodPreferences.dietary;
    return Array.isArray(dietary) ? dietary : [dietary || "No restrictions"];
  };

  const toggleDietary = (option) => {
    setSettings((currentSettings) => {
      const currentDietary = currentSettings.foodPreferences.dietary;
      const currentSelections = Array.isArray(currentDietary)
        ? currentDietary
        : [currentDietary || "No restrictions"];
      const hasOption = currentSelections.includes(option);
      let nextSelections;

      if (option === "No restrictions") {
        nextSelections = ["No restrictions"];
      } else {
        const withoutDefault = currentSelections.filter(
          (item) => item !== "No restrictions",
        );
        nextSelections = hasOption
          ? withoutDefault.filter((item) => item !== option)
          : [...withoutDefault, option];
        if (nextSelections.length === 0) nextSelections = ["No restrictions"];
      }

      return {
        ...currentSettings,
        foodPreferences: {
          ...currentSettings.foodPreferences,
          dietary: nextSelections,
        },
      };
    });
  };

  const setSpiceLevel = (spiceLevel) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      foodPreferences: {
        ...currentSettings.foodPreferences,
        spiceLevel,
      },
    }));
  };

  const togglePriority = (priority) => {
    setSettings((currentSettings) => {
      const hasPriority =
        currentSettings.foodPreferences.priorities.includes(priority);
      return {
        ...currentSettings,
        foodPreferences: {
          ...currentSettings.foodPreferences,
          priorities: hasPriority
            ? currentSettings.foodPreferences.priorities.filter(
                (item) => item !== priority,
              )
            : [...currentSettings.foodPreferences.priorities, priority],
        },
      };
    });
  };

  const updateRegionalPreference = (field, value) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      [field]: value,
    }));
  };

  const connectAccount = (providerName) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      connectedAccounts: currentSettings.connectedAccounts.map((account) =>
        account.name === providerName
          ? { ...account, status: "Connected" }
          : account,
      ),
    }));
  };

  const startProfileEdit = () => {
    setProfileDraft(profile);
    setIsEditingProfile(true);
  };

  const cancelProfileEdit = () => {
    setProfileDraft(profile);
    setIsEditingProfile(false);
  };

  const saveProfile = (event) => {
    event.preventDefault();
    setProfile(profileDraft);
    setIsEditingProfile(false);
  };

  const downloadAccountData = () => {
    setDownloadState("ready");
    window.setTimeout(() => setDownloadState("idle"), 2200);
  };

  const dietarySelections = getDietarySelections();

  return (
    <div className="account-section account-settings">
      <section className="account-page-heading">
        <span className="account-eyebrow">Settings</span>
        <h1>Settings</h1>
        <p>Account configuration, notifications, food preferences, and privacy.</p>
      </section>

      <div className="account-settings-top-grid">
        <div className="account-settings-left-column">
          <section className="account-card account-settings-card">
            <div className="account-card__header">
              <div>
                <span className="account-eyebrow">Personal information</span>
                <h2>Your details</h2>
              </div>
              {!isEditingProfile && (
                <ActionLink onClick={startProfileEdit}>Edit profile</ActionLink>
              )}
            </div>

            {isEditingProfile ? (
              <form className="account-form-grid" onSubmit={saveProfile}>
                <input
                  value={profileDraft.name}
                  placeholder="Full Name"
                  onChange={(event) =>
                    setProfileDraft((currentProfile) => ({
                      ...currentProfile,
                      name: event.target.value,
                    }))
                  }
                />
                <input
                  value={profileDraft.email}
                  placeholder="Email"
                  onChange={(event) =>
                    setProfileDraft((currentProfile) => ({
                      ...currentProfile,
                      email: event.target.value,
                    }))
                  }
                />
                <input
                  value={profileDraft.phone}
                  placeholder="Phone Number"
                  onChange={(event) =>
                    setProfileDraft((currentProfile) => ({
                      ...currentProfile,
                      phone: event.target.value,
                    }))
                  }
                />
                <div className="account-actions-row">
                  <button
                    type="button"
                    className="account-button account-button--secondary"
                    onClick={cancelProfileEdit}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="account-button account-button--primary">
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="account-settings-list">
                <div className="account-settings-row">
                  <span>Name</span>
                  <strong>{profile.name}</strong>
                </div>
                <div className="account-settings-row">
                  <span>Email</span>
                  <strong>{profile.email}</strong>
                </div>
                <div className="account-settings-row">
                  <span>Phone</span>
                  <strong>{profile.phone}</strong>
                </div>
              </div>
            )}
          </section>

          <section className="account-card account-profile-space-card account-benefits-card">
            <div className="account-benefits-card__top">
              <span className="account-eyebrow">Account benefits</span>
              <span className="account-pill account-pill--accent">
                Student Discount Active
              </span>
            </div>
            <div>
              <h2>Student Benefits</h2>
              <p>
                Exclusive student deals and selected restaurant discounts are
                available for your account.
              </p>
            </div>
            <div className="account-benefits-card__pills">
              <span>15% off next order</span>
              <span>Student deals</span>
              <span>Selected restaurants</span>
            </div>
            <ActionLink onClick={onManageBenefits}>Manage benefits</ActionLink>
          </section>
        </div>

        <section className="account-card account-settings-card">
          <div className="account-card__header">
            <div>
              <span className="account-eyebrow">Login & security</span>
              <h2>Password and connected accounts</h2>
            </div>
          </div>
          <div className="account-settings-list">
            <div className="account-settings-row">
              <div>
                <strong>Password</strong>
                <p>Last changed 2 months ago</p>
              </div>
              <ActionLink onClick={() => setIsPasswordOpen(true)}>
                Change password
              </ActionLink>
            </div>
            {settings.connectedAccounts.map((account) => {
              const isConnected = account.status === "Connected";
              return (
                <div key={account.name} className="account-settings-row">
                  <div>
                    <strong>{account.name}</strong>
                    <p>{account.status}</p>
                  </div>
                  <ActionLink
                    onClick={() =>
                      isConnected ? undefined : connectAccount(account.name)
                    }
                  >
                    {isConnected ? "Manage" : "Connect"}
                  </ActionLink>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section className="account-card account-settings-card">
        <div className="account-card__header">
          <div>
            <span className="account-eyebrow">Notifications</span>
            <h2>Choose how we contact you</h2>
            <p>Manage which updates you want to receive. Changes are saved automatically.</p>
          </div>
        </div>
        <div className="account-notifications account-notifications--compact">
          {NOTIFICATION_ROWS.map((notification) => (
            <div key={notification.id} className="account-notification-row">
              <div>
                <strong>{notification.label}</strong>
                <p>{notification.description}</p>
              </div>
              <div className="account-toggle-group">
                {CHANNELS.map((channel) => {
                  const enabled =
                    settings.notifications[notification.id]?.[channel] || false;
                  return (
                    <button
                      key={channel}
                      type="button"
                      className={enabled ? "is-active" : ""}
                      aria-pressed={enabled}
                      onClick={() => toggleNotification(notification.id, channel)}
                    >
                      {channel.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <p className="account-settings-note">Changes are saved automatically.</p>
      </section>

      <section className="account-card account-settings-card">
        <div className="account-card__header">
          <div>
            <span className="account-eyebrow">Food preferences</span>
            <h2>Personalize your recommendations</h2>
            <p>Choose what you like so Defilicious can suggest better restaurants and dishes.</p>
          </div>
        </div>
        <div className="account-preference-groups">
          <div className="account-preference-group">
            <h3>Favorite cuisines</h3>
            <div className="account-tag-grid">
              {CUISINES.map((cuisine) => (
                <button
                  key={cuisine}
                  type="button"
                  onClick={() => toggleCuisine(cuisine)}
                  className={
                    settings.foodPreferences.cuisines.includes(cuisine)
                      ? "is-active"
                      : ""
                  }
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>

          <div className="account-preference-group">
            <h3>Dietary preferences</h3>
            <div className="account-tag-grid">
              {DIETARY_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleDietary(option)}
                  className={dietarySelections.includes(option) ? "is-active" : ""}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="account-preference-group">
            <h3>Spice level</h3>
            <div className="account-tag-grid">
              {SPICE_LEVELS.map((spiceLevel) => (
                <button
                  key={spiceLevel}
                  type="button"
                  onClick={() => setSpiceLevel(spiceLevel)}
                  className={
                    settings.foodPreferences.spiceLevel === spiceLevel
                      ? "is-active"
                      : ""
                  }
                >
                  {spiceLevel}
                </button>
              ))}
            </div>
          </div>

          <div className="account-preference-group">
            <h3>Other preferences</h3>
            <div className="account-tag-grid">
              {PRIORITIES.map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => togglePriority(priority)}
                  className={
                    settings.foodPreferences.priorities.includes(priority)
                      ? "is-active"
                      : ""
                  }
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>
        </div>
        <p className="account-settings-note">Used to improve your recommendations.</p>
      </section>

      <div className="account-two-column">
        <section className="account-card account-settings-card">
          <div className="account-card__header">
            <div>
              <span className="account-eyebrow">Regional preferences</span>
              <h2>Language and currency</h2>
              <p>Choose how prices and content are displayed across Defilicious.</p>
            </div>
          </div>
          <div className="account-form-grid account-form-grid--compact">
            <select
              value={settings.language}
              onChange={(event) =>
                updateRegionalPreference("language", event.target.value)
              }
            >
              <option>English</option>
            </select>
            <select
              value={settings.currency}
              onChange={(event) =>
                updateRegionalPreference("currency", event.target.value)
              }
            >
              <option>USD</option>
            </select>
          </div>
        </section>

        <section className="account-card account-settings-card">
          <div className="account-card__header">
            <div>
              <span className="account-eyebrow">Account data</span>
              <h2>Your account data</h2>
              <p>Download a copy of your account information, order history, and saved preferences.</p>
            </div>
          </div>
          <ActionLink onClick={downloadAccountData}>
            {downloadState === "ready" ? "Data request ready" : "Download account data"}
          </ActionLink>
        </section>
      </div>

      <section className="account-card account-danger-card account-settings-card">
        <div className="account-card__header">
          <div>
            <span className="account-eyebrow">Danger zone</span>
            <h2>Delete account</h2>
            <p>Permanently delete your account and remove your saved information from Defilicious.</p>
          </div>
          <button
            type="button"
            className="account-button account-button--danger"
            onClick={onDeleteAccount}
          >
            Delete account
          </button>
        </div>
      </section>

      {isPasswordOpen && (
        <div className="account-modal" role="dialog" aria-modal="true">
          <form
            className="account-modal__panel account-password-form"
            onSubmit={(event) => {
              event.preventDefault();
              setIsPasswordOpen(false);
            }}
          >
            <h2>Change password</h2>
            <p>Use a strong password that you do not use on other websites.</p>
            <input type="password" placeholder="Current password" />
            <input type="password" placeholder="New password" />
            <input type="password" placeholder="Confirm new password" />
            <div className="account-actions-row">
              <button
                type="button"
                className="account-button account-button--secondary"
                onClick={() => setIsPasswordOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="account-button account-button--primary">
                Save password
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
