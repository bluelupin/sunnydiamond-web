"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useAppStatusToastController } from "@/shared/hooks/useAppStatusToastController";
import { cn } from "@/shared/utils/cn";
import { productNameDisplayClassName } from "@/shared/utils/productNameDisplay";
import { useAppointmentFormValidation } from "@/shared/hooks/use-appointment-form-validation";
import { useCustomerProfileContact } from "@/shared/hooks/use-customer-profile-contact";
import { useMobileStickyFooterClearance } from "@/shared/hooks/use-mobile-sticky-footer-clearance";
import { usePanelInputFocusScroll } from "@/shared/hooks/use-panel-input-focus-scroll";
import AppointmentContactFields from "@/shared/ui/AppointmentContactFields";
import {
  getAppointmentContactLocks,
  getAuthLoginIdentifierKind,
} from "@/features/auth/utils/authLoginIdentifier";
import FormFieldError from "@/shared/ui/FormFieldError";
import OverlaySelectField from "@/shared/ui/OverlaySelectField";
import {
  appointmentFieldClassName,
  appointmentLabelClassName,
  TRY_AT_HOME_BOOKING_WINDOW,
} from "@/shared/constants/appointmentForm";
import { AppStatusToastAction } from "@/shared/ui/AppStatusToast";
import {
  DUPLICATE_APPOINTMENT_TOAST,
  DUPLICATE_APPOINTMENT_VIEW_LABEL,
  hasDuplicateAppointmentBooking,
} from "@/features/products/utils/appointmentDuplicateBooking";
import type { Product } from "@/features/products/data/products";
import { getProductHref } from "@/features/products/utils/productRoutes";
import { useCurrentLocationAddress } from "@/shared/hooks/use-current-location-address";
import {
  createProductSubmission,
  getProductFormByTag,
  type NormalizedProductForm,
} from "@/services/forms/product-form.service";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useCustomerAddresses } from "@/features/account/hooks/useCustomerAddresses";
import { buildProfileSectionHref } from "@/features/account/utils/profileSectionNavigation";
import { mapCustomerAddressToFormInput } from "@/services/customer/customer-account.mapper";
import { wishlistMovedToastDurationMs } from "@/features/wishlist/data/content";
import {
  invalidFieldClassName,
  sanitizePincodeInput,
  validateAddressLine1,
  validateCity,
  validateIndianPincode,
  validateIndianState,
  validateOptionalAddressLine2,
  shouldShowFieldError,
} from "@/shared/utils/formValidation";
import { DetailDarkButton, DetailTextLink } from "./shared";
import { PanelFooter } from "@/shared/ui/PanelFooter";
import { RIGHT_PANEL_HEADER_PADDING_CLASS } from "@/shared/ui/rightPanel";
import { RightPanelCloseButton } from "@/shared/ui/RightPanelCloseButton";
import { ProductDetailSidePanelShell } from "./ProductDetailSidePanelShell";
import {
  countAdditionalTryAtHomeItemsForSlot,
  type TryAtHomeBookingSummary,
} from "@/features/products/utils/tryAtHomeBooking";
import TryAtHomeSuccessStep from "./TryAtHomeSuccessStep";
import { getCustomerAppointments } from "@/services/customer/customer-appointments.client";

const TRY_AT_HOME_FORM_TAG = "try-at-home-form";

type TryAtHomePanelProps = {
  open: boolean;
  onClose: () => void;
  product: Product;
};

type TryAtHomeStep = "details" | "address" | "success";

type TryAtHomeDetailsData = TryAtHomeBookingSummary & {
  name: string;
  countryCode: string;
  phone: string;
  email: string;
  note: string;
};

type TryAtHomeDetailsStepProps = {
  productName: string;
  productImage: string | StaticImageData;
  form: NormalizedProductForm | null;
  open: boolean;
  onClose: () => void;
  onProceed: (details: TryAtHomeDetailsData) => void;
  /** Restored when returning from the address step before submit. */
  savedDetails?: TryAtHomeDetailsData | null;
};

