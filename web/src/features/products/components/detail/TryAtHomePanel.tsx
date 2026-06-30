"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { useAppointmentFormValidation } from "@/shared/hooks/use-appointment-form-validation";
import AppointmentContactFields from "@/shared/ui/AppointmentContactFields";
import FormFieldError from "@/shared/ui/FormFieldError";
import {
  appointmentFieldClassName,
  appointmentLabelClassName,
} from "@/shared/constants/appointmentForm";
import type { Product } from "@/features/products/data/products";
import { TRY_AT_HOME_INDIAN_STATES } from "@/features/products/data/tryAtHomeContent";
import { useCurrentLocationAddress } from "@/shared/hooks/use-current-location-address";
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
import { DetailDarkButton } from "./shared";
import { PanelFooter } from "@/shared/ui/PanelFooter";
import { ProductDetailSidePanelShell } from "./ProductDetailSidePanelShell";
import { ChevronDown } from "lucide-react";
import TryAtHomeSuccessStep from "./TryAtHomeSuccessStep";
import type { TryAtHomeBookingSummary } from "@/features/products/utils/tryAtHomeBooking";

type TryAtHomePanelProps = {
  open: boolean;
  onClose: () => void;
  product: Product;
};

type TryAtHomeStep = "details" | "address" | "success";

type TryAtHomeDetailsStepProps = {
  productName: string;
  productImage: string | StaticImageData;
  onClose: () => void;
  onProceed: (booking: TryAtHomeBookingSummary) => void;
};

const TryAtHomeDetailsStep = ({
  productName,
  productImage,
  onClose,
  onProceed,
}: TryAtHomeDetailsStepProps) => {
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const formValues = useMemo(
    () => ({ name, countryCode, phone, email, date, note }),
    [name, countryCode, phone, email, date, note],
  );

  const { errors, isValid, submitted, markTouched, showError, validateSubmit } =
    useAppointmentFormValidation(formValues);

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="flex flex-col gap-6 px-4 pt-6 lg:px-8 lg:pt-8">
          <div className="flex flex-col gap-7">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">Try At Home</h2>
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
              noteLabel="What are you looking for?"
              notePlaceholder="Eg: I am looking for an engagement ring"
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
            validateSubmit(() => onProceed({ date, selectedSlot }))
          }
          disabled={submitted && !isValid}
        >
          Add Address
        </DetailDarkButton>
      </PanelFooter>
    </>
  );
};

type TryAtHomeAddressStepProps = {
  onBack: () => void;
  onClose: () => void;
  onSubmit: () => void;
};

type AddressField = "addressLine1" | "addressLine2" | "pincode" | "city" | "state";

const TryAtHomeAddressStep = ({ onBack, onClose, onSubmit }: TryAtHomeAddressStepProps) => {
  const { detectAddress, isLocating } = useCurrentLocationAddress();
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<AddressField, boolean>>>({});

  const errors = useMemo(
    () => ({
      addressLine1: validateAddressLine1(addressLine1).error,
      addressLine2: validateOptionalAddressLine2(addressLine2).error,
      pincode: validateIndianPincode(pincode).error,
      city: validateCity(city).error,
      state: validateIndianState(state, TRY_AT_HOME_INDIAN_STATES).error,
    }),
    [addressLine1, addressLine2, pincode, city, state],
  );

  const isValid = Object.values(errors).every((error) => !error);

  const markTouched = (field: AddressField) => {
    setTouched((current) => ({ ...current, [field]: true }));
  };

  const showError = (field: AddressField) =>
    shouldShowFieldError(Boolean(touched[field]), submitted, errors[field]);

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
    setSubmitted(true);
    if (!isValid) {
      return;
    }
    onSubmit();
  };

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="flex flex-col gap-6 px-4 pt-6 lg:px-8 lg:pt-8">
          <div className="flex flex-col gap-7">
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
                <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">Try At Home</h2>
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
                Address Line 1
              </label>
              <input
                id="try-at-home-address-line-1"
                type="text"
                value={addressLine1}
                onChange={(event) => setAddressLine1(event.target.value)}
                onBlur={() => markTouched("addressLine1")}
                placeholder="Enter"
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
                Address Line 2 (Optional)
              </label>
              <input
                id="try-at-home-address-line-2"
                type="text"
                value={addressLine2}
                onChange={(event) => setAddressLine2(event.target.value)}
                onBlur={() => markTouched("addressLine2")}
                placeholder="Enter"
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
                  Pincode
                </label>
                <input
                  id="try-at-home-pincode"
                  type="text"
                  inputMode="numeric"
                  value={pincode}
                  onChange={(event) => setPincode(sanitizePincodeInput(event.target.value))}
                  onBlur={() => markTouched("pincode")}
                  placeholder="Enter"
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
                  City
                </label>
                <input
                  id="try-at-home-city"
                  type="text"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  onBlur={() => markTouched("city")}
                  placeholder="Enter"
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
                State
              </label>
              <div
                className={cn(
                  "flex h-14 w-full items-center bg-aboutInactive px-3",
                  showError("state") && "ring-1 ring-destructive",
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
                  <option value="">-select-</option>
                  {TRY_AT_HOME_INDIAN_STATES.map((entry) => (
                    <option key={entry} value={entry}>
                      {entry}
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
        <DetailDarkButton onClick={handleSubmit} disabled={submitted && !isValid}>
          Schedule Try At Home
        </DetailDarkButton>
      </PanelFooter>
    </>
  );
};

const TryAtHomePanel = ({ open, onClose, product }: TryAtHomePanelProps) => {
  const router = useRouter();
  const [step, setStep] = useState<TryAtHomeStep>("details");
  const [bookingSummary, setBookingSummary] = useState<TryAtHomeBookingSummary>({
    date: "",
    selectedSlot: null,
  });
  const productImage = product.images[0] ?? product.image;

  useEffect(() => {
    if (!open) {
      setStep("details");
      setBookingSummary({ date: "", selectedSlot: null });
    }
  }, [open]);

  const handleClose = () => {
    setStep("details");
    setBookingSummary({ date: "", selectedSlot: null });
    onClose();
  };

  const handleSubmit = () => {
    setStep("success");
  };

  const handleViewBooking = () => {
    handleClose();
  };

  const handleContinueShopping = () => {
    handleClose();
    router.push("/products");
  };

  return (
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
          onClose={handleClose}
          onProceed={(booking) => {
            setBookingSummary(booking);
            setStep("address");
          }}
        />
      ) : step === "address" ? (
        <TryAtHomeAddressStep
          onBack={() => setStep("details")}
          onClose={handleClose}
          onSubmit={handleSubmit}
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
  );
};

export default TryAtHomePanel;
