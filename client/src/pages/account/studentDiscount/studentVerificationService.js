import { STUDENT_VERIFICATION_FIXTURES } from "./studentVerification.fixtures";
import { STUDENT_VERIFICATION_STATUSES } from "./studentVerification.constants";

const STORAGE_KEY_PREFIX = "defilicious.studentVerification:v1";
const LEGACY_STORAGE_KEY = "defilicious.studentVerification";
const MOCK_DELAY_MS = 650;

/**
 * @typedef {"not_verified" | "pending" | "verified" | "action_required" | "rejected" | "expired"} StudentVerificationStatus
 * @typedef {{
 *   status: StudentVerificationStatus,
 *   institution?: string,
 *   country?: string,
 *   studentEmail?: string,
 *   graduationYear?: number,
 *   submittedAt?: string,
 *   verifiedAt?: string,
 *   expiresAt?: string,
 *   verificationMethod?: "student_email" | "document",
 *   adminComment?: string,
 *   rejectionReason?: string,
 * }} StudentVerification
 */
const SAFE_STRING_FIELDS = [
  "institution",
  "country",
  "studentEmail",
  "submittedAt",
  "verifiedAt",
  "expiresAt",
  "verificationMethod",
  "adminComment",
  "rejectionReason",
];

const wait = (duration) =>
  new Promise((resolve) => {
    setTimeout(resolve, duration);
  });

const getStorageKey = (ownerId) => {
  const normalizedOwnerId = String(ownerId || "").trim().toLowerCase();
  return normalizedOwnerId
    ? `${STORAGE_KEY_PREFIX}:${encodeURIComponent(normalizedOwnerId)}`
    : "";
};

const sanitizeVerification = (value) => {
  if (!value || typeof value !== "object") return { status: "not_verified" };
  if (!STUDENT_VERIFICATION_STATUSES.includes(value.status)) {
    return { status: "not_verified" };
  }

  const safeValue = { status: value.status };
  SAFE_STRING_FIELDS.forEach((field) => {
    if (typeof value[field] === "string") safeValue[field] = value[field].slice(0, 240);
  });
  if (
    Number.isInteger(value.graduationYear) &&
    value.graduationYear >= new Date().getFullYear() - 10 &&
    value.graduationYear <= new Date().getFullYear() + 15
  ) {
    safeValue.graduationYear = value.graduationYear;
  }

  return safeValue;
};

const persistVerification = (ownerId, verification) => {
  const storageKey = getStorageKey(ownerId);
  if (!storageKey) throw new Error("Student verification requires an account owner.");

  const safeVerification = sanitizeVerification(verification);
  try {
    localStorage.setItem(storageKey, JSON.stringify(safeVerification));
  } catch {
    throw new Error("Student verification could not be saved locally.");
  }
  return safeVerification;
};

const submitVerification = async (ownerId, payload) => {
  await wait(MOCK_DELAY_MS);
  return persistVerification(ownerId, {
    status: "pending",
    institution: payload.institution.trim(),
    country: payload.country,
    studentEmail: payload.studentEmail.trim(),
    graduationYear: Number(payload.graduationYear),
    submittedAt: new Date().toISOString(),
    verificationMethod: payload.verificationMethod,
  });
};

/**
 * Frontend-only adapter. Replace these methods with the real Student
 * Verification API without moving request logic into the UI components.
 */
export const studentVerificationService = {
  async getVerification(ownerId) {
    const storageKey = getStorageKey(ownerId);
    if (!storageKey) return { status: "not_verified" };

    try {
      // The original unscoped key cannot be assigned to a user safely.
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      const storedValue = JSON.parse(localStorage.getItem(storageKey));
      return sanitizeVerification(storedValue);
    } catch {
      return { status: "not_verified" };
    }
  },

  async submitVerification(ownerId, payload) {
    return submitVerification(ownerId, payload);
  },

  async updateVerification(ownerId, payload) {
    return submitVerification(ownerId, payload);
  },

  async resetVerification(ownerId) {
    const storageKey = getStorageKey(ownerId);
    if (!storageKey) return { status: "not_verified" };

    try {
      localStorage.removeItem(storageKey);
    } catch {
      // The in-memory state can still reset when storage is unavailable.
    }
    return { status: "not_verified" };
  },

  async setDevelopmentFixture(ownerId, status) {
    if (!import.meta.env.DEV || !STUDENT_VERIFICATION_FIXTURES[status]) {
      return this.getVerification(ownerId);
    }
    return persistVerification(ownerId, STUDENT_VERIFICATION_FIXTURES[status]);
  },
};
