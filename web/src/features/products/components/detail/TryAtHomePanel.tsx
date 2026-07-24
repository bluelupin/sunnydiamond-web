"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { Check, ChevronLeft } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { useAppointmentFormValidation } from "@/shared/hooks/use-appointment-form-validation";
import { useCustomerProfileContact } from "@/shared/hooks/use-customer-profile-contact";
import AppointmentContactFields from "@/shared/ui/AppointmentContactFields";
import FormFieldError from "@/shared/ui/FormFieldError";
import {
  appointmentFieldClassName,
  appointmentLabelClassName,
} from "@/shared/constants/appointmentForm";
import type { Product } from "@/features/products/data/products";
import { getProductHref } from "@/features/products/utils/productRoutes";
import { TRY_AT_HOME_INDIAN_STATES } from "@/features/products/data/tryAtHomeContent";
import { useCurrentLocationAddress } from "@/shared/hooks/use-current-location-address";
import {
  createProductSubmission,
  getProductFormByTag,
  type NormalizedProductForm,
} from "@/services/forms/product-form.service";
import { useAuth } from "@/features/auth/context/AuthContext";
import { wishlistMovedToastDurationMs } from "@/features/wishlist/data/content";
import {
  invalidFieldClassName,
  invalidFieldContainerClassName,
  sanitizePincodeInput,
  validateAddressLine1,
  validateCity,
  validateIndianPincode,
  validateIndianState,
  validateOptionalAddressLine2,
  shouldShowFieldError,
} from "@/shared/utils/formValidation";
import { DetailDarkButton } from "./shared";
import { PanelFooter } from "@/shared/ui/PanelFooter";
import { ProductDetailSidePanelShell } from "./ProductDetailSidePanelShell";
import TryAtHomeSuccessStep from "./TryAtHomeSuccessStep";
import type { TryAtHomeBookingSummary } from "@/features/products/utils/tryAtHomeBooking";

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
};

