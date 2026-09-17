"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import RingsTabIcon from "@/assets/Icons/PLP/RingsTabIcon";
import { ProductDetailSidePanelShell } from "@/features/products/components/detail/ProductDetailSidePanelShell";
import { DetailDarkButton } from "@/features/products/components/detail/shared";
import { normalizeAppointmentDateInput } from "@/features/products/utils/tryAtHomeBooking";
import { getProductFormByTag, type NormalizedProductForm } from "@/services/forms/product-form.service";
import { rescheduleCustomerAppointment } from "@/services/customer/customer-appointments.client";
import { useAppointmentFormValidation } from "@/shared/hooks/use-appointment-form-validation";
import { useMobileStickyFooterClearance } from "@/shared/hooks/use-mobile-sticky-footer-clearance";
import { usePanelInputFocusScroll } from "@/shared/hooks/use-panel-input-focus-scroll";
import AppointmentContactFields from "@/shared/ui/AppointmentContactFields";
import FormFieldError from "@/shared/ui/FormFieldError";
import { PanelFooter } from "@/shared/ui/PanelFooter";
import { RIGHT_PANEL_HEADER_PADDING_CLASS } from "@/shared/ui/rightPanel";
import { RightPanelCloseButton } from "@/shared/ui/RightPanelCloseButton";
import { cn } from "@/shared/utils/cn";
import { productNameDisplayClassName } from "@/shared/utils/productNameDisplay";
import { profileTabsContent } from "../data/profileContent";
import type { ProfileAppointmentUi } from "../types/profileUi.types";

const panelContent = profileTabsContent.appointments.reschedulePanel;

const DEFAULT_FORM_TAGS: Record<ProfileAppointmentUi["type"], string> = {
  try_at_home: "try-at-home-form",
  video_call: "product-video-call",
  store_visit: "product-store-visit",
};

type ProfileAppointmentReschedulePanelProps = {
  open: boolean;
  appointment: ProfileAppointmentUi | null;
  onClose: () => void;
  onRescheduled: () => void;
};

export function ProfileAppointmentReschedulePanel({
  open,
  appointment,
  onClose,
  onRescheduled,
}: ProfileAppointmentReschedulePanelProps) {
  const [cmsForm, setCmsForm] = useState<NormalizedProductForm | null>(null);
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const product = appointment?.products[0] ?? null;
  const timeSlots = cmsForm?.timeSlots?.length ? cmsForm.timeSlots : undefined;
  const hasTimeSlots = Boolean(timeSlots?.length ?? true);

  const formValues = useMemo(
    () => ({
      name: appointment?.customerName ?? "",
      countryCode: "+91",
      phone: appointment?.customerPhone ?? "",
      email: appointment?.customerEmail ?? "",
      date,
      note: "",
      selectedSlot,
    }),
    [appointment, date, selectedSlot],
  );

  const validationOptions = useMemo(
    () => ({
      dateRequired: true,
      selectedSlotRequired: hasTimeSlots,
    }),
    [hasTimeSlots],
  );

  const { errors, isValid, markTouched, showError, validateSubmit, resetValidation } =
    useAppointmentFormValidation(formValues, validationOptions);

  useEffect(() => {
    if (!open || !appointment) {
      return;
    }

    setDate(normalizeAppointmentDateInput(appointment.requestedDate));
    setSelectedSlot(appointment.bookingTime || null);
    setFormError(null);
    setIsSubmitting(false);
    resetValidation();
  }, [appointment, open, resetValidation]);

  useEffect(() => {
    if (!open || !appointment) {
      setCmsForm(null);
      return;
    }

    const formTag = appointment.formTag || DEFAULT_FORM_TAGS[appointment.type];
    const controller = new AbortController();

    void (async () => {
      try {
        const form = await getProductFormByTag(formTag, controller.signal);
        if (form) {
          setCmsForm(form);
        }
      } catch {
        setCmsForm(null);
      }
    })();

    return () => controller.abort();
  }, [appointment, open]);

  const { footerRef, clearancePx } = useMobileStickyFooterClearance();
  const { scrollRef, handleFocusCapture } = usePanelInputFocusScroll();

  const handleSubmit = () => {
    if (!appointment || isSubmitting) {
      return;
    }

    validateSubmit(() => {
      void (async () => {
        setFormError(null);
        setIsSubmitting(true);

        try {
          await rescheduleCustomerAppointment(appointment.id, {
            requestedDate: date,
            selectedTimeSlot: selectedSlot ?? "",
          });
          onRescheduled();
          onClose();
        } catch (error) {
          setFormError(
            error instanceof Error ? error.message : panelContent.errorToast,
          );
        } finally {
          setIsSubmitting(false);
        }
      })();
    });
  };

  if (!open || !appointment) {
    return null;
  }

  return (
    <ProductDetailSidePanelShell
      open={open}
      onClose={onClose}
      overlayAriaLabel="Close reschedule appointment panel"
      dialogAriaLabel={panelContent.title}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div
          ref={scrollRef}
          onFocusCapture={handleFocusCapture}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain DrawerVerticleScrollbar"
        >
          <div className={cn("flex flex-col gap-6", RIGHT_PANEL_HEADER_PADDING_CLASS)}>
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">
                  {panelContent.title}
                </h2>
                <RightPanelCloseButton
                  onClick={onClose}
                  aria-label="Close reschedule appointment panel"
                />
              </div>
              <div className="h-[1px] w-full bg-neutral300" aria-hidden />
            </div>

            {product ? (
              <div className="flex flex-col items-center gap-2 pb-4">
                <div className="relative h-[133px] w-[206px]">
                  {product.imageSrc ? (
                    <Image
                      src={product.imageSrc}
                      alt={product.name}
                      fill
                      className="object-contain"
                      sizes="206px"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-white">
                      <RingsTabIcon className="size-16 text-darkblack" />
                    </div>
                  )}
                </div>
                <p
                  className={cn(
                    "font-gill text-base leading-110 text-darkblack",
                    productNameDisplayClassName,
                  )}
                >
                  {product.name}
                </p>
              </div>
            ) : null}

            <div className="flex flex-col gap-6" style={{ paddingBottom: clearancePx }}>
              <AppointmentContactFields
                idPrefix="reschedule-appointment"
                name={formValues.name}
                countryCode={formValues.countryCode}
                phone={formValues.phone}
                email={formValues.email}
                date={date}
                note=""
                selectedSlot={selectedSlot}
                timeSlots={timeSlots}
                onNameChange={() => {}}
                onCountryCodeChange={() => {}}
                onPhoneChange={() => {}}
                onEmailChange={() => {}}
                onDateChange={setDate}
                onNoteChange={() => {}}
                onSelectedSlotChange={setSelectedSlot}
                errors={errors}
                showError={showError}
                markTouched={markTouched}
                showContactDetails={false}
                showDate
                showTimeSlots
                dateLabel={cmsForm?.dateLabel}
                dateRequired
                timeSlotRequired={hasTimeSlots}
              />
              <FormFieldError message={formError ?? undefined} />
            </div>
          </div>
        </div>

        <PanelFooter footerRef={footerRef} contentClassName="flex flex-col items-center gap-4">
          <p className="text-center font-gill text-sm font-light leading-normal tracking-normal text-neutral500">
            {panelContent.footerNote}
          </p>
          <DetailDarkButton
            onClick={handleSubmit}
            disabled={isSubmitting || !isValid}
            className="w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? panelContent.savingLabel : panelContent.submitLabel}
          </DetailDarkButton>
        </PanelFooter>
      </div>
    </ProductDetailSidePanelShell>
  );
}
