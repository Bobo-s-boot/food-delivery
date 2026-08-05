import { useState } from "react";
import { CalendarClock, GraduationCap, Link2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AppToast } from "../../../components/toast/AppToast";
import { useSupport } from "../../../features/support/useSupport";
import { StudentStatusBadge } from "./StudentStatusBadge";
import { StudentVerificationForm } from "./StudentVerificationForm";
import "./StudentDiscount.scss";

export function StudentDiscountPanel({ user, verificationState }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { openSupport } = useSupport();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showVerifiedDetails, setShowVerifiedDetails] = useState(false);
  const [notification, setNotification] = useState(null);
  const { verification, isLoading, submitVerification, updateVerification } =
    verificationState;

  const contactSupport = () => openSupport({ category: "student_discount" });
  const formatDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? "—"
      : new Intl.DateTimeFormat(i18n.language, { dateStyle: "medium" }).format(date);
  };

  const handleSubmit = async (payload) => {
    if (["action_required", "rejected", "expired"].includes(verification.status)) {
      await updateVerification(payload);
    } else {
      await submitVerification(payload);
    }
    setIsFormOpen(false);
    setNotification({
      tone: "success",
      status: t("studentDiscount.toast.successStatus"),
      title: t("studentDiscount.toast.successTitle"),
      description: t("studentDiscount.toast.successDescription"),
      closeLabel: t("studentDiscount.toast.close"),
    });
  };

  const openForm = () => setIsFormOpen(true);

  return (
    <div
      id="student-discount-panel"
      className="student-discount-layout"
      role="tabpanel"
      aria-labelledby="student-discount-tab"
      tabIndex="0"
    >
      <div className="student-discount-main">
        {isLoading ? (
          <section className="account-card student-discount-loading" role="status">
            {t("studentDiscount.loading")}
          </section>
        ) : isFormOpen ? (
          <StudentVerificationForm
            key={`${verification.status}-${verification.submittedAt || "new"}`}
            user={user}
            verification={verification}
            onCancel={() => setIsFormOpen(false)}
            onSubmit={handleSubmit}
          />
        ) : (
          <StudentVerificationStatusCard
            verification={verification}
            formatDate={formatDate}
            showVerifiedDetails={showVerifiedDetails}
            onContactSupport={contactSupport}
            onExploreOffers={() => navigate("/specials")}
            onOpenForm={openForm}
            onToggleDetails={() => setShowVerifiedDetails((current) => !current)}
          />
        )}
      </div>

      <aside className="student-discount-aside" aria-label={t("studentDiscount.aside.label")}>
        <section className="account-card student-discount-info-card">
          <h2>{t("studentDiscount.aside.how.title")}</h2>
          <ol>
            <li><span>1</span>{t("studentDiscount.aside.how.step1")}</li>
            <li><span>2</span>{t("studentDiscount.aside.how.step2")}</li>
            <li><span>3</span>{t("studentDiscount.aside.how.step3")}</li>
          </ol>
        </section>

        <section className="account-card student-discount-info-card">
          <h2>{t("studentDiscount.aside.eligibility.title")}</h2>
          <p>{t("studentDiscount.aside.eligibility.description")}</p>
          <small>{t("studentDiscount.aside.eligibility.note")}</small>
        </section>

        <section className="account-card student-discount-info-card">
          <h2>{t("studentDiscount.aside.support.title")}</h2>
          <p>{t("studentDiscount.aside.support.description")}</p>
          <button
            type="button"
            className="account-button account-button--secondary"
            onClick={contactSupport}
          >
            {t("studentDiscount.actions.contactSupport")}
          </button>
        </section>
      </aside>

      <AppToast notification={notification} onDismiss={() => setNotification(null)} />
    </div>
  );
}