const TryAtHomeDetailsStep = ({
  productName,
  productImage,
  form,
  open,
  onClose,
  onProceed,
}: TryAtHomeDetailsStepProps) => {
  const { contact: profileContact } = useCustomerProfileContact(open);
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [hasAppliedProfilePrefill, setHasAppliedProfilePrefill] = useState(false);

  const formValues = useMemo(
    () => ({ name, countryCode, phone, email, date, note }),
    [name, countryCode, phone, email, date, note],
  );

  const { errors, isValid, markTouched, showError, validateSubmit, resetValidation } =
    useAppointmentFormValidation(formValues, {
      noteRequired: form?.notesRequired ?? false,
    });

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

  const timeSlots = form?.timeSlots?.length ? form.timeSlots : undefined;

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="flex flex-col gap-6 px-4 pt-6 lg:px-6 lg:pt-10">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">
                {form?.formName ?? "Try At Home"}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close try at home panel"
                className="inline-flex size-6 shrink-0 items-center justify-center"
              >
                <Image
                  src="/images/navigation/menu-close.svg"
                  alt=""
                  width={24}
                  height={24}
                  aria-hidden
                />
              </button>
            </div>
            <div className="h-px w-full bg-neutral300" aria-hidden />
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
            <p className="font-gill text-base leading-110 text-darkblack">{productName}</p>
          </div>

          <div className="flex flex-col gap-6 pb-72">
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
              nameLabel={form?.nameLabel}
              namePlaceholder={form?.namePlaceholder}
              phoneLabel={form?.phoneLabel}
              phonePlaceholder={form?.phonePlaceholder}
              emailLabel={form?.emailLabel}
              emailPlaceholder={form?.emailPlaceholder}
              dateLabel={form?.dateLabel}
              noteLabel={form?.notesLabel ?? "What are you looking for?"}
              notePlaceholder={
                form?.notesPlaceholder ?? "Eg: I am looking for an engagement ring"
              }
            />
          </div>
        </div>
      </div>

      <PanelFooter contentClassName="flex flex-col items-center gap-4">
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
        >
          {form?.stepOneButtonText ?? "Add Address"}
        </DetailDarkButton>
      </PanelFooter>
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

const TryAtHomeAddressStep = ({
  form,
  formTitle,
  submitLabel,
  isSubmitting,
  onBack,
  onClose,
  onSubmit,
}: TryAtHomeAddressStepProps) => {
  const { detectAddress, isLocating } = useCurrentLocationAddress();
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [touched, setTouched] = useState<Partial<Record<AddressField, boolean>>>({});

  const stateOptions =
    form?.stateOptions?.length ? form.stateOptions : [...TRY_AT_HOME_INDIAN_STATES];

  const errors = useMemo(
    () => ({
      addressLine1: validateAddressLine1(addressLine1).error,
      addressLine2: validateOptionalAddressLine2(addressLine2).error,
      pincode: validateIndianPincode(pincode).error,
      city: validateCity(city).error,
      state: validateIndianState(state, stateOptions).error,
    }),
    [addressLine1, addressLine2, pincode, city, state, stateOptions],
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
    onSubmit({ addressLine1, addressLine2, pincode, city, state });
  };

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="flex flex-col gap-6 px-4 pt-6 lg:px-6 lg:pt-10">
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
              <button
                type="button"
                onClick={onClose}
                aria-label="Close try at home panel"
                className="inline-flex size-6 shrink-0 items-center justify-center"
              >
                <Image
                  src="/images/navigation/menu-close.svg"
                  alt=""
                  width={24}
                  height={24}
                  aria-hidden
                />
              </button>
            </div>
            <div className="h-px w-full bg-neutral300" aria-hidden />
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="text-link-underline inline-flex border-b-[1.5px] border-darkblack pb-1 font-gill text-sm leading-110 text-darkblack disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLocating ? "DETECTING LOCATION..." : "USE CURRENT LOCATION"}
            </button>
          </div>

          <div className="flex flex-col gap-6 pb-72">
            <div className="flex flex-col gap-2">
              <label htmlFor="try-at-home-address-line-1" className={appointmentLabelClassName}>
                {form?.addressLine1Label ?? "Address Line 1"}
              </label>
              <input
                id="try-at-home-address-line-1"
                type="text"
                value={addressLine1}
                onChange={(event) => setAddressLine1(event.target.value)}
                onBlur={() => markTouched("addressLine1")}
                placeholder={form?.addressLine1Placeholder ?? "Enter"}
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
                {form?.addressLine2Label ?? "Address Line 2 (Optional)"}
              </label>
              <input
                id="try-at-home-address-line-2"
                type="text"
                value={addressLine2}
                onChange={(event) => setAddressLine2(event.target.value)}
                onBlur={() => markTouched("addressLine2")}
                placeholder={form?.addressLine2Placeholder ?? "Enter"}
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
                  {form?.pincodeLabel ?? "Pincode"}
                </label>
                <input
                  id="try-at-home-pincode"
                  type="text"
                  inputMode="numeric"
                  value={pincode}
                  onChange={(event) => setPincode(sanitizePincodeInput(event.target.value))}
                  onBlur={() => markTouched("pincode")}
                  placeholder={form?.pincodePlaceholder ?? "Enter"}
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
                  {form?.cityLabel ?? "City"}
                </label>
                <input
                  id="try-at-home-city"
                  type="text"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  onBlur={() => markTouched("city")}
                  placeholder={form?.cityPlaceholder ?? "Enter"}
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

            <div className="flex flex-col gap-2">
              <label htmlFor="try-at-home-state" className={appointmentLabelClassName}>
                {form?.stateLabel ?? "State"}
              </label>
              <div
                className={cn(
                  "flex h-14 w-full items-center border border-transparent bg-aboutInactive px-3",
                  showError("state") && invalidFieldContainerClassName,
                )}
              >
                <select
                  id="try-at-home-state"
                  value={state}
                  onChange={(event) => setState(event.target.value)}
                  onBlur={() => markTouched("state")}
                  aria-invalid={showError("state") || undefined}
                  aria-describedby={showError("state") ? "try-at-home-state-error" : undefined}
                  className={cn(
                    "min-w-0 flex-1 appearance-none bg-transparent font-gill text-base leading-110 outline-none",
                    state ? "text-darkblack" : "text-neutral400",
                  )}
                >
                  <option value="">{form?.statePlaceholder ?? "-select-"}</option>
                  {stateOptions.map((entry) => (
                    <option key={entry} value={entry}>
                      {entry}
                    </option>
                  ))}
                </select>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                  className="pointer-events-none shrink-0 text-darkblack"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.13134 9.19969C4.17617 9.15167 4.23002 9.11295 4.28982 9.08575C4.34963 9.05855 4.4142 9.04341 4.47986 9.04118C4.54552 9.03895 4.61097 9.04968 4.67248 9.07276C4.73399 9.09584 4.79035 9.13082 4.83833 9.17569L11.9983 15.8557L19.1583 9.17569C19.2553 9.08512 19.3842 9.03677 19.5168 9.04127C19.6494 9.04577 19.7748 9.10275 19.8653 9.19969C19.9559 9.29663 20.0043 9.42557 19.9998 9.55816C19.9953 9.69075 19.9383 9.81612 19.8413 9.90669L12.3413 16.9067C12.2488 16.993 12.1269 17.041 12.0003 17.041C11.8738 17.041 11.7519 16.993 11.6593 16.9067L4.15933 9.90669C4.11124 9.86193 4.07245 9.80812 4.04516 9.74836C4.01787 9.68859 4.00263 9.62403 4.00031 9.55837C3.99799 9.49271 4.00863 9.42724 4.03163 9.36569C4.05462 9.30415 4.08953 9.24774 4.13433 9.19969H4.13134Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <FormFieldError
                id="try-at-home-state-error"
                message={showError("state") ? errors.state : undefined}
              />
            </div>
          </div>
        </div>
      </div>

      <PanelFooter contentClassName="flex flex-col items-center gap-4">
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
    </>
  );
};

