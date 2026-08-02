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
import InlineCustomSelect from "@/shared/ui/InlineCustomSelect";
import AppointmentDateField from "@/shared/ui/AppointmentDateField";
import {
  getMaxSelectableDate,
  getMinSelectableDate,
  invalidFieldClassName,
  invalidFieldContainerClassName,
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
  showDate?: boolean;
  showTimeSlots?: boolean;
  timeSlots?: readonly string[];
  selectedSlotStyle?: "dark" | "gold";
  showPurpose?: boolean;
  purposeOptions?: readonly string[];
  purposeLabel?: string;
  purposePlaceholder?: string;
  nameLabel?: string;
  namePlaceholder?: string;
  phoneLabel?: string;
  phonePlaceholder?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  dateLabel?: string;
  timeSlotsLabel?: string;
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
  showDate = true,
  showTimeSlots = true,
  timeSlots,
  selectedSlotStyle = "dark",
  showPurpose = false,
  purposeOptions = [],
  purposeLabel = "Purpose of Visit",
  purposePlaceholder = "-select-",
  nameLabel = "Your Name*",
  namePlaceholder,
  phoneLabel = "Phone No.*",
  phonePlaceholder,
  emailLabel = "Email",
  emailPlaceholder = "Enter",
  dateLabel = "Date",
  timeSlotsLabel = "Time Slots",
  noteLabel = "Describe more about your visit",
  notePlaceholder = "Enter",
  noteLabelClassName,
  noteTextareaClassName = "font-gill text-base leading-110",
}: AppointmentContactFieldsProps) => {
  const minDate = getMinSelectableDate();
  const maxDate = getMaxSelectableDate();
  // Explicit `[]` means no slots (CMS empty). Only default when prop is omitted.
  const slots = timeSlots ?? APPOINTMENT_TIME_SLOTS;

  return (
    <>
      <div className="flex flex-col gap-2">
        <label htmlFor={`${idPrefix}-name`} className={labelClassName}>
          {nameLabel}
        </label>
        <input
          id={`${idPrefix}-name`}
          type="text"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          onBlur={() => markTouched("name")}
          placeholder={namePlaceholder}
          autoComplete="name"
          aria-invalid={showError("name") || undefined}
          aria-describedby={showError("name") ? `${idPrefix}-name-error` : undefined}
          className={cn(
            fieldClassName,
            showError("name")
              ? invalidFieldClassName
              : "border border-transparent focus:border-darkblack",
          )}
        />
        <FormFieldError id={`${idPrefix}-name-error`} message={showError("name") ? errors.name : undefined} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={`${idPrefix}-phone`} className={labelClassName}>
          {phoneLabel}
        </label>
        <div
          className={cn(
            "flex h-14 w-full items-center gap-2 border border-transparent bg-[#F2F2F2] px-3",
            showError("phone") && invalidFieldContainerClassName,
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
            placeholder={phonePlaceholder}
            autoComplete="tel-national"
            aria-invalid={showError("phone") || undefined}
            aria-describedby={showError("phone") ? `${idPrefix}-phone-error` : undefined}
            className="min-w-0 flex-1 bg-transparent font-gill text-base leading-110 text-darkblack outline-none placeholder:text-[#999999]"
          />
        </div>
        <FormFieldError id={`${idPrefix}-phone-error`} message={showError("phone") ? errors.phone : undefined} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={`${idPrefix}-email`} className={labelClassName}>
          {emailLabel}
        </label>
        <input
          id={`${idPrefix}-email`}
          type="email"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          onBlur={() => markTouched("email")}
          placeholder={emailPlaceholder}
          autoComplete="email"
          aria-invalid={showError("email") || undefined}
          aria-describedby={showError("email") ? `${idPrefix}-email-error` : undefined}
          className={cn(fieldClassName, showError("email") && invalidFieldClassName)}
        />
        <FormFieldError id={`${idPrefix}-email-error`} message={showError("email") ? errors.email : undefined} />
      </div>

      {showDate ? (
        <div className="flex flex-col gap-2">
          <label htmlFor={`${idPrefix}-date`} className={labelClassName}>
            {dateLabel}
          </label>
          <AppointmentDateField
            id={`${idPrefix}-date`}
            value={date}
            minDate={minDate}
            maxDate={maxDate}
            onChange={onDateChange}
            onBlur={() => markTouched("date")}
            hasError={showError("date")}
            aria-invalid={showError("date") || undefined}
            aria-describedby={showError("date") ? `${idPrefix}-date-error` : undefined}
          />
          <FormFieldError id={`${idPrefix}-date-error`} message={showError("date") ? errors.date : undefined} />
        </div>
      ) : null}

      {showTimeSlots && onSelectedSlotChange && slots.length > 0 ? (
        <div className="flex flex-col gap-2">
          <span className={labelClassName}>{timeSlotsLabel}</span>
          <div className="flex flex-col gap-3">
            {Array.from({ length: Math.ceil(slots.length / 2) }, (_, row) => (
              <div key={row} className="flex gap-2">
                {[slots[row * 2], slots[row * 2 + 1]].filter(Boolean).map((slot) => {
                  const isSelected = selectedSlot === slot;

                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => {
                        onSelectedSlotChange(isSelected ? null : slot);
                        markTouched("selectedSlot");
                      }}
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
          <FormFieldError
            id={`${idPrefix}-time-slot-error`}
            message={showError("selectedSlot") ? errors.selectedSlot : undefined}
          />
        </div>
      ) : null}

      {showPurpose && onPurposeChange && purposeOptions.length > 0 ? (
        <div className="flex flex-col gap-2">
          <InlineCustomSelect
            id={`${idPrefix}-purpose`}
            label={purposeLabel}
            value={purpose}
            options={purposeOptions}
            placeholder={purposePlaceholder}
            onChange={onPurposeChange}
            onBlur={() => markTouched("purpose")}
            invalid={showError("purpose")}
            errorId={showError("purpose") ? `${idPrefix}-purpose-error` : undefined}
          />
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
