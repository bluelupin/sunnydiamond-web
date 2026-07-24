"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Check,
  ChevronLeft,
  ExternalLink,
  Phone,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { useAppointmentFormValidation } from "@/shared/hooks/use-appointment-form-validation";
import AppointmentContactFields from "@/shared/ui/AppointmentContactFields";
import {
  appointmentFieldClassName,
  appointmentLabelClassName,
  APPOINTMENT_TIME_SLOTS,
} from "@/shared/constants/appointmentForm";
import {
  BOOK_STORE_VISIT_STORES,
  type BookStoreVisitStore,
} from "@/features/products/data/bookStoreVisitContent";
import {
  createGenericSubmission,
  getGenericFormByTag,
} from "@/services/forms/generic-form.service";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useCustomerProfileContact } from "@/shared/hooks/use-customer-profile-contact";
import { wishlistMovedToastDurationMs } from "@/features/wishlist/data/content";
import { DetailDarkButton } from "./shared";
import StoreVisitMapBlock from "./StoreVisitMapBlock";
import { PanelFooter } from "@/shared/ui/PanelFooter";
import {
  productDetailSidePanelAsideClassName,
  productDetailSidePanelOverlayClassName,
} from "./ProductDetailSidePanelShell";

const SHOWROOM_VISIT_FORM_TAG = "showroom-visit";

type BookStoreVisitPanelProps = {
  variant?: "embedded" | "page" | "modal";
  open?: boolean;
  onClose?: () => void;
  onBack?: () => void;
};

type BookVisitStep = "select-store" | "form";

