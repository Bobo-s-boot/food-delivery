import { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckCircle2, ArrowUpRight } from "lucide-react";
import { AppToast } from "../../../components/toast/AppToast";
import {
  submitEngagement,
  engagementError,
  announceEngagementUpdate,
} from "../../../api/engagementService";
import { validateSubmission } from "../../../../../shared/engagement.mjs";
import { useEngagement } from "../useEngagement";
import {
  displayCity,
  localizeVacancy,
  translateEngagementMessage,
} from "../engagement.utils";

import { ApplicationField } from "./ApplicationField";
import { ApplicationConsent } from "./ApplicationConsent";

const fieldsByKind = {
  partnership: [
    ["restaurant_name", "text", true],
    ["city", "text", true],
    ["contact_name", "text", true],
    ["phone", "tel", true],
    ["email", "email"],
    ["website", "url"],
    ["comment", "textarea"],
  ],
  courier: [
    ["applicant_name", "text", true],
    ["city", "select", true],
    ["phone", "tel", true],
    ["email", "email"],
    ["comment", "textarea"],
  ],
  team: [
    ["applicant_name", "text", true],
    ["email", "email", true],
    ["phone", "tel"],
    ["resume_url", "url"],
    ["portfolio_url", "url"],
    ["comment", "textarea"],
  ],
};

