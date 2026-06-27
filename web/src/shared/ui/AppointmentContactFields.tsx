"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import {
  APPOINTMENT_COUNTRY_CODES,
  APPOINTMENT_TIME_SLOTS,
  appointmentFieldClassName,
  appointmentLabelClassName,
} from "@/shared/constants/appointmentForm";
import FormFieldError from "@/shared/ui/FormFieldError";
import AppointmentDateField from "@/shared/ui/AppointmentDateField";
import {
  getMinSelectableDate,
  invalidFieldClassName,
  sanitizePhoneInput,
  type AppointmentContactField,
} from "@/shared/utils/formValidation";

type AppointmentContactFieldsProps = {
  idPrefix: string;
  name: string;
  countryCode: string;
  phone: string;
  email: string;
  date: string;
  note: string;
  selectedSlot?: string | null;
  purpose?: string;
  onNameChange: (value: string) => void;
  onCountryCodeChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onSelectedSlotChange?: (value: string | null) => void;
  onPurposeChange?: (value: string) => void;
  errors: Partial<Record<AppointmentContactField, string | undefined>>;
  showError: (field: AppointmentContactField) => boolean;
  markTouched: (field: AppointmentContactField) => void;
  labelClassName?: string;
  fieldClassName?: string;
  showTimeSlots?: boolean;
  selectedSlotStyle?: "dark" | "gold";
  showPurpose?: boolean;
  purposeOptions?: readonly string[];
  noteLabel?: string;
  notePlaceholder?: string;
  noteLabelClassName?: string;
  noteTextareaClassName?: string;
};

