import assert from "node:assert/strict";
import { register } from "node:module";

// Lets Node load the app's own TS modules: "@/..." → src/..., extensionless → .ts / .tsx.
const aliasHooks = `
import { statSync } from "node:fs";
import { fileURLToPath } from "node:url";
const SRC = ${JSON.stringify(new URL("../src/", import.meta.url).href)};
const isFile = (url) => { try { return statSync(fileURLToPath(url)).isFile(); } catch { return false; } };
export async function resolve(specifier, context, next) {
  const aliased = specifier.startsWith("@/");
  if (!aliased && !specifier.startsWith(".")) return next(specifier, context);
  const base = aliased ? new URL(specifier.slice(2), SRC).href : new URL(specifier, context.parentURL).href;
  for (const suffix of ["", ".ts", ".tsx", "/index.ts"]) {
    if (isFile(base + suffix)) return next(base + suffix, context);
  }
  return next(specifier, context);
}`;
register(`data:text/javascript,${encodeURIComponent(aliasHooks)}`);


const { appointmentFieldKind, appointmentFormErrors, appointmentSubmission } = await import('../src/features/appointment/utils/appointmentGenericForm.ts');
const field = (id, label, fieldType, isRequired = false, options = []) => ({ id, label, fieldType, isRequired, options });
const form = { formName: 'Book an Appointment', formTag: 'book-an-appointment', submitButtonText: 'Book', timeSlots: ['9:00 AM - 10:00 AM'], showrooms: [], purposeOptions: [], fields: [
  field('1', 'Your Name', 'text', true), field('2', 'Phone No.', 'text', true), field('3', 'Email', 'text'), field('4', 'Date', 'date', true), field('5', 'Time Slots', 'dropdown', true), field('6', 'Describe more about your visit', 'textarea'), field('7', 'Jewellery', 'dropdown', true, ['Ring', 'Necklace'])
] };
const now = new Date();
const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
const date = [tomorrow.getFullYear(), String(tomorrow.getMonth()+1).padStart(2,'0'), String(tomorrow.getDate()).padStart(2,'0')].join('-');
const values = { '1':'Sara Test', '2':'9876543210', '3':'', '4':date, '5':form.timeSlots[0], '6':'Engagement ring', '7':'Ring' };
assert.equal(appointmentFieldKind(form.fields[4]), 'slot');
assert.deepEqual(appointmentFormErrors(form, values, {}), {});
assert.deepEqual(Object.keys(appointmentFormErrors(form, {}, {})), ['1','2','4','5','7']);
assert.ok(appointmentFormErrors(form, { ...values, '3':'bad-email' }, {})['3']);
assert.ok(appointmentFormErrors(form, { ...values, '7':'Bracelet' }, {})['7']);
assert.ok(appointmentFormErrors(form, { ...values, '5':'not a slot' }, {})['5']);
const optionalPhone = { ...form, fields: [field('2', 'Telephone', 'phone')] };
assert.deepEqual(appointmentFormErrors(optionalPhone, {}, {}), {});
const payload = appointmentSubmission(form, values, { '2':'+1' }, '/current-page');
assert.equal(payload.formTag, 'book-an-appointment');
assert.equal(payload.fullName, 'Sara Test');
assert.equal(payload.phone, '+19876543210');
assert.equal(payload.preferredDate, date);
assert.equal(payload.selectedTimeSlot, form.timeSlots[0]);
assert.equal(payload.sourcePage, '/current-page');
assert.match(payload.notes, /Jewellery: Ring/);
assert.match(payload.notes, /Engagement ring/);
assert.equal(payload.email, undefined);
const reordered = { ...form, fields: [...form.fields].reverse() };
assert.deepEqual(appointmentSubmission(reordered, values, { '2':'+1' }, '/current-page'), { ...payload, notes: 'Jewellery: Ring\nDescribe more about your visit: Engagement ring' });
const requiredEmail = { ...form, fields: [field('3', 'Email', 'email', true)] };
assert.deepEqual(appointmentFormErrors(requiredEmail, {}, {}), {});
assert.ok(appointmentFormErrors({ ...requiredEmail, formTag: 'contact-us' }, {}, {})['3']);
const checkbox = { ...form, fields: [field('8', 'Consent', 'checkbox', true)] };
assert.ok(appointmentFormErrors(checkbox, { '8':'false' }, {})['8']);
assert.deepEqual(appointmentFormErrors(checkbox, { '8':'true' }, {}), {});
console.log('Appointment generic form checks passed.');