function StudentVerificationStatusCard({
  verification,
  formatDate,
  showVerifiedDetails,
  onContactSupport,
  onExploreOffers,
  onOpenForm,
  onToggleDetails,
}) {
  const { t } = useTranslation();
  const status = verification.status;

  if (status === "not_verified") {
    return (
      <section className="account-card student-verification-card">
        <span className="account-eyebrow">{t("studentDiscount.statusCard.eyebrow")}</span>
        <StudentStatusBadge status={status} />
        <h2>{t("studentDiscount.states.notVerified.title")}</h2>
        <p>{t("studentDiscount.states.notVerified.description")}</p>
        <button type="button" className="account-button account-button--primary" onClick={onOpenForm}>
          {t("studentDiscount.actions.verify")}
        </button>
        <div className="student-discount-benefits">
          <Benefit icon={GraduationCap} text={t("studentDiscount.benefits.offers")} />
          <Benefit icon={Link2} text={t("studentDiscount.benefits.account")} />
          <Benefit icon={CalendarClock} text={t("studentDiscount.benefits.validity")} />
        </div>
      </section>
    );
  }

  if (status === "pending") {
    return (
      <StatusShell
        status={status}
        title={t("studentDiscount.states.pending.title")}
        description={t("studentDiscount.states.pending.description")}
      >
        <VerificationSummary verification={verification} formatDate={formatDate} />
        <p className="student-verification-card__note">
          {t("studentDiscount.states.pending.note")}
        </p>
        <button type="button" className="account-button account-button--secondary" onClick={onContactSupport}>
          {t("studentDiscount.actions.contactSupport")}
        </button>
      </StatusShell>
    );
  }

  if (status === "verified") {
    return (
      <StatusShell
        status={status}
        title={t("studentDiscount.states.verified.title")}
        description={t("studentDiscount.states.verified.description")}
      >
        <div className="student-verification-card__actions">
          <button type="button" className="account-button account-button--primary" onClick={onExploreOffers}>
            {t("studentDiscount.actions.exploreOffers")}
          </button>
          <button type="button" className="account-button account-button--secondary" onClick={onToggleDetails}>
            {t("studentDiscount.actions.viewDetails")}
          </button>
        </div>
        {showVerifiedDetails && (
          <VerificationSummary verification={verification} formatDate={formatDate} verified />
        )}
      </StatusShell>
    );
  }

  if (status === "action_required") {
    const adminComment = verification.adminComment
      ? t(`studentDiscount.reviewNotes.${verification.adminComment}`, {
          defaultValue: verification.adminComment,
        })
      : t("studentDiscount.states.actionRequired.fallback");

    return (
      <StatusShell
        status={status}
        title={t("studentDiscount.states.actionRequired.title")}
        description={t("studentDiscount.states.actionRequired.description")}
      >
        <p className="student-verification-card__message">
          {adminComment}
        </p>
        <StateActions primary={t("studentDiscount.actions.update")} onPrimary={onOpenForm} onSupport={onContactSupport} />
      </StatusShell>
    );
  }

  if (status === "rejected") {
    const rejectionReason = verification.rejectionReason
      ? t(`studentDiscount.reviewNotes.${verification.rejectionReason}`, {
          defaultValue: verification.rejectionReason,
        })
      : t("studentDiscount.states.rejected.fallback");

    return (
      <StatusShell
        status={status}
        title={t("studentDiscount.states.rejected.title")}
        description={rejectionReason}
      >
        <StateActions primary={t("studentDiscount.actions.tryAgain")} onPrimary={onOpenForm} onSupport={onContactSupport} />
      </StatusShell>
    );
  }

  return (
    <StatusShell
      status="expired"
      title={t("studentDiscount.states.expired.title")}
      description={t("studentDiscount.states.expired.description")}
    >
      <VerificationSummary verification={verification} formatDate={formatDate} />
      <button type="button" className="account-button account-button--primary" onClick={onOpenForm}>
        {t("studentDiscount.actions.verifyAgain")}
      </button>
    </StatusShell>
  );
}

function StatusShell({ status, title, description, children }) {
  const { t } = useTranslation();

  return (
    <section className="account-card student-verification-card">
      <span className="account-eyebrow">{t("studentDiscount.statusCard.eyebrow")}</span>
      <StudentStatusBadge status={status} />
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
    </section>
  );
}

function VerificationSummary({ verification, formatDate, verified = false }) {
  const { t } = useTranslation();
  const country = verification.country
    ? t(`studentDiscount.countries.${verification.country}`, {
        defaultValue: verification.country,
      })
    : "";
  const rows = verified
    ? [
        ["institution", verification.institution],
        ["verifiedDate", formatDate(verification.verifiedAt)],
        ["expirationDate", formatDate(verification.expiresAt)],
        ["studentEmail", verification.studentEmail],
      ]
    : [
        ["institution", verification.institution],
        ["country", country],
        ["studentEmail", verification.studentEmail],
        ["graduationYear", verification.graduationYear],
        ["submittedDate", formatDate(verification.submittedAt)],
        [
          "verificationMethod",
          t(`studentDiscount.summary.methods.${verification.verificationMethod || "student_email"}`),
        ],
      ];

  return (
    <dl className="student-verification-summary">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt>{t(`studentDiscount.summary.${label}`)}</dt>
          <dd>{value || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}

function StateActions({ primary, onPrimary, onSupport }) {
  const { t } = useTranslation();
  return (
    <div className="student-verification-card__actions">
      <button type="button" className="account-button account-button--primary" onClick={onPrimary}>{primary}</button>
      <button type="button" className="account-button account-button--secondary" onClick={onSupport}>
        {t("studentDiscount.actions.contactSupport")}
      </button>
    </div>
  );
}

function Benefit({ icon, text }) {
  const IconComponent = icon;

  return (
    <div>
      <IconComponent aria-hidden="true" size={18} />
      <span>{text}</span>
    </div>
  );
}
