export const defaultSettings = {
  revision: 0,
  navigation: { restaurants: true, careers: true },
  hiring: {
    global_enabled: true,
    courier_enabled: true,
    team_enabled: true,
    courier_cities: [],
  },
};

export const vacancyStatuses = {
  draft: "Черновик",
  published: "Опубликована",
  closed: "Закрыта",
};
export const applicationStatuses = {
  new: "Новая",
  in_review: "На рассмотрении",
  contacted: "Связались",
  completed: "Завершена",
  rejected: "Отклонена",
};
export const text = (value) => (typeof value === "string" ? value.trim() : "");
export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export const isPhone = (value) =>
  /^(?:\+?380|0)\d{9}$/.test(value.replace(/[\s()-]/g, ""));
export const isWebUrl = (value) => {
  try {
    const url = new URL(value);
    return (
      ["http:", "https:"].includes(url.protocol) &&
      !!url.hostname &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
};

export const isEngagementSectionEnabled = (settings, section) =>
  ["careers", "restaurants"].includes(section) &&
  settings?.navigation?.[section] !== false;

export function eligibility(settings, kind, vacancy, city) {
  const section = kind === "partnership" ? "restaurants" : "careers";
  if (!isEngagementSectionEnabled(settings, section))
    return "This section is unavailable.";
  if (kind === "partnership") return "";
  const hiring = settings.hiring;
  if (kind === "team" && vacancy?.publication_status !== "published")
    return "Вакансия закрыта.";
  if (!hiring.global_enabled)
    return "Сейчас мы временно не принимаем новые заявки. Следите за обновлениями на странице карьеры.";
  if (kind === "courier") {
    if (!hiring.courier_enabled) return "Набор курьеров временно закрыт.";
    if (!hiring.courier_cities.length)
      return "Набор курьеров временно закрыт. Города набора пока не указаны.";
    if (
      city &&
      !hiring.courier_cities.some(
        (item) => item.toLocaleLowerCase() === text(city).toLocaleLowerCase(),
      )
    )
      return "В вашем городе набор пока не открыт.";
  } else if (!hiring.team_enabled)
    return "Приём откликов на эту вакансию временно приостановлен.";
  return "";
}

export function validateActivityEntry(input) {
  const errors = {};
  if (input === undefined) return { data: undefined, errors };
  if (!input || typeof input !== "object" || Array.isArray(input))
    return {
      data: undefined,
      errors: { activity_entry: "Provide a note or contact entry." },
    };
  const data = { type: input.type, body: text(input.body) };
  if (!["note", "contact"].includes(input.type))
    errors["activity_entry.type"] = "Choose a note or contact entry.";
  if (!data.body || data.body.length > 5000)
    errors["activity_entry.body"] = "Enter between 1 and 5000 characters.";
  if (input.type === "contact") {
    data.channel = input.channel;
    if (!["email", "phone"].includes(input.channel))
      errors["activity_entry.channel"] = "Choose email or phone.";
  } else if (input.channel !== undefined) {
    errors["activity_entry.channel"] = "Only contact entries have a channel.";
  }
  return { data, errors };
}

const lengths = {
  restaurant_name: 160,
  city: 120,
  applicant_name: 160,
  contact_name: 160,
  phone: 40,
  email: 254,
  website: 2000,
  resume_url: 2000,
  portfolio_url: 2000,
  comment: 3000,
};
export function validateSubmission(kind, input, vacancy) {
  const data = {};
  const errors = {};
  const fields =
    kind === "partnership"
      ? [
          "restaurant_name",
          "city",
          "contact_name",
          "phone",
          "email",
          "website",
          "comment",
        ]
      : kind === "courier"
        ? ["applicant_name", "city", "phone", "email", "comment"]
        : [
            "applicant_name",
            "email",
            "phone",
            "resume_url",
            "comment",
            ...(vacancy?.portfolio_field_enabled ? ["portfolio_url"] : []),
          ];
  const required =
    kind === "partnership"
      ? ["restaurant_name", "city", "contact_name", "phone"]
      : kind === "courier"
        ? ["applicant_name", "city", "phone"]
        : [
            "applicant_name",
            "email",
            ...(vacancy?.resume_required ? ["resume_url"] : []),
          ];
  for (const field of fields) {
    data[field] = text(input[field]);
    if (data[field].length > lengths[field])
      errors[field] = `Не более ${lengths[field]} символов`;
    if (required.includes(field) && !data[field])
      errors[field] = "Заполните это поле";
  }
  if (data.phone && !isPhone(data.phone))
    errors.phone = "Проверьте номер телефона";
  if (data.email && !isEmail(data.email))
    errors.email = "Проверьте адрес электронной почты";
  for (const field of ["website", "resume_url", "portfolio_url"]) {
    if (data[field] && !isWebUrl(data[field]))
      errors[field] = "Укажите корректную ссылку с http:// или https://";
  }
  data.consent = input.consent === true;
  if (!data.consent)
    errors.consent = "Подтвердите согласие на обработку данных";
  return { data, errors };
}

export function validateSettings(input) {
  const errors = {};
  const data = { navigation: {}, hiring: {} };
  for (const key of ["restaurants", "careers"]) {
    if (typeof input.navigation?.[key] !== "boolean")
      errors[key] = "Укажите состояние";
    data.navigation[key] = input.navigation?.[key];
  }
  for (const key of ["global_enabled", "courier_enabled", "team_enabled"]) {
    if (typeof input.hiring?.[key] !== "boolean")
      errors[key] = "Укажите состояние";
    data.hiring[key] = input.hiring?.[key];
  }
  const cities = input.hiring?.courier_cities;
  if (
    !Array.isArray(cities) ||
    cities.length > 50 ||
    cities.some(
      (city) => typeof city !== "string" || !text(city) || city.length > 120,
    )
  )
    errors.courier_cities = "Укажите до 50 городов, по одному на строке";
  data.hiring.courier_cities = Array.isArray(cities)
    ? [...new Set(cities.map(text))]
    : [];
  return { data, errors };
}

export function validateVacancy(input) {
  const errors = {};
  const data = {};
  for (const [field, max] of Object.entries({
    title: 160,
    slug: 160,
    department: 120,
    city: 120,
    employment_type: 120,
    overview: 5000,
  })) {
    data[field] = text(input[field]);
    const required =
      ["title", "slug"].includes(field) ||
      (input.publication_status !== "draft" &&
        ["department", "city", "overview"].includes(field));
    if (required && !data[field]) errors[field] = "Заполните это поле";
    if (data[field].length > max) errors[field] = `Не более ${max} символов`;
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug) || data.slug === "courier")
    errors.slug =
      "Укажите уникальный адрес латиницей, например support-specialist";
  for (const field of ["responsibilities", "requirements", "conditions"]) {
    const items = Array.isArray(input[field]) ? input[field] : [];
    data[field] = items.map(text).filter(Boolean);
    if (
      items.length > 50 ||
      items.some((item) => typeof item !== "string" || item.length > 1000)
    )
      errors[field] = "До 50 пунктов, не более 1000 символов каждый";
    if (
      input.publication_status !== "draft" &&
      field !== "conditions" &&
      !data[field].length
    )
      errors[field] = "Добавьте хотя бы один пункт";
  }
  for (const field of ["resume_required", "portfolio_field_enabled"]) {
    data[field] = input[field] === true;
    if (typeof input[field] !== "boolean") errors[field] = "Укажите значение";
  }
  data.publication_status = input.publication_status;
  if (!Object.hasOwn(vacancyStatuses, data.publication_status))
    errors.publication_status = "Неизвестный статус";
  return { data, errors };
}

export const footerEntries = [
  {
    key: "forRestaurants",
    label: "Для ресторанов",
    to: "/for-restaurants",
    setting: "restaurants",
  },
  { key: "careers", label: "Карьера", to: "/careers", setting: "careers" },
];
export const visibleFooterEntries = (navigation) =>
  footerEntries.filter((entry) =>
    isEngagementSectionEnabled({ navigation }, entry.setting),
  );
