"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import RingsTabIcon from "@/assets/Icons/PLP/RingsTabIcon";
import { BookStoreVisitStoreHero } from "@/features/products/components/detail/BookStoreVisitStoreHero";
import { ProductDetailSidePanelShell } from "@/features/products/components/detail/ProductDetailSidePanelShell";
import {
  DetailDarkButton,
  DetailTextLink,
} from "@/features/products/components/detail/shared";
import type { BookStoreVisitStore } from "@/features/products/data/bookStoreVisitContent";
import { resolveBookStoreVisitStores } from "@/features/products/utils/bookStoreVisitStores";
import { useHomepageEditorialBlocks } from "@/hooks/homepage/useHomepageEditorialBlocks";
import { normalizeAppointmentDateInput } from "@/features/products/utils/tryAtHomeBooking";
import {
  getAppointmentContactLocks,
  getAuthLoginIdentifierKind,
} from "@/features/auth/utils/authLoginIdentifier";
import {
  getProductFormByTag,
  STORE_VISIT_FORM_TAG,
  type NormalizedProductForm,
} from "@/services/forms/product-form.service";
import { rescheduleCustomerAppointment } from "@/services/customer/customer-appointments.client";
import {
  APPOINTMENT_COUNTRY_CODES,
  DEFAULT_COUNTRY_CODE,
  STORE_VISIT_BOOKING_WINDOW,
  TRY_AT_HOME_BOOKING_WINDOW,
  VIDEO_CALL_BOOKING_WINDOW,
  appointmentFieldClassName,
  appointmentLabelClassName,
} from "@/shared/constants/appointmentForm";
import type { AppointmentBookingWindow } from "@/shared/utils/appointmentTimeSlots";
import { useAppointmentFormValidation } from "@/shared/hooks/use-appointment-form-validation";
import { useCurrentLocationAddress } from "@/shared/hooks/use-current-location-address";
import { useMobileStickyFooterClearance } from "@/shared/hooks/use-mobile-sticky-footer-clearance";
import { usePanelInputFocusScroll } from "@/shared/hooks/use-panel-input-focus-scroll";
import AppointmentContactFields from "@/shared/ui/AppointmentContactFields";
import FormFieldError from "@/shared/ui/FormFieldError";
import OverlaySelectField from "@/shared/ui/OverlaySelectField";
import { PanelFooter } from "@/shared/ui/PanelFooter";
import { RIGHT_PANEL_HEADER_PADDING_CLASS } from "@/shared/ui/rightPanel";
import { RightPanelCloseButton } from "@/shared/ui/RightPanelCloseButton";
import { cn } from "@/shared/utils/cn";
import { productNameDisplayClassName } from "@/shared/utils/productNameDisplay";
import {
  invalidFieldClassName,
  sanitizePincodeInput,
  validateAddressLine1,
  validateCity,
  validateIndianPincode,
  validateIndianState,
  validateBookingWindowDate,
  validateOptionalAddressLine2,
} from "@/shared/utils/formValidation";
import {
  getTryAtHomeStateSelectOptions,
  matchTryAtHomeStateSelectOption,
} from "@/features/products/data/tryAtHomeContent";
import { profileTabsContent } from "../data/profileContent";
import type { ProfileAppointmentUi } from "../types/profileUi.types";

const panelContent = profileTabsContent.appointments.reschedulePanel;

const DEFAULT_FORM_TAGS: Record<ProfileAppointmentUi["type"], string> = {
  try_at_home: "try-at-home-form",
  video_call: "product-video-call",
  store_visit: STORE_VISIT_FORM_TAG,
};

