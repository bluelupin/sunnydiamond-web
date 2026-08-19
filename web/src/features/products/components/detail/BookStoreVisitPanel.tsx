"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  Check,
} from "lucide-react";
import { useHomepageEditorialBlocks } from "@/hooks/homepage/useHomepageEditorialBlocks";
import { resolveBookStoreVisitStores } from "@/features/products/utils/bookStoreVisitStores";
import {
  storeLocatorFoundCopy,
  storeLocatorNearbySuggestionsCopy,
  storeLocatorStatusEyebrowClassName,
} from "@/features/stores/data/storeLocatorContent";
import {
  filterBookStoreVisitStores,
  getStoreLocatorPincodeSearchError,
  shouldSuggestNearbyStores,
} from "@/features/stores/utils/storeLocatorFilters";
import { BookStoreVisitLocationDetails } from "./BookStoreVisitLocationDetails";
import {
  mapBookStoreVisitStoreToLayoutItem,
  ShowroomsLayout,
} from "@/features/stores/components/ShowroomsLayout";
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
import { createProductSubmission } from "@/services/forms/product-form.service";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useCustomerProfileContact } from "@/shared/hooks/use-customer-profile-contact";
import { wishlistMovedToastDurationMs } from "@/features/wishlist/data/content";
import { DetailDarkButton } from "./shared";
import { PanelFooter } from "@/shared/ui/PanelFooter";
import {
  productDetailSidePanelAsideClassName,
  productDetailSidePanelOverlayClassName,
} from "./ProductDetailSidePanelShell";

const SHOWROOM_VISIT_FORM_TAG = "showroom-visit";

type StoreLocatorListStatus = "default" | "search-match" | "no-area";

type BookStoreVisitPanelProps = {
  variant?: "embedded" | "page" | "modal";
  open?: boolean;
  onClose?: () => void;
  onBack?: () => void;
  storeSearchQuery?: string;
  storeStateFilter?: string | null;
  /** Prefetched showrooms from `/api/store-locator-page` (page variant). */
  initialStores?: BookStoreVisitStore[];
  /** Shows showroom layout skeleton while store-locator data is loading. */
  isShowroomsLoading?: boolean;
  getDirectionsLabel?: string | null;
  noResultsMessage?: string | null;
  /**
   * PDP Visit Us only. When set (e.g. `product-store-visit`), submit via
   * product-submissions so the booking appears under My Appointments.
   * Store locator / mobile nav omit this — existing generic flow unchanged.
   */
  submissionFormTag?: string;
  productName?: string;
  productId?: string;
};

type BookVisitStep = "select-store" | "form";