const AppointmentContactFields = ({
  idPrefix,
  name,
  countryCode,
  phone,
  email,
  date,
  note,
  selectedSlot = null,
  purpose = "",
  onNameChange,
  onCountryCodeChange,
  onPhoneChange,
  onEmailChange,
  onDateChange,
  onNoteChange,
  onSelectedSlotChange,
  onPurposeChange,
  errors,
  showError,
  markTouched,
  labelClassName = appointmentLabelClassName,
  fieldClassName = appointmentFieldClassName,
  showTimeSlots = true,
  selectedSlotStyle = "dark",
  showPurpose = false,
  purposeOptions = [],
  noteLabel = "Describe more about your visit",
  notePlaceholder = "Enter",
  noteLabelClassName,
  noteTextareaClassName = "font-gill text-base leading-110",
}: AppointmentContactFieldsProps) => {
  const minDate = getMinSelectableDate();

  return (
    <>
      <div className="flex flex-col gap-2">
        <label htmlFor={`${idPrefix}-name`} className={labelClassName}>
          Your Name*
        </label>
        <input
          id={`${idPrefix}-name`}
          type="text"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          onBlur={() => markTouched("name")}
          autoComplete="name"
          aria-invalid={showError("name") || undefined}
          aria-describedby={showError("name") ? `${idPrefix}-name-error` : undefined}
          className={cn(
            fieldClassName,
            "border border-transparent focus:border-darkblack",
            showError("name") && invalidFieldClassName,
          )}
        />
        <FormFieldError id={`${idPrefix}-name-error`} message={showError("name") ? errors.name : undefined} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={`${idPrefix}-phone`} className={labelClassName}>
          Phone No.*
        </label>
        <div
          className={cn(
            "flex h-14 w-full items-center gap-2 bg-[#F2F2F2] px-3",
            showError("phone") && "ring-1 ring-[#B42318]",
          )}
        >
          <div className="relative flex shrink-0 items-center">
            <select
              value={countryCode}
              onChange={(event) => {
                onCountryCodeChange(event.target.value);
                onPhoneChange(sanitizePhoneInput(phone, event.target.value));
                markTouched("phone");
              }}
              aria-label="Country code"
              className="appearance-none bg-transparent pr-5 font-gill text-base leading-110 text-darkblack outline-none"
            >
              {APPOINTMENT_COUNTRY_CODES.map((entry) => (
                <option key={entry.code} value={entry.code}>
                  {entry.code}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              strokeWidth={1.5}
              aria-hidden
              className="pointer-events-none absolute right-0 text-darkblack"
            />
          </div>
          <input
            id={`${idPrefix}-phone`}
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(event) => onPhoneChange(sanitizePhoneInput(event.target.value, countryCode))}
            onBlur={() => markTouched("phone")}
            autoComplete="tel-national"
            aria-invalid={showError("phone") || undefined}
            aria-describedby={showError("phone") ? `${idPrefix}-phone-error` : undefined}
            className="min-w-0 flex-1 bg-transparent font-gill text-base leading-110 text-darkblack outline-none"
          />
        </div>
        <FormFieldError id={`${idPrefix}-phone-error`} message={showError("phone") ? errors.phone : undefined} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={`${idPrefix}-email`} className={labelClassName}>
          Email
        </label>
        <input
          id={`${idPrefix}-email`}
          type="email"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          onBlur={() => markTouched("email")}
          placeholder="Enter"
          autoComplete="email"
          aria-invalid={showError("email") || undefined}
          aria-describedby={showError("email") ? `${idPrefix}-email-error` : undefined}
          className={cn(fieldClassName, showError("email") && invalidFieldClassName)}
        />
        <FormFieldError id={`${idPrefix}-email-error`} message={showError("email") ? errors.email : undefined} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={`${idPrefix}-date`} className={labelClassName}>
          Date
        </label>
        <AppointmentDateField
          id={`${idPrefix}-date`}
          value={date}
          minDate={minDate}
          onChange={onDateChange}
          onBlur={() => markTouched("date")}
          hasError={showError("date")}
          aria-invalid={showError("date") || undefined}
          aria-describedby={showError("date") ? `${idPrefix}-date-error` : undefined}
        />
        <FormFieldError id={`${idPrefix}-date-error`} message={showError("date") ? errors.date : undefined} />
      </div>

      {showTimeSlots && onSelectedSlotChange ? (
        <div className="flex flex-col gap-2">
          <span className={labelClassName}>Time Slots</span>
          <div className="flex flex-col gap-3">
            {Array.from({ length: APPOINTMENT_TIME_SLOTS.length / 2 }, (_, row) => (
              <div key={row} className="flex gap-2">
                {[APPOINTMENT_TIME_SLOTS[row * 2], APPOINTMENT_TIME_SLOTS[row * 2 + 1]].map((slot) => {
                  const isSelected = selectedSlot === slot;

                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => onSelectedSlotChange(isSelected ? null : slot)}
                      className={cn(
                        "flex h-14 min-w-0 flex-1 items-center justify-center px-3 font-gill text-base leading-110",
                        isSelected
                          ? selectedSlotStyle === "gold"
                            ? "bg-[#DECAA0] font-normal text-darkblack"
                            : "bg-darkblack font-normal text-white"
                          : "bg-[#F2F2F2] font-light text-darkblack",
                      )}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {showPurpose && onPurposeChange ? (
        <div className="flex flex-col gap-2">
          <label htmlFor={`${idPrefix}-purpose`} className={labelClassName}>
            Purpose of Visit
          </label>
          <div
            className={cn(
              "relative flex h-14 w-full items-center bg-[#F2F2F2] px-3",
              showError("purpose") && "ring-1 ring-[#B42318]",
            )}
          >
            <select
              id={`${idPrefix}-purpose`}
              value={purpose}
              onChange={(event) => onPurposeChange(event.target.value)}
              onBlur={() => markTouched("purpose")}
              aria-invalid={showError("purpose") || undefined}
              aria-describedby={showError("purpose") ? `${idPrefix}-purpose-error` : undefined}
              className={cn(
                "min-w-0 flex-1 appearance-none bg-transparent font-gill text-base leading-110 outline-none",
                purpose ? "text-darkblack" : "text-neutral400",
              )}
            >
              <option value="">-select-</option>
              {purposeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown
              size={20}
              strokeWidth={1.5}
              aria-hidden
              className="pointer-events-none shrink-0 text-darkblack"
            />
          </div>
          <FormFieldError
            id={`${idPrefix}-purpose-error`}
            message={showError("purpose") ? errors.purpose : undefined}
          />
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <label htmlFor={`${idPrefix}-note`} className={noteLabelClassName ?? labelClassName}>
          {noteLabel}
        </label>
        <textarea
          id={`${idPrefix}-note`}
          value={note}
          onChange={(event) => onNoteChange(event.target.value)}
          onBlur={() => markTouched("note")}
          placeholder={notePlaceholder}
          rows={4}
          maxLength={500}
          aria-invalid={showError("note") || undefined}
          aria-describedby={showError("note") ? `${idPrefix}-note-error` : undefined}
          className={cn(
            "h-[100px] w-full resize-none bg-[#F2F2F2] p-3 text-darkblack placeholder:text-[#999999] outline-none",
            noteTextareaClassName,
            showError("note") && invalidFieldClassName,
          )}
        />
        <FormFieldError id={`${idPrefix}-note-error`} message={showError("note") ? errors.note : undefined} />
      </div>
    </>
  );
};

export default AppointmentContactFields;
