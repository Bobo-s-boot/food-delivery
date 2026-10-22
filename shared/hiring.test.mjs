import assert from 'node:assert/strict';
import test from 'node:test';
import {
  emptyHiringVacancy, hiringAdminProjection, hiringEditable, hiringFingerprint,
  hiringPublicProjection, hiringReviewed, hiringSlug, validateHiringVacancy,
} from './hiring.mjs';

function vacancy() {
  const record = emptyHiringVacancy();
  Object.assign(record, { slug: 'support-specialist', employment_type: 'full_time', work_mode: 'hybrid', faq_enabled: true });
  for (const language of ['en', 'uk']) Object.assign(record.content[language], {
    title: `${language} support`, department: 'Support', city: 'Kyiv',
    summary: 'Help customers.', overview: 'Work with our team.',
    responsibilities: ['Answer questions'], requirements: ['Clear communication'],
    faq: [{ id: 'schedule', question: `${language} schedule?`, answer: `${language} flexible` }],
  });
  return record;
}
function reviewed(record) {
  record.reviews = { en: hiringFingerprint(record), uk: hiringFingerprint(record) };
  return record;
}

test('new vacancies have independent bilingual lists, FAQ, images and review state', () => {
  const first = emptyHiringVacancy(), second = emptyHiringVacancy();
  first.content.en.faq.push({ id: 'new' });
  first.content.en.requirements.push('Experience');
  first.images.card = 'image-id';
  assert.deepEqual(first.content.uk.faq, []);
  assert.deepEqual(second.content.en.faq, []);
  assert.deepEqual(second.content.en.requirements, []);
  assert.equal(second.images.card, null);
  assert.equal(second.publication_status, 'draft');
  assert.equal(second.resume_required, true);
});

test('draft saves permit incomplete translations; publishing requires both complete and reviewed', () => {
  const record = emptyHiringVacancy();
  record.slug = 'draft-role'; record.content.uk.title = 'Назва';
  assert.deepEqual(validateHiringVacancy(record).errors, {});
  const errors = validateHiringVacancy(record, true).errors;
  for (const key of ['employment_type', 'work_mode', 'content.en.title', 'content.uk.department', 'content.en.responsibilities', 'reviews.en', 'reviews.uk']) assert.ok(errors[key], key);
  assert.deepEqual(validateHiringVacancy(reviewed(vacancy()), true).errors, {});
});

test('publication review survives metadata changes but both languages require review after authored changes', () => {
  const record = reviewed(vacancy());
  record.revision = 12; record.publication_status = 'published'; record.updatedAt = '2026-10-21';
  assert.equal(hiringReviewed(record, 'en'), true);
  record.content.uk.faq[0].answer = 'New profession-specific answer';
  assert.equal(hiringReviewed(record, 'en'), false);
  assert.equal(hiringReviewed(record, 'uk'), false);
  const errors = validateHiringVacancy(record, true).errors;
  assert.deepEqual(Object.keys(errors), ['reviews.en', 'reviews.uk']);
});

test('profession FAQ identity and order must match across languages when enabled', () => {
  const record = vacancy();
  for (const language of ['en', 'uk']) record.content[language].faq.push({ id: 'pay', question: 'Pay?', answer: 'Discussed at interview.' });
  assert.deepEqual(validateHiringVacancy(reviewed(record), true).errors, {});
  record.content.uk.faq.reverse();
  assert.ok(validateHiringVacancy(record).errors.faq);
  record.faq_enabled = false;
  assert.equal(validateHiringVacancy(record).errors.faq, undefined);
});

test('enabled profession FAQ requires a question on publication; disabled FAQ retains its authored data', () => {
  const record = vacancy();
  record.content.en.faq = []; record.content.uk.faq = [];
  assert.ok(validateHiringVacancy(reviewed(record), true).errors['content.en.faq']);
  record.faq_enabled = false;
  record.content.en.faq = [{ id: 'saved', question: '', answer: '' }];
  const result = validateHiringVacancy(reviewed(record), true);
  assert.deepEqual(result.errors, {});
  assert.equal(result.data.content.en.faq[0].id, 'saved');
});

