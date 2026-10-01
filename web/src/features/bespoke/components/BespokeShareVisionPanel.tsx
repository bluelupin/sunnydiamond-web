"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useAppStatusToastController } from "@/shared/hooks/useAppStatusToastController";
import { useAppointmentFormValidation } from "@/shared/hooks/use-appointment-form-validation";
import ShareYourVisionFields from "@/shared/ui/ShareYourVisionFields";
import {
  appointmentFieldClassName,
  appointmentLabelClassName,
} from "@/shared/constants/appointmentForm";
import { PanelFooter } from "@/shared/ui/PanelFooter";
import { RIGHT_PANEL_HEADER_PADDING_CLASS } from "@/shared/ui/rightPanel";
import { RightPanelCloseButton } from "@/shared/ui/RightPanelCloseButton";
import { cn } from "@/shared/utils/cn";
import { DetailDarkButton, DetailTextLink } from "@/features/products/components/detail/shared";
import { ProductDetailSidePanelShell } from "@/features/products/components/detail/ProductDetailSidePanelShell";
import { createBespokeSubmission } from "@/services/bespoke/bespoke-submission.service";
import type { NormalizedBespokeCustomDesignForm } from "@/services/bespoke/contact-bespoke-page.types";
import {
  formatBespokeSubmissionError,
  parseBespokeSubmissionFieldErrors,
} from "@/features/bespoke/utils/formatBespokeSubmissionError";
import { wishlistMovedToastDurationMs } from "@/features/wishlist/data/content";
import FormFieldError from "@/shared/ui/FormFieldError";
import type { AppointmentContactField } from "@/shared/utils/formValidation";
import BespokeReferenceFileIcon from "@/assets/Icons/BespokeReferenceFileIcon";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiFieldErrors, setApiFieldErrors] = useState<
    Partial<Record<AppointmentContactField, string>>
  >({});
  const [referenceImageError, setReferenceImageError] = useState<string | null>(null);
  const { show: showStatusToast, node: statusToast } = useAppStatusToastController(
    wishlistMovedToastDurationMs,
  );
  const referenceImageInputRef = useRef<HTMLInputElement>(null);

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

  const displayErrors = useMemo(
    () => ({ ...errors, ...apiFieldErrors }),
    [apiFieldErrors, errors],
  );

  const showFieldError = useCallback(
    (field: AppointmentContactField) => Boolean(apiFieldErrors[field]) || showError(field),
    [apiFieldErrors, showError],
  );

  const clearApiFieldError = useCallback((field: AppointmentContactField) => {
    setApiFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }, []);

  const clearReferenceImage = () => {
    setReferenceImage(null);
    setReferenceImageName(null);
    setReferenceImageError(null);
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
    setApiFieldErrors({});
    setReferenceImageError(null);
    resetValidation();
  };

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
        } catch (error) {
          const { fieldErrors, referenceImageError: imageError } =
            parseBespokeSubmissionFieldErrors(error);

          if (Object.keys(fieldErrors).length > 0) {
            setApiFieldErrors(fieldErrors);
            return;
          }

          if (imageError) {
            setReferenceImageError(imageError);
            return;
          }

          showStatusToast(formatBespokeSubmissionError(error));
        } finally {
          setIsSubmitting(false);
        }
      })();
    });
  };

  const handleReferenceImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (file && file.size > MAX_REFERENCE_IMAGE_BYTES) {
      setReferenceImageError("Image must be 5 MB or smaller");
      if (referenceImageInputRef.current) {
        referenceImageInputRef.current.value = "";
      }
      return;
    }

    setReferenceImage(file);
    setReferenceImageName(file?.name ?? null);
    setReferenceImageError(null);
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
        overlayAriaLabel={form.dialogAriaLabel}
        dialogAriaLabel={form.dialogAriaLabel}
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain DrawerVerticleScrollbar">
            <div className={cn("flex flex-col gap-6", RIGHT_PANEL_HEADER_PADDING_CLASS)}>
              <div className="flex flex-col gap-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-3">
                    <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">
                      {form.title}
                    </h2>
                    {form.description ? (
                      <p className="font-gill text-base font-light leading-110 text-darkblack">
                        {form.description}
                      </p>
                    ) : null}
                  </div>
                  <RightPanelCloseButton onClick={handleClose} aria-label={form.dialogAriaLabel} />
                </div>
                <div className="h-px w-full bg-neutral300" aria-hidden />
              </div>

              <div className="flex flex-col gap-4 pb-72 test">
                <ShareYourVisionFields
                  idPrefix="bespoke-share-vision"
                  name={name}
                  countryCode={countryCode}
                  phone={phone}
                  email={email}
                  date=""
                  note={note}
                  onNameChange={(value) => {
                    clearApiFieldError("name");
                    setName(value);
                  }}
                  onCountryCodeChange={(value) => {
                    clearApiFieldError("phone");
                    setCountryCode(value);
                  }}
                  onPhoneChange={(value) => {
                    clearApiFieldError("phone");
                    setPhone(value);
                  }}
                  onEmailChange={(value) => {
                    clearApiFieldError("email");
                    setEmail(value);
                  }}
                  onDateChange={() => undefined}
                  onNoteChange={(value) => {
                    clearApiFieldError("note");
                    setNote(value);
                  }}
                  errors={displayErrors}
                  showError={showFieldError}
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
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden className="size-6 shrink-0 text-darkblack" >
                      <path d="M9.375 9.375C9.54076 9.375 9.69973 9.44085 9.81694 9.55806C9.93415 9.67527 10 9.83424 10 10V13.125C10 13.2908 10.0658 13.4497 10.1831 13.5669C10.3003 13.6842 10.4592 13.75 10.625 13.75" stroke="#0A0A0A" strokeWidth="0.9375" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9.6875 7.34375C10.119 7.34375 10.4688 6.99397 10.4688 6.5625C10.4688 6.13103 10.119 5.78125 9.6875 5.78125C9.25603 5.78125 8.90625 6.13103 8.90625 6.5625C8.90625 6.99397 9.25603 7.34375 9.6875 7.34375Z" fill="#0A0A0A" />
                      <path d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z" stroke="#0A0A0A" strokeWidth="0.9375" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
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

                  {referenceImageName ? (
                    <div className="mt-[3px] flex min-w-0 flex-wrap items-center gap-4">
                      <div className="flex min-w-0 items-center gap-2">
                        <BespokeReferenceFileIcon className="h-[21.33px] w-5 shrink-0 text-darkblack" />
                        <p className="min-w-0 truncate font-gill text-sm font-light leading-110 text-darkblack">
                          {referenceImageName}
                        </p>
                      </div>
                      <DetailTextLink onClick={clearReferenceImage}>
                        Remove
                      </DetailTextLink>
                    </div>
                  ) : (
                    <DetailTextLink onClick={() => referenceImageInputRef.current?.click()}>
                      {form.referenceImageButtonText}
                    </DetailTextLink>
                  )}
                  <FormFieldError
                    id="bespoke-reference-image-error"
                    message={referenceImageError ?? undefined}
                  />
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
              disabled={isSubmitting || !isValid}
              className="w-full border-darkblack disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "SUBMITTING..." : form.submitButtonText}
            </DetailDarkButton>
          </PanelFooter>
        </div>
      </ProductDetailSidePanelShell>
    </>
  );
};

export default BespokeShareVisionPanel;