const TryAtHomePanel = ({ open, onClose, product }: TryAtHomePanelProps) => {
  const router = useRouter();
  const { customer } = useAuth();
  const [step, setStep] = useState<TryAtHomeStep>("details");
  const [cmsForm, setCmsForm] = useState<NormalizedProductForm | null>(null);
  const [details, setDetails] = useState<TryAtHomeDetailsData | null>(null);
  const [bookingSummary, setBookingSummary] = useState<TryAtHomeBookingSummary>({
    date: "",
    selectedSlot: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusToastMessage, setStatusToastMessage] = useState<string | null>(null);
  const statusToastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const productImage = product.images[0] ?? product.image;

  const dismissStatusToast = () => {
    if (statusToastTimeoutRef.current) {
      clearTimeout(statusToastTimeoutRef.current);
      statusToastTimeoutRef.current = null;
    }
    setStatusToastMessage(null);
  };

  const showStatusToast = (message: string) => {
    dismissStatusToast();
    setStatusToastMessage(message);
    statusToastTimeoutRef.current = setTimeout(() => {
      setStatusToastMessage(null);
      statusToastTimeoutRef.current = null;
    }, wishlistMovedToastDurationMs);
  };

  useEffect(() => {
    return () => {
      if (statusToastTimeoutRef.current) {
        clearTimeout(statusToastTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!open) {
      setStep("details");
      setDetails(null);
      setBookingSummary({ date: "", selectedSlot: null });
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
    setBookingSummary({ date: "", selectedSlot: null });
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
      const requestDetails = [
        details.note.trim(),
        address.state.trim() ? `State: ${address.state.trim()}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      await createProductSubmission({
        formTag: cmsForm?.formTag ?? TRY_AT_HOME_FORM_TAG,
        productName: product.name,
        productId: product.id,
        customerName: details.name.trim(),
        customerPhone: `${details.countryCode} ${details.phone}`.trim(),
        customerEmail: details.email.trim() || undefined,
        ...(customer?.id != null ? { magentoCustomerId: customer.id } : {}),
        requestDetails: requestDetails || undefined,
        requestedDate: details.date || undefined,
        selectedTimeSlot: details.selectedSlot ?? undefined,
        addressLine1: address.addressLine1.trim(),
        addressLine2: address.addressLine2.trim() || undefined,
        pincode: address.pincode.trim(),
        city: address.city.trim(),
        sourcePage:
          typeof window !== "undefined" ? window.location.pathname : getProductHref(product),
        consentAccepted: true,
        workflowStatus: "New",
      });

      setBookingSummary({
        date: details.date,
        selectedSlot: details.selectedSlot,
      });
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
  };

  const handleContinueShopping = () => {
    handleClose();
    router.push("/jewellery");
  };

  const statusToast = statusToastMessage ? (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-auto fixed left-1/2 top-16 z-[80] w-[calc(100%-2rem)] max-w-[300px] -translate-x-1/2 animate-in fade-in slide-in-from-top-2 duration-300 md:top-104"
    >
      <div className="flex w-full items-center gap-2 bg-darkblack px-4 py-3">
        <Check size={18} strokeWidth={1.25} aria-hidden className="shrink-0 text-white" />
        <p className="font-gill text-sm font-light leading-110 text-white">{statusToastMessage}</p>
      </div>
    </div>
  ) : null;

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
            onProceed={(nextDetails) => {
              setDetails(nextDetails);
              setBookingSummary({
                date: nextDetails.date,
                selectedSlot: nextDetails.selectedSlot,
              });
              setStep("address");
            }}
          />
        ) : step === "address" ? (
          <TryAtHomeAddressStep
            form={cmsForm}
            formTitle={cmsForm?.formName ?? "Try At Home"}
            submitLabel={cmsForm?.submitButtonText ?? "Schedule Try At Home"}
            isSubmitting={isSubmitting}
            onBack={() => setStep("details")}
            onClose={handleClose}
            onSubmit={(address) => {
              void handleAddressSubmit(address);
            }}
          />
        ) : (
          <TryAtHomeSuccessStep
            product={product}
            productImage={productImage}
            booking={bookingSummary}
            onClose={handleClose}
            onViewBooking={handleViewBooking}
            onContinueShopping={handleContinueShopping}
          />
        )}
      </ProductDetailSidePanelShell>
    </>
  );
};

export default TryAtHomePanel;