const BOOKING_WINDOWS: Record<ProfileAppointmentUi["type"], AppointmentBookingWindow> = {
  try_at_home: TRY_AT_HOME_BOOKING_WINDOW,
  video_call: VIDEO_CALL_BOOKING_WINDOW,
  store_visit: STORE_VISIT_BOOKING_WINDOW,
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

type AddressField = "addressLine1" | "addressLine2" | "pincode" | "city" | "state";

type RescheduleStep = "details" | "address";

const ALL_ADDRESS_FIELDS: AddressField[] = [
  "addressLine1",
  "addressLine2",
  "pincode",
  "city",
  "state",
];

/** Same showroom card as the PDP Book a Visit panel, for the booked store. */
function RescheduleStoreVisitCard({
  storeVisit,
}: {
  storeVisit: NonNullable<ProfileAppointmentUi["storeVisit"]>;
}) {
  const { data: editorialData } = useHomepageEditorialBlocks();
  const editorialShowrooms = editorialData?.showroomSection?.showrooms;

  const store = useMemo<BookStoreVisitStore>(() => {
    const matched = storeVisit.showroomDocumentId
      ? resolveBookStoreVisitStores([], editorialShowrooms ?? []).find(
        (entry) => entry.documentId === storeVisit.showroomDocumentId,
      )
      : undefined;

    return (
      matched ?? {
        id: storeVisit.showroomDocumentId ?? storeVisit.city,
        tabLabel: storeVisit.city.toUpperCase(),
        storeName: storeVisit.city,
        city: storeVisit.city,
        address: storeVisit.lines.join(", "),
        phone: "",
        directionsUrl: storeVisit.directionsHref ?? "",
      }
    );
  }, [editorialShowrooms, storeVisit]);

  return (
    <BookStoreVisitStoreHero
      store={store}
      directionsLabel={profileTabsContent.appointments.getDirectionsLabel}
    />
  );
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
  const [step, setStep] = useState<RescheduleStep>("details");
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState<string>(DEFAULT_COUNTRY_CODE);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const [touchedAddressFields, setTouchedAddressFields] = useState<Set<AddressField>>(
    () => new Set(),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const product = appointment?.products[0] ?? null;
  const timeSlots = cmsForm?.timeSlots?.length ? cmsForm.timeSlots : undefined;
  const hasTimeSlots = Boolean(timeSlots?.length ?? true);
  const isTryAtHome = appointment?.type === "try_at_home";
  const isStoreVisit = appointment?.type === "store_visit";
  const bookingWindow = BOOKING_WINDOWS[appointment?.type ?? "store_visit"];
  const storeVisitPurpose = isStoreVisit ? (appointment?.purposeOfVisit?.trim() ?? "") : "";
  const address = appointment?.appointmentAddress;
  const hasAddressStep = isTryAtHome && Boolean(address);
  const isAddressStep = hasAddressStep && step === "address";
  const { phoneLocked, emailLocked } = getAppointmentContactLocks(
    getAuthLoginIdentifierKind(),
  );
  const { detectAddress, isLocating } = useCurrentLocationAddress();

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
      bookingWindow,
    }),
    [bookingWindow, hasTimeSlots],
  );

  const { errors, markTouched, showError, resetValidation } =
    useAppointmentFormValidation(formValues, validationOptions);

  const cmsStateOptionSource = useMemo(() => {
    if (!cmsForm) {
      return undefined;
    }

    return cmsForm.stateFieldOptions.length > 0
      ? cmsForm.stateFieldOptions
      : cmsForm.stateOptions;
  }, [cmsForm]);

  const stateOptions = useMemo(
    () => getTryAtHomeStateSelectOptions(cmsStateOptionSource, address?.state),
    [address?.state, cmsStateOptionSource],
  );

  const selectedAddressState = useMemo(
    () => matchTryAtHomeStateSelectOption(addressState, stateOptions),
    [addressState, stateOptions],
  );

  const isAddressChanged =
    isTryAtHome &&
    Boolean(address) &&
    (addressLine1.trim() !== (address?.addressLine1 ?? "").trim() ||
      addressLine2.trim() !== (address?.addressLine2 ?? "").trim() ||
      pincode.trim() !== (address?.pincode ?? "").trim() ||
      city.trim() !== (address?.city ?? "").trim() ||
      addressState.trim() !== (address?.state ?? "").trim());

  // Saved addresses are trusted as-is; only validate once the customer edits them.
  const addressErrors = useMemo<Partial<Record<AddressField, string | undefined>>>(
    () =>
      isAddressChanged
        ? {
          addressLine1: validateAddressLine1(addressLine1).error,
          addressLine2: validateOptionalAddressLine2(addressLine2).error,
          pincode: validateIndianPincode(pincode).error,
          city: validateCity(city).error,
          state: validateIndianState(selectedAddressState, stateOptions).error,
        }
        : {},
    [addressLine1, addressLine2, city, isAddressChanged, pincode, selectedAddressState, stateOptions],
  );

  const hasAddressErrors = Object.values(addressErrors).some(Boolean);
  const markAddressTouched = (field: AddressField) =>
    setTouchedAddressFields((current) =>
      current.has(field) ? current : new Set(current).add(field),
    );
  const showAddressError = (field: AddressField) =>
    touchedAddressFields.has(field) && Boolean(addressErrors[field]);

  const canProceedToAddress = useMemo(() => {
    if (isSubmitting) return false;
    if (validateBookingWindowDate(date, bookingWindow, true).error) return false;
    if (hasTimeSlots && !selectedSlot?.trim()) return false;
    return true;
  }, [bookingWindow, date, hasTimeSlots, isSubmitting, selectedSlot]);

  const hasChanges = useMemo(() => {
    if (!appointment) return false;
    const initialPhone = splitStoredPhone(appointment.customerPhone);
    return (
      name.trim() !== (appointment.customerName ?? "").trim() ||
      countryCode !== initialPhone.countryCode ||
      phone.trim() !== initialPhone.phone.trim() ||
      email.trim() !== (appointment.customerEmail ?? "").trim() ||
      note.trim() !== (appointment.notes ?? "").trim() ||
      date !== normalizeAppointmentDateInput(appointment.requestedDate) ||
      (selectedSlot?.trim() ?? "") !== (appointment.bookingTime?.trim() ?? "") ||
      isAddressChanged
    );
  }, [appointment, countryCode, date, email, isAddressChanged, name, note, phone, selectedSlot]);

  const canSave = canProceedToAddress && !hasAddressErrors && hasChanges;

  const handleUseCurrentLocation = async () => {
    const detected = await detectAddress();
    if (!detected) {
      return;
    }

    setAddressLine1(detected.addressLine1);
    setAddressLine2(detected.addressLine2);
    setPincode(detected.pincode);
    setCity(detected.city);
    setAddressState(detected.state);
    setTouchedAddressFields(new Set(ALL_ADDRESS_FIELDS));
  };

  useEffect(() => {
    if (!open || !appointment) {
      return;
    }

    const parts = splitStoredPhone(appointment.customerPhone);
    setStep("details");
    setName(appointment.customerName ?? "");
    setCountryCode(parts.countryCode);
    setPhone(parts.phone);
    setEmail(appointment.customerEmail ?? "");
    setNote(appointment.notes ?? "");
    setDate(normalizeAppointmentDateInput(appointment.requestedDate));
    setSelectedSlot(appointment.bookingTime?.trim() || null);
    setAddressLine1(appointment.appointmentAddress?.addressLine1 ?? "");
    setAddressLine2(appointment.appointmentAddress?.addressLine2 ?? "");
    setPincode(appointment.appointmentAddress?.pincode ?? "");
    setCity(appointment.appointmentAddress?.city ?? "");
    const rawState = appointment.appointmentAddress?.state?.trim() ?? "";
    setAddressState(rawState);
    setTouchedAddressFields(new Set());
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

        // Video calls are rescheduled atomically by the CMS appointment group.
        const appointmentIds = appointment.type === 'video_call'
          ? [appointment.id]
          : [...new Set([appointment.id, ...(appointment.clubbedAppointmentIds ?? [])])];
        for (const appointmentId of appointmentIds) {
          await rescheduleCustomerAppointment(appointmentId, {
            requestedDate: date,
            selectedTimeSlot: selectedSlot ?? "",
            ...(customerName ? { customerName } : {}),
            ...(customerPhone ? { customerPhone } : {}),
            ...(customerEmail ? { customerEmail } : {}),
            ...(requestDetails ? { requestDetails } : {}),
            ...(isAddressChanged
              ? {
                address: {
                  addressLine1: addressLine1.trim(),
                  pincode: pincode.trim(),
                  city: city.trim(),
                  ...(addressLine2.trim() ? { addressLine2: addressLine2.trim() } : {}),
                  ...(selectedAddressState.trim()
                    ? { state: selectedAddressState.trim() }
                    : {}),
                },
              }
              : {}),
          });
        }
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
          key={step}
          ref={scrollRef}
          onFocusCapture={handleFocusCapture}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain DrawerVerticleScrollbar"
        >
          <div className={cn("flex flex-col gap-6", RIGHT_PANEL_HEADER_PADDING_CLASS)}>
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-2">
                  {isAddressStep ? (
                    <button
                      type="button"
                      onClick={() => setStep("details")}
                      aria-label="Back to try at home details"
                      className="inline-flex size-6 shrink-0 items-center justify-center"
                    >
                      <ChevronLeft
                        size={24}
                        strokeWidth={1.25}
                        aria-hidden
                        className="text-darkblack"
                      />
                    </button>
                  ) : null}
                  <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">
                    {panelTitle}
                  </h2>
                </div>
                <RightPanelCloseButton
                  onClick={onClose}
                  aria-label="Close reschedule appointment panel"
                />
              </div>
              <div className="h-[1px] w-full bg-neutral300" aria-hidden />
            </div>

            {isStoreVisit && appointment.storeVisit ? (
              <RescheduleStoreVisitCard storeVisit={appointment.storeVisit} />
            ) : null}

            {isAddressStep ? (
              <div className="flex justify-center">
                <DetailTextLink
                  onClick={() => void handleUseCurrentLocation()}
                  disabled={isLocating}
                >
                  {isLocating ? "DETECTING LOCATION..." : "USE CURRENT LOCATION"}
                </DetailTextLink>
              </div>
            ) : null}

            {product && !isStoreVisit && !isAddressStep ? (
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
              {!isAddressStep ? (
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
                  detailsReadOnly
                  showDate
                  showTimeSlots
                  selectedSlotStyle={isStoreVisit ? "gold" : "dark"}
                  showPurpose={Boolean(storeVisitPurpose)}
                  purpose={storeVisitPurpose}
                  purposeOptions={storeVisitPurpose ? [storeVisitPurpose] : []}
                  purposeLabel={profileTabsContent.appointments.purposeOfVisitLabel}
                  onPurposeChange={() => undefined}
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
                  bookingWindow={bookingWindow}
                  noteLabel={
                    cmsForm?.notesLabel ??
                    (isTryAtHome ? "What are you looking for?" : appointment.notesLabel)
                  }
                  notePlaceholder={
                    cmsForm?.notesPlaceholder ?? "Eg: I am looking for an engagement ring"
                  }
                />
              ) : null}

              {isAddressStep ? (
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
                      value={addressLine1}
                      onChange={(event) => setAddressLine1(event.target.value)}
                      onBlur={() => markAddressTouched("addressLine1")}
                      placeholder={cmsForm?.addressLine1Placeholder ?? "Enter"}
                      aria-invalid={showAddressError("addressLine1") || undefined}
                      className={cn(
                        appointmentFieldClassName,
                        showAddressError("addressLine1") && invalidFieldClassName,
                      )}
                    />
                    <FormFieldError
                      message={
                        showAddressError("addressLine1") ? addressErrors.addressLine1 : undefined
                      }
                    />
                  </div>

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
                      value={addressLine2}
                      onChange={(event) => setAddressLine2(event.target.value)}
                      onBlur={() => markAddressTouched("addressLine2")}
                      placeholder={cmsForm?.addressLine2Placeholder ?? "Enter"}
                      aria-invalid={showAddressError("addressLine2") || undefined}
                      className={cn(
                        appointmentFieldClassName,
                        showAddressError("addressLine2") && invalidFieldClassName,
                      )}
                    />
                    <FormFieldError
                      message={
                        showAddressError("addressLine2") ? addressErrors.addressLine2 : undefined
                      }
                    />
                  </div>

                  <div className="flex gap-6">
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <label
                        htmlFor="reschedule-appointment-pincode"
                        className={appointmentLabelClassName}
                      >
                        {cmsForm?.pincodeLabel ?? "Pincode"}
                      </label>
                      <input
                        id="reschedule-appointment-pincode"
                        type="text"
                        inputMode="numeric"
                        value={pincode}
                        onChange={(event) => setPincode(sanitizePincodeInput(event.target.value))}
                        onBlur={() => markAddressTouched("pincode")}
                        placeholder={cmsForm?.pincodePlaceholder ?? "Enter"}
                        aria-invalid={showAddressError("pincode") || undefined}
                        className={cn(
                          appointmentFieldClassName,
                          showAddressError("pincode") && invalidFieldClassName,
                        )}
                      />
                      <FormFieldError
                        message={showAddressError("pincode") ? addressErrors.pincode : undefined}
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <label
                        htmlFor="reschedule-appointment-city"
                        className={appointmentLabelClassName}
                      >
                        {cmsForm?.cityLabel ?? ""}
                      </label>
                      <input
                        id="reschedule-appointment-city"
                        type="text"
                        value={city}
                        onChange={(event) => setCity(event.target.value)}
                        onBlur={() => markAddressTouched("city")}
                        placeholder={cmsForm?.cityPlaceholder ?? ""}
                        aria-invalid={showAddressError("city") || undefined}
                        className={cn(
                          appointmentFieldClassName,
                          showAddressError("city") && invalidFieldClassName,
                        )}
                      />
                      <FormFieldError
                        message={showAddressError("city") ? addressErrors.city : undefined}
                      />
                    </div>
                  </div>

                  <OverlaySelectField
                    id="reschedule-appointment-state"
                    label={cmsForm?.stateLabel ?? "State"}
                    value={selectedAddressState}
                    options={stateOptions}
                    placeholder={cmsForm?.statePlaceholder ?? "Select"}
                    onChange={setAddressState}
                    onBlur={() => markAddressTouched("state")}
                    labelClassName={appointmentLabelClassName}
                    invalid={showAddressError("state")}
                    error={
                      showAddressError("state") ? addressErrors.state : undefined
                    }
                  />
                </>
              ) : null}

              <FormFieldError message={formError ?? undefined} />
            </div>
          </div>
        </div>

        <PanelFooter footerRef={footerRef} contentClassName="flex flex-col items-center gap-4">
          <p className="text-center font-gill text-sm font-light leading-normal tracking-normal text-neutral500">
            {panelContent.footerNote}
          </p>
          {hasAddressStep && !isAddressStep ? (
            <DetailDarkButton
              onClick={() => setStep("address")}
              disabled={!canProceedToAddress}
              className="w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              {cmsForm?.stepOneButtonText || "PROCEED"}
            </DetailDarkButton>
          ) : (
            <DetailDarkButton
              onClick={handleSubmit}
              disabled={!canSave}
              className="w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? panelContent.savingLabel : panelContent.submitLabel}
            </DetailDarkButton>
          )}
        </PanelFooter>
      </div>
    </ProductDetailSidePanelShell>
  );
}
