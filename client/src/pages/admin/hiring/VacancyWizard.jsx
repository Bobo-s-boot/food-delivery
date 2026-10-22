import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Eye, X, Ellipsis, Trash2 } from "lucide-react";
import { I18nextProvider, useTranslation } from "react-i18next";
import { hiringEditable, hiringFingerprint, hiringReviewed, hiringLanguages, validateHiringVacancy, hiringSlug } from "../../../../../shared/hiring.mjs";
import { saveHiringVacancy, deleteHiringVacancy } from "../../../api/engagementService";

import { useUnsavedChanges } from "../../../features/engagement/useUnsavedChanges";
import { localizeVacancy } from "../../../features/engagement/engagement.utils";
import { VacancyCard } from "../../../features/engagement/components/VacancyCard";

import { VacancyView } from "../../../features/engagement/components/VacancyView";
import { AdminCard } from "../components/AdminCard";
import { AdminField, HiringHint } from "./components/HiringPrimitives";
import { BackLink, ConfirmationDialog, EngagementHeading as HiringHeading } from "../components/engagement/EngagementPrimitives";
import { unsavedMessage } from "./engagementLabels";
import { EngagementSelect } from "../components/engagement/EngagementSelect";
import { useHiringNotification } from "./HiringNotificationContext";
import { VacancyRoleDetails } from "./components/vacancy-editor/VacancyRoleDetails";
import { VacancyContentStep } from "./components/vacancy-editor/VacancyContentStep";
import { VacancyImagesStep } from "./components/vacancy-editor/VacancyImagesStep";
import { VacancyReviewStep } from "./components/vacancy-editor/VacancyReviewStep";
import { VacancyOptionsStep } from "./components/vacancy-editor/VacancyOptionsStep";
import "./VacancyWizard.scss";

const defaultSteps = [
  ["details", "Role details", "Set the public address and working arrangements."],
  ["en", "English content", "Write the card summary and complete role description."],
  ["uk", "Ukrainian content", "Add the same information in Ukrainian."],
  ["images", "Images", "Upload one image for both views, or use separate images."],
  ["options", "FAQ & applications", "Choose what candidates read and submit."],
  ["review", "Review & publish", "Check both languages before making this version public."],
];
const baseFieldStep = (key) => key.startsWith("reviews.") ? 5 : key.includes("faq") || ["resume_required", "portfolio_field_enabled"].includes(key) ? 4
  : key.startsWith("images") || key.includes("image_") || key.startsWith("image_mode") ? 3
    : key.startsWith("content.en.") ? 1 : key.startsWith("content.uk.") ? 2 : 0;
const titles = { title: "Job title", department: "Team / department", city: "Job location",
  schedule: "Working days and hours (optional)", summary: "Summary for the vacancy card", overview: "Full job description",
  responsibilities: "Responsibilities", requirements: "Requirements", conditions: "Working conditions (optional)" };
const contentHelp = {
  title: "The heading on the vacancy card and full page. Enter the job name, such as Customer Support Specialist.",
  department: "Shown as the team on the card and full page, and used by the team filter. For example, Customer Experience.",
  city: "Shown on the card and full page, and used by the location filter. Enter a city, such as Kyiv, or Remote.",
  schedule: "Shown on the card and full page. Include working days and hours, such as Mon–Fri · 09:00–18:00.",
  summary: "The short introduction on the Careers vacancy card. Sum up the role in up to 320 characters.",
  overview: "Shown under About the role on the full vacancy page. Explain the purpose of the role and the team. Paragraph breaks are kept.",
  responsibilities: "Shown under What you’ll do on the full page. Enter one task per line; up to 50 lines, each up to 1,000 characters.",
  requirements: "Shown under What matters for this role on the full page. Enter one skill or requirement per line; up to 50 lines.",
  conditions: "Shown in Working arrangements on the full page. Enter one benefit or working condition per line, or leave blank.",
};