const TryAtHomeDetailsStep = ({
  productName,
  productImage,
  form,
  open,
  onClose,
  onProceed,
  savedDetails = null,
}: TryAtHomeDetailsStepProps) => {
  const { contact: profileContact } = useCustomerProfileContact(open);
  const [name, setName] = useState(() => savedDetails?.name ?? "");
  const [countryCode, setCountryCode] = useState(() => savedDetails?.countryCode ?? "+91");
  const [phone, setPhone] = useState(() => savedDetails?.phone ?? "");
  const [email, setEmail] = useState(() => savedDetails?.email ?? "");
  const [date, setDate] = useState(() => savedDetails?.date ?? "");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(
    () => savedDetails?.selectedSlot ?? null,
  );
  const [note, setNote] = useState(() => savedDetails?.note ?? "");
  const [hasAppliedProfilePrefill, setHasAppliedProfilePrefill] = useState(
    () => savedDetails != null,
  );

  const timeSlots = form?.timeSlots?.length ? form.timeSlots : undefined;
  const hasTimeSlots = Boolean(timeSlots?.length ?? true);
  const { phoneLocked, emailLocked } = getAppointmentContactLocks(
    getAuthLoginIdentifierKind(),
  );

  const formValues = useMemo(
    () => ({ name, countryCode, phone, email, date, note, selectedSlot }),
    [name, countryCode, phone, email, date, note, selectedSlot],
  );

  const validationOptions = useMemo(
    () => ({
      noteRequired: form?.notesRequired ?? false,
      dateRequired: true,
      selectedSlotRequired: hasTimeSlots,
      bookingWindow: TRY_AT_HOME_BOOKING_WINDOW,
    }),
    [form?.notesRequired, hasTimeSlots],
  );

  const { errors, isValid, markTouched, showError, validateSubmit, resetValidation } =
    useAppointmentFormValidation(formValues, validationOptions);

  useEffect(() => {
    if (!open) {
      setName("");
      setCountryCode("+91");
      setPhone("");
      setEmail("");
      setDate("");
      setSelectedSlot(null);
      setNote("");
      setHasAppliedProfilePrefill(false);
      resetValidation();
    }
  }, [open, resetValidation]);

  useEffect(() => {
    if (!profileContact || hasAppliedProfilePrefill) return;

    const profileName = profileContact.fullName?.trim();
    const profileEmail = profileContact.email?.trim();
    const profilePhone = profileContact.phone?.trim();
    const profileCountryCode = profileContact.countryCode?.trim();

    if (profileName && !name.trim()) setName(profileName);
    if (profileEmail && !email.trim()) setEmail(profileEmail);
    if (profilePhone && !phone.trim()) setPhone(profilePhone);
    if (profileCountryCode) setCountryCode(profileCountryCode);

    setHasAppliedProfilePrefill(true);
  }, [profileContact, hasAppliedProfilePrefill, name, email, phone]);

  const { footerRef, clearancePx } = useMobileStickyFooterClearance();
  const { scrollRef, handleFocusCapture } = usePanelInputFocusScroll();

  return (
    <>
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
                {form?.formName ?? ""}
              </h2>
              <RightPanelCloseButton onClick={onClose} aria-label="Close try at home panel" />
            </div>
            <div className="h-[1px] w-full bg-neutral300" aria-hidden />
          </div>

          <div className="flex flex-col items-center gap-2 pb-4">
            <Image
              src={productImage}
              alt={productName}
              width={206}
              height={133}
              className="h-133 w-206 object-contain"
              sizes="206px"
            />
            <p
              className={cn(
                "font-gill text-base leading-110 text-darkblack",
                productNameDisplayClassName,
              )}
            >
              {productName}
            </p>
          </div>

          <div className="flex flex-col gap-6" style={{ paddingBottom: clearancePx }}>
            <AppointmentContactFields
              idPrefix="try-at-home"
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
              showDate
              showTimeSlots
              nameLabel={form?.nameLabel ?? ""}
              namePlaceholder={form?.namePlaceholder}
              phoneLabel={form?.phoneLabel ?? ""}
              phonePlaceholder={form?.phonePlaceholder}
              emailLabel={form?.emailLabel ?? ""}
              emailPlaceholder={form?.emailPlaceholder ?? ""}
              dateLabel={form?.dateLabel ?? ""}
              datePlaceholder={form?.datePlaceholder ?? ""}
              dateRequired
              timeSlotRequired={hasTimeSlots}
              noteLabel={form?.notesLabel ?? ""}
              notePlaceholder={form?.notesPlaceholder ?? ""}
              phoneLocked={phoneLocked}
              emailLocked={emailLocked}
              bookingWindow={TRY_AT_HOME_BOOKING_WINDOW}
              selectedSlotStyle="gold"
            />
          </div>
        </div>
      </div>

      <PanelFooter footerRef={footerRef} contentClassName="flex flex-col items-center gap-4">
        <p className="text-center font-gill text-sm font-light leading-normal tracking-normal text-neutral500">
          Our representative will get in touch with you soon
        </p>
        <DetailDarkButton
          onClick={() =>
            validateSubmit(() =>
              onProceed({
                name,
                countryCode,
                phone,
                email,
                note,
                date,
                selectedSlot,
              }),
            )
          }
          disabled={!isValid}
          className="disabled:cursor-not-allowed disabled:opacity-50"
        >
          {form?.stepOneButtonText ?? ""}
        </DetailDarkButton>
      </PanelFooter>
      </div>
    </>
  );
};