export function ApplicationForm({ kind, vacancy, unavailable = "", preview = false }) {
  const { t, i18n } = useTranslation();
  const copy = t("engagement.form", { returnObjects: true });
  const {
    demo,
    settings,
    intakeReady,
    loading,
    error: dataError,
    hiringError,
  } = useEngagement();
  const [values, setValues] = useState({ consent: false });
  const [errors, setErrors] = useState({});
  const [failure, setFailure] = useState("");
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [notification, setNotification] = useState(null);
  const dismissToast = useCallback(() => setNotification(null), []);
  const inFlight = useRef(false);
  const request = useRef({ key: "", payload: "" });
  const formRef = useRef(null);
  const optionalRef = useRef(null);
  const successRef = useRef(null);
  const disabled =
    preview || pending || loading || !!dataError || (kind !== "partnership" && !!hiringError) || !!unavailable || !intakeReady;
  const fields = fieldsByKind[kind].filter(
    ([key]) => key !== "portfolio_url" || vacancy?.portfolio_field_enabled,
  );
  const setValue = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };
  const focusError = (validation) => {
    const first = Object.keys(validation)[0];
    if (["website", "comment"].includes(first) && optionalRef.current)
      optionalRef.current.open = true;
    window.requestAnimationFrame(() =>
      formRef.current?.elements.namedItem(first)?.focus(),
    );
  };
  const submit = async (event) => {
    event.preventDefault();
    if (inFlight.current || disabled) return;
    const { data, errors: validation } = validateSubmission(
      kind,
      values,
      vacancy,
    );
    setErrors(validation);
    setFailure("");
    if (Object.keys(validation).length) {
      focusError(validation);
      return;
    }
    const payload = {
      ...data,
      application_language: i18n.resolvedLanguage?.startsWith("uk") ? "uk" : "en",
      ...(vacancy ? { vacancy_id: vacancy._id } : {}),
    };
    const serialized = JSON.stringify(payload);
    if (serialized !== request.current.payload)
      request.current = { key: crypto.randomUUID(), payload: serialized };
    inFlight.current = true;
    setPending(true);
    try {
      const response = await submitEngagement(
        kind,
        payload,
        request.current.key,
      );
      if (!response.confirmed) throw new Error("No confirmed receipt");
      setSuccess(true);
      setNotification({
        tone: "success",
        title:
          kind === "partnership"
            ? copy.toastPartnershipTitle
            : copy.toastApplicationTitle,
        description:
          kind === "partnership"
            ? copy.toastPartnershipDescription
            : copy.toastApplicationDescription,
        closeLabel: copy.toastClose,
      });
      announceEngagementUpdate();
      window.requestAnimationFrame(() => successRef.current?.focus());
    } catch (err) {
      const validationErrors = err.response?.data?.errors || {};
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length) focusError(validationErrors);
      setFailure(engagementError(err, "submission_failed"));
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  };
  if (success)
    return (
      <>
        <AppToast
          notification={notification}
          onDismiss={dismissToast}
          className="eng-toast"
        />
        <div className="eng-success" ref={successRef} tabIndex={-1}>
          <CheckCircle2 size={40} aria-hidden="true" />
          <h2>{copy.successTitle}</h2>
          <p>
            {kind === "partnership"
              ? copy.partnershipSuccess
              : kind === "courier"
                ? t("engagement.form.courierSuccess", {
                    city: displayCity(values.city, t, demo),
                  })
                : t("engagement.form.teamSuccess", {
                    title: localizeVacancy(vacancy, t, demo).title,
                  })}
          </p>
          <Link
            className="eng-button"
            to={kind === "partnership" ? "/" : "/careers"}
          >
            {kind === "partnership" ? copy.home : copy.back}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </>
    );
  const renderField = (field) => (
    <ApplicationField
      key={field[0]}
      field={field}
      copy={copy}
      kind={kind}
      vacancy={vacancy}
      values={values}
      errors={errors}
      pending={pending}
      preview={preview}
      settings={settings}
      t={t}
      demo={demo}
      setValue={setValue}
    />
  );
  return (
    <form
      ref={formRef}
      className="eng-form"
      onSubmit={submit}
      noValidate
      aria-busy={pending}
    >
      {preview && <p className="eng-notice">{t("engagement.hiring.previewForm")}</p>}
      {kind !== "partnership" && hiringError && <p className="eng-notice" role="alert">{t("engagement.hiring.storageUnavailable")}</p>}
      {unavailable && (
        <p className="eng-notice" role="status">
          {translateEngagementMessage(unavailable, t)}
        </p>
      )}
      {!loading && !intakeReady && (
        <p className="eng-notice">{copy.unavailable}</p>
      )}
      {kind === "partnership" && (
        <fieldset className="eng-form__group">
          <legend>{copy.restaurantGroup}</legend>
          <div className="eng-form__grid">
            {fields
              .filter(([key]) => ["restaurant_name", "city"].includes(key))
              .map(renderField)}
          </div>
        </fieldset>
      )}
      <fieldset className="eng-form__group">
        <legend>{copy.contactGroup}</legend>
        <div className="eng-form__grid">
          {fields
            .filter(
              ([key]) =>
                !["website", "comment", "resume_url", "portfolio_url"].includes(
                  key,
                ) &&
                (kind !== "partnership" ||
                  !["restaurant_name", "city"].includes(key)),
            )
            .map(renderField)}
        </div>
      </fieldset>
      {kind === "team" && (
        <fieldset className="eng-form__group">
          <legend>{copy.experienceGroup}</legend>
          <div className="eng-form__grid">
            {fields
              .filter(([key]) => ["resume_url", "portfolio_url"].includes(key))
              .map(renderField)}
          </div>
        </fieldset>
      )}
      <details className="eng-form__optional" ref={optionalRef}>
        <summary>
          {kind === "partnership" ? copy.optionalDetails : copy.optionalNote}
        </summary>
        <div className="eng-form__grid">
          {fields
            .filter(([key]) => ["website", "comment"].includes(key))
            .map(renderField)}
        </div>
      </details>
      <ApplicationConsent
        kind={kind}
        copy={copy}
        values={values}
        errors={errors}
        pending={pending}
        preview={preview}
        setValue={setValue}
        t={t}
      />
      {failure && (
        <p className="eng-notice eng-notice--error" role="alert">
          {translateEngagementMessage(failure, t)}
        </p>
      )}
      <div className="eng-form__footer">
        <span>{copy.required}</span>
        <button className="eng-button" type="submit" disabled={disabled}>
          {pending
            ? copy.sending
            : kind === "team"
              ? copy.submitTeam
              : copy.submit}
          <ArrowUpRight size={18} aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
