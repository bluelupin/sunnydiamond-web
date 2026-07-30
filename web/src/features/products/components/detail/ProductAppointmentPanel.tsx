"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import { Check, Info, X } from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";
import { useAppointmentFormValidation } from "@/shared/hooks/use-appointment-form-validation";
import { useCustomerProfileContact } from "@/shared/hooks/use-customer-profile-contact";
import AppointmentContactFields from "@/shared/ui/AppointmentContactFields";
import {
  appointmentFieldClassName,
  appointmentLabelClassName,
} from "@/shared/constants/appointmentForm";
import type { Product } from "@/features/products/data/products";
import { getProductHref } from "@/features/products/utils/productRoutes";
import {
  createProductSubmission,
  getProductFormByTag,
} from "@/services/forms/product-form.service";
import { useAuth } from "@/features/auth/context/AuthContext";
import { wishlistMovedToastDurationMs } from "@/features/wishlist/data/content";
import {
  PRODUCT_APPOINTMENT_PANEL_CONFIG,
  type ProductAppointmentVariant,
} from "./productAppointmentPanel.config";
import { PanelFooter } from "@/shared/ui/PanelFooter";
import { DetailDarkButton } from "./shared";
import { ProductDetailSidePanelShell } from "./ProductDetailSidePanelShell";

const PERSONALISE_FORM_TAG = "product-personalisation";
const SCHEDULE_VIDEO_CALL_FORM_TAG = "product-video-call";

type ProductAppointmentPanelProps = {
  open: boolean;
  onClose: () => void;
  product: Product;
  variant: ProductAppointmentVariant;
};

type ProductAppointmentFormProps = {
  config: (typeof PRODUCT_APPOINTMENT_PANEL_CONFIG)[ProductAppointmentVariant];
  product: Product;
  productImage: string | StaticImageData;
  variant: ProductAppointmentVariant;
  open: boolean;
  onClose: () => void;
  onSubmitSuccess: (message: string) => void;
  onSubmitError: (message: string) => void;
};

