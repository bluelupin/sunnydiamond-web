"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";
import { useAppointmentFormValidation } from "@/shared/hooks/use-appointment-form-validation";
import { useCustomerProfileContact } from "@/shared/hooks/use-customer-profile-contact";
import { useAuth } from "@/features/auth/context/AuthContext";
import {
  getAppointmentContactLocks,
  signupMethodToContactLockKind,
} from "@/features/auth/utils/authLoginIdentifier";
import AppointmentContactFields from "@/shared/ui/AppointmentContactFields";
import {
  appointmentFieldClassName,
  appointmentLabelClassName,
} from "@/shared/constants/appointmentForm";
import {
  DELIVERY_STORE_ICONS,
  type DeliveryStoreLocation,
} from "@/features/products/data/deliveryStoreContent";
import { DetailDarkButton, DetailTextLink } from "./shared";
import { PanelFooter } from "@/shared/ui/PanelFooter";
import { RIGHT_PANEL_HEADER_PADDING_CLASS } from "@/shared/ui/rightPanel";
import { RightPanelCloseButton } from "@/shared/ui/RightPanelCloseButton";
import { cn } from "@/shared/utils/cn";
import { ProductDetailSidePanelShell } from "./ProductDetailSidePanelShell";
import StoreVisitMapBlock from "./StoreVisitMapBlock";
import { useUiPlatform } from "@/shared/hooks/use-ui-platform";
import { useCmsSection } from "@/hooks/homepage/useCmsSection";
import type { NormalizedStoreLocatorShowroom } from "@/services/store-locator/store-locator-page.types";
import type { Product } from "@/features/products/data/products";
import { getProductSubmissionVariant } from "@/features/products/utils/productSubmissionVariant";
import {
  createProductSubmission,
  ProductSubmissionRefusedError,
  STORE_VISIT_FORM_TAG,
} from "@/services/forms/product-form.service";

type DeliveryStoreJourneyPanelProps = {
  open: boolean;
  onClose: () => void;
  store: DeliveryStoreLocation;
  product: Product;
};

type JourneyStep = "availability" | "booking";

async function fetchShowrooms(signal: AbortSignal): Promise<NormalizedStoreLocatorShowroom[]> {
  const response = await fetch("/api/store-locator/showrooms", { signal });
  if (!response.ok) throw new Error("Showrooms unavailable");
  const { showrooms } = (await response.json()) as { showrooms: NormalizedStoreLocatorShowroom[] };
  return showrooms;
}

