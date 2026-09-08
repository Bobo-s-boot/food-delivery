import { useTranslation } from "react-i18next";
import { useSupport } from "../../features/support/useSupport";
import "./PrivacyPolicy.scss";

const POLICY_SECTIONS = [
  "information",
  "studentVerification",
  "localStorage",
  "support",
  "choices",
];

export function PrivacyPolicy() {
  const { t } = useTranslation();
  const { openSupport } = useSupport();

  return (
    <article className="privacy-page">
      <header className="privacy-page__header">
        <span className="privacy-page__eyebrow">{t("privacyPolicy.eyebrow")}</span>
        <h1>{t("privacyPolicy.title")}</h1>
        <p>{t("privacyPolicy.description")}</p>
      </header>

      <div className="privacy-page__content">
        {POLICY_SECTIONS.map((section) => (
          <section key={section}>
            <h2>{t(`privacyPolicy.sections.${section}.title`)}</h2>
            <p>{t(`privacyPolicy.sections.${section}.description`)}</p>
          </section>
        ))}

        <button
          type="button"
          className="privacy-page__support"
          onClick={() => openSupport({ category: "account_profile" })}
        >
          {t("privacyPolicy.contactSupport")}
        </button>
      </div>
    </article>
  );
}