const BookStoreVisitPanel = ({
  variant = "modal",
  open = true,
  onClose,
  onBack,
}: BookStoreVisitPanelProps) => {
  const profileEnabled = variant !== "modal" || open;
  const { customer } = useAuth();
  const { contact: profileContact } = useCustomerProfileContact(profileEnabled);
  const [step, setStep] = useState<BookVisitStep>("select-store");
  const [stores, setStores] = useState<BookStoreVisitStore[]>(BOOK_STORE_VISIT_STORES);
  const [timeSlots, setTimeSlots] = useState<readonly string[]>(APPOINTMENT_TIME_SLOTS);
  const [purposeOptions, setPurposeOptions] = useState<readonly string[]>([]);
  const [formTitle, setFormTitle] = useState("Book Your Store Visit");
  const [nameLabel, setNameLabel] = useState("Your Name*");
  const [namePlaceholder, setNamePlaceholder] = useState<string | undefined>(undefined);
  const [phoneLabel, setPhoneLabel] = useState("Phone No.*");
  const [phonePlaceholder, setPhonePlaceholder] = useState<string | undefined>(undefined);
  const [emailLabel, setEmailLabel] = useState("Email");
  const [emailPlaceholder, setEmailPlaceholder] = useState("Enter");
  const [dateLabel, setDateLabel] = useState("Date");
  const [purposeLabel, setPurposeLabel] = useState("Purpose of Visit");
  const [purposePlaceholder, setPurposePlaceholder] = useState("-select-");
  const [notesLabel, setNotesLabel] = useState("Describe more about your visit");
  const [notesPlaceholder, setNotesPlaceholder] = useState("Enter");
  const [submitButtonText, setSubmitButtonText] = useState("BOOK A VISIT");
  const [formTag, setFormTag] = useState(SHOWROOM_VISIT_FORM_TAG);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState(BOOK_STORE_VISIT_STORES[0].id);
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [purpose, setPurpose] = useState("");
  const [note, setNote] = useState("");
  const [hasAppliedProfilePrefill, setHasAppliedProfilePrefill] = useState(false);
  const [statusToastMessage, setStatusToastMessage] = useState<string | null>(null);
  const statusToastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const selectedStore =
    stores.find((store) => store.id === selectedStoreId) ?? stores[0] ?? BOOK_STORE_VISIT_STORES[0];

  // Prefill from My Profile once when available; never overwrite fields the user already typed.
  useEffect(() => {
    if (!profileContact || hasAppliedProfilePrefill) return;

    const profileName = profileContact.fullName?.trim();
    const profileEmail = profileContact.email?.trim();
    const profilePhone = profileContact.phone?.trim();
    const profileCountryCode = profileContact.countryCode?.trim();

    if (profileName && !name.trim()) {
      setName(profileName);
    }
    if (profileEmail && !email.trim()) {
      setEmail(profileEmail);
    }
    if (profilePhone && !phone.trim()) {
      setPhone(profilePhone);
    }
    if (profileCountryCode) {
      setCountryCode(profileCountryCode);
    }

    setHasAppliedProfilePrefill(true);
  }, [profileContact, hasAppliedProfilePrefill, name, email, phone]);

  useEffect(() => {
    if (!open && variant === "modal") return;

    const controller = new AbortController();

    void (async () => {
      try {
        const form = await getGenericFormByTag(SHOWROOM_VISIT_FORM_TAG, controller.signal);
        if (!form) return;

        setFormTag(form.formTag || SHOWROOM_VISIT_FORM_TAG);
        if (form.formName) {
          setFormTitle(form.formName);
        }
        if (form.submitButtonText) {
          setSubmitButtonText(form.submitButtonText.toUpperCase());
        }
        if (form.timeSlots.length > 0) {
          setTimeSlots(form.timeSlots);
        }
        if (form.purposeOptions.length > 0) {
          setPurposeOptions(form.purposeOptions);
        }
        if (form.nameLabel) {
          setNameLabel(form.nameLabel);
        }
        if (form.namePlaceholder) {
          setNamePlaceholder(form.namePlaceholder);
        }
        if (form.phoneLabel) {
          setPhoneLabel(form.phoneLabel);
        }
        if (form.phonePlaceholder) {
          setPhonePlaceholder(form.phonePlaceholder);
        }
        if (form.emailLabel) {
          setEmailLabel(form.emailLabel);
        }
        if (form.emailPlaceholder) {
          setEmailPlaceholder(form.emailPlaceholder);
        }
        if (form.dateLabel) {
          setDateLabel(form.dateLabel);
        }
        if (form.purposeLabel) {
          setPurposeLabel(form.purposeLabel);
        }
        if (form.purposePlaceholder) {
          setPurposePlaceholder(form.purposePlaceholder);
        }
        if (form.notesLabel) {
          setNotesLabel(form.notesLabel);
        }
        if (form.notesPlaceholder) {
          setNotesPlaceholder(form.notesPlaceholder);
        }
        if (form.showrooms.length > 0) {
          setStores(form.showrooms);
          setSelectedStoreId((current) =>
            form.showrooms.some((store) => store.id === current)
              ? current
              : form.showrooms[0]!.id,
          );
        }
      } catch {
        // Keep local fallbacks so the panel remains usable if CMS fails.
      }
    })();

    return () => controller.abort();
  }, [open, variant]);

  useEffect(() => {
    if (variant !== "modal" || !open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, variant]);

  const resetBookingForm = () => {
    setStep("select-store");
    setName("");
    setCountryCode("+91");
    setPhone("");
    setEmail("");
    setDate("");
    setSelectedSlot(null);
    setPurpose("");
    setNote("");
    setIsSubmitting(false);
    setHasAppliedProfilePrefill(false);
    setSelectedStoreId((current) =>
      stores.some((store) => store.id === current) ? current : (stores[0]?.id ?? BOOK_STORE_VISIT_STORES[0].id),
    );
  };

  // Clear entered values when the panel closes so the next open starts blank.
  useEffect(() => {
    if (!open) {
      resetBookingForm();
    }
    // Intentionally only react to `open` — reset should not re-run when stores list updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset on close only
  }, [open]);

  const handleClose = () => {
    resetBookingForm();
    onClose?.();
  };

  const handleStoreSelectionBack = () => {
    if (variant === "embedded" || variant === "page") {
      onBack?.();
    }
  };

  const showStoreSelectionBack = variant === "embedded" || variant === "page";

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const composedNotes = [purpose ? `Purpose: ${purpose}` : "", note.trim()]
        .filter(Boolean)
        .join("\n");

      // preferredShowroom is a Strapi relation — send documentId, not the display name
      const preferredShowroom =
        selectedStore.documentId ?? selectedStore.id;

      await createGenericSubmission({
        formTag,
        fullName: name.trim(),
        email: email.trim() || undefined,
        phone: `${countryCode} ${phone}`.trim(),
        preferredShowroom,
        preferredDate: date || undefined,
        selectedTimeSlot: selectedSlot ?? undefined,
        notes: composedNotes || undefined,
        ...(customer?.id != null ? { magentoCustomerId: customer.id } : {}),
        sourcePage:
          typeof window !== "undefined" ? window.location.pathname : "/store-locator",
        consentAccepted: true,
        workflowStatus: "New",
      });

      showStatusToast("Visit booked");
      handleClose();
    } catch {
      showStatusToast("Could not book visit");
    } finally {
      setIsSubmitting(false);
    }
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

  if (!open && variant !== "page") {
    return statusToast;
  }

  const panelBody =
    step === "select-store" ? (
      <StoreSelectionStep
        stores={stores}
        selectedStoreId={selectedStoreId}
        selectedStore={selectedStore}
        formTitle={formTitle}
        onSelectStore={setSelectedStoreId}
        onProceed={() => setStep("form")}
        onBack={showStoreSelectionBack ? handleStoreSelectionBack : undefined}
        onClose={variant !== "page" ? handleClose : undefined}
        showBack={showStoreSelectionBack}
      />
    ) : (
      <BookingFormStep
        selectedStore={selectedStore}
        name={name}
        countryCode={countryCode}
        phone={phone}
        email={email}
        date={date}
        selectedSlot={selectedSlot}
        purpose={purpose}
        note={note}
        timeSlots={timeSlots}
        purposeOptions={purposeOptions}
        formTitle={formTitle}
        nameLabel={nameLabel}
        namePlaceholder={namePlaceholder}
        phoneLabel={phoneLabel}
        phonePlaceholder={phonePlaceholder}
        emailLabel={emailLabel}
        emailPlaceholder={emailPlaceholder}
        dateLabel={dateLabel}
        purposeLabel={purposeLabel}
        purposePlaceholder={purposePlaceholder}
        notesLabel={notesLabel}
        notesPlaceholder={notesPlaceholder}
        submitButtonText={submitButtonText}
        isSubmitting={isSubmitting}
        onBack={() => setStep("select-store")}
        onClose={variant !== "page" ? handleClose : undefined}
        onNameChange={setName}
        onCountryCodeChange={setCountryCode}
        onPhoneChange={setPhone}
        onEmailChange={setEmail}
        onDateChange={setDate}
        onSelectedSlotChange={setSelectedSlot}
        onPurposeChange={setPurpose}
        onNoteChange={setNote}
        onSubmit={handleSubmit}
      />
    );

  if (variant === "embedded") {
    return (
      <>
        {statusToast}
        <div
          className="absolute inset-0 flex flex-col bg-white"
          role="dialog"
          aria-modal="true"
          aria-label="Book your store visit"
        >
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{panelBody}</div>
        </div>
      </>
    );
  }

  const panelContent = (
    <aside
      role="dialog"
      aria-modal={variant !== "page"}
      aria-label="Book your store visit"
      className={cn(
        "flex flex-col overflow-hidden bg-white",
        variant === "page" && "mx-auto min-h-[calc(100vh-4rem)] w-full max-w-480",
        variant === "modal" && cn("shadow-2xl", productDetailSidePanelAsideClassName),
      )}
    >
      {panelBody}
    </aside>
  );

  if (variant === "page") {
    return (
      <>
        {statusToast}
        {panelContent}
      </>
    );
  }

  return (
    <>
      {statusToast}
      <div className="fixed inset-0 z-[70] flex max-md:flex-col md:justify-end">
        <button
          type="button"
          aria-label="Close book a visit"
          className={productDetailSidePanelOverlayClassName}
          onClick={handleClose}
        />
        {panelContent}
      </div>
    </>
  );
};

