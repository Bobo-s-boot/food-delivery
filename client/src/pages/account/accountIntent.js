const ACCOUNT_INTENT_KEY = "defilicious.accountIntent:v1";
const LEGACY_ACCOUNT_INTENT_KEY = "defilicious_account_intent";
const ACCOUNT_INTENT_TTL_MS = 30 * 60 * 1000;
const ACCOUNT_SECTIONS = new Set([
  "dashboard",
  "orders",
  "favorites",
  "addresses",
  "payments",
  "settings",
]);

const normalizeAccountIntent = (value) => {
  if (!value || typeof value !== "object" || !ACCOUNT_SECTIONS.has(value.section)) {
    return {};
  }

  const intent = { section: value.section };
  if (value.section === "payments" && value.tab === "student-discount") {
    intent.tab = value.tab;
  }

  return intent;
};

export const saveAccountIntent = (section, tab = "") => {
  const intent = normalizeAccountIntent({ section, tab });
  if (!intent.section) return;

  try {
    sessionStorage.setItem(
      ACCOUNT_INTENT_KEY,
      JSON.stringify({ ...intent, createdAt: Date.now() }),
    );
    sessionStorage.removeItem(LEGACY_ACCOUNT_INTENT_KEY);
  } catch {
    // Navigation state still carries the same intent when sessionStorage is unavailable.
  }
};

export const readAccountIntent = (locationState) => {
  const stateIntent = normalizeAccountIntent({
    section: locationState?.accountSection,
    tab: locationState?.accountTab,
  });
  if (stateIntent.section) return stateIntent;

  try {
    const storedIntent = JSON.parse(sessionStorage.getItem(ACCOUNT_INTENT_KEY));
    const isFresh =
      Number.isFinite(storedIntent?.createdAt) &&
      Date.now() - storedIntent.createdAt <= ACCOUNT_INTENT_TTL_MS;

    if (!isFresh) {
      sessionStorage.removeItem(ACCOUNT_INTENT_KEY);
      sessionStorage.removeItem(LEGACY_ACCOUNT_INTENT_KEY);
      return {};
    }

    return normalizeAccountIntent(storedIntent);
  } catch {
    return {};
  }
};

export const clearAccountIntent = () => {
  try {
    sessionStorage.removeItem(ACCOUNT_INTENT_KEY);
    sessionStorage.removeItem(LEGACY_ACCOUNT_INTENT_KEY);
  } catch {
    // There is nothing else to clear when sessionStorage is unavailable.
  }
};

export const buildPostAuthPath = (user, accountIntent = {}) => {
  if (user?.role === "admin") return `/${user.username}/admin`;

  const profilePath = `/${user.username}/profile`;
  const intent = normalizeAccountIntent(accountIntent);
  if (!intent.section) return profilePath;

  const searchParams = new URLSearchParams({ section: intent.section });
  if (intent.tab) searchParams.set("tab", intent.tab);
  return `${profilePath}?${searchParams.toString()}`;
};