test('profession FAQ enforces current per-language count and text limits even while disabled', () => {
  const record = vacancy(); record.faq_enabled = false;
  record.content.en.faq = Array.from({ length: 21 }, (_, index) => ({ id: `q-${index}`, question: 'Q', answer: 'A' }));
  record.content.en.faq[0].question = 'Q'.repeat(241);
  record.content.en.faq[1].answer = 'A'.repeat(3001);
  const errors = validateHiringVacancy(record).errors;
  for (const key of ['content.en.faq', 'content.en.faq.0', 'content.en.faq.1']) assert.ok(errors[key]);
  record.content.en.faq = [{ id: 'valid', question: 'Q'.repeat(240), answer: 'A'.repeat(3000) }];
  assert.deepEqual(validateHiringVacancy(record).errors, {});
});

test('vacancy validation keeps authored whitespace and does not mutate input while normalizing lists', () => {
  const record = vacancy(); record.content.en.title = '  Support  ';
  record.content.en.requirements = [' Experience ', null, 12];
  const before = structuredClone(record), result = validateHiringVacancy(record);
  assert.deepEqual(record, before);
  assert.equal(result.data.content.en.title, '  Support  ');
  assert.deepEqual(result.data.content.en.requirements, [' Experience ']);
});

test('published image references require localized alt text for the images actually used', () => {
  const record = vacancy(); record.images = { card: 'card-id', detail: 'detail-id' };
  let errors = validateHiringVacancy(reviewed(record), true).errors;
  assert.ok(errors['content.en.image_alt']);
  assert.equal(errors['content.en.detail_image_alt'], undefined);
  record.image_mode = 'separate';
  errors = validateHiringVacancy(reviewed(record), true).errors;
  assert.ok(errors['content.uk.detail_image_alt']);
  for (const language of ['en', 'uk']) Object.assign(record.content[language], { image_alt: 'Team', detail_image_alt: 'Office' });
  assert.deepEqual(validateHiringVacancy(reviewed(record), true).errors, {});
});

test('public projection serves the publication snapshot and excludes drafts, closed and deleted roles', () => {
  const record = { ...vacancy(), _id: 'role-1', revision: 5, published_revision: 3, publication_status: 'published', published_at: '2026-10-20T10:00:00Z' };
  record.published_snapshot = structuredClone(hiringEditable(record));
  record.content.en.title = 'Unsaved for the public';
  const projected = hiringPublicProjection(record);
  assert.equal(projected.content.en.title, 'en support');
  assert.equal(projected.revision, 3);
  assert.equal(projected._id, 'role-1');
  assert.equal(hiringAdminProjection(record).has_unpublished_changes, true);
  for (const state of [{ publication_status: 'draft' }, { publication_status: 'closed' }, { deleted_at: '2026-10-21' }, { published_snapshot: null }]) assert.equal(hiringPublicProjection({ ...record, ...state }), null);
});

test('admin projection prefers the English title and falls back to Ukrainian without mutating content', () => {
  const record = vacancy(); record.content.en.title = ' ';
  assert.equal(hiringAdminProjection(record).title, 'uk support');
  record.content.en.title = 'English';
  assert.equal(hiringAdminProjection(record).title, 'English');
  assert.equal(hiringAdminProjection(record).has_unpublished_changes, false);
});

test('slug generation handles Ukrainian and accents; validation preserves reserved and length rules', () => {
  assert.equal(hiringSlug('Фахівець підтримки'), 'fakhivets-pidtrymky');
  assert.equal(hiringSlug('  Café / Team’s Support!  '), 'cafe-teams-support');
  assert.equal(hiringSlug('a'.repeat(200)).length, 150);
  for (const slug of ['courier', 'Uppercase', 'two--dashes', 'a'.repeat(161)]) assert.ok(validateHiringVacancy({ ...vacancy(), slug }).errors.slug);
  assert.equal(validateHiringVacancy({ ...vacancy(), slug: 'a'.repeat(160) }).errors.slug, undefined);
});