type TryAtHomeAddressStepProps = {
  form: NormalizedProductForm | null;
  formTitle: string;
  submitLabel: string;
  isSubmitting: boolean;
  onBack: () => void;
  onClose: () => void;
  onSubmit: (address: {
    addressLine1: string;
    addressLine2: string;
    pincode: string;
    city: string;
    state: string;
  }) => void;
};

type AddressField = "addressLine1" | "addressLine2" | "pincode" | "city" | "state";

/** Prefilled/detected values may differ in case from the CMS options (e.g. "uttar pradesh" vs "Uttar Pradesh"). */
const matchSelectOption = (value: string, options: readonly string[]): string => {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return "";
  return options.find((option) => option.toLowerCase() === normalized) ?? "";
};

const TryAtHomeAddressStep = ({
  form,
  formTitle,
  submitLabel,
  isSubmitting,
  onBack,
  onClose,
  onSubmit,
}: TryAtHomeAddressStepProps) => {
  const { status, customer } = useAuth();
  const isAuthenticated = status === "authenticated" && Boolean(customer);
  const { addresses } = useCustomerAddresses(isAuthenticated);
  const { detectAddress, isLocating } = useCurrentLocationAddress();
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [touched, setTouched] = useState<Partial<Record<AddressField, boolean>>>({});
  const [hasAppliedAddressPrefill, setHasAppliedAddressPrefill] = useState(false);

  const stateOptions = useMemo(() => form?.stateFieldOptions ?? [], [form?.stateFieldOptions]);
  const selectedState = matchSelectOption(state, stateOptions);

  const defaultShippingAddress = useMemo(() => {
    if (addresses.length === 0) {
      return null;
    }

    return addresses.find((address) => address.isDefaultShipping) ?? addresses[0];
  }, [addresses]);

  useEffect(() => {
    if (!defaultShippingAddress || hasAppliedAddressPrefill) {
      return;
    }

    const mapped = mapCustomerAddressToFormInput(defaultShippingAddress);

    setAddressLine1(mapped.addressLine1);
    setAddressLine2(mapped.addressLine2 ?? "");
    setPincode(mapped.pincode);
    setCity(mapped.city);
    setState(mapped.state);
    setHasAppliedAddressPrefill(true);
  }, [defaultShippingAddress, hasAppliedAddressPrefill]);

  const errors = useMemo(
    () => ({
      addressLine1: validateAddressLine1(addressLine1).error,
      addressLine2: validateOptionalAddressLine2(addressLine2).error,
      pincode: validateIndianPincode(pincode).error,
      city: validateCity(city).error,
      state: validateIndianState(selectedState, stateOptions).error,
    }),
    [addressLine1, addressLine2, pincode, city, selectedState, stateOptions],
  );

  const isValid = Object.values(errors).every((error) => !error);

  const markTouched = (field: AddressField) => {
    setTouched((current) => ({ ...current, [field]: true }));
  };

  const showError = (field: AddressField) =>
    shouldShowFieldError(Boolean(touched[field]), false, errors[field]);

  const handleUseCurrentLocation = async () => {
    const address = await detectAddress();
    if (!address) {
      return;
    }

    setAddressLine1(address.addressLine1);
    setAddressLine2(address.addressLine2);
    setPincode(address.pincode);
    setCity(address.city);
    setState(address.state);
    setTouched({
      addressLine1: true,
      addressLine2: true,
      pincode: true,
      city: true,
      state: true,
    });
  };

  const handleSubmit = () => {
    setTouched({
      addressLine1: true,
      addressLine2: true,
      pincode: true,
      city: true,
      state: true,
    });
    if (!isValid) {
      return;
    }
    onSubmit({ addressLine1, addressLine2, pincode, city, state: selectedState });
  };

  const { footerRef, clearancePx } = useMobileStickyFooterClearance();
  const { scrollRef, handleFocusCapture } = usePanelInputFocusScroll();

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div
          ref={scrollRef}
          onFocusCapture={handleFocusCapture}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain DrawerVerticleScrollbar"
        >
        <div className={cn("flex flex-col gap-6", RIGHT_PANEL_HEADER_PADDING_CLASS)}>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-2">
                <button
                  type="button"
                  onClick={onBack}
                  aria-label="Back to try at home details"
                  className="inline-flex size-6 shrink-0 items-center justify-center"
                >
                  <ChevronLeft size={24} strokeWidth={1.25} aria-hidden className="text-darkblack" />
                </button>
                <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">
                  {formTitle}
                </h2>
              </div>
              <RightPanelCloseButton onClick={onClose} aria-label="Close try at home panel" />
            </div>
            <div className="h-[1px] w-full bg-neutral300" aria-hidden />
          </div>

          <div className="flex justify-center">
            <DetailTextLink
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
            >
              {isLocating ? "DETECTING LOCATION..." : "USE CURRENT LOCATION"}
            </DetailTextLink>
          </div>

          <div className="flex flex-col gap-6" style={{ paddingBottom: clearancePx }}>
            <div className="flex flex-col gap-2">
              <label htmlFor="try-at-home-address-line-1" className={appointmentLabelClassName}>
                {form?.addressLine1Label ?? ""}
              </label>
              <input
                id="try-at-home-address-line-1"
                type="text"
                value={addressLine1}
                onChange={(event) => setAddressLine1(event.target.value)}
                onBlur={() => markTouched("addressLine1")}
                placeholder={form?.addressLine1Placeholder ?? ""}
                autoComplete="address-line1"
                maxLength={120}
                aria-invalid={showError("addressLine1") || undefined}
                aria-describedby={
                  showError("addressLine1") ? "try-at-home-address-line-1-error" : undefined
                }
                className={cn(
                  appointmentFieldClassName,
                  showError("addressLine1") && invalidFieldClassName,
                )}
              />
              <FormFieldError
                id="try-at-home-address-line-1-error"
                message={showError("addressLine1") ? errors.addressLine1 : undefined}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="try-at-home-address-line-2" className={appointmentLabelClassName}>
                {form?.addressLine2Label ?? ""}
              </label>
              <input
                id="try-at-home-address-line-2"
                type="text"
                value={addressLine2}
                onChange={(event) => setAddressLine2(event.target.value)}
                onBlur={() => markTouched("addressLine2")}
                placeholder={form?.addressLine2Placeholder ?? ""}
                autoComplete="address-line2"
                maxLength={120}
                aria-invalid={showError("addressLine2") || undefined}
                aria-describedby={
                  showError("addressLine2") ? "try-at-home-address-line-2-error" : undefined
                }
                className={cn(
                  appointmentFieldClassName,
                  showError("addressLine2") && invalidFieldClassName,
                )}
              />
              <FormFieldError
                id="try-at-home-address-line-2-error"
                message={showError("addressLine2") ? errors.addressLine2 : undefined}
              />
            </div>

            <div className="flex gap-6">
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <label htmlFor="try-at-home-pincode" className={appointmentLabelClassName}>
                  {form?.pincodeLabel ?? ""}
                </label>
                <input
                  id="try-at-home-pincode"
                  type="text"
                  inputMode="numeric"
                  value={pincode}
                  onChange={(event) => setPincode(sanitizePincodeInput(event.target.value))}
                  onBlur={() => markTouched("pincode")}
                  placeholder={form?.pincodePlaceholder ?? ""}
                  autoComplete="postal-code"
                  maxLength={6}
                  aria-invalid={showError("pincode") || undefined}
                  aria-describedby={showError("pincode") ? "try-at-home-pincode-error" : undefined}
                  className={cn(
                    appointmentFieldClassName,
                    showError("pincode") && invalidFieldClassName,
                  )}
                />
                <FormFieldError
                  id="try-at-home-pincode-error"
                  message={showError("pincode") ? errors.pincode : undefined}
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <label htmlFor="try-at-home-city" className={appointmentLabelClassName}>
                  {form?.cityLabel ?? ""}
                </label>
                <input
                  id="try-at-home-city"
                  type="text"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  onBlur={() => markTouched("city")}
                  placeholder={form?.cityPlaceholder ?? ""}
                  autoComplete="address-level2"
                  maxLength={80}
                  aria-invalid={showError("city") || undefined}
                  aria-describedby={showError("city") ? "try-at-home-city-error" : undefined}
                  className={cn(appointmentFieldClassName, showError("city") && invalidFieldClassName)}
                />
                <FormFieldError
                  id="try-at-home-city-error"
                  message={showError("city") ? errors.city : undefined}
                />
              </div>
            </div>

            <OverlaySelectField
              id="try-at-home-state"
              label={form?.stateLabel ?? ""}
              value={selectedState}
              options={stateOptions}
              placeholder={form?.statePlaceholder ?? ""}
              onChange={setState}
              onBlur={() => markTouched("state")}
              labelClassName={appointmentLabelClassName}
              invalid={showError("state")}
              errorId={showError("state") ? "try-at-home-state-error" : undefined}
              error={showError("state") ? errors.state : undefined}
            />
          </div>
        </div>
      </div>

      <PanelFooter footerRef={footerRef} contentClassName="flex flex-col items-center gap-4">
        <p className="text-center font-gill text-sm font-light leading-normal tracking-normal text-neutral500">
          Our representative will get in touch with you soon
        </p>
        <DetailDarkButton
          onClick={handleSubmit}
          disabled={isSubmitting || !isValid}
          className="disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "SUBMITTING..." : submitLabel}
        </DetailDarkButton>
      </PanelFooter>
      </div>
    </>
  );
};

