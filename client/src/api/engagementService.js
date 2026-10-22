import { engagementPreviewRequest } from "./engagementPreview";
import { getStoredUser } from "./authConfig";
import { getHiringWorkspace, getPublishedHiringVacancies, getPublishedHiringVacancy,
  getHiringDraft, getHiringVacancyBySlug, saveHiringRecord, deleteHiringRecord, restoreHiringRecord, updateHiringApplication, addHiringApplication, hiringFailure } from "./hiringRepository";
import { applicationStatuses, eligibility, validateSubmission, validateActivityEntry } from "../../../shared/engagement.mjs";

// These four areas intentionally use browser-local data in every build.
// Existing API adapters and authentication remain owned by the receiving app.
const request = async (method, path, data, requestKey) => {
  const config = { headers: requestKey ? { "Idempotency-Key": requestKey } : {} };
  return engagementPreviewRequest(path, method, data, config);
};
const requireHiringAdmin = () => {
  if (getStoredUser()?.role !== "admin") throw hiringFailure("Sign in with an administrator account.", 403);
};
export const getPublicEngagement = async () => {
  const data = await request("get", "/public");
  try {
    return { ...data, hiringError: "", vacancies: data.settings.navigation.careers
      ? getPublishedHiringVacancies() : [] };
  } catch (error) {
    // Hiring storage failure must not interrupt restaurant inquiries or section settings.
    return { ...data, vacancies: [], hiringError: error.message };
  }
};
export const getPublicVacancy = async (slug) => {
  const { settings } = await request("get", "/public");
  if (!settings.navigation.careers) throw hiringFailure("Вакансия не найдена.", 404);
  const authored = getPublishedHiringVacancy(slug);
  if (authored) return authored;
  const draft = getHiringVacancyBySlug(slug);
  if (draft?.publication_status === "draft" && getStoredUser()?.role === "admin")
    return { ...draft, draft_preview: true };
  throw hiringFailure("Вакансия не найдена.", 404);
};
export const getAdminEngagement = () =>
  request("get", "/admin");
export const getAdminHiringEngagement = async () => {
  requireHiringAdmin();
  const legacy = await getAdminEngagement();
  return { ...legacy, ...getHiringWorkspace() };
};
export const getAdminHiringPreview = async (id) => {
  requireHiringAdmin();
  const record = getHiringDraft(id);
  if (!record) throw hiringFailure("Vacancy not found.", 404);
  return record;
};
export const saveEngagementSettings = (data) =>
  request("put", "/admin/settings", data);
export const saveHiringVacancy = async (data, id) => {
  requireHiringAdmin();
  return saveHiringRecord(data, id);
};
export const deleteHiringVacancy = async (id, revision) => { requireHiringAdmin(); return deleteHiringRecord(id, revision); };
export const restoreHiringVacancy = async (id, revision) => { requireHiringAdmin(); return restoreHiringRecord(id, revision); };
export const saveHiringApplication = async (id, data) => {
  requireHiringAdmin();
  const activity = validateActivityEntry(data.activity_entry);
  const errors = { ...activity.errors };
  if (!Object.hasOwn(applicationStatuses, data.application_status)) errors.application_status = "Choose a valid status.";
  if (typeof data.internal_note !== "string" || data.internal_note.length > 5000) errors.internal_note = "Keep notes under 5,000 characters.";
  if (Object.keys(errors).length) throw hiringFailure("Check the highlighted fields.", 400, errors);
  return updateHiringApplication(id, { ...data, activity_entry: activity.data }, getStoredUser().username);
};
export const savePartnershipInquiry = (id, data) =>
  request("put", `/admin/partnerships/${id}`, data);
export const submitEngagement = async (kind, data, requestKey) => {
  if (kind === "partnership") return request("post", "/partnerships", data, requestKey);
  if (!["courier", "team"].includes(kind)) throw hiringFailure("Choose an application type.");
  if (!/^[a-zA-Z0-9-]{20,80}$/.test(requestKey || "")) throw hiringFailure("Reload the form and try again.");
  const payload = { ...data, kind };
  return addHiringApplication(payload, requestKey, (authoredVacancy) => {
    const { settings } = engagementPreviewRequest("/public", "get");
    const vacancy = kind === "team" ? authoredVacancy : null;
    const reason = eligibility(settings, kind, vacancy, data.city);
    if (reason) throw hiringFailure(reason, 409);
    const validation = validateSubmission(kind, data, vacancy);
    if (Object.keys(validation.errors).length) throw hiringFailure("Check the highlighted fields.", 400, validation.errors);
    const now = new Date().toISOString(), id = crypto.randomUUID();
    const fields = { ...validation.data };
    delete fields.consent;
    return { ...fields, _id: id, kind, vacancy_id: vacancy?._id || null,
      vacancy_title: vacancy?.content?.en?.title || vacancy?.title || "Delivery Courier",
      vacancy_revision: vacancy?.revision ?? null,
      vacancy_snapshot: vacancy ? { slug: vacancy.slug, title: vacancy.content ? { en: vacancy.content.en.title, uk: vacancy.content.uk.title } : { en: vacancy.title }, revision: vacancy.revision } : null,
      application_language: ["en", "uk"].includes(data.application_language) ? data.application_language : "en",
      city: kind === "courier" ? validation.data.city : "", application_status: "new", internal_note: "", revision: 0,
      createdAt: now, updatedAt: now, consent_at: now,
      activity: [{ id: crypto.randomUUID(), type: "status", status: "new", body: "Application received.", author: "System", at: now }],
      history: [{ status: "new", author: "System", at: now }] };
  });
};
export const engagementError = (
  error,
  fallback = "Не удалось выполнить запрос. Попробуйте ещё раз.",
) => error.response?.data?.message || error.message || fallback;
export const announceEngagementUpdate = () =>
  window.dispatchEvent(new Event("engagement:updated"));
