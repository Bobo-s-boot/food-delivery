const messages = {
  "Заполните это поле": "form.errors.required",
  "Проверьте номер телефона": "form.errors.phone",
  "Проверьте адрес электронной почты": "form.errors.email",
  "Укажите корректную ссылку с http:// или https://": "form.errors.url",
  "Подтвердите согласие на обработку данных": "form.errors.consent",
  "Вакансия закрыта.": "availability.closed",
  "Сейчас мы временно не принимаем новые заявки. Следите за обновлениями на странице карьеры.":
    "availability.globalClosed",
  "Набор курьеров временно закрыт.": "availability.courierClosed",
  "Набор курьеров временно закрыт. Города набора пока не указаны.":
    "availability.noCities",
  "В вашем городе набор пока не открыт.": "availability.cityClosed",
  "Приём откликов на эту вакансию временно приостановлен.":
    "availability.teamClosed",
  "Вакансия не найдена.": "availability.notFound",
  "Слишком много попыток. Попробуйте позже.": "availability.rateLimit",
  "Приём заявок пока недоступен: процесс обработки персональных данных ещё не утверждён.":
    "form.unavailable",
  "Обновите форму и повторите отправку.": "form.stale",
  "Обновите страницу и повторите отправку": "form.reload",
};
export function translateEngagementMessage(
  message,
  t,
  fallback = "form.failure",
) {
  if (!message) return "";
  if (messages[message]) return t("engagement." + messages[message]);
  const length = message.match(/^Не более (\d+) символов$/);
  if (length)
    return t("engagement.form.errors.length", { count: Number(length[1]) });
  return t("engagement." + fallback);
}
// Present the selected language from the same authored record used by Hiring.
export function localizeVacancy(vacancy, t, demo, language) {
  const locale = language === "uk" || (!language && t("engagement.hiring.locale") === "uk") ? "uk" : "en";
  const content = vacancy.content[locale];
  const employment = vacancy.employment_type ? t("engagement.hiring.employment." + vacancy.employment_type) : "";
  const mode = vacancy.work_mode ? t("engagement.hiring.workMode." + vacancy.work_mode) : "";
  return { ...vacancy, ...content, employment_type: [mode, employment].filter(Boolean).join(" · "),
    faq: content.faq.map(({ question, answer }) => [question, answer]) };
}
export function displayCity(city, t, demo) {
  if (!demo) return city;
  if (city === "Демо-город") return t("engagement.common.previewCity");
  const initialCityKeys = { Kyiv: "kyiv", Lviv: "lviv", Odesa: "odesa", Dnipro: "dnipro" };
  return initialCityKeys[city]
    ? t("engagement.common.cityNames." + initialCityKeys[city])
    : city;
}
export function filterVacancies(vacancies, { department, city, search }) {
  const query = search.trim().toLocaleLowerCase();
  return vacancies.filter(
    (item) =>
      (!department ||
        (item.sourceDepartment ?? item.department) === department) &&
      (!city || (item.sourceCity ?? item.city) === city) &&
      item.title.toLocaleLowerCase().includes(query),
  );
}