const TryAtHomePanel = ({ open, onClose, product }: TryAtHomePanelProps) => {
  const router = useRouter();
  const { customer } = useAuth();
  const [step, setStep] = useState<TryAtHomeStep>("details");
  const [cmsForm, setCmsForm] = useState<NormalizedProductForm | null>(null);
  const [details, setDetails] = useState<TryAtHomeDetailsData | null>(null);
  const [submittedBooking, setSubmittedBooking] = useState<TryAtHomeBookingSummary | null>(null);
  const [additionalItemsCount, setAdditionalItemsCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { show: showStatusToast, node: statusToast } = useAppStatusToastController(
    wishlistMovedToastDurationMs,
  );
  const productImage = product.image || product.images[0];

  useEffect(() => {
    if (!open) {
      setStep("details");
      setDetails(null);
      setSubmittedBooking(null);
      setAdditionalItemsCount(0);
      setIsSubmitting(false);
      return;
    }

    const controller = new AbortController();

    void (async () => {
      try {
        const form = await getProductFormByTag(TRY_AT_HOME_FORM_TAG, controller.signal);
        if (form) setCmsForm(form);
      } catch {
        // Keep local fallbacks if CMS fails.
      }
    })();

    return () => controller.abort();
  }, [open]);

  const handleClose = () => {
    setStep("details");
    setDetails(null);
    setSubmittedBooking(null);
    setAdditionalItemsCount(0);
    setIsSubmitting(false);
    onClose();
  };

  const handleAddressSubmit = async (address: {
    addressLine1: string;
    addressLine2: string;
    pincode: string;
    city: string;
    state: string;
  }) => {
    if (!details || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const booking: TryAtHomeBookingSummary = {
        date: details.date,
        selectedSlot: details.selectedSlot,
      };

      if (
        customer?.id != null &&
        (await hasDuplicateAppointmentBooking({
          kind: "try_at_home",
          productId: product.id,
          date: booking.date,
          selectedSlot: booking.selectedSlot,
          address: {
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2,
            pincode: address.pincode,
            city: address.city,
          },
        }))
      ) {
        showStatusToast(DUPLICATE_APPOINTMENT_TOAST, {
          action: (
            <AppStatusToastAction onClick={handleViewBooking}>
              {DUPLICATE_APPOINTMENT_VIEW_LABEL}
            </AppStatusToastAction>
          ),
        });
        return;
      }

      const requestDetails = details.note.trim() || undefined;

      await createProductSubmission({
        formTag: cmsForm?.formTag ?? TRY_AT_HOME_FORM_TAG,
        productName: product.name,
        productId: product.id,
        customerName: details.name.trim(),
        customerPhone: `${details.countryCode} ${details.phone}`.trim(),
        customerEmail: details.email.trim() || undefined,
        ...(customer?.id != null ? { magentoCustomerId: customer.id } : {}),
        requestDetails,
        requestedDate: booking.date,
        selectedTimeSlot: booking.selectedSlot ?? undefined,
        addressLine1: address.addressLine1.trim(),
        addressLine2: address.addressLine2.trim() || undefined,
        pincode: address.pincode.trim(),
        city: address.city.trim(),
        ...(address.state.trim() ? { state: address.state.trim() } : {}),
        sourcePage:
          typeof window !== "undefined" ? window.location.pathname : getProductHref(product),
        consentAccepted: true,
        workflowStatus: "New",
      });

      let moreItems = 0;
      try {
        const page = await getCustomerAppointments(1, 50);
        if (page?.appointments?.length) {
          moreItems = countAdditionalTryAtHomeItemsForSlot(page.appointments, {
            date: booking.date,
            selectedSlot: booking.selectedSlot,
            address: {
              addressLine1: address.addressLine1.trim(),
              addressLine2: address.addressLine2.trim() || undefined,
              pincode: address.pincode.trim(),
              city: address.city.trim(),
              state: address.state.trim() || undefined,
            },
            currentProductId: product.id,
          });
        }
      } catch {
        moreItems = 0;
      }

      setAdditionalItemsCount(moreItems);
      setSubmittedBooking(booking);
      setStep("success");
      showStatusToast("Try at home request received");
    } catch {
      showStatusToast("Could not submit request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewBooking = () => {
    handleClose();
    router.push(buildProfileSectionHref("appointments"));
  };

  const handleContinueShopping = () => {
    handleClose();
    router.push("/jewellery");
  };

  if (!open) {
    return statusToast;
  }

  return (
    <>
      {statusToast}
      <ProductDetailSidePanelShell
        open={open}
        onClose={handleClose}
        overlayAriaLabel="Close try at home panel"
        dialogAriaLabel="Try At Home"
      >
        {step === "details" ? (
          <TryAtHomeDetailsStep
            productName={product.name}
            productImage={productImage}
            form={cmsForm}
            open={open}
            onClose={handleClose}
            savedDetails={details}
            onProceed={(nextDetails) => {
              setDetails(nextDetails);
              setStep("address");
            }}
          />
        ) : step === "address" ? (
          <TryAtHomeAddressStep
            form={cmsForm}
            formTitle={cmsForm?.formName ?? ""}
            submitLabel={cmsForm?.submitButtonText ?? ""}
            isSubmitting={isSubmitting}
            onBack={() => setStep("details")}
            onClose={handleClose}
            onSubmit={(address) => {
              void handleAddressSubmit(address);
            }}
          />
        ) : submittedBooking ? (
          <TryAtHomeSuccessStep
            product={product}
            productImage={productImage}
            booking={submittedBooking}
            minNoticeMinutes={TRY_AT_HOME_BOOKING_WINDOW.minNoticeMinutes}
            additionalItemsCount={additionalItemsCount}
            onClose={handleClose}
            onViewBooking={handleViewBooking}
            onContinueShopping={handleContinueShopping}
          />
        ) : null}
      </ProductDetailSidePanelShell>
    </>
  );
};

export default TryAtHomePanel;
