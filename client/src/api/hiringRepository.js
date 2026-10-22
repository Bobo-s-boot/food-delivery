import { emptyHiringVacancy, hiringAdminProjection, hiringPublicProjection, hiringEditable, hiringFingerprint,
  validateHiringVacancy } from "../../../shared/hiring.mjs";
import { createAdminRecords } from "../pages/admin/hiring/engagement.data";
import { createHiringStarters } from "./hiringSeed";

export const HIRING_STORAGE_KEY = "defilicious.hiringWorkspace:v3";
const clone = (value) => structuredClone(value);
export function hiringFailure(message, status = 400, errors) {
  const error = new Error(message);
  error.response = { status, data: { message, errors } };
  return error;
}
const seedApplications = createAdminRecords().applications;
function initialState() {
  const previous = JSON.parse(localStorage.getItem("defilicious.hiringWorkspace:v2") || "null");
  if (previous && (previous.schema_version !== 2 || !Array.isArray(previous.vacancies) || !Array.isArray(previous.applications)))
    throw new Error("Invalid earlier Hiring data");
  const vacancies = clone(previous?.vacancies || []);
  for (const starter of createHiringStarters())
    if (!vacancies.some((item) => item._id === starter._id || item.slug === starter.slug)) vacancies.push(starter);
  // Preserve the v1 store. Only authored UUID records migrate; design fixtures stay separate.
  const legacy = JSON.parse(localStorage.getItem("defilicious.engagementPreview:v1") || "null");
  for (const item of [...(legacy?.vacancies || []), ...(legacy?.adminOnlyVacancies || [])]) {
    if (!item._id || item._id.startsWith("preview-") || vacancies.some((record) => record._id === item._id || record.slug === item.slug)) continue;
    const record = emptyHiringVacancy();
    Object.assign(record, { _id: item._id, slug: item.slug, createdAt: item.createdAt,
      updatedAt: item.updatedAt, resume_required: item.resume_required !== false,
      portfolio_field_enabled: !!item.portfolio_field_enabled, migrated: true });
    for (const key of ["title", "department", "city", "overview", "responsibilities", "requirements", "conditions"])
      if (item[key]) record.content.en[key] = clone(item[key]);
    record.content.en.summary = (item.overview || "").slice(0, 320);
    vacancies.push(record);
  }
  return { schema_version: 3, vacancies, applications: clone(previous?.applications || seedApplications), receipts: clone(previous?.receipts || {}) };
}
function readState() {
  try {
    const raw = localStorage.getItem(HIRING_STORAGE_KEY);
    if (raw === null) {
      const state = initialState();
      localStorage.setItem(HIRING_STORAGE_KEY, JSON.stringify(state));
      return state;
    }
    const state = JSON.parse(raw);
    if (state.schema_version !== 3 || !Array.isArray(state.vacancies) || !Array.isArray(state.applications) || !state.receipts)
      throw new Error("Invalid hiring data");
    // Normalize untouched starter records that may have loaded during a development hot update.
    let normalizedSeed = false;
    for (const item of state.vacancies) {
      if (!item.seed_format && item.revision === 0 && item.createdAt === item.updatedAt &&
        ["preview-support", "preview-partners", "vacancy-delivery-operations"].includes(item._id) &&
        item.reviews?.en === hiringFingerprint(item) && item.reviews?.uk === hiringFingerprint(item)) {
        item.content = validateHiringVacancy(item).data.content;
        item.reviews = { en: hiringFingerprint(item), uk: hiringFingerprint(item) };
        item.published_snapshot = clone(hiringEditable(item)); item.seed_format = 1; normalizedSeed = true;
      }
    }
    if (normalizedSeed) localStorage.setItem(HIRING_STORAGE_KEY, JSON.stringify(state));
    return state;
  } catch {
    throw hiringFailure("Hiring data could not be read. Your browser data has been kept; try again or restore a backup.", 503);
  }
}
export function notifyHiring() {
  window.dispatchEvent(new Event("hiring:updated"));
  window.dispatchEvent(new Event("engagement:updated"));
}
async function mutate(action) {
  const commit = async () => {
    const state = readState();
    const result = action(state);
    try { localStorage.setItem(HIRING_STORAGE_KEY, JSON.stringify(state)); }
    catch { throw hiringFailure("Your changes could not be saved. Browser storage may be full or unavailable. Your form is retained.", 507); }
    notifyHiring();
    return clone(result);
  };
  return navigator.locks ? navigator.locks.request(HIRING_STORAGE_KEY, commit) : commit();
}
export const getHiringWorkspace = () => {
  const state = readState();
  return { vacancies: state.vacancies.filter((item) => !item.deleted_at).map(hiringAdminProjection), applications: state.applications,
    deletedVacancies: state.vacancies.filter((item) => item.deleted_at).sort((a, b) => b.deleted_at.localeCompare(a.deleted_at)).map((item) => ({ _id: item._id, title: item.content.en.title || item.content.uk.title, revision: item.revision })) };
};
export const getPublishedHiringVacancies = () => readState().vacancies.map(hiringPublicProjection).filter(Boolean);
export const getHiringDraft = (id) => readState().vacancies.find((item) => item._id === id && !item.deleted_at);
export const getHiringVacancyBySlug = (slug) => readState().vacancies.find((item) => item.slug === slug && !item.deleted_at);
export const getPublishedHiringVacancy = (slug) => getPublishedHiringVacancies().find((item) => item.slug === slug);
export function saveHiringRecord(input, id) {
  return mutate((state) => {
    const current = id && state.vacancies.find((item) => item._id === id);
    if (id && (!current || current.deleted_at)) throw hiringFailure("Vacancy not found.", 404);
    if (current && current.revision !== input.revision) throw hiringFailure("This vacancy changed in another tab. Reload before saving; your changes are still here.", 409);
    const action = input.action || "save";
    if (!["save", "publish", "draft", "close"].includes(action)) throw hiringFailure("Choose a valid publication action.");
    const { data, errors } = validateHiringVacancy(input, action === "publish");
    if (Object.keys(errors).length) throw hiringFailure("Check the highlighted fields.", 400, errors);
    if (state.vacancies.some((item) => item._id !== id && item.slug === data.slug))
      throw hiringFailure("This URL is already in use.", 400, { slug: "Choose a different public URL." });
    if (current?.published_at && current.slug !== data.slug) throw hiringFailure("The URL is fixed after first publication.", 400, { slug: "Keep the existing public URL." });
    const now = new Date().toISOString();
    const saved = { ...current, ...data, _id: id || crypto.randomUUID(), revision: current ? current.revision + 1 : 0,
      createdAt: current?.createdAt || now, updatedAt: now,
      publication_status: action === "save" ? current?.publication_status || "draft" : action === "publish" ? "published" : action === "close" ? "closed" : "draft" };
    if (action === "publish") {
      saved.published_snapshot = clone(hiringEditable(saved));
      saved.published_revision = saved.revision;
      saved.published_at = current?.published_at || now;
    }
    state.vacancies = current ? state.vacancies.map((item) => item._id === id ? saved : item) : [saved, ...state.vacancies];
    return hiringAdminProjection(saved);
  });
}
export function deleteHiringRecord(id, revision) {
  return mutate((state) => {
    const current = state.vacancies.find((item) => item._id === id && !item.deleted_at);
    if (!current) throw hiringFailure("Vacancy not found.", 404);
    if (current.revision !== revision) throw hiringFailure("This vacancy changed in another tab. Reload before deleting.", 409);
    current.deleted_at = new Date().toISOString(); current.publication_status = "draft"; current.revision += 1;
    return { _id: id };
  });
}
export function restoreHiringRecord(id, revision) {
  return mutate((state) => {
    const current = state.vacancies.find((item) => item._id === id && item.deleted_at);
    if (!current) throw hiringFailure("Deleted vacancy not found.", 404);
    if (current.revision !== revision) throw hiringFailure("This vacancy changed in another tab. Reload before restoring.", 409);
    delete current.deleted_at; current.publication_status = "draft"; current.revision += 1;
    return hiringAdminProjection(current);
  });
}
export function updateHiringApplication(id, input, author) {
  return mutate((state) => {
    const current = state.applications.find((item) => item._id === id);
    if (!current) throw hiringFailure("Candidate not found.", 404);
    if (current.revision !== input.revision) throw hiringFailure("This candidate changed in another tab. Reload before saving.", 409);
    const now = new Date().toISOString();
    const event = (data) => ({ id: crypto.randomUUID(), author, at: now, ...data });
    const entries = [];
    const changed = input.application_status !== current.application_status;
    if (changed) entries.push(event({ type: "status", status: input.application_status, body: "" }));
    if (input.activity_entry) entries.push(event(input.activity_entry));
    const saved = { ...current, application_status: input.application_status, internal_note: input.internal_note,
      activity: [...(current.activity || []), ...entries],
      history: [...(current.history || []), ...(changed ? [{ status: input.application_status, author, at: now }] : [])],
      revision: current.revision + 1, updatedAt: now };
    state.applications = state.applications.map((item) => item._id === id ? saved : item);
    return saved;
  });
}
export function addHiringApplication(payload, key, create) {
  return mutate((state) => {
    const fingerprint = JSON.stringify(payload);
    if (state.receipts[key]) {
      if (state.receipts[key].fingerprint !== fingerprint) throw hiringFailure("Reload the form and try again.", 409);
      return { confirmed: true, receipt: state.receipts[key].id, demo: true };
    }
    // Recheck publication inside the same write lock as the receipt/application.
    const vacancy = payload.kind === "team" ? state.vacancies.map(hiringPublicProjection).find((item) => item?._id === payload.vacancy_id) : null;
    const record = create(vacancy);
    state.applications.unshift(record);
    state.receipts[key] = { id: record._id, fingerprint };
    return { confirmed: true, receipt: record._id, demo: true };
  });
}
