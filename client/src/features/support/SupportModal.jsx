import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FileText, LoaderCircle, Paperclip, Trash2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getStoredUser } from "../../api/authConfig";
import { getRestaurants } from "../../api/restaurantService";
import { createSupportTicket } from "../../api/supportService";
import { getUserProfile } from "../../api/userService";
import { formatFileSize } from "../../utils/fileUtils";
import {
  EMPTY_SUPPORT_FORM,
  MAX_SUPPORT_FILES,
  SUPPORT_CATEGORIES,
  SUPPORT_FEATURES,
} from "./support.constants";
import { getSupportFormErrors, isUsableEmail, validateSupportFile } from "./support.utils";

const focusableSelector = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

const getInitialForm = (context) => ({
  ...EMPTY_SUPPORT_FORM,
  category: context?.category || (context?.orderId ? "order_delivery" : ""),
  relatedOrderId: context?.orderId || "",
});

export function SupportModal({
  isOpen,
  isAuthenticated,
  context,
  onClose,
  onAuthenticate,
  onOpenAccountSettings,
  onSuccess,
  onViewFaq,
}) {
  const { t } = useTranslation();
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);
  const fileInputRef = useRef(null);
  const wasOpenRef = useRef(false);
  const [form, setForm] = useState(() => getInitialForm(context));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [attachments, setAttachments] = useState([]);
  const [attachmentError, setAttachmentError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [isRestaurantsLoading, setIsRestaurantsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      setForm(getInitialForm(context));
      setErrors({});
      setTouched({});
      setAttachments([]);
      setAttachmentError("");
      setSubmitError("");
    }
    wasOpenRef.current = isOpen;
  }, [context, isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = requestAnimationFrame(() => closeButtonRef.current?.focus());

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;
      const focusableElements = [...panelRef.current.querySelectorAll(focusableSelector)];
      if (!focusableElements.length) return;
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !isAuthenticated) {
      setProfile(null);
      return undefined;
    }

    let isActive = true;
    setIsProfileLoading(true);
    getUserProfile()
      .then((data) => {
        if (isActive) setProfile(data);
      })
      .catch(() => {
        if (isActive) setProfile(null);
      })
      .finally(() => {
        if (isActive) setIsProfileLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [isAuthenticated, isOpen]);

  useEffect(() => {
    const needsRestaurants = ["restaurant_information", "offer_discount"].includes(
      form.category,
    );
    if (!isOpen || !needsRestaurants || restaurants.length) return undefined;

    let isActive = true;
    setIsRestaurantsLoading(true);
    getRestaurants()
      .then((data) => {
        if (isActive) setRestaurants(Array.isArray(data) ? data : []);
      })
      .finally(() => {
        if (isActive) setIsRestaurantsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [form.category, isOpen, restaurants.length]);

  const storedUser = getStoredUser();
  const accountEmail =
    profile?.email || profile?.username || storedUser?.email || storedUser?.username || "";
  const studentStatus = profile?.studentStatus || "Not verified";
  const formErrors = useMemo(() => getSupportFormErrors(form, t), [form, t]);
  const canSubmit =
    isAuthenticated &&
    isUsableEmail(accountEmail) &&
    !isProfileLoading &&
    !isSubmitting &&
    Object.keys(formErrors).length === 0;

  if (!isOpen) return null;

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setSubmitError("");
  };

  const markTouched = (field) => {
    setTouched((current) => ({ ...current, [field]: true }));
  };

  const handleFiles = (event) => {
    const selectedFiles = [...(event.target.files || [])];
    const availableSlots = MAX_SUPPORT_FILES - attachments.length;

    if (selectedFiles.length > availableSlots) {
      setAttachmentError(t("support.validation.tooManyFiles"));
      event.target.value = "";
      return;
    }

    const nextFiles = [];
    for (const file of selectedFiles) {
      const error = validateSupportFile(file, t);
      if (error) {
        setAttachmentError(error);
        event.target.value = "";
        return;
      }
      nextFiles.push(file);
    }

    setAttachments((current) => [...current, ...nextFiles]);
    setAttachmentError("");
    event.target.value = "";
  };

  const focusFirstError = (validationErrors) => {
    const firstErrorField = Object.keys(validationErrors)[0];
    if (!firstErrorField) return;
    requestAnimationFrame(() => {
      panelRef.current
        ?.querySelector(`[name="${firstErrorField}"]`)
        ?.focus();
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const validationErrors = getSupportFormErrors(form, t);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      focusFirstError(validationErrors);
      return;
    }

    if (!isUsableEmail(accountEmail)) return;

    const payload = new FormData();
    payload.append("category", form.category);
    payload.append("subject", form.subject);
    payload.append("description", form.description);
    if (form.category === "order_delivery") {
      payload.append("relatedOrderId", form.relatedOrderId);
    }
    if (form.category === "restaurant_information") {
      payload.append("relatedRestaurantId", form.relatedRestaurantId);
    }
    if (form.category === "offer_discount") {
      payload.append("relatedOfferId", form.relatedOfferId);
    }
    if (form.category === "technical_problem") {
      payload.append("affectedFeature", form.affectedFeature);
    }
    payload.append("studentStatus", studentStatus);
    payload.append("route", `${window.location.pathname}${window.location.hash}`);
    payload.append("userAgent", navigator.userAgent);
    payload.append("platform", navigator.userAgentData?.platform || navigator.platform || "");
    payload.append("language", navigator.language || "");
    payload.append("viewport", `${window.innerWidth}x${window.innerHeight}`);
    attachments.forEach((file) => payload.append("attachments", file));

    setIsSubmitting(true);
    setSubmitError("");
    try {
      const result = await createSupportTicket(payload);
      setForm(getInitialForm({}));
      setAttachments([]);
      setErrors({});
      setTouched({});
      onSuccess(result);
    } catch (error) {
      setSubmitError(
        error.response?.data?.message || t("support.error.description"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldError = (field) =>
    errors[field] || (touched[field] ? formErrors[field] : "") || "";

  return createPortal(
    <div
      className="support-modal"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={panelRef}
        className="support-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-modal-title"
        aria-describedby="support-modal-description"
      >
        <header className="support-modal__header">
          <div>
            <h2 id="support-modal-title">{t("support.title")}</h2>
            <p id="support-modal-description">{t("support.description")}</p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="support-modal__close"
            aria-label={t("support.close")}
            onClick={onClose}
          >
            <X aria-hidden="true" size={20} />
          </button>
        </header>

        <div className="support-modal__scroll-region">
          {!isAuthenticated ? (
            <div className="support-modal__auth-state">
              <div className="support-modal__auth-icon" aria-hidden="true">
                <FileText size={26} />
              </div>
              <h3>{t("support.auth.title")}</h3>
              <p>{t("support.auth.description")}</p>
              <div className="support-modal__auth-actions">
                <button
                  type="button"
                  className="support-modal__button support-modal__button--primary"
                  onClick={() => onAuthenticate("login")}
                >
                  {t("support.auth.signIn")}
                </button>
                <button
                  type="button"
                  className="support-modal__button support-modal__button--secondary"
                  onClick={() => onAuthenticate("register")}
                >
                  {t("support.auth.createAccount")}
                </button>
              </div>
              <button
                type="button"
                className="support-modal__text-link"
                onClick={onViewFaq}
              >
                {t("support.auth.viewFaq")}
              </button>
            </div>
          ) : (
            <form className="support-form" noValidate onSubmit={handleSubmit}>
              {submitError && (
                <div className="support-form__alert" role="alert">
                  <strong>{t("support.error.title")}</strong>
                  <span>{submitError}</span>
                  <small>{t("support.error.preserved")}</small>
                </div>
              )}

              <SupportField
                label={t("support.fields.category.label")}
                error={fieldError("category")}
                fieldId="support-category"
                required
              >
                <select
                  id="support-category"
                  name="category"
                  value={form.category}
                  aria-invalid={Boolean(fieldError("category"))}
                  aria-describedby={fieldError("category") ? "support-category-error" : undefined}
                  onChange={(event) => updateField("category", event.target.value)}
                  onBlur={() => markTouched("category")}
                >
                  <option value="">{t("support.fields.category.placeholder")}</option>
                  {SUPPORT_CATEGORIES.map((category) => (
                    <option key={category.id} value={category.id}>
                      {t(`support.categories.${category.labelKey}`)}
                    </option>
                  ))}
                </select>
              </SupportField>

              <SupportField
                label={t("support.fields.subject.label")}
                error={fieldError("subject")}
                fieldId="support-subject"
                required
              >
                <input
                  id="support-subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  maxLength="120"
                  placeholder={t("support.fields.subject.placeholder")}
                  aria-invalid={Boolean(fieldError("subject"))}
                  aria-describedby={fieldError("subject") ? "support-subject-error" : undefined}
                  onChange={(event) => updateField("subject", event.target.value)}
                  onBlur={() => markTouched("subject")}
                />
              </SupportField>

              <SupportField
                label={t("support.fields.description.label")}
                error={fieldError("description")}
                fieldId="support-description-field"
                required
              >
                <textarea
                  id="support-description-field"
                  name="description"
                  rows="6"
                  value={form.description}
                  maxLength="1500"
                  placeholder={t("support.fields.description.placeholder")}
                  aria-invalid={Boolean(fieldError("description"))}
                  aria-describedby="support-description-helper"
                  onChange={(event) => updateField("description", event.target.value)}
                  onBlur={() => markTouched("description")}
                />
                <div id="support-description-helper" className="support-form__counter">
                  <span>{fieldError("description")}</span>
                  <span>{form.description.length} / 1500</span>
                </div>
              </SupportField>

              {form.category === "order_delivery" && (
                <SupportField
                  label={t("support.fields.order.label")}
                  fieldId="support-order"
                  helper={
                    context?.recentOrders?.length
                      ? ""
                      : t("support.fields.order.helper")
                  }
                >
                  {context?.recentOrders?.length ? (
                    <select
                      id="support-order"
                      name="relatedOrderId"
                      value={form.relatedOrderId}
                      onChange={(event) => updateField("relatedOrderId", event.target.value)}
                    >
                      <option value="">{t("support.fields.order.selectPlaceholder")}</option>
                      {context.recentOrders.map((order) => (
                        <option key={order.id} value={order.id}>
                          #{order.id}{order.restaurantName ? ` · ${order.restaurantName}` : ""}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id="support-order"
                      name="relatedOrderId"
                      type="text"
                      value={form.relatedOrderId}
                      placeholder={t("support.fields.order.placeholder")}
                      onChange={(event) => updateField("relatedOrderId", event.target.value)}
                    />
                  )}
                </SupportField>
              )}

              {form.category === "restaurant_information" && (
                <SupportField
                  label={t("support.fields.restaurant.label")}
                  fieldId="support-restaurant"
                >
                  <select
                    id="support-restaurant"
                    name="relatedRestaurantId"
                    value={form.relatedRestaurantId}
                    onChange={(event) => updateField("relatedRestaurantId", event.target.value)}
                  >
                    <option value="">
                      {isRestaurantsLoading
                        ? t("support.fields.restaurant.loading")
                        : t("support.fields.restaurant.placeholder")}
                    </option>
                    {restaurants.map((restaurant) => (
                      <option key={restaurant._id || restaurant.id} value={restaurant._id || ""}>
                        {restaurant.name}
                      </option>
                    ))}
                  </select>
                </SupportField>
              )}

              {form.category === "offer_discount" && (
                <SupportField
                  label={t("support.fields.offer.label")}
                  fieldId="support-offer"
                  helper={t("support.fields.optional")}
                >
                  <input
                    id="support-offer"
                    name="relatedOfferId"
                    type="text"
                    value={form.relatedOfferId}
                    placeholder={t("support.fields.offer.placeholder")}
                    onChange={(event) => updateField("relatedOfferId", event.target.value)}
                  />
                </SupportField>
              )}

              {form.category === "student_discount" && (
                <div className="support-form__readonly">
                  <span>{t("support.fields.studentStatus.label")}</span>
                  <strong>{t(`support.studentStatuses.${studentStatus}`)}</strong>
                </div>
              )}

              {form.category === "technical_problem" && (
                <SupportField
                  label={t("support.fields.affectedFeature.label")}
                  fieldId="support-feature"
                >
                  <select
                    id="support-feature"
                    name="affectedFeature"
                    value={form.affectedFeature}
                    onChange={(event) => updateField("affectedFeature", event.target.value)}
                  >
                    <option value="">{t("support.fields.affectedFeature.placeholder")}</option>
                    {SUPPORT_FEATURES.map((feature) => (
                      <option key={feature.id} value={feature.id}>
                        {t(`support.features.${feature.labelKey}`)}
                      </option>
                    ))}
                  </select>
                </SupportField>
              )}

              <div className="support-form__field">
                <span className="support-form__label">{t("support.fields.attachments.label")}</span>
                <p className="support-form__helper">{t("support.fields.attachments.helper")}</p>
                <input
                  ref={fileInputRef}
                  className="support-form__file-input"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  multiple
                  onChange={handleFiles}
                />
                <button
                  type="button"
                  className="support-form__upload-button"
                  disabled={attachments.length >= MAX_SUPPORT_FILES}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip aria-hidden="true" size={17} />
                  {t("support.fields.attachments.action")}
                </button>
                {attachmentError && <span className="support-form__error">{attachmentError}</span>}
                {attachments.length > 0 && (
                  <ul className="support-form__files">
                    {attachments.map((file, index) => (
                      <li key={`${file.name}-${file.size}-${index}`}>
                        <div>
                          <strong>{file.name}</strong>
                          <span>{formatFileSize(file.size)}</span>
                        </div>
                        <button
                          type="button"
                          aria-label={t("support.fields.attachments.remove", { fileName: file.name })}
                          onClick={() =>
                            setAttachments((current) =>
                              current.filter((_, fileIndex) => fileIndex !== index),
                            )
                          }
                        >
                          <Trash2 aria-hidden="true" size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="support-form__contact">
                {isProfileLoading ? (
                  <span>{t("support.contact.loading")}</span>
                ) : isUsableEmail(accountEmail) ? (
                  <span>{t("support.contact.replyTo", { userEmail: accountEmail })}</span>
                ) : (
                  <div role="alert">
                    <strong>{t("support.contact.missingTitle")}</strong>
                    <p>{t("support.contact.missingDescription")}</p>
                  </div>
                )}
                <button type="button" onClick={onOpenAccountSettings}>
                  {t("support.contact.changeSettings")}
                </button>
              </div>

              <div className="support-modal__actions">
                <button
                  type="button"
                  className="support-modal__button support-modal__button--secondary"
                  onClick={onClose}
                >
                  {t("support.actions.cancel")}
                </button>
                <button
                  type="submit"
                  className="support-modal__button support-modal__button--primary"
                  disabled={!canSubmit}
                >
                  {isSubmitting && <LoaderCircle className="support-form__spinner" aria-hidden="true" size={17} />}
                  {isSubmitting ? t("support.actions.sending") : t("support.actions.send")}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>,
    document.body,
  );
}

function SupportField({ label, fieldId, error = "", helper = "", required = false, children }) {
  return (
    <div className="support-form__field">
      <label className="support-form__label" htmlFor={fieldId}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {children}
      {helper && <span className="support-form__helper">{helper}</span>}
      {error && (
        <span id={`${fieldId}-error`} className="support-form__error">
          {error}
        </span>
      )}
    </div>
  );
}
