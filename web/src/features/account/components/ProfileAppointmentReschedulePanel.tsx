"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import RingsTabIcon from "@/assets/Icons/PLP/RingsTabIcon";
import { ProductDetailSidePanelShell } from "@/features/products/components/detail/ProductDetailSidePanelShell";
import { DetailDarkButton } from "@/features/products/components/detail/shared";
import { normalizeAppointmentDateInput } from "@/features/products/utils/tryAtHomeBooking";
import {
  getAppointmentContactLocks,
  getAuthLoginIdentifierKind,
} from "@/features/auth/utils/authLoginIdentifier";
import { getProductFormByTag, type NormalizedProductForm } from "@/services/forms/product-form.service";
import { rescheduleCustomerAppointment } from "@/services/customer/customer-appointments.client";
import {
  APPOINTMENT_COUNTRY_CODES,
  DEFAULT_COUNTRY_CODE,
  appointmentFieldClassName,
  appointmentLabelClassName,
} from "@/shared/constants/appointmentForm";
import { useAppointmentFormValidation } from "@/shared/hooks/use-appointment-form-validation";
import { useMobileStickyFooterClearance } from "@/shared/hooks/use-mobile-sticky-footer-clearance";
import { usePanelInputFocusScroll } from "@/shared/hooks/use-panel-input-focus-scroll";
import AppointmentContactFields from "@/shared/ui/AppointmentContactFields";
import FormFieldError from "@/shared/ui/FormFieldError";
import { PanelFooter } from "@/shared/ui/PanelFooter";
import { RIGHT_PANEL_HEADER_PADDING_CLASS } from "@/shared/ui/rightPanel";
import { RightPanelCloseButton } from "@/shared/ui/RightPanelCloseButton";
import { cn } from "@/shared/utils/cn";
import { productNameDisplayClassName } from "@/shared/utils/productNameDisplay";
import { validateRequiredDate } from "@/shared/utils/formValidation";
import { profileTabsContent } from "../data/profileContent";
import type { ProfileAppointmentUi } from "../types/profileUi.types";

const panelContent = profileTabsContent.appointments.reschedulePanel;

const DEFAULT_FORM_TAGS: Record<ProfileAppointmentUi["type"], string> = {
  try_at_home: "try-at-home-form",
  video_call: "product-video-call",
  store_visit: "product-store-visit",
};

function splitStoredPhone(rawPhone: string): { countryCode: string; phone: string } {
  const trimmed = rawPhone.trim();
  if (!trimmed) {
    return { countryCode: DEFAULT_COUNTRY_CODE, phone: "" };
  }

  const sortedCodes = [...APPOINTMENT_COUNTRY_CODES]
    .map((entry) => entry.code)
    .sort((a, b) => b.length - a.length);

  for (const code of sortedCodes) {
    if (trimmed.startsWith(code)) {
      return {
        countryCode: code,
        phone: trimmed.slice(code.length).replace(/\D/g, ""),
      };
    }
  }

  const spaced = /^(\+\d{1,3})\s+(.*)$/.exec(trimmed);
  if (spaced) {
    return {
      countryCode: spaced[1],
      phone: spaced[2].replace(/\D/g, ""),
    };
  }

  return {
    countryCode: DEFAULT_COUNTRY_CODE,
    phone: trimmed.replace(/\D/g, ""),
  };
}

type ProfileAppointmentReschedulePanelProps = {
  open: boolean;
  appointment: ProfileAppointmentUi | null;
  onClose: () => void;
  onRescheduled: () => void;
};

