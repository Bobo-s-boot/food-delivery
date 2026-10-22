import assert from 'node:assert/strict';
import test from 'node:test';
import {
  defaultSettings, eligibility, isEngagementSectionEnabled, isPhone, isWebUrl,
  validateActivityEntry, validateSettings, validateSubmission, visibleFooterEntries,
} from './engagement.mjs';

const settings = () => structuredClone(defaultSettings);
const team = { applicant_name: 'Applicant', email: 'applicant@example.test', consent: true };

test('submission contracts trim recognized fields, ignore unknown keys, and preserve caller data', () => {
  const input = { restaurant_name: ' Kitchen ', city: ' Kyiv ', contact_name: ' Owner ', phone: ' +380 (67) 123-45-67 ', consent: true, arbitrary: 'ignored' };
  const before = structuredClone(input), result = validateSubmission('partnership', input);
  assert.deepEqual(result.errors, {});
  assert.deepEqual(result.data, { restaurant_name: 'Kitchen', city: 'Kyiv', contact_name: 'Owner', phone: '+380 (67) 123-45-67', email: '', website: '', comment: '', consent: true });
  assert.deepEqual(input, before);
});

test('validation error ordering keeps the current first invalid field for each public form', () => {
  assert.deepEqual(Object.keys(validateSubmission('partnership', {}).errors), ['restaurant_name', 'city', 'contact_name', 'phone', 'consent']);
  assert.deepEqual(Object.keys(validateSubmission('courier', {}).errors), ['applicant_name', 'city', 'phone', 'consent']);
  assert.deepEqual(Object.keys(validateSubmission('team', {}, { resume_required: true }).errors), ['applicant_name', 'email', 'resume_url', 'consent']);
});

test('team form CV requirement and optional portfolio follow vacancy flags', () => {
  assert.deepEqual(validateSubmission('team', team, { resume_required: false }).errors, {});
  assert.ok(validateSubmission('team', team, { resume_required: true }).errors.resume_url);
  const input = { ...team, resume_url: 'https://example.test/cv', portfolio_url: 'javascript:alert(1)' };
  assert.deepEqual(validateSubmission('team', input, { resume_required: true, portfolio_field_enabled: false }).errors, {});
  assert.ok(validateSubmission('team', input, { portfolio_field_enabled: true }).errors.portfolio_url);
  assert.deepEqual(validateSubmission('team', team, { portfolio_field_enabled: true }).errors, {});
});

test('consent must be boolean true; optional phone and email are checked only when supplied', () => {
  for (const consent of [false, undefined, 'true', 1]) assert.ok(validateSubmission('team', { ...team, consent }).errors.consent);
  const result = validateSubmission('team', { ...team, phone: '123', email: 'bad-address' });
  assert.equal(result.errors.phone, 'Проверьте номер телефона');
  assert.equal(result.errors.email, 'Проверьте адрес электронной почты');
});

test('form text limits and URL restrictions retain their existing boundary messages', () => {
  const input = { ...team, applicant_name: 'N'.repeat(160), comment: 'C'.repeat(3000), resume_url: 'https://example.test/cv' };
  assert.deepEqual(validateSubmission('team', input, { resume_required: true }).errors, {});
  input.applicant_name += 'N'; input.comment += 'C';
  const errors = validateSubmission('team', input).errors;
  assert.equal(errors.applicant_name, 'Не более 160 символов');
  assert.equal(errors.comment, 'Не более 3000 символов');
  for (const value of ['ftp://example.test/cv', 'https://user:pass@example.test/cv', '/relative', 'javascript:alert(1)']) assert.equal(isWebUrl(value), false);
  assert.equal(isWebUrl('http://example.test/cv?q=1'), true);
});

test('Ukrainian phone formats accept current separators and reject other country/short numbers', () => {
  for (const phone of ['+380 (67) 123-45-67', '380671234567', '0671234567']) assert.equal(isPhone(phone), true);
  for (const phone of ['+447123456789', '067123', '+380.67.123.45.67']) assert.equal(isPhone(phone), false);
});

test('section gates and footer links default to visible and hide only on explicit false', () => {
  assert.equal(isEngagementSectionEnabled(undefined, 'careers'), true);
  assert.equal(isEngagementSectionEnabled(settings(), 'unknown'), false);
  assert.deepEqual(visibleFooterEntries({}).map((item) => item.to), ['/for-restaurants', '/careers']);
  assert.deepEqual(visibleFooterEntries({ restaurants: false, careers: true }).map((item) => item.to), ['/careers']);
});

test('eligibility preserves section, vacancy, global and individual pause precedence', () => {
  const current = settings(); current.hiring.global_enabled = false; current.hiring.team_enabled = false;
  assert.equal(eligibility(current, 'partnership'), '');
  assert.equal(eligibility(current, 'team', { publication_status: 'closed' }), 'Вакансия закрыта.');
  assert.equal(eligibility(current, 'team', { publication_status: 'published' }), 'Сейчас мы временно не принимаем новые заявки. Следите за обновлениями на странице карьеры.');
  current.navigation.careers = false;
  assert.equal(eligibility(current, 'team', { publication_status: 'closed' }), 'This section is unavailable.');
  current.navigation.restaurants = false;
  assert.equal(eligibility(current, 'partnership'), 'This section is unavailable.');
});

test('courier availability needs configured cities and matches selected cities without case sensitivity', () => {
  const current = settings();
  assert.equal(eligibility(current, 'courier'), 'Набор курьеров временно закрыт. Города набора пока не указаны.');
  current.hiring.courier_cities = ['Kyiv'];
  assert.equal(eligibility(current, 'courier', undefined, '  KYIV  '), '');
  assert.equal(eligibility(current, 'courier', undefined, 'Lviv'), 'В вашем городе набор пока не открыт.');
  current.hiring.courier_enabled = false;
  assert.equal(eligibility(current, 'courier'), 'Набор курьеров временно закрыт.');
});

test('settings normalize duplicate cities without changing case semantics or input', () => {
  const input = settings(); input.hiring.courier_cities = [' Kyiv ', 'Kyiv', 'kyiv', 'Lviv'];
  const before = structuredClone(input), result = validateSettings(input);
  assert.deepEqual(result.errors, {});
  assert.deepEqual(result.data.hiring.courier_cities, ['Kyiv', 'kyiv', 'Lviv']);
  assert.deepEqual(input, before);
  input.navigation.careers = 'true'; input.hiring.courier_cities = [''];
  assert.deepEqual(Object.keys(validateSettings(input).errors), ['careers', 'courier_cities']);
});

test('follow-up entries keep status-only saves distinct from note/contact additions', () => {
  assert.deepEqual(validateActivityEntry(undefined), { data: undefined, errors: {} });
  assert.deepEqual(validateActivityEntry({ type: 'note', body: '  Called back  ' }), { data: { type: 'note', body: 'Called back' }, errors: {} });
  assert.deepEqual(validateActivityEntry({ type: 'contact', body: 'Emailed', channel: 'email' }).errors, {});
  assert.ok(validateActivityEntry({ type: 'note', body: 'Note', channel: 'phone' }).errors['activity_entry.channel']);
  assert.ok(validateActivityEntry({ type: 'contact', body: 'Call', channel: 'chat' }).errors['activity_entry.channel']);
  for (const input of [null, [], 'note']) assert.ok(validateActivityEntry(input).errors.activity_entry);
  assert.ok(validateActivityEntry({ type: 'note', body: ' '.repeat(5) }).errors['activity_entry.body']);
  assert.ok(validateActivityEntry({ type: 'note', body: 'n'.repeat(5001) }).errors['activity_entry.body']);
});
