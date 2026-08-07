const currentYear = new Date().getFullYear();
const now = new Date();
const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 12).toISOString();
const nextYear = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()).toISOString();

const baseSubmitted = {
  institution: "Kyiv National University",
  country: "ukraine",
  studentEmail: "student@university.edu",
  graduationYear: currentYear + 2,
  submittedAt: lastMonth,
  verificationMethod: "student_email",
};

export const STUDENT_VERIFICATION_FIXTURES = {
  not_verified: { status: "not_verified" },
  pending: { ...baseSubmitted, status: "pending" },
  verified: {
    ...baseSubmitted,
    status: "verified",
    verifiedAt: lastMonth,
    expiresAt: nextYear,
  },
  action_required: {
    ...baseSubmitted,
    status: "action_required",
    adminComment: "information_unconfirmed",
  },
  rejected: {
    ...baseSubmitted,
    status: "rejected",
    rejectionReason: "document_unreadable",
  },
  expired: {
    ...baseSubmitted,
    status: "expired",
    verifiedAt: new Date(currentYear - 1, 4, 10).toISOString(),
    expiresAt: new Date(currentYear, 4, 10).toISOString(),
  },
};
