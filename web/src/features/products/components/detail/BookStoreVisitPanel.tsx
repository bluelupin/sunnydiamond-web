"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
} from "lucide-react";
import { useAppStatusToastController } from "@/shared/hooks/useAppStatusToastController";
import { AppStatusToastAction } from "@/shared/ui/AppStatusToast";
import { buildProfileSectionHref } from "@/features/account/utils/profileSectionNavigation";
import { useHomepageEditorialBlocks } from "@/hooks/homepage/useHomepageEditorialBlocks";
import {
  getDefaultBookStoreVisitStoreId,
  resolveBookStoreVisitStoresForPanel,
} from "@/features/products/utils/bookStoreVisitStores";
import {
  storeLocatorExploreShowroomsTitle,
  storeLocatorListHeadingClassName,
  storeLocatorNoAreaSubtitle,
  storeLocatorNoAreaTitle,
  storeLocatorSearchMatchMessage,
} from "@/features/stores/data/storeLocatorContent";
import {
  filterBookStoreVisitStores,
  getStoreLocatorPincodeSearchError,
  shouldShowPincodeMatchResults,
  shouldSuggestNearbyStores,
} from "@/features/stores/utils/storeLocatorFilters";
import type { NormalizedStoreLocatorListCopy } from "@/services/store-locator/store-locator-page.types";
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
  type BookStoreVisitStore,
} from "@/features/products/data/bookStoreVisitContent";
import {
  createProductSubmission,
  getProductFormByTag,
} from "@/services/forms/product-form.service";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useCustomerProfileContact } from "@/shared/hooks/use-customer-profile-contact";
import { wishlistMovedToastDurationMs } from "@/features/wishlist/data/content";
import { DetailDarkButton } from "./shared";
import { PanelFooter } from "@/shared/ui/PanelFooter";
import { RIGHT_PANEL_HEADER_PADDING_CLASS } from "@/shared/ui/rightPanel";
import { RightPanelCloseButton } from "@/shared/ui/RightPanelCloseButton";
import {
  ProductDetailSidePanelShell,
} from "./ProductDetailSidePanelShell";

