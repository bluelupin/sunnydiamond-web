import type { GenericSubmissionPayload, NormalizedGenericForm, NormalizedGenericFormField } from "@/services/forms/generic-form.types";
import { validateOptionalDate, validateOptionalEmail, validatePhone, validateRequiredName } from "@/shared/utils/formValidation";
import { isAppointmentTimeSlotAvailable } from "@/shared/utils/appointmentTimeSlots";

export function appointmentFieldKind(field: NormalizedGenericFormField) {
  const type = field.fieldType.toLowerCase().replace(/[\s_-]/g, "");
  const label = field.label.toLowerCase();
  if (type === "phone" || type === "tel" || (type === "text" && /\b(phone|mobile|telephone)\b/.test(label))) return "phone";
  if (type === "text" && /\be-?mail\b/.test(label)) return "email";
  if (type === "email" || type === "date") return type;
  if (type.includes("timeslot") || /time\s*slots?/.test(label)) return "slot";
  if (type === "text" && /\b(name|full)\b/.test(label)) return "name";
  if (type === "textarea" || type === "multiline") return "note";
  if (type === "dropdown" || type === "select" || type === "radio") return "select";
  if (type === "checkbox" || type === "boolean") return "checkbox";
  return "text";
}

export const appointmentFieldKey = (field: NormalizedGenericFormField, index: number) =>
  field.id ?? `field-${index}`;

export function appointmentFieldOptions(field: NormalizedGenericFormField, form: NormalizedGenericForm) {
  return appointmentFieldKind(field) === "slot" && field.options.length === 0
    ? form.timeSlots : field.options;
}

export function appointmentFormErrors(form: NormalizedGenericForm, values: Record<string, string>, codes: Record<string, string>, now = new Date()) {
  const errors: Record<string, string> = {};
  const dateIndex = form.fields.findIndex((field) => appointmentFieldKind(field) === "date");
  const date = dateIndex < 0 ? "" : values[appointmentFieldKey(form.fields[dateIndex], dateIndex)] ?? "";
  form.fields.forEach((field, index) => {
    const key = appointmentFieldKey(field, index);
    const value = (values[key] ?? "").trim();
    const kind = appointmentFieldKind(field);
    let error: string | undefined;
    if (field.isRequired && (!value || (kind === "checkbox" && value !== "true"))) error = "This field is required";
    else if (value) {
      if (kind === "name") error = validateRequiredName(value).error;
      if (kind === "phone") error = validatePhone(value, codes[key] ?? "+91").error;
      if (kind === "email") error = validateOptionalEmail(value).error;
      if (kind === "date") error = validateOptionalDate(value).error;
      if ((kind === "select" || kind === "slot") && !appointmentFieldOptions(field, form).includes(value)) error = "Select an available option";
      if (kind === "slot" && date && !isAppointmentTimeSlotAvailable(value, date, now)) error = "Select an available time slot";
    }
    if (error) errors[key] = error;
  });
  return errors;
}

export function appointmentSubmission(form: NormalizedGenericForm, values: Record<string, string>, codes: Record<string, string>, sourcePage: string): GenericSubmissionPayload {
  const payload: GenericSubmissionPayload = { formTag: form.formTag, fullName: "", phone: "", sourcePage, consentAccepted: false };
  const notes: string[] = [];
  form.fields.forEach((field, index) => {
    const key = appointmentFieldKey(field, index);
    const value = (values[key] ?? "").trim();
    if (!value) return;
    switch (appointmentFieldKind(field)) {
      case "name": payload.fullName = value; break;
      case "phone": payload.phone = `${codes[key] ?? "+91"}${value}`; break;
      case "email": payload.email = value; break;
      case "date": payload.preferredDate = value; break;
      case "slot": payload.selectedTimeSlot = value; break;
      default: notes.push(`${field.label.replace(/\*$/, "")}: ${value}`);
    }
  });
  if (notes.length) payload.notes = notes.join("\n");
  return payload;
}
