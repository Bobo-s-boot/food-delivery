import {
  defaultSettings,
  validateSettings,
  validateSubmission,
  applicationStatuses,
  isEngagementSectionEnabled,
  validateActivityEntry,
} from "../../../shared/engagement.mjs";
import { getStoredUser } from "./authConfig";
import { createAdminRecords } from "../pages/admin/hiring/engagement.data";

const storageKey = "defilicious.engagementPreview:v1";
const clone = (value) => JSON.parse(JSON.stringify(value));
const initialCourierCities = ["Kyiv", "Lviv", "Odesa", "Dnipro"];
let settings = {
  ...clone(defaultSettings),
  hiring: {
    ...defaultSettings.hiring,
    courier_cities: [...initialCourierCities],
  },
};
// Existing candidate/restaurant fixtures are shared with the Hiring repository.
const { applications, partnerships } = createAdminRecords();
const receipts = new Map();
function restore() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved?.settings) {
      settings = saved.settings;
      const cities = settings.hiring?.courier_cities;
      const migrateCities =
        Array.isArray(cities) &&
        cities.length === 1 &&
        cities[0] === "Демо-город";
      if (migrateCities)
        settings = {
          ...settings,
          hiring: {
            ...settings.hiring,
            courier_cities: [...initialCourierCities],
          },
        };
      if (migrateCities) persist();
    }
  } catch {
    /* An unavailable browser store leaves the preview in memory. */
  }
}
function persist() {
  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify({ ...JSON.parse(localStorage.getItem(storageKey) || "{}"), settings }),
    );
  } catch {
    /* Memory-only fallback. */
  }
}
function fail(message, status = 400, errors) {
  const error = new Error(message);
  error.response = { status, data: { message, errors } };
  throw error;
}
const valid = ({ data, errors }) => {
  if (Object.keys(errors).length)
    fail("Проверьте заполненные поля", 400, errors);
  return data;
};
export function engagementPreviewRequest(path, method, input, config) {
  restore();
  const publicData = {
    settings,
    vacancies: [],
    intakeReady: true,
    demo: true,
  };
  if (path === "/public") return clone(publicData);
  if (path.startsWith("/admin")) {
    if (getStoredUser()?.role !== "admin")
      fail("У вас нет доступа к этому разделу.", 403);
    if (path === "/admin" && method === "get")
      return clone({
        settings: {
          ...settings,
          updatedAt: settings.updatedAt || "2026-10-14T12:20:00.000Z",
        },
        vacancies: [],
        applications,
        partnerships,
        intakeReady: true,
      });
    if (path === "/admin/settings") {
      if (input.revision !== settings.revision)
        fail(
          "Настройки изменились в другой сессии. Обновите данные и повторите действие.",
          409,
        );
      settings = {
        ...valid(validateSettings(input)),
        revision: settings.revision + 1,
        updatedAt: new Date().toISOString(),
      };
      persist();
      return clone(settings);
    }
    const collection = path.startsWith("/admin/applications/")
      ? applications
      : partnerships;
    const recordIndex = collection.findIndex(
      (item) => item._id === path.split("/")[3],
    );
    const current = collection[recordIndex];
    if (!current) fail("Record not found.", 404);
    const statusField =
      collection === applications ? "application_status" : "status";
    const statuses =
      collection === applications
        ? Object.keys(applicationStatuses)
        : ["new", "in_review", "completed"];
    const activity = validateActivityEntry(input.activity_entry);
    const errors = {
      ...(!statuses.includes(input[statusField])
        ? { [statusField]: "Choose a valid status." }
        : {}),
      ...(typeof input.internal_note !== "string" ||
      input.internal_note.length > 5000
        ? { internal_note: "Enter a note of up to 5000 characters." }
        : {}),
      ...(!Number.isInteger(input.revision) || input.revision < 0
        ? { revision: "Reload the record before saving." }
        : {}),
      ...activity.errors,
    };
    if (Object.keys(errors).length)
      fail("Check the highlighted fields.", 400, errors);
    if (current.revision !== input.revision)
      fail(
        "This record changed in another session. Reload the data and try again.",
        409,
      );
    const now = new Date().toISOString();
    const author = getStoredUser()?.username || "Administrator";
    const event = (fields) => ({
      id: crypto.randomUUID(),
      ...fields,
      author,
      at: now,
    });
    const entries = [];
    const statusChanged = input[statusField] !== current[statusField];
    if (statusChanged) {
      const labels = {
        new: "New",
        in_review: "In review",
        contacted: "Contacted",
        completed: "Completed",
        rejected: "Rejected",
      };
      entries.push(
        event({
          type: "status",
          body: `Status changed to ${labels[input[statusField]]}.`,
          status: input[statusField],
        }),
      );
    }
    if (activity.data) entries.push(event(activity.data));
    const note = input.internal_note.trim();
    if (
      note &&
      note !== (current.internal_note || "").trim() &&
      !(activity.data?.type === "note" && activity.data.body === note)
    )
      entries.push(event({ type: "note", body: note }));
    const saved = {
      ...current,
      [statusField]: input[statusField],
      internal_note: input.internal_note,
      activity: [...(current.activity || []), ...entries],
      ...(collection === applications && statusChanged
        ? {
            history: [
              ...(current.history || []),
              { status: input.application_status, author, at: now },
            ],
          }
        : {}),
      revision: current.revision + 1,
      updatedAt: now,
    };
    collection[recordIndex] = saved;
    return clone(saved);
  }
  const kind = path === "/partnerships" ? "partnership" : input.kind;
  if (kind !== "partnership")
    fail("Укажите направление");
  if (
    !isEngagementSectionEnabled(
      settings,
      kind === "partnership" ? "restaurants" : "careers",
    )
  )
    fail("Page not found.", 404);
  const data = valid(validateSubmission(kind, input));
  const key =
    config?.headers?.get?.("Idempotency-Key") ||
    config?.headers?.["Idempotency-Key"];
  if (typeof key !== "string" || !/^[a-zA-Z0-9-]{20,80}$/.test(key))
    fail("Check the highlighted fields.", 400, {
      request: "Reload the page and try again.",
    });
  const fingerprint = JSON.stringify({
    kind,
    vacancy_id: input.vacancy_id,
    data,
  });
  if (receipts.has(key)) {
    if (receipts.get(key).fingerprint !== fingerprint)
      fail("Обновите форму и повторите отправку.", 409);
    return { confirmed: true, receipt: receipts.get(key).id, demo: true };
  }
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const fields = { ...data };
  delete fields.consent;
  const record = {
    ...fields,
    _id: id,
    revision: 0,
    createdAt: now,
    updatedAt: now,
    internal_note: "",
    consent_at: now,
    activity: [
      {
        id: crypto.randomUUID(),
        type: "status",
        body:
          kind === "partnership"
            ? "Inquiry received."
            : "Application received.",
        status: "new",
        author: "System",
        at: now,
      },
    ],
  };
  partnerships.unshift({ ...record, status: "new" });
  receipts.set(key, { id, fingerprint });
  return { confirmed: true, receipt: id, demo: true };
}
