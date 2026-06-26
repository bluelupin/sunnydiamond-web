"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ExternalLink,
  Phone,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { useToast } from "@/shared/hooks/use-toast";
import { useAppointmentFormValidation } from "@/shared/hooks/use-appointment-form-validation";
import AppointmentContactFields from "@/shared/ui/AppointmentContactFields";
import {
  appointmentFieldClassName,
  appointmentLabelClassName,
} from "@/shared/constants/appointmentForm";
import {
  BOOK_STORE_VISIT_PURPOSES,
  BOOK_STORE_VISIT_STORES,
  type BookStoreVisitStore,
} from "@/features/products/data/bookStoreVisitContent";
import { DELIVERY_STORE_MAP_IMAGES } from "@/features/products/data/deliveryStoreContent";
import { DetailDarkButton } from "./shared";

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
  const { toast } = useToast();
  const [step, setStep] = useState<BookVisitStep>("select-store");
  const [selectedStoreId, setSelectedStoreId] = useState(BOOK_STORE_VISIT_STORES[0].id);
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [purpose, setPurpose] = useState("");
  const [note, setNote] = useState("");

  const selectedStore =
    BOOK_STORE_VISIT_STORES.find((store) => store.id === selectedStoreId) ?? BOOK_STORE_VISIT_STORES[0];

  useEffect(() => {
    if (variant !== "modal" || !open) {
      if (!open) {
        setStep("select-store");
      }
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

  useEffect(() => {
    if (!open) {
      setStep("select-store");
    }
  }, [open]);

  const handleClose = () => {
    setStep("select-store");
    onClose?.();
  };

  const handleStoreSelectionBack = () => {
    if (variant === "embedded" || variant === "page") {
      onBack?.();
      return;
    }
  };

  const showStoreSelectionBack = variant === "embedded" || variant === "page";
  const showCloseButton = variant === "embedded";

  const handleSubmit = () => {
    toast({
      title: "Visit booked",
      description: "Our representative will get in touch with you soon.",
    });
    handleClose();
  };

  if (!open && variant !== "page") {
    return null;
  }

  const panelContent = (
    <aside
      role="dialog"
      aria-modal={variant !== "page"}
      aria-label="Book your store visit"
      className={cn(
        "flex flex-col overflow-hidden bg-white",
        variant === "embedded" && "absolute inset-0",
        variant === "page" && "mx-auto min-h-[calc(100vh-64px)] w-full max-w-[480px]",
        variant === "modal" &&
          "absolute shadow-2xl inset-x-0 bottom-0 top-12 max-lg:animate-in max-lg:slide-in-from-bottom max-lg:duration-300 lg:inset-x-auto lg:inset-y-0 lg:right-0 lg:top-0 lg:w-full lg:max-w-[480px] lg:animate-in lg:slide-in-from-right lg:duration-300",
      )}
    >
      {step === "select-store" ? (
        <StoreSelectionStep
          selectedStoreId={selectedStoreId}
          selectedStore={selectedStore}
          onSelectStore={setSelectedStoreId}
          onProceed={() => setStep("form")}
          onBack={showStoreSelectionBack ? handleStoreSelectionBack : undefined}
          onClose={showCloseButton ? handleClose : undefined}
          showBack={showStoreSelectionBack}
          showClose={showCloseButton}
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
          onBack={() => setStep("select-store")}
          onClose={showCloseButton ? handleClose : undefined}
          showClose={showCloseButton}
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
      )}
    </aside>
  );

  if (variant === "embedded" || variant === "page") {
    return panelContent;
  }

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Close book a visit"
        className="absolute inset-0 bg-[rgba(30,30,30,0.3)] backdrop-blur-[10px] animate-in fade-in duration-300"
        onClick={handleClose}
      />
      {panelContent}
    </div>
  );
};

type StoreSelectionStepProps = {
  selectedStoreId: string;
  selectedStore: BookStoreVisitStore;
  onSelectStore: (storeId: string) => void;
  onProceed: () => void;
  onBack?: () => void;
  onClose?: () => void;
  showBack?: boolean;
  showClose?: boolean;
};

const StoreSelectionStep = ({
  selectedStoreId,
  selectedStore,
  onSelectStore,
  onProceed,
  onBack,
  onClose,
  showBack = false,
  showClose = false,
}: StoreSelectionStepProps) => (
  <>
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="px-4 pt-6 lg:px-8">
        <div className="flex flex-col gap-7">
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
              <h2 className="font-larken text-24 font-light leading-110 text-darkblack">
                Book Your Store Visit
              </h2>
            </div>
            {showClose ? (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="inline-flex size-6 shrink-0 items-center justify-center"
              >
                <X size={24} strokeWidth={1.25} aria-hidden className="text-darkblack" />
              </button>
            ) : (
              <SlidersHorizontal size={32} strokeWidth={1.25} aria-hidden className="shrink-0 text-darkblack" />
            )}
          </div>
          <div className="h-px w-full bg-neutral300" aria-hidden />
        </div>

        <div className="mt-[22px] flex flex-col gap-4 pb-6">
          <div className="-mx-4 flex gap-10 overflow-x-auto px-4 lg:-mx-8 lg:px-8">
            {BOOK_STORE_VISIT_STORES.map((store) => {
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

          <div className="relative h-[400px] w-full shrink-0 overflow-hidden">
            <div className="absolute left-[calc(50%+55.5px)] top-[calc(50%+13.76px)] h-[518px] w-[720px] -translate-x-1/2 -translate-y-1/2">
              <div className="relative size-full">
                <Image
                  src={DELIVERY_STORE_MAP_IMAGES.base}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="720px"
                />
                <Image
                  src={DELIVERY_STORE_MAP_IMAGES.overlay1}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="720px"
                />
                <Image
                  src={DELIVERY_STORE_MAP_IMAGES.overlay2}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="720px"
                />
              </div>
            </div>

            <div className="absolute left-1/2 top-[163px] flex w-[311px] -translate-x-1/2 flex-col gap-4 bg-gray300 px-4 py-6">
              <p className="font-larken text-20 font-light leading-110 text-darkblack">
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
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="shrink-0">
      <div className="pointer-events-none h-[71px] bg-gradient-to-b from-transparent to-white" aria-hidden />
      <div className="border-t border-neutral300/50 bg-white px-4 py-6 lg:px-8">
        <DetailDarkButton onClick={onProceed}>PROCEED WITH THIS STORE</DetailDarkButton>
      </div>
    </div>
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
  onBack: () => void;
  onClose?: () => void;
  showClose?: boolean;
  onNameChange: (value: string) => void;
  onCountryCodeChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onSelectedSlotChange: (value: string | null) => void;
  onPurposeChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onSubmit: () => void;
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
  onBack,
  onClose,
  showClose = false,
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

  const { isValid, submitted, errors, markTouched, showError, validateSubmit } =
    useAppointmentFormValidation(formValues, { validatePurpose: true });

  return (
  <>
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="px-4 pt-6 lg:px-8">
        <div className="flex flex-col gap-7">
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
              <h2 className="font-larken text-24 font-light leading-110 text-darkblack">
                Book Your Store Visit
              </h2>
            </div>
            {showClose ? (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="inline-flex size-6 shrink-0 items-center justify-center"
              >
                <X size={24} strokeWidth={1.25} aria-hidden className="text-darkblack" />
              </button>
            ) : (
              <SlidersHorizontal size={32} strokeWidth={1.25} aria-hidden className="shrink-0 text-darkblack" />
            )}
          </div>
          <div className="h-px w-full bg-neutral300" aria-hidden />
        </div>

        <div className="mt-[22px] flex flex-col gap-6 pb-6">
          <div className="relative h-[400px] w-full shrink-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute left-[-53.51%] top-[-13.32%] h-[118.92%] w-[209.18%]">
                <Image
                  src={selectedStore.heroImage}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 480px) 100vw, 480px"
                  aria-hidden
                />
              </div>
            </div>

            <div className="absolute left-1/2 top-[246px] flex w-[311px] -translate-x-1/2 flex-col gap-4 bg-gray300 px-4 py-6">
              <p className="font-larken text-20 font-light leading-110 text-darkblack">
                {selectedStore.storeName}
              </p>
              <div className="h-px w-full bg-neutral300" aria-hidden />
              <div className="flex gap-3">
                <ExternalLink
                  size={24}
                  strokeWidth={1.25}
                  aria-hidden
                  className="mt-0.5 shrink-0 text-darkblack"
                />
                <a
                  href={selectedStore.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-gill text-base font-light leading-110 text-darkblack"
                >
                  {selectedStore.address}
                </a>
              </div>
            </div>
          </div>

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
              showPurpose
              purposeOptions={BOOK_STORE_VISIT_PURPOSES}
            />
          </div>
        </div>
      </div>
    </div>

    <div className="shrink-0">
      <div className="pointer-events-none h-[71px] bg-gradient-to-b from-transparent to-white" aria-hidden />
      <div className="flex flex-col items-center gap-4 border-t border-neutral300/50 bg-white px-4 py-6 lg:px-8">
        <p className="text-center font-gill text-sm font-light leading-normal tracking-[0.252px] text-neutral500">
          Our representative will get in touch with you soon
        </p>
        <DetailDarkButton
          onClick={() => validateSubmit(onSubmit)}
          disabled={submitted && !isValid}
          className="disabled:cursor-not-allowed disabled:opacity-50"
        >
          BOOK A VISIT
        </DetailDarkButton>
      </div>
    </div>
  </>
  );
};

export default BookStoreVisitPanel;
