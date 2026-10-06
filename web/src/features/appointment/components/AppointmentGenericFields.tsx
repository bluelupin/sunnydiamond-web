"use client";

import type { NormalizedGenericForm } from "@/services/forms/generic-form.types";
import AppointmentDateField from "@/shared/ui/AppointmentDateField";
import PhoneCountryCodeSelect from "@/shared/ui/PhoneCountryCodeSelect";
import InlineCustomSelect from "@/shared/ui/InlineCustomSelect";
import FormFieldError from "@/shared/ui/FormFieldError";
import { sanitizePhoneInput, invalidFieldClassName } from "@/shared/utils/formValidation";
import { getAppointmentBookingDateBounds, isAppointmentTimeSlotAvailable } from "@/shared/utils/appointmentTimeSlots";
import { cn } from "@/shared/utils/cn";
import { APPOINTMENT_BOOKING_WINDOW, appointmentFieldKey, appointmentFieldKind, appointmentFieldOptions, appointmentFieldRequired } from "../utils/appointmentGenericForm";

type Props = {
  form: NormalizedGenericForm;
  values: Record<string, string>;
  codes: Record<string, string>;
  errors: Record<string, string>;
  disabled: boolean;
  now: Date;
  onChange: (key: string, value: string) => void;
  onCodeChange: (key: string, code: string) => void;
  onBlur: (key: string) => void;
};

const fieldClassName = "h-14 w-full bg-[#F2F2F2] px-3 font-gill text-sm leading-110 text-darkblack placeholder:text-[#999999] outline-none";

export default function AppointmentGenericFields({ form, values, codes, errors, disabled, now, onChange, onCodeChange, onBlur }: Props) {
  const { minDate, maxDate } = getAppointmentBookingDateBounds(APPOINTMENT_BOOKING_WINDOW, now);
  const dateIndex = form.fields.findIndex((field) => appointmentFieldKind(field) === "date");
  const date = dateIndex < 0 ? "" : values[appointmentFieldKey(form.fields[dateIndex], dateIndex)] ?? "";
  return (
    <fieldset disabled={disabled} className="flex min-w-0 flex-col gap-6">
      {form.fields.map((field, index) => {
        const key = appointmentFieldKey(field, index);
        const id = `appointment-${key}`;
        const kind = appointmentFieldKind(field);
        const value = values[key] ?? "";
        const code = codes[key] ?? "+91";
        const error = errors[key];
        const options = appointmentFieldOptions(field, form);
        const required = appointmentFieldRequired(form, field);
        const baseLabel = kind === "email" && !required ? field.label.replace(/[\s*]+$/, "").trim() : field.label;
        const label = required && !baseLabel.endsWith("*") ? `${baseLabel}*` : baseLabel;
        const change = (next: string) => onChange(key, next);
        const blur = () => onBlur(key);
        const inputProps = { id, value, onBlur: blur, placeholder: field.placeholder, "aria-required": required, "aria-invalid": Boolean(error), "aria-describedby": error ? `${id}-error` : undefined, className: cn(fieldClassName, error && invalidFieldClassName) };
        return (
          <div key={key} className="flex flex-col gap-2">
            <label htmlFor={id} className="font-gill text-sm leading-110 text-darkblack">{label}</label>
            {kind === "phone" ? (
              <div className={cn("flex h-14 items-center gap-2 bg-[#F2F2F2] px-3", error && invalidFieldClassName)}>
                <PhoneCountryCodeSelect id={`${id}-code`} value={code} onBlur={blur} disabled={disabled} onChange={(next) => { onCodeChange(key, next); change(sanitizePhoneInput(value, next)); }} />
                <input {...inputProps} type="tel" inputMode="numeric" autoComplete="tel-national" onChange={(event) => change(sanitizePhoneInput(event.target.value, code))} className="min-w-0 flex-1 bg-transparent font-gill text-sm outline-none placeholder:text-[#999999]" />
              </div>
            ) : kind === "date" ? (
              <AppointmentDateField id={id} value={value} onChange={change} onBlur={blur} minDate={minDate} maxDate={maxDate} placeholder={field.placeholder} hasError={Boolean(error)} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} />
            ) : kind === "slot" ? (
              <div id={id} role="group" aria-label={label} aria-describedby={error ? `${id}-error` : undefined} className="grid grid-cols-2 gap-3">
                {options.map((slot) => (
                  <button key={slot} type="button" aria-pressed={value === slot} disabled={disabled || (dateIndex >= 0 && (!date || date < minDate || date > maxDate || !isAppointmentTimeSlotAvailable(slot, date, now, APPOINTMENT_BOOKING_WINDOW.minNoticeMinutes)))} onClick={() => { change(slot); blur(); }} className={cn("min-h-14 px-3 py-3 font-gill text-sm disabled:cursor-not-allowed disabled:opacity-40", value === slot ? "bg-gold300 text-darkblack" : "bg-[#F2F2F2] text-gray600")}>{slot}</button>
                ))}
              </div>
            ) : kind === "select" ? (
              <InlineCustomSelect id={id} label={label} hideLabel value={value} options={options} placeholder={field.placeholder} onChange={change} onBlur={blur} triggerClassName={fieldClassName} invalid={Boolean(error)} errorId={`${id}-error`} listPlacement="inline" disabled={disabled} />
            ) : kind === "note" ? (
              <textarea {...inputProps} onChange={(event) => change(event.target.value)} className={cn(inputProps.className, "h-28 resize-none py-3")} />
            ) : kind === "checkbox" ? (
              <input id={id} type="checkbox" checked={value === "true"} onChange={(event) => change(String(event.target.checked))} onBlur={blur} aria-required={field.isRequired} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className="size-5 accent-darkblack" />
            ) : (
              <input {...inputProps} type={kind === "email" ? "email" : field.fieldType.toLowerCase() === "number" ? "number" : "text"} autoComplete={kind === "name" ? "name" : kind === "email" ? "email" : undefined} onChange={(event) => change(event.target.value)} />
            )}
            <FormFieldError id={`${id}-error`} message={error} />
          </div>
        );
      })}
    </fieldset>
  );
}