const PRODUCT_STORE_VISIT_FORM_TAG = "product-store-visit";
/** Fallback product identity when booking outside PDP (store locator / nav). */
const STORE_VISIT_PRODUCT_NAME = "Store Visit";
const STORE_VISIT_PRODUCT_ID = "store-visit";

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
  invalidPincodeMessage?: string | null;
  listCopy?: NormalizedStoreLocatorListCopy | null;
  /**
   * Overrides the default `product-store-visit` form tag.
   * Submit always uses product-submissions (My Appointments).
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
  invalidPincodeMessage,
  listCopy,
  submissionFormTag,
  productName,
  productId,
}: BookStoreVisitPanelProps) => {
  const router = useRouter();
  const profileEnabled = variant !== "modal" || open;
  const { customer } = useAuth();
  const { contact: profileContact } = useCustomerProfileContact(profileEnabled);
  const { data: editorialData } = useHomepageEditorialBlocks();
  const editorialShowrooms = useMemo(
    () => editorialData?.showroomSection?.showrooms ?? [],
    [editorialData?.showroomSection?.showrooms],
  );
  const [isResolvingStores, setIsResolvingStores] = useState(
    () => !(initialStores && initialStores.length > 0),
  );
  const [step, setStep] = useState<BookVisitStep>("select-store");
  const [stores, setStores] = useState<BookStoreVisitStore[]>(() => initialStores ?? []);
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
  const [formTag, setFormTag] = useState(
    submissionFormTag ?? PRODUCT_STORE_VISIT_FORM_TAG,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState(
    () => getDefaultBookStoreVisitStoreId(initialStores ?? []),
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
  const { show: showStatusToast, node: statusToast } = useAppStatusToastController(
    wishlistMovedToastDurationMs,
  );

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
      const allStores = filterBookStoreVisitStores(stores, "", null);
      const stateMatched = storeStateFilter
        ? filterBookStoreVisitStores(stores, "", storeStateFilter)
        : [];
      const searchMatched = filterBookStoreVisitStores(
        stores,
        storeSearchQuery,
        null,
      );

      if (getStoreLocatorPincodeSearchError(storeSearchQuery, invalidPincodeMessage)) {
        // Empty state tab still uses no-area UX; invalid message stays under the field.
        if (storeStateFilter?.trim() && stateMatched.length === 0) {
          return {
            displayStores: allStores,
            listStatus: "no-area" as StoreLocatorListStatus,
            matchedStores: [] as BookStoreVisitStore[],
          };
        }

        return {
          displayStores: allStores,
          listStatus: "default" as StoreLocatorListStatus,
          // Keep full list; highlight state tab match in place when selected.
          matchedStores: stateMatched,
        };
      }

      if (shouldSuggestNearbyStores(storeSearchQuery, searchMatched.length)) {
        return {
          displayStores: allStores,
          listStatus: "no-area" as StoreLocatorListStatus,
          matchedStores: [] as BookStoreVisitStore[],
        };
      }

      const isPincodeMatch = shouldShowPincodeMatchResults(
        storeSearchQuery,
        searchMatched.length,
      );
      const isLocationNameMatch =
        Boolean(query) && !/^\d+$/.test(query) && searchMatched.length > 0;

      if (isPincodeMatch || isLocationNameMatch) {
        return {
          displayStores: allStores,
          listStatus: "search-match" as StoreLocatorListStatus,
          matchedStores: searchMatched,
        };
      }

      // Text location search with no hits (e.g. "dehradun") — same no-area UX as
      // a pincode miss. Do not fall through to a sticky state tab (which was
      // wrongly showing "Explore Our Showrooms" + that state's store active).
      if (Boolean(query) && !/^\d+$/.test(query) && searchMatched.length === 0) {
        return {
          displayStores: allStores,
          listStatus: "no-area" as StoreLocatorListStatus,
          matchedStores: [] as BookStoreVisitStore[],
        };
      }

      // Empty state tab (Karnataka / Telangana / Maharashtra / New Delhi, etc.) —
      // same UX as valid pincode miss: no-area copy + full default listing.
      if (storeStateFilter?.trim() && stateMatched.length === 0) {
        return {
          displayStores: allStores,
          listStatus: "no-area" as StoreLocatorListStatus,
          matchedStores: [] as BookStoreVisitStore[],
        };
      }

      // State tab (or idle): never remove locations — only activate matches in place.
      return {
        displayStores: allStores,
        listStatus: "default" as StoreLocatorListStatus,
        matchedStores: stateMatched,
      };
    }, [stores, storeSearchQuery, storeStateFilter, variant, invalidPincodeMessage]);

  // Honor any in-list selection so nearby / non-matched rows stay clickable.
  // Fall back to the first match (or first listed store) only when the current id is gone.
  const activeStoreId = useMemo(() => {
    if (displayStores.some((store) => store.id === selectedStoreId)) {
      return selectedStoreId;
    }

    if (matchedStores.length > 0) {
      return matchedStores[0]?.id ?? "";
    }

    return displayStores[0]?.id ?? (variant === "page" ? "" : selectedStoreId);
  }, [displayStores, matchedStores, selectedStoreId, variant]);

  const selectedStore =
    displayStores.find((store) => store.id === activeStoreId) ??
    displayStores[0] ??
    stores[0];

  // When search/state filter changes, activate the first match in place.
  // Do not lock selection to matches — clicking Coimbatore (or any nearby row) must stick.
  useEffect(() => {
    if (variant !== "page") {
      return;
    }

    if (matchedStores.length > 0) {
      setSelectedStoreId((current) =>
        matchedStores.some((store) => store.id === current)
          ? current
          : (matchedStores[0]?.id ?? current),
      );
      return;
    }

    // State tab with no showrooms: don't leave another state's store expanded.
    if (storeStateFilter?.trim()) {
      setSelectedStoreId(displayStores[0]?.id ?? "");
    }
  }, [variant, storeSearchQuery, storeStateFilter, matchedStores, displayStores]);

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
        const activeFormTag = submissionFormTag ?? PRODUCT_STORE_VISIT_FORM_TAG;
        const form = await getProductFormByTag(activeFormTag, controller.signal);
        const resolvedStores = resolveBookStoreVisitStoresForPanel(
          variant,
          initialStores,
          [],
          editorialShowrooms,
        );

        if (!form) {
          setStores(resolvedStores);
          setSelectedStoreId((current) =>
            resolvedStores.some((store) => store.id === current)
              ? current
              : getDefaultBookStoreVisitStoreId(resolvedStores),
          );
          return;
        }

        setFormTag(form.formTag || activeFormTag);
        if (form.formName) {
          setFormTitle(form.formName);
        }
        if (form.submitButtonText) {
          setSubmitButtonText(form.submitButtonText.toUpperCase());
        }
        if (form.timeSlots.length > 0) {
          setTimeSlots(form.timeSlots);
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
        if (form.notesLabel) {
          setNotesLabel(form.notesLabel);
        }
        if (form.notesPlaceholder) {
          setNotesPlaceholder(form.notesPlaceholder);
        }

        setStores(resolvedStores);
        setSelectedStoreId((current) =>
          resolvedStores.some((store) => store.id === current)
            ? current
            : getDefaultBookStoreVisitStoreId(resolvedStores),
        );
      } catch {
        const resolvedStores = resolveBookStoreVisitStoresForPanel(
          variant,
          initialStores,
          [],
          editorialShowrooms,
        );
        setStores(resolvedStores);
        setSelectedStoreId((current) =>
          resolvedStores.some((store) => store.id === current)
            ? current
            : getDefaultBookStoreVisitStoreId(resolvedStores),
        );
      } finally {
        setIsResolvingStores(false);
      }
    })();

    return () => controller.abort();
  }, [open, variant, editorialShowrooms, submissionFormTag, initialStores]);

  useEffect(() => {
    setFormTag(submissionFormTag ?? PRODUCT_STORE_VISIT_FORM_TAG);
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
        : getDefaultBookStoreVisitStoreId(stores),
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

      await createProductSubmission({
        formTag: formTag || PRODUCT_STORE_VISIT_FORM_TAG,
        productName: productName?.trim() || STORE_VISIT_PRODUCT_NAME,
        productId: productId?.trim() || STORE_VISIT_PRODUCT_ID,
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

      showStatusToast("Visit booked successfully.", {
        action: (
          <AppStatusToastAction
            onClick={() => {
              router.push(buildProfileSectionHref("appointments"));
            }}
          >
            View Here
          </AppStatusToastAction>
        ),
      });
      handleClose();
    } catch {
      showStatusToast("Could not book visit");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        listCopy={listCopy}
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
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
      {panelBody}
    </div>
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
            className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-472 flex-col overflow-hidden bg-white"
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
      <ProductDetailSidePanelShell
        open={open}
        onClose={handleClose}
        overlayAriaLabel="Close book a visit"
        dialogAriaLabel="Book your store visit"
      >
        {panelContent}
      </ProductDetailSidePanelShell>
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
  listCopy?: NormalizedStoreLocatorListCopy | null;
  listStatus?: StoreLocatorListStatus;
  isShowroomsLoading?: boolean;
};

function StoreLocatorListStatusHeader({
  status,
  listCopy,
}: {
  status: StoreLocatorListStatus;
  listCopy?: NormalizedStoreLocatorListCopy | null;
}) {
  if (status === "no-area") {
    const title = listCopy?.noAreaTitle?.trim() || storeLocatorNoAreaTitle;
    const subtitle = listCopy?.noAreaSubtitle?.trim() || storeLocatorNoAreaSubtitle;

    return (
      <div className="flex flex-col gap-2 pt-6 lg:pt-0">
        <p className="font-gill text-base font-normal uppercase leading-110 text-darkblack">
          {title}
        </p>
        <p className="font-gill text-base font-normal leading-110 text-darkblack">
          {subtitle}
        </p>
      </div>
    );
  }

  if (status === "search-match") {
    const storeFoundMessage =
      listCopy?.storeFoundMessage?.trim() || storeLocatorSearchMatchMessage;

    return (
      <div className="flex flex-col gap-4 pt-6 lg:pt-0">
        <p className={storeLocatorListHeadingClassName}>{storeFoundMessage}</p>
      </div>
    );
  }

  // Default + invalid pincode fallback listing (Figma).
  return (
    <div className="flex flex-col gap-4 pt-6 lg:pt-0">
      <p className={storeLocatorListHeadingClassName}>
        {storeLocatorExploreShowroomsTitle}
      </p>
    </div>
  );
}

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
  listCopy,
  listStatus = "default",
  isShowroomsLoading = false,
}: StoreSelectionStepProps) => {
  if (layout === "page") {
    const listHeader = (
      <StoreLocatorListStatusHeader status={listStatus} listCopy={listCopy} />
    );

    return (
      <ShowroomsLayout
        locations={stores.map(mapBookStoreVisitStoreToLayoutItem)}
        activeId={selectedStoreId || null}
        onSelect={onSelectStore}
        getDirectionsLabel={getDirectionsLabel ?? undefined}
        listHeader={listHeader}
        isLoading={isShowroomsLoading}
        emptyMessage={noResultsMessage?.trim() || undefined}
      />
    );
  }

  const selectedStore =
    stores.find((store) => store.id === selectedStoreId) ?? stores[0] ?? null;
  const heroImage = selectedStore?.heroImage || selectedStore?.mobileHeroImage;

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto DrawerVerticleScrollbar">
        <div className={cn(RIGHT_PANEL_HEADER_PADDING_CLASS)}>
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
                <RightPanelCloseButton onClick={onClose} aria-label="Close" />
              ) : null}
            </div>
            <div className="h-px w-full bg-neutral300" aria-hidden />
          </div>

          <div className="mt-6 flex flex-col gap-6 pb-72" aria-label="Showroom locations">
            {isShowroomsLoading ? (
              <div className="flex flex-col gap-4" aria-busy="true" aria-label="Loading showrooms">
                <div className="h-8 animate-pulse bg-gray300" />
                <div className="aspect-[4/5] animate-pulse bg-gray300" />
              </div>
            ) : stores.length === 0 ? (
              noResultsMessage?.trim() ? (
                <p className="py-8 font-gill text-base font-light leading-110 text-neutral500">
                  {noResultsMessage.trim()}
                </p>
              ) : null
            ) : (
              <>
                <div
                  role="tablist"
                  aria-label="Store locations"
                  className="flex gap-6 overflow-x-auto horizontalScrollbar"
                >
                  {stores.map((store) => {
                    const isSelected = store.id === (selectedStore?.id ?? "");
                    return (
                      <button
                        key={store.id}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        onClick={() => onSelectStore(store.id)}
                        className={cn(
                          "shrink-0 border-b-[1.5px] pb-2 font-gill text-sm font-normal uppercase leading-110 tracking-normal transition-colors",
                          isSelected
                            ? "border-linkGold text-linkGold"
                            : "border-transparent text-darkblack",
                        )}
                      >
                        {store.tabLabel || store.storeName.toUpperCase()}
                      </button>
                    );
                  })}
                </div>

                {selectedStore ? (
                  <div className="relative w-full">
                    {heroImage ? (
                      <div className="relative aspect-[3/4] min-h-[420px] w-full">
                        <Image
                          src={heroImage}
                          alt={selectedStore.imageAlt || selectedStore.storeName}
                          fill
                          className="object-cover object-center"
                          sizes="(max-width: 480px) 100vw, 480px"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[3/4] min-h-[420px] w-full bg-gray300" aria-hidden />
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gray300 px-4 py-6 lg:px-6">
                      <div className="flex flex-col gap-4">
                        <p className="font-larken text-xl font-light leading-110 text-darkblack lg:text-2xl">
                          {selectedStore.storeName}
                        </p>
                        <BookStoreVisitLocationDetails
                          store={selectedStore}
                          directionsLabel={getDirectionsLabel}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}
              </>
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
      <div className="min-h-0 flex-1 overflow-y-auto DrawerVerticleScrollbar">
        <div className={cn(RIGHT_PANEL_HEADER_PADDING_CLASS)}>
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
                <RightPanelCloseButton onClick={onClose} aria-label="Close" />
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
