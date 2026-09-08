export const STUDENT_VERIFICATION_STATUSES = [
  "not_verified",
  "pending",
  "verified",
  "action_required",
  "rejected",
  "expired",
];

export const STUDENT_STATUS_CONFIG = {
  not_verified: { labelKey: "notVerified", tone: "neutral" },
  pending: { labelKey: "pending", tone: "warning" },
  verified: { labelKey: "verified", tone: "success" },
  action_required: { labelKey: "actionRequired", tone: "warning" },
  rejected: { labelKey: "rejected", tone: "error" },
  expired: { labelKey: "expired", tone: "neutral" },
};

export const STUDENT_COUNTRIES = [
  "ukraine",
  "poland",
  "germany",
  "france",
  "italy",
  "spain",
  "unitedKingdom",
  "unitedStates",
  "canada",
  "netherlands",
  "czechRepublic",
  "romania",
  "other",
];

export const MAX_STUDENT_DOCUMENT_SIZE = 10 * 1024 * 1024;
export const STUDENT_DOCUMENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);
export const STUDENT_DOCUMENT_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
  "pdf",
]);
