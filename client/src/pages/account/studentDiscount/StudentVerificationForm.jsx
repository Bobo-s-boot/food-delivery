import { useMemo, useRef, useState } from "react";
import { LoaderCircle, Paperclip, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { formatFileSize } from "../../../utils/fileUtils";
import {
  MAX_STUDENT_DOCUMENT_SIZE,
  STUDENT_COUNTRIES,
  STUDENT_DOCUMENT_EXTENSIONS,
  STUDENT_DOCUMENT_TYPES,
} from "./studentVerification.constants";

const getNameParts = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "—",
    lastName: parts.slice(1).join(" ") || "—",
  };
};

export function StudentVerificationForm({ user, verification, onCancel, onSubmit }) {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const formRef = useRef(null);
  const currentYear = new Date().getFullYear();
  const graduationYears = useMemo(
    () => Array.from({ length: 9 }, (_, index) => currentYear + index),
    [currentYear],
  );
  const [form, setForm] = useState({
    institution: verification.institution || "",
    country: verification.country || "",
    studentEmail: verification.studentEmail || "",
    graduationYear: verification.graduationYear
      ? String(verification.graduationYear)
      : "",
    confirmed: false,
  });
  const [documentFile, setDocumentFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [fileError, setFileError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { firstName, lastName } = getNameParts(user.name);

  const validate = () => {
    const nextErrors = {};
    const institution = form.institution.trim();

    if (!institution || institution.length < 2) {
      nextErrors.institution = t("studentDiscount.validation.institution");
    } else if (institution.length > 120) {
      nextErrors.institution = t("studentDiscount.validation.institutionMax");
    }
    if (!form.country) nextErrors.country = t("studentDiscount.validation.country");
    if (!/^\S+@\S+\.\S+$/.test(form.studentEmail.trim())) {
      nextErrors.studentEmail = t("studentDiscount.validation.studentEmail");
    }
    if (!form.graduationYear) {
      nextErrors.graduationYear = t("studentDiscount.validation.graduationYear");
    }
    if (!form.confirmed) nextErrors.confirmed = t("studentDiscount.validation.confirmation");

    return nextErrors;
  };

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setSubmitError("");
  };

  const selectDocument = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase() || "";
    if (
      !STUDENT_DOCUMENT_TYPES.has(file.type) ||
      !STUDENT_DOCUMENT_EXTENSIONS.has(extension)
    ) {
      setFileError(t("studentDiscount.validation.fileType"));
      return;
    }
    if (file.size > MAX_STUDENT_DOCUMENT_SIZE) {
      setFileError(t("studentDiscount.validation.fileSize"));
      return;
    }

    setDocumentFile(file);
    setFileError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      const firstField = Object.keys(nextErrors)[0];
      requestAnimationFrame(() => {
        formRef.current?.querySelector(`[name="${firstField}"]`)?.focus();
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    try {
      await onSubmit({
        institution: form.institution,
        country: form.country,
        studentEmail: form.studentEmail,
        graduationYear: Number(form.graduationYear),
        verificationMethod: documentFile ? "document" : "student_email",
      });
      setDocumentFile(null);
    } catch {
      setSubmitError(t("studentDiscount.toast.errorDescription"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancel = () => {
    setDocumentFile(null);
    setFileError("");
    onCancel();
  };

  return (
    <section className="account-card student-verification-form-card">
      <div className="account-card__header">
        <div>
          <h2>{t("studentDiscount.form.title")}</h2>
          <p>{t("studentDiscount.form.description")}</p>
        </div>
      </div>

      {submitError && (
        <div className="student-verification-form__alert" role="alert">
          <strong>{t("studentDiscount.toast.errorTitle")}</strong>
          <span>{submitError}</span>
        </div>
      )}

      <form ref={formRef} className="student-verification-form" noValidate onSubmit={handleSubmit}>
        <fieldset disabled={isSubmitting}>
          <legend>{t("studentDiscount.form.accountInfo")}</legend>
          <div className="student-verification-form__identity">
            <ReadOnlyValue label={t("studentDiscount.form.firstName")} value={firstName} />
            <ReadOnlyValue label={t("studentDiscount.form.lastName")} value={lastName} />
            <ReadOnlyValue label={t("studentDiscount.form.accountEmail")} value={user.email} />
          </div>
        </fieldset>

        <fieldset disabled={isSubmitting}>
          <legend>{t("studentDiscount.form.studentInfo")}</legend>
          <VerificationField
            fieldId="student-institution"
            label={t("studentDiscount.form.institution")}
            error={errors.institution}
          >
            <input
              id="student-institution"
              name="institution"
              maxLength="120"
              value={form.institution}
              placeholder={t("studentDiscount.form.institutionPlaceholder")}
              aria-invalid={Boolean(errors.institution)}
              aria-describedby={errors.institution ? "student-institution-error" : undefined}
              onChange={(event) => updateField("institution", event.target.value)}
            />
          </VerificationField>

          <VerificationField
            fieldId="student-country"
            label={t("studentDiscount.form.country")}
            error={errors.country}
          >
            <select
              id="student-country"
              name="country"
              value={form.country}
              aria-invalid={Boolean(errors.country)}
              aria-describedby={errors.country ? "student-country-error" : undefined}
              onChange={(event) => updateField("country", event.target.value)}
            >
              <option value="">{t("studentDiscount.form.countryPlaceholder")}</option>
              {STUDENT_COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {t(`studentDiscount.countries.${country}`)}
                </option>
              ))}
            </select>
          </VerificationField>

          <VerificationField
            fieldId="student-email"
            label={t("studentDiscount.form.studentEmail")}
            helper={t("studentDiscount.form.studentEmailHelper")}
            error={errors.studentEmail}
          >
            <input
              id="student-email"
              name="studentEmail"
              type="email"
              value={form.studentEmail}
              placeholder={t("studentDiscount.form.studentEmailPlaceholder")}
              aria-invalid={Boolean(errors.studentEmail)}
              aria-describedby={
                errors.studentEmail
                  ? "student-email-helper student-email-error"
                  : "student-email-helper"
              }
              onChange={(event) => updateField("studentEmail", event.target.value)}
            />
          </VerificationField>

          <VerificationField
            fieldId="student-graduation-year"
            label={t("studentDiscount.form.graduationYear")}
            error={errors.graduationYear}
          >
            <select
              id="student-graduation-year"
              name="graduationYear"
              value={form.graduationYear}
              aria-invalid={Boolean(errors.graduationYear)}
              aria-describedby={errors.graduationYear ? "student-graduation-year-error" : undefined}
              onChange={(event) => updateField("graduationYear", event.target.value)}
            >
              <option value="">{t("studentDiscount.form.graduationYearPlaceholder")}</option>
              {graduationYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </VerificationField>
        </fieldset>

        <fieldset disabled={isSubmitting}>
          <legend>{t("studentDiscount.form.document")}</legend>
          <p className="student-verification-form__helper">
            {t("studentDiscount.form.documentHelper")}
          </p>
          <input
            ref={fileInputRef}
            className="student-verification-form__file-input"
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.pdf"
            onChange={selectDocument}
          />
          {!documentFile ? (
            <button
              type="button"
              className="student-verification-form__file-button"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip aria-hidden="true" size={17} />
              {t("studentDiscount.form.chooseDocument")}
            </button>
          ) : (
            <div className="student-verification-form__file">
              <div>
                <strong>{documentFile.name}</strong>
                <span>{formatFileSize(documentFile.size)}</span>
              </div>
              <button
                type="button"
                aria-label={t("studentDiscount.form.removeDocument", { fileName: documentFile.name })}
                onClick={() => setDocumentFile(null)}
              >
                <Trash2 aria-hidden="true" size={16} />
              </button>
            </div>
          )}
          {fileError && <span className="student-verification-form__error">{fileError}</span>}
        </fieldset>

        <label className="student-verification-form__confirmation">
          <input
            type="checkbox"
            name="confirmed"
            checked={form.confirmed}
            aria-invalid={Boolean(errors.confirmed)}
            aria-describedby={errors.confirmed ? "student-confirmed-error" : undefined}
            disabled={isSubmitting}
            onChange={(event) => updateField("confirmed", event.target.checked)}
          />
          <span>
            {t("studentDiscount.form.confirmationPrefix")}{" "}
            <Link to="/privacy-policy">{t("studentDiscount.form.privacyPolicy")}</Link>.
          </span>
        </label>
        {errors.confirmed && (
          <span id="student-confirmed-error" className="student-verification-form__error">
            {errors.confirmed}
          </span>
        )}

        <div className="student-verification-form__actions">
          <button
            type="button"
            className="account-button account-button--secondary"
            disabled={isSubmitting}
            onClick={cancel}
          >
            {t("studentDiscount.actions.cancel")}
          </button>
          <button
            type="submit"
            className="account-button account-button--primary"
            disabled={isSubmitting}
          >
            {isSubmitting && <LoaderCircle className="student-verification-form__spinner" aria-hidden="true" size={17} />}
            {isSubmitting
              ? t("studentDiscount.actions.submitting")
              : t("studentDiscount.actions.submit")}
          </button>
        </div>
      </form>
    </section>
  );
}

function VerificationField({ fieldId, label, helper = "", error = "", children }) {
  return (
    <div className="student-verification-form__field">
      <label htmlFor={fieldId}>{label}</label>
      {children}
      {helper && <span id={`${fieldId}-helper`} className="student-verification-form__helper">{helper}</span>}
      {error && <span id={`${fieldId}-error`} className="student-verification-form__error">{error}</span>}
    </div>
  );
}

function ReadOnlyValue({ label, value }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value || "—"}</strong>
    </div>
  );
}