const ProductAppointmentForm = ({
  config,
  product,
  productImage,
  variant,
  open,
  onClose,
  onSubmitSuccess,
  onSubmitError,
}: ProductAppointmentFormProps) => {
  const isPersonalise = variant === "personalise";
  const isScheduleVideoCall = variant === "schedule-video-call";
  const { customer } = useAuth();
  const { contact: profileContact } = useCustomerProfileContact(open);

  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [referenceImageName, setReferenceImageName] = useState<string | null>(null);
  const [referenceImagePreviewUrl, setReferenceImagePreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAppliedProfilePrefill, setHasAppliedProfilePrefill] = useState(false);
  const referenceImageInputRef = useRef<HTMLInputElement>(null);
  const referenceImagePreviewUrlRef = useRef<string | null>(null);

  const [formTag, setFormTag] = useState(
    isPersonalise ? PERSONALISE_FORM_TAG : SCHEDULE_VIDEO_CALL_FORM_TAG,
  );
  const [formTitle, setFormTitle] = useState(config.title);
  const [submitLabel, setSubmitLabel] = useState(config.submitLabel);
  const [nameLabel, setNameLabel] = useState("Your Name*");
  const [namePlaceholder, setNamePlaceholder] = useState<string | undefined>(undefined);
  const [phoneLabel, setPhoneLabel] = useState("Phone No.*");
  const [phonePlaceholder, setPhonePlaceholder] = useState<string | undefined>(undefined);
  const [emailLabel, setEmailLabel] = useState("Email");
  const [emailPlaceholder, setEmailPlaceholder] = useState("Enter");
  const [dateLabel, setDateLabel] = useState("Date");
  const [notesLabel, setNotesLabel] = useState(config.noteLabel);
  const [notesPlaceholder, setNotesPlaceholder] = useState(config.notePlaceholder);
  const [notesRequired, setNotesRequired] = useState(config.noteRequired);
  const [allowImageUpload, setAllowImageUpload] = useState(config.showReferenceImage);
  const [timeSlots, setTimeSlots] = useState<readonly string[]>([]);

  const formValues = useMemo(
    () => ({ name, countryCode, phone, email, date, note, selectedSlot }),
    [name, countryCode, phone, email, date, note, selectedSlot],
  );

  const validationOptions = useMemo(
    () => ({
      noteRequired: notesRequired,
      dateRequired: config.showTimeSlots,
      selectedSlotRequired: config.showTimeSlots,
    }),
    [notesRequired, config.showTimeSlots],
  );

  const { isValid, errors, markTouched, showError, validateSubmit, resetValidation } =
    useAppointmentFormValidation(formValues, validationOptions);

  const clearReferenceImage = () => {
    if (referenceImagePreviewUrlRef.current) {
      URL.revokeObjectURL(referenceImagePreviewUrlRef.current);
      referenceImagePreviewUrlRef.current = null;
    }
    setReferenceImagePreviewUrl(null);
    setReferenceImage(null);
    setReferenceImageName(null);
    if (referenceImageInputRef.current) {
      referenceImageInputRef.current.value = "";
    }
  };

  const resetForm = () => {
    setName("");
    setCountryCode("+91");
    setPhone("");
    setEmail("");
    setDate("");
    setSelectedSlot(null);
    setNote("");
    clearReferenceImage();
    setIsSubmitting(false);
    setHasAppliedProfilePrefill(false);
    resetValidation();
  };

  useEffect(() => {
    if (!open) {
      resetForm();
      return;
    }

    if (!isPersonalise && !isScheduleVideoCall) return;

    const controller = new AbortController();
    const cmsFormTag = isPersonalise ? PERSONALISE_FORM_TAG : SCHEDULE_VIDEO_CALL_FORM_TAG;

    void (async () => {
      try {
        const form = await getProductFormByTag(cmsFormTag, controller.signal);
        if (!form) return;

        setFormTag(form.formTag || cmsFormTag);
        if (form.formName) setFormTitle(form.formName);
        if (form.submitButtonText) setSubmitLabel(form.submitButtonText);
        if (form.nameLabel) setNameLabel(form.nameLabel);
        if (form.namePlaceholder) setNamePlaceholder(form.namePlaceholder);
        if (form.phoneLabel) setPhoneLabel(form.phoneLabel);
        if (form.phonePlaceholder) setPhonePlaceholder(form.phonePlaceholder);
        if (form.emailLabel) setEmailLabel(form.emailLabel);
        if (form.emailPlaceholder) setEmailPlaceholder(form.emailPlaceholder);
        if (form.dateLabel) setDateLabel(form.dateLabel);
        if (form.notesLabel) setNotesLabel(form.notesLabel);
        if (form.notesPlaceholder) setNotesPlaceholder(form.notesPlaceholder);
        setNotesRequired(form.notesRequired);
        setAllowImageUpload(form.allowImageUpload);
        if (form.timeSlots.length > 0) setTimeSlots(form.timeSlots);
      } catch {
        // Keep local config fallbacks if CMS fails.
      }
    })();

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset/load on open only
  }, [open, isPersonalise, isScheduleVideoCall]);

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

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleReferenceImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (referenceImagePreviewUrlRef.current) {
      URL.revokeObjectURL(referenceImagePreviewUrlRef.current);
      referenceImagePreviewUrlRef.current = null;
    }

    const previewUrl = file ? URL.createObjectURL(file) : null;
    referenceImagePreviewUrlRef.current = previewUrl;
    setReferenceImagePreviewUrl(previewUrl);
    setReferenceImage(file);
    setReferenceImageName(file?.name ?? null);
  };

  useEffect(() => {
    return () => {
      if (referenceImagePreviewUrlRef.current) {
        URL.revokeObjectURL(referenceImagePreviewUrlRef.current);
        referenceImagePreviewUrlRef.current = null;
      }
    };
  }, []);

  const handleSubmit = () => {
    validateSubmit(() => {
      void (async () => {
        if (isSubmitting) return;

        if (!isPersonalise && !isScheduleVideoCall) {
          onSubmitSuccess(config.successToast.title);
          handleClose();
          return;
        }

        setIsSubmitting(true);
        try {
          await createProductSubmission({
            formTag,
            productName: product.name,
            productId: product.id,
            customerName: name.trim(),
            customerPhone: `${countryCode} ${phone}`.trim(),
            customerEmail: email.trim() || undefined,
            ...(customer?.id != null ? { magentoCustomerId: customer.id } : {}),
            requestDetails: note.trim() || undefined,
            requestedDate: isScheduleVideoCall ? date || undefined : undefined,
            selectedTimeSlot: isScheduleVideoCall ? (selectedSlot ?? undefined) : undefined,
            sourcePage:
              typeof window !== "undefined" ? window.location.pathname : getProductHref(product),
            consentAccepted: true,
            workflowStatus: "New",
            uploadedImage: allowImageUpload && referenceImage ? referenceImage : undefined,
          });

          onSubmitSuccess(
            isScheduleVideoCall ? config.successToast.title : "Request submitted",
          );
          handleClose();
        } catch {
          onSubmitError(
            isScheduleVideoCall ? "Could not schedule video call" : "Could not submit request",
          );
        } finally {
          setIsSubmitting(false);
        }
      })();
    });
  };

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="flex flex-col gap-6 px-4 pt-6 lg:px-6 lg:pt-10">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">
                {formTitle}
              </h2>
              <button
                type="button"
                onClick={handleClose}
                aria-label={config.closeAriaLabel}
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
              alt={product.name}
              width={206}
              height={133}
              className="h-133 w-206 object-contain"
              sizes="206px"
            />
            <p className="font-gill text-base leading-110 text-darkblack">{product.name}</p>
          </div>

          <div className="flex flex-col gap-6 pb-72">
            <AppointmentContactFields
              idPrefix={config.idPrefix}
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
              onSelectedSlotChange={config.showTimeSlots ? setSelectedSlot : undefined}
              errors={errors}
              showError={showError}
              markTouched={markTouched}
              showDate={!isPersonalise && config.showTimeSlots}
              showTimeSlots={config.showTimeSlots}
              nameLabel={nameLabel}
              namePlaceholder={namePlaceholder}
              phoneLabel={phoneLabel}
              phonePlaceholder={phonePlaceholder}
              emailLabel={emailLabel}
              emailPlaceholder={emailPlaceholder}
              dateLabel={dateLabel}
              noteLabel={notesLabel}
              notePlaceholder={notesPlaceholder}
              noteLabelClassName={config.noteLabelClassName}
              noteTextareaClassName={config.noteTextareaClassName}
              labelClassName={appointmentLabelClassName}
              fieldClassName={appointmentFieldClassName}
            />

            {allowImageUpload ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                  <Info size={24} strokeWidth={1.25} aria-hidden className="shrink-0 text-darkblack" />
                  <p className="font-gill text-base font-light leading-110 text-darkblack">
                    Do you have any reference image? (Optional)
                  </p>
                </div>
                <input
                  ref={referenceImageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleReferenceImageChange}
                  className="sr-only"
                  aria-label="Attach reference image"
                />

                {referenceImagePreviewUrl ? (
                  <div className="flex items-center gap-3">
                    <div className="relative size-16 shrink-0">
                      <div className="size-full overflow-hidden bg-[#F2F2F2]">
                        <img
                          src={referenceImagePreviewUrl}
                          alt={
                            referenceImageName
                              ? `Preview of ${referenceImageName}`
                              : "Reference image preview"
                          }
                          className="size-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={clearReferenceImage}
                        aria-label="Remove reference image"
                        className="absolute -right-2 -top-2 z-10 inline-flex size-6 items-center justify-center rounded-full bg-darkblack text-white shadow-sm"
                      >
                        <X size={14} strokeWidth={2} aria-hidden className="text-white" />
                      </button>
                    </div>
                    <div className="flex min-w-0 flex-col gap-1">
                      <p className="truncate font-gill text-sm font-light leading-110 text-darkblack">
                        {referenceImageName}
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => referenceImageInputRef.current?.click()}
                          className="text-link-underline inline-flex w-fit border-b-[1.5px] border-darkblack pb-1 font-gill text-sm leading-110 text-darkblack"
                        >
                          Replace Image
                        </button>
                        <button
                          type="button"
                          onClick={clearReferenceImage}
                          className="text-link-underline inline-flex w-fit border-b-[1.5px] border-darkblack pb-1 font-gill text-sm leading-110 text-darkblack"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => referenceImageInputRef.current?.click()}
                    className="text-link-underline inline-flex w-fit border-b-[1.5px] border-darkblack pb-1 font-gill text-sm leading-110 text-darkblack"
                  >
                    Attach Image
                  </button>
                )}
              </div>
            ) : null}
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
          className="uppercase disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "SUBMITTING..." : submitLabel}
        </DetailDarkButton>
      </PanelFooter>
    </>
  );
};

const ProductAppointmentPanel = ({
  open,
  onClose,
  product,
  variant,
}: ProductAppointmentPanelProps) => {
  const { toast } = useToast();
  const config = PRODUCT_APPOINTMENT_PANEL_CONFIG[variant];
  const productImage = product.image || product.images[0];
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

  const handleLegacySuccess = (message: string) => {
    if (variant === "personalise") {
      showStatusToast(message);
      return;
    }

    toast(config.successToast);
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
        onClose={onClose}
        overlayAriaLabel={config.closeAriaLabel}
        dialogAriaLabel={config.dialogAriaLabel}
      >
        <ProductAppointmentForm
          config={config}
          product={product}
          productImage={productImage}
          variant={variant}
          open={open}
          onClose={onClose}
          onSubmitSuccess={handleLegacySuccess}
          onSubmitError={showStatusToast}
        />
      </ProductDetailSidePanelShell>
    </>
  );
};

export default ProductAppointmentPanel;
