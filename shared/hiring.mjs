// Framework-independent vacancy contract. A future API can validate this same payload.
export const hiringLanguages = ["en", "uk"];
export const hiringTextFields = {
  title: 160, department: 120, city: 120, schedule: 160,
  summary: 320, overview: 5000, image_alt: 200, detail_image_alt: 200,
};
export const hiringListFields = ["responsibilities", "requirements", "conditions"];
export const employmentTypes = ["full_time", "part_time", "contract", "internship"];
export const workModes = ["onsite", "hybrid", "remote"];
export const emptyHiringContent = () => ({
  ...Object.fromEntries(Object.keys(hiringTextFields).map((key) => [key, ""])),
  responsibilities: [], requirements: [], conditions: [], faq: [],
});
export const emptyHiringVacancy = () => ({
  schema_version: 2, slug: "", source_language: "en", employment_type: "", work_mode: "",
  resume_required: true, portfolio_field_enabled: false, faq_enabled: false,
  image_mode: "shared", images: { card: null, detail: null },
  content: { en: emptyHiringContent(), uk: emptyHiringContent() }, reviews: {},
  publication_status: "draft", revision: 0,
});
export function hiringEditable(record) {
  const { slug, source_language, employment_type, work_mode, resume_required,
    portfolio_field_enabled, faq_enabled, image_mode, images, content } = record;
  return { slug, source_language, employment_type, work_mode, resume_required,
    portfolio_field_enabled, faq_enabled, image_mode, images, content };
}
export function hiringFingerprint(record) {
  // Review identity, not an authentication/security signature.
  const value = JSON.stringify(hiringEditable(record));
  let a = 2166136261, b = 5381;
  for (let i = 0; i < value.length; i++) {
    a = Math.imul(a ^ value.charCodeAt(i), 16777619);
    b = Math.imul(b, 33) ^ value.charCodeAt(i);
  }
  return `${value.length}:${a >>> 0}:${b >>> 0}`;
}
export const hiringReviewed = (record, language) =>
  record.reviews?.[language] === hiringFingerprint(record);

export function validateHiringVacancy(input, publishing = false) {
  const errors = {};
  const data = { ...emptyHiringVacancy(), ...hiringEditable(input), reviews: { ...input.reviews } };
  data.slug = typeof input.slug === "string" ? input.slug : "";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug) || data.slug.length > 160 || data.slug === "courier")
    errors.slug = "Enter a unique link ending, such as customer-support-specialist. Use lowercase English letters, numbers and hyphens; ‘courier’ is reserved.";
  if (!hiringLanguages.includes(data.source_language)) errors.source_language = "Choose the language you write first.";
  for (const [key, choices] of [["employment_type", employmentTypes], ["work_mode", workModes]])
    if ((publishing || data[key]) && !choices.includes(data[key])) errors[key] = "Choose an option.";
  for (const key of ["resume_required", "portfolio_field_enabled", "faq_enabled"])
    if (typeof data[key] !== "boolean") errors[key] = "Choose a value.";
  if (!["shared", "separate"].includes(data.image_mode)) errors.image_mode = "Choose how images are used.";
  data.images = { card: input.images?.card || null, detail: input.images?.detail || null };
  for (const value of Object.values(data.images))
    if (value !== null && (typeof value !== "string" || value.length > 100)) errors.images = "Choose a valid uploaded image.";
  data.content = {};
  for (const language of hiringLanguages) {
    const source = input.content?.[language] || {};
    const content = emptyHiringContent();
    for (const [key, max] of Object.entries(hiringTextFields)) {
      content[key] = typeof source[key] === "string" ? source[key] : "";
      if (content[key].length > max) errors[`content.${language}.${key}`] = `Use at most ${max} characters.`;
      if (publishing && ["title", "department", "city", "summary", "overview"].includes(key) && !content[key].trim())
        errors[`content.${language}.${key}`] = "Complete this field before publishing.";
    }
    for (const key of hiringListFields) {
      content[key] = Array.isArray(source[key]) ? source[key].filter((item) => typeof item === "string") : [];
      if (content[key].length > 50 || content[key].some((item) => item.length > 1000))
        errors[`content.${language}.${key}`] = "Use up to 50 items, each at most 1,000 characters.";
      if (publishing && key !== "conditions" && !content[key].some((item) => item.trim()))
        errors[`content.${language}.${key}`] = "Add at least one item before publishing.";
    }
    content.faq = Array.isArray(source.faq) ? source.faq.map((item) => ({
      id: typeof item.id === "string" ? item.id : "", question: typeof item.question === "string" ? item.question : "",
      answer: typeof item.answer === "string" ? item.answer : "",
    })) : [];
    if (content.faq.length > 20) errors[`content.${language}.faq`] = "Use at most 20 questions.";
    if (publishing && data.faq_enabled && !content.faq.length) errors[`content.${language}.faq`] = "Add a question or turn the FAQ off.";
    content.faq.forEach((item, index) => {
      if (!item.id || item.question.length > 240 || item.answer.length > 3000 ||
        (publishing && data.faq_enabled && (!item.question.trim() || !item.answer.trim())))
        errors[`content.${language}.faq.${index}`] = "Enter a question (up to 240 characters) and answer (up to 3,000).";
    });
    if (publishing && data.images.card && !content.image_alt.trim())
      errors[`content.${language}.image_alt`] = "Describe the uploaded card image.";
    if (publishing && data.image_mode === "separate" && data.images.detail && !content.detail_image_alt.trim())
      errors[`content.${language}.detail_image_alt`] = "Describe the uploaded detail image.";
    data.content[language] = content;
  }
  if (!hiringLanguages.some((language) => data.content[language].title.trim()))
    errors["content.en.title"] = "Enter a title in at least one language to save your work.";
  if (data.faq_enabled && data.content.en.faq.map((item) => item.id).join() !== data.content.uk.faq.map((item) => item.id).join())
    errors.faq = "Keep the same questions and order in both languages.";
  if (publishing) for (const language of hiringLanguages)
    if (!hiringReviewed(data, language)) errors[`reviews.${language}`] = `Review the ${language === "en" ? "English" : "Ukrainian"} version before publishing.`;
  return { data, errors };
}

export function hiringAdminProjection(record) {
  const content = record.content.en.title.trim() ? record.content.en : record.content.uk;
  return { ...record, title: content.title, department: content.department, city: content.city,
    has_unpublished_changes: !!record.published_snapshot &&
      hiringFingerprint(record) !== hiringFingerprint(record.published_snapshot) };
}
export function hiringPublicProjection(record) {
  if (record.deleted_at || record.publication_status !== "published" || !record.published_snapshot) return null;
  return { ...record.published_snapshot, _id: record._id, revision: record.published_revision,
    publication_status: "published", schema_version: 2, published_at: record.published_at };
}
export function hiringSlug(title) {
  const letters = { а:"a",б:"b",в:"v",г:"h",ґ:"g",д:"d",е:"e",є:"ye",ж:"zh",з:"z",и:"y",і:"i",ї:"yi",й:"y",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"kh",ц:"ts",ч:"ch",ш:"sh",щ:"shch",ь:"",ю:"yu",я:"ya" };
  return [...title.toLowerCase()].map((char) => letters[char] ?? char).join("").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[’'ʼ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 150).replace(/-$/g, "");
}