export function ProfileAppointmentReschedulePanel({
  open,
  appointment,
  onClose,
  onRescheduled,
}: ProfileAppointmentReschedulePanelProps) {
  const [cmsForm, setCmsForm] = useState<NormalizedProductForm | null>(null);
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState<string>(DEFAULT_COUNTRY_CODE);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const product = appointment?.products[0] ?? null;
  const timeSlots = cmsForm?.timeSlots?.length ? cmsForm.timeSlots : undefined;
  const hasTimeSlots = Boolean(timeSlots?.length ?? true);
  const isTryAtHome = appointment?.type === "try_at_home";
  const address = appointment?.appointmentAddress;
  const { phoneLocked, emailLocked } = getAppointmentContactLocks(
    getAuthLoginIdentifierKind(),
  );

  const formValues = useMemo(
    () => ({
      name,
      countryCode,
      phone,
      email,
      date,
      note,
      selectedSlot,
    }),
    [name, countryCode, phone, email, date, note, selectedSlot],
  );

  const validationOptions = useMemo(
    () => ({
      dateRequired: true,
      selectedSlotRequired: hasTimeSlots,
    }),
    [hasTimeSlots],
  );

  const { errors, markTouched, showError, resetValidation } =
    useAppointmentFormValidation(formValues, validationOptions);

  const canSave = useMemo(() => {
    if (isSubmitting) return false;
    if (validateRequiredDate(date).error) return false;
    if (hasTimeSlots && !selectedSlot?.trim()) return false;
    return true;
  }, [date, hasTimeSlots, isSubmitting, selectedSlot]);

  useEffect(() => {
    if (!open || !appointment) {
      return;
    }

    const parts = splitStoredPhone(appointment.customerPhone);
    setName(appointment.customerName ?? "");
    setCountryCode(parts.countryCode);
    setPhone(parts.phone);
    setEmail(appointment.customerEmail ?? "");
    setNote(appointment.notes ?? "");
    setDate(normalizeAppointmentDateInput(appointment.requestedDate));
    setSelectedSlot(appointment.bookingTime?.trim() || null);
    setFormError(null);
    setIsSubmitting(false);
    resetValidation();
  }, [appointment, open, resetValidation]);

  useEffect(() => {
    if (!open || !appointment) {
      setCmsForm(null);
      return;
    }

    const formTag = appointment.formTag || DEFAULT_FORM_TAGS[appointment.type];
    const controller = new AbortController();

    void (async () => {
      try {
        const form = await getProductFormByTag(formTag, controller.signal);
        if (form) {
          setCmsForm(form);
        }
      } catch {
        setCmsForm(null);
      }
    })();

    return () => controller.abort();
  }, [appointment, open]);

  const { footerRef, clearancePx } = useMobileStickyFooterClearance();
  const { scrollRef, handleFocusCapture } = usePanelInputFocusScroll();

  const handleSubmit = () => {
    if (!appointment || !canSave) {
      return;
    }

    void (async () => {
      setFormError(null);
      setIsSubmitting(true);

      try {
        const customerName = name.trim();
        const customerPhone = `${countryCode} ${phone}`.trim();
        const customerEmail = email.trim();
        const requestDetails = note.trim();

        await rescheduleCustomerAppointment(appointment.id, {
          requestedDate: date,
          selectedTimeSlot: selectedSlot ?? "",
          ...(customerName ? { customerName } : {}),
          ...(customerPhone ? { customerPhone } : {}),
          ...(customerEmail ? { customerEmail } : {}),
          ...(requestDetails ? { requestDetails } : {}),
        });
        onRescheduled();
        onClose();
      } catch (error) {
        setFormError(
          error instanceof Error ? error.message : panelContent.errorToast,
        );
      } finally {
        setIsSubmitting(false);
      }
    })();
  };

  if (!open || !appointment) {
    return null;
  }

  const panelTitle =
    cmsForm?.formName?.trim() ||
    (isTryAtHome
      ? "Try At Home"
      : appointment.type === "video_call"
        ? "Schedule a Video call"
        : panelContent.title);

  return (
    <ProductDetailSidePanelShell
      open={open}
      onClose={onClose}
      overlayAriaLabel="Close reschedule appointment panel"
      dialogAriaLabel={panelTitle}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div
          ref={scrollRef}
          onFocusCapture={handleFocusCapture}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain DrawerVerticleScrollbar"
        >
          <div className={cn("flex flex-col gap-6", RIGHT_PANEL_HEADER_PADDING_CLASS)}>
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">
                  {panelTitle}
                </h2>
                <RightPanelCloseButton
                  onClick={onClose}
                  aria-label="Close reschedule appointment panel"
                />
              </div>
              <div className="h-[1px] w-full bg-neutral300" aria-hidden />
            </div>

            {product ? (
              <div className="flex flex-col items-center gap-2 pb-4">
                <div className="relative h-[133px] w-[206px]">
                  {product.imageSrc ? (
                    <Image
                      src={product.imageSrc}
                      alt={product.name}
                      fill
                      className="object-contain"
                      sizes="206px"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-white">
                      <RingsTabIcon className="size-16 text-darkblack" />
                    </div>
                  )}
                </div>
                <p
                  className={cn(
                    "font-gill text-base leading-110 text-darkblack",
                    productNameDisplayClassName,
                  )}
                >
                  {product.name}
                </p>
              </div>
            ) : null}

            <div className="flex flex-col gap-6" style={{ paddingBottom: clearancePx }}>
              <AppointmentContactFields
                idPrefix="reschedule-appointment"
                name={name}
                countryCode={countryCode}
                phone={phone}
                email={email}
                date={date}
                note={note}
                selectedSlot={selectedSlot}
                timeSlots={timeSlots}
                onNameChange={setName}
                onCountryCodeChange={setCountryCode}
                onPhoneChange={setPhone}
                onEmailChange={setEmail}
                onDateChange={setDate}
                onNoteChange={setNote}
                onSelectedSlotChange={setSelectedSlot}
                errors={errors}
                showError={showError}
                markTouched={markTouched}
                showContactDetails
                showDate
                showTimeSlots
                phoneLocked={phoneLocked}
                emailLocked={emailLocked}
                nameLabel={cmsForm?.nameLabel}
                namePlaceholder={cmsForm?.namePlaceholder}
                phoneLabel={cmsForm?.phoneLabel}
                phonePlaceholder={cmsForm?.phonePlaceholder}
                emailLabel={cmsForm?.emailLabel}
                emailPlaceholder={cmsForm?.emailPlaceholder}
                dateLabel={cmsForm?.dateLabel}
                dateRequired
                timeSlotRequired={hasTimeSlots}
                noteLabel={
                  cmsForm?.notesLabel ??
                  (isTryAtHome ? "What are you looking for?" : appointment.notesLabel)
                }
                notePlaceholder={
                  cmsForm?.notesPlaceholder ?? "Eg: I am looking for an engagement ring"
                }
              />

              {isTryAtHome && address ? (
                <>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="reschedule-appointment-address-line-1"
                      className={appointmentLabelClassName}
                    >
                      {cmsForm?.addressLine1Label ?? "Address Line 1"}
                    </label>
                    <input
                      id="reschedule-appointment-address-line-1"
                      type="text"
                      value={address.addressLine1}
                      readOnly
                      aria-readonly
                      className={cn(
                        appointmentFieldClassName,
                        "cursor-not-allowed opacity-70",
                      )}
                    />
                  </div>

                  {address.addressLine2 ? (
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="reschedule-appointment-address-line-2"
                        className={appointmentLabelClassName}
                      >
                        {cmsForm?.addressLine2Label ?? "Address Line 2 (Optional)"}
                      </label>
                      <input
                        id="reschedule-appointment-address-line-2"
                        type="text"
                        value={address.addressLine2}
                        readOnly
                        aria-readonly
                        className={cn(
                          appointmentFieldClassName,
                          "cursor-not-allowed opacity-70",
                        )}
                      />
                    </div>
                  ) : null}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="reschedule-appointment-pincode"
                        className={appointmentLabelClassName}
                      >
                        {cmsForm?.pincodeLabel ?? "Pincode"}
                      </label>
                      <input
                        id="reschedule-appointment-pincode"
                        type="text"
                        value={address.pincode ?? ""}
                        readOnly
                        aria-readonly
                        className={cn(
                          appointmentFieldClassName,
                          "cursor-not-allowed opacity-70",
                        )}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="reschedule-appointment-city"
                        className={appointmentLabelClassName}
                      >
                        {cmsForm?.cityLabel ?? "City"}
                      </label>
                      <input
                        id="reschedule-appointment-city"
                        type="text"
                        value={address.city ?? ""}
                        readOnly
                        aria-readonly
                        className={cn(
                          appointmentFieldClassName,
                          "cursor-not-allowed opacity-70",
                        )}
                      />
                    </div>
                  </div>

                  {address.state ? (
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="reschedule-appointment-state"
                        className={appointmentLabelClassName}
                      >
                        {cmsForm?.stateLabel ?? "State"}
                      </label>
                      <input
                        id="reschedule-appointment-state"
                        type="text"
                        value={address.state}
                        readOnly
                        aria-readonly
                        className={cn(
                          appointmentFieldClassName,
                          "cursor-not-allowed opacity-70",
                        )}
                      />
                    </div>
                  ) : null}
                </>
              ) : null}

              {appointment.type === "store_visit" && appointment.storeVisit ? (
                <div className="flex flex-col gap-2">
                  <p className={appointmentLabelClassName}>Store</p>
                  <div
                    className={cn(
                      appointmentFieldClassName,
                      "flex h-auto min-h-14 flex-col justify-center gap-1 py-3 opacity-70",
                    )}
                  >
                    <span>{appointment.storeVisit.city}</span>
                    {appointment.storeVisit.lines.map((line) => (
                      <span key={line} className="font-light text-neutral500">
                        {line}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <FormFieldError message={formError ?? undefined} />
            </div>
          </div>
        </div>

        <PanelFooter footerRef={footerRef} contentClassName="flex flex-col items-center gap-4">
          <p className="text-center font-gill text-sm font-light leading-normal tracking-normal text-neutral500">
            {panelContent.footerNote}
          </p>
          <DetailDarkButton
            onClick={handleSubmit}
            disabled={!canSave}
            className="w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? panelContent.savingLabel : panelContent.submitLabel}
          </DetailDarkButton>
        </PanelFooter>
      </div>
    </ProductDetailSidePanelShell>
  );
}