const DeliveryStoreJourneyPanel = ({
  open,
  onClose,
  store,
  product,
}: DeliveryStoreJourneyPanelProps) => {
  const { toast } = useToast();
  const { status, customer } = useAuth();
  const { phoneLocked, emailLocked } = getAppointmentContactLocks(
    signupMethodToContactLockKind(customer?.signupMethod),
  );
  const canPrefill = open && status === "authenticated";
  const { contact } = useCustomerProfileContact(canPrefill);
  const profileContact = canPrefill ? contact : null;
  const [step, setStep] = useState<JourneyStep>("availability");
  // Undefined lets the profile supply the initial value. An edit, including clearing a field, takes precedence.
  const [nameInput, setName] = useState<string>();
  const [countryCodeInput, setCountryCode] = useState<string>();
  const [phoneInput, setPhone] = useState<string>();
  const [emailInput, setEmail] = useState<string>();
  const name = nameInput ?? profileContact?.fullName?.trim() ?? "";
  const countryCode = countryCodeInput ?? (profileContact?.countryCode?.trim() || "+91");
  const phone = phoneInput ?? profileContact?.phone?.trim() ?? "";
  const email = emailInput ?? profileContact?.email?.trim() ?? "";
  const handlePhoneChange = useCallback((value: string) => {
    setPhone(value);
    setCountryCode((current) => current ?? countryCode);
  }, [countryCode]);
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pendingSubmission = useRef<Promise<void> | null>(null);

  const { data: showrooms, isLoading: isLoadingShowrooms } = useCmsSection(
    "store-locator-showrooms",
    fetchShowrooms,
    { enabled: open },
  );
  const showroom = showrooms?.find((location) => location.slug === store.slug);
  const directionsUrl = showroom?.mapUrl?.trim();

  useEffect(() => {
    if (!open) {
      setStep("availability");
    }
  }, [open]);

  useEffect(() => () => {
    pendingSubmission.current = null;
  }, []);

  const formValues = useMemo(
    () => ({ name, countryCode, phone, email, date, note }),
    [name, countryCode, phone, email, date, note],
  );

  const { isValid, submitted, errors, markTouched, showError, validateSubmit } =
    useAppointmentFormValidation(formValues);

  const handleClose = () => {
    setStep("availability");
    onClose();
  };

  const submitVisit = async () => {
    if (pendingSubmission.current) return;

    const preferredShowroom = showroom?.documentId ?? showroom?.id;
    if (!preferredShowroom) {
      toast({ title: "Store details unavailable", description: "Please try again shortly." });
      return;
    }

    const request = Promise.resolve().then(() => createProductSubmission({
      formTag: STORE_VISIT_FORM_TAG,
      preferredShowroom,
      productId: product.id,
      productName: product.name,
      ...getProductSubmissionVariant(product),
      customerName: name.trim(),
      customerPhone: `${countryCode} ${phone}`.trim(),
      customerEmail: email.trim() || undefined,
      requestDetails: note.trim() || undefined,
      requestedDate: date || undefined,
      selectedTimeSlot: selectedSlot ?? undefined,
      sourcePage: window.location.pathname,
    }));
    pendingSubmission.current = request;
    setIsSubmitting(true);

    try {
      await request;
      if (pendingSubmission.current !== request) return;
      toast({
        title: "Visit confirmed",
        description: "Our representative will get in touch with you soon.",
      });
      handleClose();
    } catch (error) {
      if (pendingSubmission.current !== request) return;
      toast({
        title: error instanceof ProductSubmissionRefusedError && error.message
          ? error.message
          : "Could not book visit. Please try again.",
      });
    } finally {
      if (pendingSubmission.current === request) {
        pendingSubmission.current = null;
        setIsSubmitting(false);
      }
    }
  };

  const { windows } = useUiPlatform();
  return (
    <ProductDetailSidePanelShell
      open={open}
      onClose={handleClose}
      overlayAriaLabel="Close store availability"
      dialogAriaLabel={step === "availability" ? "In store availability" : "Book your store visit"}
    >
      {step === "availability" ? (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain DrawerVerticleScrollbar">
            <div className={cn(RIGHT_PANEL_HEADER_PADDING_CLASS)}>
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">
                    In Store Availabilty
                  </h2>
                  <RightPanelCloseButton
                    onClick={handleClose}
                    aria-label="Close store availability"
                  />
                </div>
                <div className="h-px w-full bg-neutral300" aria-hidden />
              </div>

              <div className="mt-6 flex flex-col gap-3 pb-72">
                <div className="flex flex-wrap items-center gap-2">
                  <Image
                    src={DELIVERY_STORE_ICONS.store}
                    alt=""
                    width={24}
                    height={24}
                    aria-hidden
                    className="shrink-0"
                  />
                  <p className="font-gill text-base font-light leading-110 text-darkblack">
                    Available now at nearest store
                  </p>
                  <span className="text-link-underline inline-flex border-b-[1.5px] border-darkblack pb-1 font-gill text-sm leading-110 text-darkblack">
                    {store.name.toUpperCase()}
                  </span>
                </div>

                <StoreVisitMapBlock
                  variant="availability"
                  showroomImage={showroom ? {
                    desktopSrc: showroom.desktopImageUrl,
                    mobileSrc: showroom.mobileImageUrl,
                    alt: showroom.imageAlt || store.name,
                  } : undefined}
                >
                  {showroom ? (
                    <div className="flex flex-col gap-4">
                      {showroom.address ? (
                        <div className="flex gap-3 items-center">
                          <Image
                            src={DELIVERY_STORE_ICONS.address}
                            alt=""
                            width={20}
                            height={20}
                            aria-hidden
                            className={cn(!windows && "-translate-y-0.5", "mt-0.5 shrink-0")}
                          />
                          <p className="min-w-0 flex-1 font-gill text-base font-light leading-110 text-darkblack">
                            {showroom.address}
                          </p>
                        </div>
                      ) : null}
                      {showroom.phone ? (
                        <div className="flex gap-3 items-center">
                          <Image
                            src={DELIVERY_STORE_ICONS.phone}
                            alt=""
                            width={20}
                            height={20}
                            aria-hidden
                            className={cn(!windows && "-translate-y-0.5", "mt-0.5 shrink-0")}
                          />
                          <p className="min-w-0 flex-1 font-gill text-base font-light leading-110 text-darkblack">
                            {showroom.phone}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <p role="status" className="font-gill text-base font-light leading-110 text-darkblack">
                      {isLoadingShowrooms ? "Loading store details…" : "Store details unavailable"}
                    </p>
                  )}
                  {directionsUrl ? (
                    <DetailTextLink
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GET DIRECTION
                    </DetailTextLink>
                  ) : null}
                </StoreVisitMapBlock>
              </div>
            </div>
          </div>

          <PanelFooter>
            <DetailDarkButton onClick={() => setStep("booking")}>BOOK YOUR VISIT</DetailDarkButton>
          </PanelFooter>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain DrawerVerticleScrollbar">
            <div className={cn(RIGHT_PANEL_HEADER_PADDING_CLASS)}>
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setStep("availability")}
                      aria-label="Back to store availability"
                      className="inline-flex size-6 shrink-0 items-center justify-center"
                    >
                      <ChevronLeft size={24} strokeWidth={1.25} aria-hidden className="text-darkblack" />
                    </button>
                    <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">
                      Book Your Store Visit
                    </h2>
                  </div>
                  <RightPanelCloseButton
                    onClick={handleClose}
                    aria-label="Close book your store visit"
                  />
                </div>
                <div className="h-px w-full bg-neutral300" aria-hidden />
              </div>

              <div className="mt-6 flex flex-col gap-6 pb-72">
                <AppointmentContactFields
                  idPrefix="store-visit"
                  name={name}
                  countryCode={countryCode}
                  phone={phone}
                  email={email}
                  date={date}
                  note={note}
                  selectedSlot={selectedSlot}
                  onNameChange={setName}
                  onCountryCodeChange={setCountryCode}
                  onPhoneChange={handlePhoneChange}
                  onEmailChange={setEmail}
                  onDateChange={setDate}
                  onNoteChange={setNote}
                  onSelectedSlotChange={setSelectedSlot}
                  errors={errors}
                  showError={showError}
                  markTouched={markTouched}
                  labelClassName={appointmentLabelClassName}
                  fieldClassName={appointmentFieldClassName}
                  selectedSlotStyle="gold"
                  phoneLocked={phoneLocked}
                  emailLocked={emailLocked}
                />
              </div>
            </div>
          </div>

          <PanelFooter contentClassName="flex flex-col items-center gap-4">
            <p className="text-center font-gill text-sm font-light leading-normal tracking-normal text-neutral500">
              Our representative will get in touch with you soon
            </p>
            <DetailDarkButton
              onClick={() => validateSubmit(() => void submitVisit())}
              disabled={isSubmitting || (submitted && !isValid)}
              className="disabled:cursor-not-allowed disabled:opacity-50"
            >
              CONFIRM VISIT
            </DetailDarkButton>
          </PanelFooter>
        </div>
      )}
    </ProductDetailSidePanelShell>
  );
};

export default DeliveryStoreJourneyPanel;
