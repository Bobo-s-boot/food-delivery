export const applicationStatuses = {
  new: "New",
  in_review: "In review",
  contacted: "Contacted",
  completed: "Completed",
  rejected: "Rejected",
};
export const vacancyStatuses = {
  draft: "Draft",
  published: "Published",
  closed: "Closed",
};
export const partnershipStatuses = {
  new: "New",
  in_review: "In review",
  completed: "Completed",
};
export const unsavedMessage =
  "You have unsaved changes. Leave this page without saving?";

const messages = {
  "У вас нет доступа к этому разделу.":
    "You do not have access to this section. Sign in with an administrator account.",
  "Вакансия не найдена.": "Vacancy not found. Refresh the workspace.",
  "Запись не найдена.": "Record not found. Refresh the workspace.",
  "Проверьте заполненные поля": "Check the highlighted fields and try again.",
  "Заполните это поле": "Complete this field.",
  "Укажите значение": "Choose a value.",
  "Укажите состояние": "Choose a state.",
  "Неизвестный статус": "Choose a valid status.",
  "Проверьте заметку": "Keep the internal note under 5,000 characters.",
  "Добавьте хотя бы один пункт": "Add at least one item.",
  "До 50 пунктов, не более 1000 символов каждый":
    "Use up to 50 items, with at most 1,000 characters each.",
  "Укажите уникальный адрес латиницей, например support-specialist":
    "Use a unique URL slug, such as support-specialist.",
  "Этот адрес уже используется": "This URL slug is already in use.",
  "Адрес опубликованной вакансии нельзя менять":
    "The URL of a published vacancy cannot be changed.",
  "Укажите до 50 городов, по одному на строке":
    "Enter up to 50 cities, one per line.",
  "Настройки изменились в другой сессии. Обновите данные и повторите действие.":
    "Settings changed in another session. Reload the data and try again.",
  "Данные изменились в другой сессии. Обновите данные и повторите действие.":
    "This record changed in another session. Your draft is retained; reload the data before trying again.",
};
export function adminMessage(
  message,
  fallback = "Unable to save changes. Please try again.",
) {
  if (!message) return fallback;
  if (messages[message]) return messages[message];
  const limit = message.match(/^Не более (\d+) символов$/);
  if (limit) return `Use no more than ${limit[1]} characters.`;
  return /[\u0400-\u04ff]/.test(message) ? fallback : message;
}
export const adminErrors = (errors = {}) =>
  Object.fromEntries(
    Object.entries(errors).map(([key, value]) => [
      key,
      adminMessage(value, "Check this field and try again."),
    ]),
  );
export function hiringAvailability(settings, kind) {
  if (!settings.hiring.global_enabled)
    return "New applications are paused. Existing applications remain available.";
  if (kind === "courier" && !settings.hiring.courier_enabled)
    return "Courier hiring is closed.";
  if (kind === "courier" && !settings.hiring.courier_cities.length)
    return "Add recruitment cities to open courier applications.";
  if (kind === "team" && !settings.hiring.team_enabled)
    return "Applications for team vacancies are paused.";
  return "";
}
