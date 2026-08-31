"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Check, Info, X } from "lucide-react";
import { useAppointmentFormValidation } from "@/shared/hooks/use-appointment-form-validation";
import ShareYourVisionFields from "@/shared/ui/ShareYourVisionFields";
import {
  appointmentFieldClassName,
  appointmentLabelClassName,
} from "@/shared/constants/appointmentForm";
import { PanelFooter } from "@/shared/ui/PanelFooter";
import { DetailDarkButton, DetailTextLink } from "@/features/products/components/detail/shared";
import { ProductDetailSidePanelShell } from "@/features/products/components/detail/ProductDetailSidePanelShell";
import { createBespokeSubmission } from "@/services/bespoke/bespoke-submission.service";
import type { NormalizedBespokeCustomDesignForm } from "@/services/bespoke/contact-bespoke-page.types";
import { wishlistMovedToastDurationMs } from "@/features/wishlist/data/content";

const MAX_REFERENCE_IMAGE_BYTES = 5 * 1024 * 1024;

type BespokeShareVisionPanelProps = {
  open: boolean;
  onClose: () => void;
  form: NormalizedBespokeCustomDesignForm;
};

const BespokeShareVisionPanel = ({ open, onClose, form }: BespokeShareVisionPanelProps) => {
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [referenceImageName, setReferenceImageName] = useState<string | null>(null);
  const [referenceImagePreviewUrl, setReferenceImagePreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusToastMessage, setStatusToastMessage] = useState<string | null>(null);
  const referenceImageInputRef = useRef<HTMLInputElement>(null);
  const referenceImagePreviewUrlRef = useRef<string | null>(null);
  const statusToastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const formValues = useMemo(
    () => ({ name, countryCode, phone, email, date: "", note }),
    [name, countryCode, phone, email, note],
  );

  const validationOptions = useMemo(
    () => ({ noteRequired: true, emailRequired: true }),
    [],
  );

  const { isValid, submitted, errors, markTouched, showError, validateSubmit, resetValidation } =
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
    setNote("");
    clearReferenceImage();
    setIsSubmitting(false);
    resetValidation();
  };

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
      if (referenceImagePreviewUrlRef.current) {
        URL.revokeObjectURL(referenceImagePreviewUrlRef.current);
        referenceImagePreviewUrlRef.current = null;
      }
      if (statusToastTimeoutRef.current) {
        clearTimeout(statusToastTimeoutRef.current);
      }
    };
  }, []);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    validateSubmit(() => {
      void (async () => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
          await createBespokeSubmission({
            fullName: name.trim(),
            phone: `${countryCode} ${phone}`.trim(),
            email: email.trim(),
            designVision: note.trim(),
            referenceImage,
          });

          showStatusToast(form.successToast.title);
          handleClose();
        } catch {
          showStatusToast("Could not submit request");
        } finally {
          setIsSubmitting(false);
        }
      })();
    });
  };

  const handleReferenceImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (file && file.size > MAX_REFERENCE_IMAGE_BYTES) {
      showStatusToast("Image must be 5 MB or smaller");
      if (referenceImageInputRef.current) {
        referenceImageInputRef.current.value = "";
      }
      return;
    }

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
        overlayAriaLabel={form.dialogAriaLabel}
        dialogAriaLabel={form.dialogAriaLabel}
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className="flex flex-col gap-6 px-4 pt-6 lg:px-6 lg:pt-10">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">
                  {form.title}
                </h2>
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label={form.dialogAriaLabel}
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
              </div>
              <div className="h-px w-full bg-neutral300" aria-hidden />
            </div>

            <div className="flex flex-col gap-6 pb-72">
              <ShareYourVisionFields
                idPrefix="bespoke-share-vision"
                name={name}
                countryCode={countryCode}
                phone={phone}
                email={email}
                date=""
                note={note}
                onNameChange={setName}
                onCountryCodeChange={setCountryCode}
                onPhoneChange={setPhone}
                onEmailChange={setEmail}
                onDateChange={() => undefined}
                onNoteChange={setNote}
                errors={errors}
                showError={showError}
                markTouched={markTouched}
                showDate={false}
                showTimeSlots={false}
                nameLabel={form.fullNameLabel}
                emailLabel={form.emailLabel}
                noteLabel={form.visionLabel}
                noteLabelClassName={appointmentLabelClassName}
                noteTextareaClassName="font-gill text-base leading-110"
                labelClassName={appointmentLabelClassName}
                fieldClassName={appointmentFieldClassName}
              />

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                  <Info size={24} strokeWidth={1.25} aria-hidden className="shrink-0 text-darkblack" />
                  <p className="font-gill text-base font-light leading-110 text-darkblack">
                    {form.referenceImagePrompt}
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
                  <div className="mt-[3px] flex items-center gap-3">
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
                        <DetailTextLink
                          onClick={() => referenceImageInputRef.current?.click()}
                        >
                          Replace Image
                        </DetailTextLink>
                        <DetailTextLink
                          onClick={clearReferenceImage}
                        >
                          Remove
                        </DetailTextLink>
                      </div>
                    </div>
                  </div>
                ) : (
                  <DetailTextLink onClick={() => referenceImageInputRef.current?.click()}>
                    {form.referenceImageButtonText}
                  </DetailTextLink>
                )}
              </div>
            </div>
          </div>
        </div>

        <PanelFooter contentClassName="flex flex-col items-center gap-4">
          <p className="text-center font-gill text-sm font-light leading-normal tracking-normal text-neutral500">
            {form.helperText}
          </p>
          <DetailDarkButton
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || (submitted && !isValid)}
            className="w-full border-darkblack disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "SUBMITTING..." : form.submitButtonText}
          </DetailDarkButton>
        </PanelFooter>
      </ProductDetailSidePanelShell>
    </>
  );
};

export default BespokeShareVisionPanel;