export function VacancyWizard({ record, data, base, onSaved, onReload }) {
  const [form, setForm] = useState(() => structuredClone(record));
  const manualSlug = useRef(!!record.slug);
  const steps = form.source_language === "uk" ? [defaultSteps[0], defaultSteps[2], defaultSteps[1], ...defaultSteps.slice(3)] : defaultSteps;
  const fieldStep = (key) => {
    const index = baseFieldStep(key);
    return form.source_language === "uk" && [1, 2].includes(index) ? 3 - index : index;
  };
  const [saved, setSaved] = useState(record);
  const [desiredStatus, setDesiredStatus] = useState(record.publication_status);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [saving, setPending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const pending = saving || uploading;
  const [confirm, setConfirm] = useState(null);
  const [preview, setPreview] = useState(null);
  const heading = useRef(null), mutex = useRef(false), actions = useRef(null);
  const navigate = useNavigate();
  const notify = useHiringNotification();
  const statusChanged = desiredStatus !== saved.publication_status;
  const contentDirty = JSON.stringify(form) !== JSON.stringify(saved);
  const dirty = contentDirty || statusChanged;
  useUnsavedChanges(dirty || uploading, unsavedMessage);
  useEffect(() => { heading.current?.focus(); }, [step]);
  useEffect(() => {
    const closeOutside = (event) => {
      if (actions.current && !actions.current.contains(event.target)) actions.current.open = false;
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);
  const allErrors = validateHiringVacancy(form, true).errors;
  const contentErrors = Object.fromEntries(Object.entries(allErrors).filter(([key]) => !key.startsWith("reviews.")));
  const contentReady = !Object.keys(contentErrors).length;
  const ready = contentReady && hiringLanguages.every((language) => hiringReviewed(form, language));
  const publicChanges = saved.publication_status === "published" && hiringFingerprint(form) !== hiringFingerprint(saved.published_snapshot);
  const saveAction = statusChanged ? ({ published: "publish", draft: "draft", closed: "close" })[desiredStatus] : "save";
  const saveLabel = statusChanged ? ({ published: "Publish vacancy", draft: "Save as Draft", closed: "Save as Closed" })[desiredStatus]
    : saved.publication_status === "published" ? "Save working copy" : saved.publication_status === "closed" ? "Save changes" : "Save draft";
  const errorSummary = (fields) => Object.entries(fields).slice(0, 3).map(([key, message]) => {
    if (key.startsWith("reviews.")) return message;
    const parts = key.split(".");
    const names = { ...titles, slug: "Vacancy page link", source_language: "Language you write first", employment_type: "Employment type", work_mode: "Workplace", image_alt: "Card image description", detail_image_alt: "Detail image description", images: "Images", image_mode: "Image usage", faq: "FAQ" };
    return (key.startsWith("content.") ? parts[1].toUpperCase() + " · " : "") + (names[parts.at(-1)] || (key.includes(".faq.") ? "FAQ question " + (Number(parts.at(-1)) + 1) : parts.at(-1).replaceAll("_", " "))) + ": " + message;
  }).join(" ") + (Object.keys(fields).length > 3 ? " Check the other highlighted fields too." : "");
  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "", ...(key === "reviews" ? Object.fromEntries(hiringLanguages.filter((lang) => value[lang] === hiringFingerprint(form)).map((lang) => ["reviews." + lang, ""])) : {}) }));
    setFeedback(null);
  };
  const updateSlug = (value) => { manualSlug.current = !!value; update("slug", value); };
  const updateContent = (language, key, value) => {
    setForm((current) => ({ ...current,
      ...(key === "title" && language === current.source_language && !saved.published_at && !manualSlug.current ? { slug: hiringSlug(value) } : {}),
      content: { ...current.content, [language]: { ...current.content[language], [key]: value } } }));
    setErrors((current) => ({ ...current, ["content." + language + "." + key]: "", ...(key === "title" && language === form.source_language && !saved.published_at && !manualSlug.current ? { slug: "" } : {}) }));
    setFeedback(null);
  };
  const updateImage = (key, id) => {
    setForm((current) => ({ ...current, images: { ...current.images, [key]: id } }));
    setFeedback(null);
  };
  const persist = async (action = "save") => {
    if (mutex.current || uploading) return;
    if (action === "delete") {
      mutex.current = true; setPending(true);
      try { await deleteHiringVacancy(saved._id, saved.revision); notify?.({ title: "Vacancy deleted", description: "Candidates are kept. You can restore the vacancy as a draft." }); navigate(base + "/vacancies", { replace: true }); }
      catch (error) { notify?.({ title: "Vacancy could not be deleted", description: error.response?.data?.message || "Please try again.", tone: "error" }); }
      finally { setPending(false); mutex.current = false; }
      return;
    }
    const validation = validateHiringVacancy(form, action === "publish");
    setErrors(validation.errors);
    if (Object.keys(validation.errors).length) {
      setStep(fieldStep(Object.keys(validation.errors)[0]));
      notify?.({ title: action === "publish" ? "Vacancy is not ready to publish" : "Check the vacancy details", description: errorSummary(validation.errors), tone: "error" });
      return;
    }
    mutex.current = true; setPending(true); setFeedback(null);
    try {
      const result = await saveHiringVacancy({ ...validation.data, action, revision: form.revision }, form._id);
      setForm(result); setSaved(result); setDesiredStatus(result.publication_status); onSaved(result);
      notify?.({ title: action === "publish" ? "Vacancy published" : action === "draft" ? "Saved as draft" : action === "close" ? "Vacancy closed" : result.publication_status === "published" ? "Working copy saved" : result.publication_status === "closed" ? "Vacancy saved" : "Saved as draft",
        description: action === "publish" ? "Both reviewed language versions are now live." : action === "close" ? "The website page is unavailable. Candidates are kept." : result.publication_status === "published" ? "The approved website version stays live until you publish updates." : "" });
      if (!form._id) navigate(base + "/vacancies/" + result._id, { replace: true });
    } catch (error) {
      setErrors(error.response?.data?.errors || {});
      setFeedback({ error: true, conflict: error.response?.status === 409, message: error.response?.data?.message || "Could not save. Please try again." });
      if (Object.keys(error.response?.data?.errors || {}).length) setStep(fieldStep(Object.keys(error.response.data.errors)[0]));
      notify?.({ title: "Vacancy could not be saved", description: error.response?.data?.errors ? errorSummary(error.response.data.errors) : error.response?.data?.message || "Please try again. Your changes are retained.", tone: "error" });
    } finally { setPending(false); mutex.current = false; }
  };
  const input = (key, label, value, onChange, { multiline = false, helper, maxLength, disabled = false } = {}) =>
    <AdminField key={key} name={key} label={label} error={errors[key]} helper={helper}>
      {multiline ? <textarea id={key} name={key} value={value} onChange={(event) => onChange(event.target.value)} rows={7} maxLength={maxLength} disabled={pending || disabled} />
        : <input id={key} name={key} value={value} onChange={(event) => onChange(event.target.value)} maxLength={maxLength} disabled={pending || disabled} />}
    </AdminField>;
  
  const toggle = (key, label, description) => <label className="hiring-switch">
    <input type="checkbox" checked={form[key]} disabled={pending} onChange={(event) => update(key, event.target.checked)} />
    <span><strong>{label}</strong><small>{description}</small></span>
  </label>;
  const addQuestion = () => {
    const id = crypto.randomUUID();
    setForm((current) => ({ ...current, content: Object.fromEntries(hiringLanguages.map((language) => [language, { ...current.content[language], faq: [...current.content[language].faq, { id, question: "", answer: "" }] }])) }));
  };
  const removeQuestion = (item) => setForm((current) => ({ ...current, content: Object.fromEntries(hiringLanguages.map((language) => [language, { ...current.content[language], faq: current.content[language].faq.filter((entry) => entry.id !== item.id) }])) }));
  const changeQuestion = (language, index, key, value) => updateContent(language, "faq", form.content[language].faq.map((item, i) => i === index ? { ...item, [key]: value } : item));
  const moveQuestion = (index, target) => setForm((current) => ({ ...current, content: Object.fromEntries(hiringLanguages.map((language) => {
    const faq = [...current.content[language].faq];
    [faq[index], faq[target]] = [faq[target], faq[index]];
    return [language, { ...current.content[language], faq }];
  })) }));
  const discard = () => { setForm(saved); setDesiredStatus(saved.publication_status); setErrors({}); setFeedback(null); notify?.({ title: "Unsaved changes discarded" }); };
  const confirmAction = (action) => {
    actions.current.open = false;
    actions.current.querySelector("summary").focus();
    setConfirm(action);
  };
  return <div className="hiring-vacancy-editor">
    <BackLink to={base + "/vacancies"}>Back to vacancies</BackLink>
    <HiringHeading title={form._id ? form.content.en.title || form.content.uk.title || "Edit vacancy" : "Create vacancy"} />
    <div className="hiring-editor-toolbar" role="region" aria-label="Vacancy controls">
      <div className="hiring-editor-status">
        <EngagementSelect id="vacancy-publication-status" label="Vacancy status" value={desiredStatus} options={[{ value: "published", label: "Published" }, { value: "draft", label: "Draft" }, { value: "closed", label: "Closed" }]} disabled={pending} onChange={setDesiredStatus} />
      </div>
      <div className="hiring-editor-view-actions">
        <button type="button" disabled={pending} onClick={() => setPreview({ language: "en", mode: "detail" })}><Eye size={16} aria-hidden="true" />Admin preview</button>
        {saved._id && saved.publication_status === "published" && <Link className="hiring-button" to={"/careers/" + saved.slug} target="_blank" rel="noopener noreferrer">View public page</Link>}
        {saved._id && saved.publication_status === "draft" && <Link className="hiring-button" to={"/careers/" + saved.slug} target="_blank" rel="noopener noreferrer">View draft page</Link>}
      </div>
      <div className="hiring-editor-save">
        <div className="hiring-editor-save__buttons">
          {publicChanges && !statusChanged && <button type="button" disabled={pending} onClick={() => persist("publish")}>Publish updates</button>}
          <button type="button" className="is-primary" disabled={pending || !dirty} onClick={() => persist(saveAction)}>{saving ? "Saving…" : uploading ? "Saving image…" : saveLabel}</button>
        </div>
      </div>
      {(saved._id || dirty) && <details className="hiring-editor-more" ref={actions} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false; }} onKeyDown={(event) => { if (event.key === "Escape") { event.currentTarget.open = false; event.currentTarget.querySelector("summary").focus(); } }}><summary aria-label="More vacancy actions" aria-disabled={pending} onClick={(event) => { if (pending) event.preventDefault(); }}><Ellipsis size={18} aria-hidden="true" /></summary><div>
        {dirty && <button type="button" disabled={pending} onClick={() => confirmAction("discard")}>Discard unsaved changes</button>}
        {saved._id && <button type="button" className="hiring-editor-delete" disabled={pending} onClick={() => confirmAction("delete")}><Trash2 size={16} aria-hidden="true" />Delete vacancy</button>}
      </div></details>}
    </div>
    {record.migrated && <p className="hiring-notice">Your earlier vacancy is retained as a draft. Complete and review both languages before publishing it.</p>}
    {record.revision > saved.revision && <p className="hiring-notice">A newer version was saved in another tab. Your current work has been retained. Reload the saved version before saving again.</p>}
    <nav className="hiring-steps" aria-label="Vacancy creation steps">
      {steps.map(([key, title], index) => {
        const complete = index === 5 ? ready : !Object.keys(contentErrors).some((field) => fieldStep(field) === index);
        return <button key={key} type="button" aria-current={step === index ? "step" : undefined} onClick={() => setStep(index)} disabled={pending}>
          <span className="hiring-steps__number">{index + 1}</span>
          <span><strong>{title}</strong><small>{complete ? "Ready" : "To complete"}</small></span>
        </button>;
      })}
    </nav>
    <form noValidate onSubmit={(event) => { event.preventDefault(); if (dirty && !pending) persist(saveAction); }}>
      <AdminCard className="hiring-wizard-panel">
        <div className="hiring-wizard-heading"><h2 tabIndex={-1} ref={heading}>{steps[step][1]}</h2><p>{steps[step][2]}</p></div>
        {step === 0 && <VacancyRoleDetails
          form={form}
          saved={saved}
          updateSlug={updateSlug}
          update={update}
          input={input}
          errors={errors}
          pending={pending}
        />}
        {(step === 1 || step === 2) && <VacancyContentStep
          form={form}
          steps={steps}
          step={step}
          input={input}
          updateContent={updateContent}
          titles={titles}
          contentHelp={contentHelp}
        />}
        {step === 3 && <VacancyImagesStep
          form={form}
          pending={pending}
          input={input}
          update={update}
          setUploading={setUploading}
          updateImage={updateImage}
          updateContent={updateContent}
        />}
        {step === 4 && <VacancyOptionsStep
          form={form}
          pending={pending}
          toggle={toggle}
          input={input}
          errors={errors}
          changeQuestion={changeQuestion}
          moveQuestion={moveQuestion}
          removeQuestion={removeQuestion}
          addQuestion={addQuestion}
        />}
        {step === 5 && <VacancyReviewStep
          form={form}
          errors={errors}
          pending={pending}
          contentReady={contentReady}
          contentErrors={contentErrors}
          allErrors={allErrors}
          ready={ready}
          data={data}
          setPreview={setPreview}
          update={update}
          setStep={setStep}
          fieldStep={fieldStep}
          setErrors={setErrors}
        />}
      </AdminCard>
      {feedback?.conflict && <div className="hiring-notice" role="alert">{feedback.message}<button type="button" onClick={() => setConfirm("reload")}>Reload saved version</button></div>}
      <div className="hiring-wizard-footer">
        <div><button type="button" disabled={pending || step === 0} title={step === 0 ? "You are on the first step" : "Go to the previous step without saving"} onClick={() => setStep(step - 1)}><ChevronLeft size={16} aria-hidden="true" />Previous step</button>
          {step < 5 && <button type="button" className="is-primary" disabled={pending} onClick={() => setStep(step + 1)}>Continue<ChevronRight size={16} aria-hidden="true" /></button>}</div>
        <HiringHint id="vacancy-step-help" label="Step navigation">Previous is unavailable on the first step. These buttons move between steps without saving. Use Save in the top controls to keep your changes.</HiringHint>
      </div>
    </form>
    {confirm && <ConfirmationDialog title={confirm === "delete" ? "Delete this vacancy?" : confirm === "close" ? "Close this vacancy?" : confirm === "draft" ? "Return this vacancy to Draft?" : confirm === "reload" ? "Reload the saved version?" : "Discard your unsaved changes?"}
      description={confirm === "delete" ? "Remove the vacancy from Hiring and the website. Candidates and their saved job details stay available. You can restore it as a draft from the vacancy list." : ["close", "draft"].includes(confirm) ? "The public card disappears. Closed pages are unavailable to everyone; Draft pages can be previewed only by administrators. Existing applications stay in Hiring." : "Your unsaved changes will be replaced by the saved working copy."}
      action={confirm === "delete" ? "Delete vacancy" : confirm === "close" ? "Close vacancy" : confirm === "draft" ? "Return to Draft" : confirm === "reload" ? "Reload saved version" : "Discard changes"}
      onClose={() => setConfirm(null)} onConfirm={() => { const action = confirm; setConfirm(null); if (action === "discard") discard(); else if (action === "reload") onReload(); else persist(action); }} />}
    {preview && <VacancyPreview form={form} preview={preview} setPreview={setPreview} onClose={() => setPreview(null)} />}
  </div>;
}