type StoreSelectionStepProps = {
  stores: BookStoreVisitStore[];
  selectedStoreId: string;
  selectedStore: BookStoreVisitStore;
  formTitle: string;
  onSelectStore: (storeId: string) => void;
  onProceed: () => void;
  onBack?: () => void;
  onClose?: () => void;
  showBack?: boolean;
};

const StoreSelectionStep = ({
  stores,
  selectedStoreId,
  selectedStore,
  formTitle,
  onSelectStore,
  onProceed,
  onBack,
  onClose,
  showBack = false,
}: StoreSelectionStepProps) => (
  <>
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="px-4 pt-6 lg:px-6 lg:pt-10">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-2">
              {showBack ? (
                <button
                  type="button"
                  onClick={onBack}
                  aria-label="Go back"
                  className="inline-flex size-6 shrink-0 items-center justify-center"
                >
                  <ChevronLeft size={24} strokeWidth={1.25} aria-hidden className="text-darkblack" />
                </button>
              ) : null}
              <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">
                {formTitle}
              </h2>
            </div>
            {onClose ? (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
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
            ) : null}
          </div>
          <div className="h-px w-full bg-neutral300" aria-hidden />
        </div>

        <div className="mt-6 flex flex-col gap-4 pb-72">
          <div className="-mx-4 flex gap-10 overflow-x-auto px-4 lg:-mx-8 lg:px-8">
            {stores.map((store) => {
              const isSelected = store.id === selectedStoreId;

              return (
                <button
                  key={store.id}
                  type="button"
                  onClick={() => onSelectStore(store.id)}
                  className={cn(
                    "shrink-0 py-2 font-gill text-base leading-110",
                    isSelected
                      ? "border-b border-linkGold text-linkGold"
                      : "text-darkblack hover:text-linkGold",
                  )}
                >
                  {store.tabLabel}
                </button>
              );
            })}
          </div>

          <StoreVisitMapBlock variant="store-select">
            <p className="font-larken text-xl font-light leading-110 text-darkblack">
              {selectedStore.storeName}
            </p>
            <div className="h-px w-full bg-neutral300" aria-hidden />
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex gap-3">
                  <ExternalLink
                    size={24}
                    strokeWidth={1.25}
                    aria-hidden
                    className="mt-0.5 shrink-0 text-darkblack"
                  />
                  <p className="font-gill text-base font-light leading-110 text-darkblack">
                    {selectedStore.address}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={24} strokeWidth={1.25} aria-hidden className="shrink-0 text-darkblack" />
                  <p className="font-gill text-base font-light leading-110 text-darkblack">
                    {selectedStore.phone}
                  </p>
                </div>
              </div>
              <a
                href={selectedStore.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link-underline inline-flex border-b-[1.5px] border-darkblack pb-1 font-gill text-sm leading-110 text-darkblack"
              >
                GET DIRECTIONS
              </a>
            </div>
          </StoreVisitMapBlock>
        </div>
      </div>
    </div>

    <PanelFooter>
      <DetailDarkButton onClick={onProceed}>PROCEED WITH THIS STORE</DetailDarkButton>
    </PanelFooter>
  </>
);

type BookingFormStepProps = {
  selectedStore: BookStoreVisitStore;
  name: string;
  countryCode: string;
  phone: string;
  email: string;
  date: string;
  selectedSlot: string | null;
  purpose: string;
  note: string;
  timeSlots: readonly string[];
  purposeOptions: readonly string[];
  formTitle: string;
  nameLabel: string;
  namePlaceholder?: string;
  phoneLabel: string;
  phonePlaceholder?: string;
  emailLabel: string;
  emailPlaceholder: string;
  dateLabel: string;
  purposeLabel: string;
  purposePlaceholder: string;
  notesLabel: string;
  notesPlaceholder: string;
  submitButtonText: string;
  isSubmitting: boolean;
  onBack: () => void;
  onClose?: () => void;
  onNameChange: (value: string) => void;
  onCountryCodeChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onSelectedSlotChange: (value: string | null) => void;
  onPurposeChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onSubmit: () => void | Promise<void>;
};

const BookingFormStep = ({
  selectedStore,
  name,
  countryCode,
  phone,
  email,
  date,
  selectedSlot,
  purpose,
  note,
  timeSlots,
  purposeOptions,
  formTitle,
  nameLabel,
  namePlaceholder,
  phoneLabel,
  phonePlaceholder,
  emailLabel,
  emailPlaceholder,
  dateLabel,
  purposeLabel,
  purposePlaceholder,
  notesLabel,
  notesPlaceholder,
  submitButtonText,
  isSubmitting,
  onBack,
  onClose,
  onNameChange,
  onCountryCodeChange,
  onPhoneChange,
  onEmailChange,
  onDateChange,
  onSelectedSlotChange,
  onPurposeChange,
  onNoteChange,
  onSubmit,
}: BookingFormStepProps) => {
  const formValues = useMemo(
    () => ({ name, countryCode, phone, email, date, note, purpose }),
    [name, countryCode, phone, email, date, note, purpose],
  );

  const { isValid, errors, markTouched, showError, validateSubmit } =
    useAppointmentFormValidation(formValues, {
      validatePurpose: purposeOptions.length > 0,
    });

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="px-4 pt-6 lg:px-6 lg:pt-10">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-2">
                <button
                  type="button"
                  onClick={onBack}
                  aria-label="Back to store selection"
                  className="inline-flex size-6 shrink-0 items-center justify-center"
                >
                  <ChevronLeft size={24} strokeWidth={1.25} aria-hidden className="text-darkblack" />
                </button>
                <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">
                  {formTitle}
                </h2>
              </div>
              {onClose ? (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
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
              ) : null}
            </div>
            <div className="h-px w-full bg-neutral300" aria-hidden />
          </div>

          <div className="mt-6 flex flex-col gap-6 pb-72">
            <StoreVisitMapBlock variant="store-select">
              <p className="font-larken text-xl font-light leading-110 text-darkblack">
                {selectedStore.storeName}
              </p>
              <div className="h-px w-full bg-neutral300" aria-hidden />
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <div className="flex gap-3">
                    <ExternalLink
                      size={24}
                      strokeWidth={1.25}
                      aria-hidden
                      className="mt-0.5 shrink-0 text-darkblack"
                    />
                    <p className="font-gill text-base font-light leading-110 text-darkblack">
                      {selectedStore.address}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={24} strokeWidth={1.25} aria-hidden className="shrink-0 text-darkblack" />
                    <p className="font-gill text-base font-light leading-110 text-darkblack">
                      {selectedStore.phone}
                    </p>
                  </div>
                </div>
                <a
                  href={selectedStore.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link-underline inline-flex border-b-[1.5px] border-darkblack pb-1 font-gill text-sm leading-110 text-darkblack"
                >
                  GET DIRECTIONS
                </a>
              </div>
            </StoreVisitMapBlock>

            <div className="flex flex-col gap-6">
              <AppointmentContactFields
                idPrefix="book-visit"
                name={name}
                countryCode={countryCode}
                phone={phone}
                email={email}
                date={date}
                note={note}
                purpose={purpose}
                selectedSlot={selectedSlot}
                timeSlots={timeSlots}
                onNameChange={onNameChange}
                onCountryCodeChange={onCountryCodeChange}
                onPhoneChange={onPhoneChange}
                onEmailChange={onEmailChange}
                onDateChange={onDateChange}
                onNoteChange={onNoteChange}
                onSelectedSlotChange={onSelectedSlotChange}
                onPurposeChange={onPurposeChange}
                errors={errors}
                showError={showError}
                markTouched={markTouched}
                labelClassName={appointmentLabelClassName}
                fieldClassName={appointmentFieldClassName}
                selectedSlotStyle="gold"
                showPurpose={purposeOptions.length > 0}
                purposeOptions={purposeOptions}
                nameLabel={nameLabel}
                namePlaceholder={namePlaceholder}
                phoneLabel={phoneLabel}
                phonePlaceholder={phonePlaceholder}
                emailLabel={emailLabel}
                emailPlaceholder={emailPlaceholder}
                dateLabel={dateLabel}
                purposeLabel={purposeLabel}
                purposePlaceholder={purposePlaceholder}
                noteLabel={notesLabel}
                notePlaceholder={notesPlaceholder}
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
          onClick={() => validateSubmit(() => void onSubmit())}
          disabled={isSubmitting || !isValid}
          className="disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "BOOKING..." : submitButtonText}
        </DetailDarkButton>
      </PanelFooter>
    </>
  );
};

export default BookStoreVisitPanel;
