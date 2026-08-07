import { AlertCircle, CheckCircle2, Clock3, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { STUDENT_STATUS_CONFIG } from "./studentVerification.constants";

const STATUS_ICONS = {
  not_verified: GraduationCap,
  pending: Clock3,
  verified: CheckCircle2,
  action_required: AlertCircle,
  rejected: AlertCircle,
  expired: Clock3,
};

export function StudentStatusBadge({ status = "not_verified", onClick }) {
  const { t } = useTranslation();
  const config = STUDENT_STATUS_CONFIG[status] || STUDENT_STATUS_CONFIG.not_verified;
  const Icon = STATUS_ICONS[status] || GraduationCap;
  const label = t(`studentDiscount.status.${config.labelKey}`);
  const className = `account-pill account-student-status account-student-status--${config.tone}`;

  if (onClick) {
    return (
      <button
        type="button"
        className={className}
        aria-label={t("studentDiscount.badge.open", { status: label })}
        onClick={onClick}
      >
        <Icon aria-hidden="true" size={14} />
        {label}
      </button>
    );
  }

  return (
    <span className={className}>
      <Icon aria-hidden="true" size={14} />
      {label}
    </span>
  );
}