const BookStoreVisitPanel = ({
  variant = "modal",
  open = true,
  onClose,
  onBack,
  storeSearchQuery = "",
  storeStateFilter = null,
  initialStores,
  isShowroomsLoading = false,
  getDirectionsLabel,
  noResultsMessage,
  submissionFormTag,
  productName,
  productId,
}: BookStoreVisitPanelProps) => {
  const profileEnabled = variant !== "modal" || open;
  const { customer } = useAuth();
  const { contact: profileContact } = useCustomerProfileContact(profileEnabled);
  const { data: editorialData } = useHomepageEditorialBlocks();
  const editorialShowrooms = useMemo(
    () => editorialData?.showroomSection?.showrooms ?? [],
    [editorialData?.showroomSection?.showrooms],
  );
  const [isResolvingStores, setIsResolvingStores] = useState(
    () => variant === "page" && !(initialStores && initialStores.length > 0),
  );
  const [step, setStep] = useState<BookVisitStep>("select-store");
  const [stores, setStores] = useState<BookStoreVisitStore[]>(() => {
    if (initialStores && initialStores.length > 0) return initialStores;
    if (variant === "page") return [];
    return BOOK_STORE_VISIT_STORES;
  });
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
  const [formTag, setFormTag] = useState(submissionFormTag ?? SHOWROOM_VISIT_FORM_TAG);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState(
    () =>
      initialStores?.[0]?.id ??
      (variant === "page" ? "" : BOOK_STORE_VISIT_STORES[0]?.id ?? ""),
  );
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

  const { displayStores, listStatus, matchedStores } =
    useMemo(() => {
      const empty = {
        displayStores: stores,
        listStatus: "default" as StoreLocatorListStatus,
        matchedStores: [] as BookStoreVisitStore[],
      };

      if (variant !== "page") {
        return empty;
      }

      const query = storeSearchQuery.trim();
      const filtered = filterBookStoreVisitStores(stores, storeSearchQuery, storeStateFilter);
      const allStores = filterBookStoreVisitStores(stores, "", null);

      if (getStoreLocatorPincodeSearchError(storeSearchQuery)) {
        return {
          displayStores: filterBookStoreVisitStores(stores, "", storeStateFilter),
          listStatus: "default" as StoreLocatorListStatus,
          matchedStores: [] as BookStoreVisitStore[],
        };
      }

      if (shouldSuggestNearbyStores(storeSearchQuery, filtered.length)) {
        return {
          displayStores: allStores,
          listStatus: "no-area" as StoreLocatorListStatus,
          matchedStores: [] as BookStoreVisitStore[],
        };
      }

      if (query && filtered.length > 0) {
        const matchedIds = new Set(filtered.map((store) => store.id));
        const rest = allStores.filter((store) => !matchedIds.has(store.id));
        return {
          displayStores: [...filtered, ...rest],
          listStatus: "search-match" as StoreLocatorListStatus,
          matchedStores: filtered,
        };
      }

      return {
        displayStores: filtered,
        listStatus: "default" as StoreLocatorListStatus,
        matchedStores: [] as BookStoreVisitStore[],
      };
    }, [stores, storeSearchQuery, storeStateFilter, variant]);

  // Keep selection inside the filtered list synchronously so search/pincode
  // results expand immediately (useEffect-only sync left a stale id briefly).
  const activeStoreId = useMemo(() => {
    if (matchedStores.length > 0) {
      if (matchedStores.some((store) => store.id === selectedStoreId)) {
        return selectedStoreId;
      }
      return matchedStores[0]?.id ?? "";
    }

    if (displayStores.some((store) => store.id === selectedStoreId)) {
      return selectedStoreId;
    }
    return displayStores[0]?.id ?? (variant === "page" ? "" : selectedStoreId);
  }, [displayStores, matchedStores, selectedStoreId, variant]);

  const selectedStore =
    displayStores.find((store) => store.id === activeStoreId) ??
    displayStores[0] ??
    stores[0] ??
    (variant === "page" ? undefined : BOOK_STORE_VISIT_STORES[0]);

  useEffect(() => {
    if (variant !== "page") {
      return;
    }

    if (selectedStoreId === activeStoreId) {
      return;
    }

    setSelectedStoreId(activeStoreId);
  }, [activeStoreId, selectedStoreId, variant]);

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
        if (!form) {
          const resolvedStores =
            variant === "page"
              ? (initialStores ?? [])
              : initialStores && initialStores.length > 0
                ? initialStores
                : resolveBookStoreVisitStores([], editorialShowrooms);
          setStores(resolvedStores);
          setSelectedStoreId((current) =>
            resolvedStores.some((store) => store.id === current)
              ? current
              : resolvedStores[0]?.id ?? (variant === "page" ? "" : BOOK_STORE_VISIT_STORES[0].id),
          );
          return;
        }

        // Keep PDP submission tag; only adopt CMS tag for generic Book a Visit.
        if (!submissionFormTag) {
          setFormTag(form.formTag || SHOWROOM_VISIT_FORM_TAG);
        }
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

        const resolvedStores =
          variant === "page"
            ? (initialStores ?? [])
            : initialStores && initialStores.length > 0
              ? initialStores
              : resolveBookStoreVisitStores(form.showrooms, editorialShowrooms);
        setStores(resolvedStores);
        setSelectedStoreId((current) =>
          resolvedStores.some((store) => store.id === current)
            ? current
            : resolvedStores[0]?.id ?? (variant === "page" ? "" : BOOK_STORE_VISIT_STORES[0].id),
        );
      } catch {
        const resolvedStores =
          variant === "page"
            ? (initialStores ?? [])
            : initialStores && initialStores.length > 0
              ? initialStores
              : resolveBookStoreVisitStores([], editorialShowrooms);
        setStores(resolvedStores);
        setSelectedStoreId((current) =>
          resolvedStores.some((store) => store.id === current)
            ? current
            : resolvedStores[0]?.id ?? (variant === "page" ? "" : BOOK_STORE_VISIT_STORES[0].id),
        );
      } finally {
        if (variant === "page") {
          setIsResolvingStores(false);
        }
      }
    })();

    return () => controller.abort();
  }, [open, variant, editorialShowrooms, submissionFormTag, initialStores]);

  useEffect(() => {
    if (submissionFormTag) {
      setFormTag(submissionFormTag);
    }
  }, [submissionFormTag]);

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
      stores.some((store) => store.id === current)
        ? current
        : (stores[0]?.id ?? (variant === "page" ? "" : BOOK_STORE_VISIT_STORES[0].id)),
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
    if (isSubmitting || !selectedStore) return;

    setIsSubmitting(true);
    try {
      const composedNotes = [purpose ? `Purpose: ${purpose}` : "", note.trim()]
        .filter(Boolean)
        .join("\n");

      // preferredShowroom is a Strapi relation — send documentId, not the display name
      const preferredShowroom =
        selectedStore.documentId ?? selectedStore.id;

      // PDP Visit Us only — store locator / mobile nav keep generic-submissions.
      const isProductStoreVisit =
        Boolean(submissionFormTag) &&
        Boolean(productName?.trim()) &&
        Boolean(productId?.trim());

      if (isProductStoreVisit) {
        await createProductSubmission({
          formTag: submissionFormTag!,
          productName: productName!.trim(),
          productId: productId!.trim(),
          customerName: name.trim(),
          customerPhone: `${countryCode} ${phone}`.trim(),
          customerEmail: email.trim() || undefined,
          ...(customer?.id != null ? { magentoCustomerId: customer.id } : {}),
          requestDetails: composedNotes || undefined,
          requestedDate: date || undefined,
          selectedTimeSlot: selectedSlot ?? undefined,
          preferredShowroom,
          sourcePage:
            typeof window !== "undefined" ? window.location.pathname : undefined,
          consentAccepted: true,
          workflowStatus: "New",
        });
      } else {
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
      }

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
    step === "select-store" || !selectedStore ? (
      <StoreSelectionStep
        stores={displayStores}
        selectedStoreId={activeStoreId}
        layout={variant === "page" ? "page" : "panel"}
        formTitle={formTitle}
        onSelectStore={setSelectedStoreId}
        onProceed={() => setStep("form")}
        onBack={showStoreSelectionBack ? handleStoreSelectionBack : undefined}
        onClose={variant !== "page" ? handleClose : undefined}
        showBack={showStoreSelectionBack}
        getDirectionsLabel={getDirectionsLabel}
        noResultsMessage={noResultsMessage}
        listStatus={listStatus}
        isShowroomsLoading={isShowroomsLoading || isResolvingStores}
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
        getDirectionsLabel={getDirectionsLabel}
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
        {step === "select-store" ? (
          panelBody
        ) : (
          <aside
            role="dialog"
            aria-label="Book your store visit"
            className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-480 flex-col overflow-hidden bg-white"
          >
            {panelBody}
          </aside>
        )}
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
  formTitle: string;
  layout?: "panel" | "page";
  onSelectStore: (storeId: string) => void;
  onProceed: () => void;
  onBack?: () => void;
  onClose?: () => void;
  showBack?: boolean;
  getDirectionsLabel?: string | null;
  noResultsMessage?: string | null;
  listStatus?: StoreLocatorListStatus;
  isShowroomsLoading?: boolean;
};

function StoreLocatorListStatusHeader({ status }: { status: StoreLocatorListStatus }) {
  if (status === "no-area") {
    return (
      <div className="flex flex-col gap-2 pt-6 lg:pt-0">
        <p className="font-gill text-base font-normal uppercase leading-110 text-darkblack">
          {storeLocatorNearbySuggestionsCopy.title}
        </p>
        <p className="font-gill text-base font-normal leading-110 text-darkblack">
          {storeLocatorNearbySuggestionsCopy.subtitle}
        </p>
      </div>
    );
  }

  const title = status === "search-match" && storeLocatorFoundCopy.search;

  const isFoundState = status === "search-match";

  return (
    <div className="flex flex-col gap-4 pt-6 lg:pt-0">
      <p
        className={
          isFoundState
            ? storeLocatorStatusEyebrowClassName
            : "font-gill text-sm font-normal leading-110 text-neutral500 lg:text-base"
        }
      >
        {title}
      </p>
    </div>
  );
}

const storeListTitleClassName =
  "font-larken text-xl font-light leading-110 text-darkblack lg:text-2xl";

const selectedStoreCardClassName =
  "flex flex-col gap-4 bg-gray300 px-4 py-6 lg:px-10 lg:py-8";

const unselectedStoreButtonClassName =
  "flex w-full items-center px-4 py-6 text-left font-larken text-xl font-light leading-110 text-darkblack lg:px-10 lg:py-8 lg:text-2xl";

const StoreSelectionStep = ({
  stores,
  selectedStoreId,
  formTitle,
  layout = "panel",
  onSelectStore,
  onProceed,
  onBack,
  onClose,
  showBack = false,
  getDirectionsLabel,
  noResultsMessage,
  listStatus = "default",
  isShowroomsLoading = false,
}: StoreSelectionStepProps) => {
  if (layout === "page") {
    const listHeader =
      listStatus !== "default" ? (
        <StoreLocatorListStatusHeader status={listStatus} />
      ) : null;

    return (
      <ShowroomsLayout
        locations={stores.map(mapBookStoreVisitStoreToLayoutItem)}
        activeId={selectedStoreId || null}
        onSelect={onSelectStore}
        getDirectionsLabel={getDirectionsLabel ?? undefined}
        listHeader={listHeader}
        isLoading={isShowroomsLoading}
        emptyMessage={
          noResultsMessage?.trim() ||
          "No showrooms match your search. Try another location or state."
        }
      />
    );
  }

  return (
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
                    src="/icons/menu-close.svg"
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

          <div
            className="mt-6 flex flex-col border-r border-neutral300 pb-72"
            aria-label="Showroom locations"
          >
            {stores.length === 0 ? (
              <p className="px-4 py-8 font-gill text-base font-light leading-110 text-neutral500 lg:px-10">
                {noResultsMessage?.trim() || "No showrooms match your search. Try another location or state."}
              </p>
            ) : (
              stores.map((store) => {
                const isSelected = store.id === selectedStoreId;

                return (
                  <div key={store.id} className="w-full">
                    {isSelected ? (
                      <div className={selectedStoreCardClassName}>
                        <p className={storeListTitleClassName}>{store.storeName}</p>
                        <div className="h-px w-full bg-neutral300" aria-hidden />
                        {store.heroImage ? (
                          <div className="relative aspect-[2500/1797] w-full overflow-hidden">
                            <Image
                              src={store.heroImage}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="(max-width: 480px) 100vw, 480px"
                              aria-hidden
                            />
                          </div>
                        ) : null}
                        <BookStoreVisitLocationDetails store={store} size="page" directionsLabel={getDirectionsLabel} />
                      </div>
                    ) : (
                      <button
                        type="button"
                        aria-pressed={false}
                        onClick={() => onSelectStore(store.id)}
                        className={unselectedStoreButtonClassName}
                      >
                        {store.storeName}
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <PanelFooter>
        <DetailDarkButton onClick={onProceed} disabled={stores.length === 0}>
          PROCEED WITH THIS STORE
        </DetailDarkButton>
      </PanelFooter>
    </>
  );
};

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
  getDirectionsLabel?: string | null;
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
  getDirectionsLabel,
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
                    src="/icons/menu-close.svg"
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
            <div className="flex flex-col gap-4 bg-gray300 px-4 py-8 lg:px-6">
              <p className="font-larken text-2xl font-light leading-110 text-darkblack">
                {selectedStore.storeName}
              </p>
              <div className="h-px w-full bg-neutral300" aria-hidden />
              <BookStoreVisitLocationDetails store={selectedStore} directionsLabel={getDirectionsLabel} />
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
