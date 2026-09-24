"use client";

import { useEffect } from "react";
import { cn } from "@/shared/utils/cn";
import {
  APPOINTMENT_TIME_SLOTS,
  appointmentFieldClassName,
  appointmentLabelClassName,
} from "@/shared/constants/appointmentForm";
import FormFieldError from "@/shared/ui/FormFieldError";
import InlineCustomSelect from "@/shared/ui/InlineCustomSelect";
import PhoneCountryCodeSelect from "@/shared/ui/PhoneCountryCodeSelect";
import AppointmentDateField from "@/shared/ui/AppointmentDateField";
import { isAppointmentTimeSlotAvailable } from "@/shared/utils/appointmentTimeSlots";
import {
  getMaxSelectableDate,
  getMinSelectableDate,
  invalidFieldClassName,
  invalidFieldContainerClassName,
  formatRequiredFieldLabel,
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
  showContactDetails?: boolean;
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
  emailRequired?: boolean;
  dateLabel?: string;
  dateRequired?: boolean;
  timeSlotsLabel?: string;
  timeSlotRequired?: boolean;
  noteLabel?: string;
  notePlaceholder?: string;
  noteLabelClassName?: string;
  noteTextareaClassName?: string;
  phoneLocked?: boolean;
  emailLocked?: boolean;
  /** Prefill-only mode (e.g. reschedule): contact + note are visible but not editable. */
  detailsReadOnly?: boolean;
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
  showContactDetails = true,
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
  emailRequired = false,
  dateLabel = "Date",
  dateRequired = false,
  timeSlotsLabel = "Time Slots",
  timeSlotRequired = false,
  noteLabel = "Describe more about your visit",
  notePlaceholder = "Enter",
  noteLabelClassName,
  noteTextareaClassName = "font-gill text-base leading-110",
  phoneLocked = false,
  emailLocked = false,
  detailsReadOnly = false,
}: AppointmentContactFieldsProps) => {
  const minDate = getMinSelectableDate();
  const maxDate = getMaxSelectableDate();
  // Explicit `[]` means no slots (CMS empty). Only default when prop is omitted.
  const slots = timeSlots ?? APPOINTMENT_TIME_SLOTS;
  const isPhoneLocked = phoneLocked || detailsReadOnly;
  const isEmailLocked = emailLocked || detailsReadOnly;
  const phoneMaxLength =
    countryCode.trim() === "+44" || countryCode.trim() === "44" ? 11 : 10;

  // Cap prefilled / pasted values that bypassed onChange sanitization.
  useEffect(() => {
    const next = sanitizePhoneInput(phone, countryCode);
    if (next !== phone) {
      onPhoneChange(next);
    }
  }, [phone, countryCode, onPhoneChange]);

  // Clear selection if the chosen slot is no longer bookable for the selected date.
  useEffect(() => {
    if (!onSelectedSlotChange || !selectedSlot || !date.trim()) {
      return;
    }

    if (!isAppointmentTimeSlotAvailable(selectedSlot, date)) {
      onSelectedSlotChange(null);
    }
  }, [date, onSelectedSlotChange, selectedSlot]);

  return (
    <>
      {showContactDetails ? (
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
          readOnly={detailsReadOnly}
          aria-readonly={detailsReadOnly || undefined}
          aria-invalid={showError("name") || undefined}
          aria-describedby={showError("name") ? `${idPrefix}-name-error` : undefined}
          className={cn(
            fieldClassName,
            detailsReadOnly && "cursor-not-allowed opacity-70",
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
          <PhoneCountryCodeSelect
            id={`${idPrefix}-country-code`}
            value={countryCode}
            onChange={(nextCode) => {
              onCountryCodeChange(nextCode);
              onPhoneChange(sanitizePhoneInput(phone, nextCode));
              markTouched("phone");
            }}
            onBlur={() => markTouched("phone")}
            disabled={isPhoneLocked}
          />
          <input
            id={`${idPrefix}-phone`}
            type="tel"
            inputMode="numeric"
            maxLength={phoneMaxLength}
            value={phone}
            onChange={(event) => onPhoneChange(sanitizePhoneInput(event.target.value, countryCode))}
            onBlur={() => markTouched("phone")}
            placeholder={phonePlaceholder}
            autoComplete="tel-national"
            readOnly={isPhoneLocked}
            aria-readonly={isPhoneLocked || undefined}
            aria-invalid={showError("phone") || undefined}
            aria-describedby={showError("phone") ? `${idPrefix}-phone-error` : undefined}
            className={cn(
              "min-w-0 flex-1 bg-transparent font-gill text-base leading-110 text-darkblack outline-none placeholder:text-[#999999]",
              isPhoneLocked && "cursor-not-allowed opacity-70",
            )}
          />
        </div>
        <FormFieldError id={`${idPrefix}-phone-error`} message={showError("phone") ? errors.phone : undefined} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={`${idPrefix}-email`} className={labelClassName}>
          {emailRequired ? formatRequiredFieldLabel(emailLabel) : emailLabel}
        </label>
        <input
          id={`${idPrefix}-email`}
          type="email"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          onBlur={() => markTouched("email")}
          placeholder={emailPlaceholder}
          autoComplete="email"
          readOnly={isEmailLocked}
          aria-readonly={isEmailLocked || undefined}
          aria-invalid={showError("email") || undefined}
          aria-required={emailRequired || undefined}
          aria-describedby={showError("email") ? `${idPrefix}-email-error` : undefined}
          className={cn(
            fieldClassName,
            isEmailLocked && "cursor-not-allowed opacity-70",
            showError("email") && invalidFieldClassName,
          )}
        />
        <FormFieldError id={`${idPrefix}-email-error`} message={showError("email") ? errors.email : undefined} />
      </div>
      </>
      ) : null}

      {showDate ? (
        <div className="flex flex-col gap-2">
          <label htmlFor={`${idPrefix}-date`} className={labelClassName}>
            {dateRequired ? formatRequiredFieldLabel(dateLabel) : dateLabel}
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
          <span className={labelClassName}>
            {timeSlotRequired ? formatRequiredFieldLabel(timeSlotsLabel) : timeSlotsLabel}
          </span>
          <div
            className="flex flex-col gap-3"
            role="group"
            aria-invalid={showError("selectedSlot") || undefined}
            aria-describedby={showError("selectedSlot") ? `${idPrefix}-time-slot-error` : undefined}
          >
            {Array.from({ length: Math.ceil(slots.length / 2) }, (_, row) => (
              <div key={row} className="flex gap-2">
                {[slots[row * 2], slots[row * 2 + 1]].filter(Boolean).map((slot) => {
                  const isSelected = selectedSlot === slot;
                  const isSlotAvailable =
                    !date.trim() || isAppointmentTimeSlotAvailable(slot, date);

                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={!isSlotAvailable}
                      aria-disabled={!isSlotAvailable || undefined}
                      onClick={() => {
                        if (!isSlotAvailable) return;
                        onSelectedSlotChange(isSelected ? null : slot);
                        markTouched("selectedSlot");
                      }}
                      className={cn(
                        "flex h-14 min-w-0 flex-1 items-center justify-center px-3 font-gill text-base leading-110",
                        !isSlotAvailable
                          ? "cursor-not-allowed bg-[#F2F2F2] font-light text-darkblack opacity-40"
                          : isSelected
                            ? selectedSlotStyle === "gold"
                              ? "bg-[#DECAA0] font-normal text-darkblack"
                              : "bg-darkblack font-normal text-white"
                            : cn(
                                "bg-[#F2F2F2] font-light text-darkblack",
                                showError("selectedSlot") &&
                                  invalidFieldContainerClassName,
                              ),
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

      {showContactDetails ? (
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
          readOnly={detailsReadOnly}
          aria-readonly={detailsReadOnly || undefined}
          aria-invalid={showError("note") || undefined}
          aria-describedby={showError("note") ? `${idPrefix}-note-error` : undefined}
          className={cn(
            "h-[100px] w-full resize-none bg-[#F2F2F2] p-3 text-darkblack placeholder:text-[#999999] outline-none",
            noteTextareaClassName,
            detailsReadOnly && "cursor-not-allowed opacity-70",
            showError("note") && invalidFieldClassName,
          )}
        />
        <FormFieldError id={`${idPrefix}-note-error`} message={showError("note") ? errors.note : undefined} />
      </div>
      ) : null}
    </>
  );
};

export default AppointmentContactFields;