function VacancyPreview({ form, preview, setPreview, onClose }) {
  const dialog = useRef(null);
  const { i18n } = useTranslation();
  const previewI18n = useMemo(() => i18n.cloneInstance({ lng: preview.language, initImmediate: false }), [i18n, preview.language]);
  useEffect(() => { const opener = document.activeElement; dialog.current.showModal(); return () => { opener?.focus(); }; }, []);
  const t = i18n.getFixedT(preview.language);
  const record = { ...hiringEditable(form), _id: form._id || "unsaved", schema_version: 2, publication_status: "draft" };
  return <dialog className="hiring-preview-dialog" ref={dialog} aria-label="Admin vacancy preview" onCancel={(event) => { event.preventDefault(); onClose(); }}>
    <div className="hiring-preview-toolbar"><div><strong>Admin preview</strong><small>Working copy · only available inside Hiring</small></div>
      <div className="hiring-actions">{["en", "uk"].map((language) => <button key={language} type="button" aria-pressed={preview.language === language} onClick={() => setPreview({ ...preview, language })}>{language === "en" ? "English" : "Ukrainian"}</button>)}
        {["card", "detail"].map((mode) => <button key={mode} type="button" aria-pressed={preview.mode === mode} onClick={() => setPreview({ ...preview, mode })}>{mode === "card" ? "Card" : "Full page"}</button>)}
        <button type="button" aria-label="Close preview" onClick={onClose} autoFocus><X size={20} /></button></div></div>
    <I18nextProvider i18n={previewI18n}><div className="hiring-preview-body">{preview.mode === "card" ? <div className="eng-page"><div className="eng-roles"><VacancyCard vacancy={localizeVacancy(record, t, false, preview.language)} preview /></div></div>
      : <VacancyView record={record} language={preview.language} preview />}</div></I18nextProvider>
  </dialog>;
}

