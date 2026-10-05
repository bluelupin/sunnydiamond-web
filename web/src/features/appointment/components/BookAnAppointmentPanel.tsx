"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { useToast } from "@/shared/hooks/use-toast";
import { useAppointmentFormValidation } from "@/shared/hooks/use-appointment-form-validation";
import AppointmentContactFields from "@/shared/ui/AppointmentContactFields";
import { PanelFooter } from "@/shared/ui/PanelFooter";
import { RIGHT_PANEL_HEADER_PADDING_CLASS } from "@/shared/ui/rightPanel";
import { RightPanelCloseButton } from "@/shared/ui/RightPanelCloseButton";
import { ProductDetailSidePanelShell } from "@/features/products/components/detail/ProductDetailSidePanelShell";
import { getProductFormByTag } from "@/services/forms/product-form.service";
import type { NormalizedProductForm } from "@/services/forms/product-form.types";

const TRY_AT_HOME_FORM_TAG = "try-at-home-form";

const labelClassName = "font-gill text-sm leading-110 text-darkblack";
const fieldClassName =
  "h-14 w-full bg-[#F2F2F2] px-3 font-gill text-sm leading-110 text-darkblack placeholder:text-[#999999] outline-none";

type BookAnAppointmentPanelProps = {
  variant?: "embedded" | "page" | "modal";
  open?: boolean;
  onBack?: () => void;
  onClose?: () => void;
  showBack?: boolean;
  showClose?: boolean;
};

const BookAnAppointmentPanel = ({
  variant = "embedded",
  open = true,
  onBack,
  onClose,
  showBack = true,
  showClose = true,
}: BookAnAppointmentPanelProps) => {
  const { toast } = useToast();
  const [cmsForm, setCmsForm] = useState<NormalizedProductForm | null>(null);
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const formValues = useMemo(
    () => ({ name, countryCode, phone, email, date, note, selectedSlot }),
    [name, countryCode, phone, email, date, note, selectedSlot],
  );

  const validationOptions = useMemo(
    () => ({ dateRequired: true, selectedSlotRequired: true }),
    [],
  );

  const { isValid, submitted, errors, markTouched, showError, validateSubmit, resetValidation } =
    useAppointmentFormValidation(formValues, validationOptions);

  const panelActive = variant !== "modal" || open;

  useEffect(() => {
    if (!panelActive) {
      return;
    }

    const controller = new AbortController();

    void (async () => {
      try {
        const form = await getProductFormByTag(TRY_AT_HOME_FORM_TAG, controller.signal);
        if (form) {
          setCmsForm(form);
        }
      } catch {
        // Match Try at Home: keep field defaults when CMS is unavailable.
      }
    })();

    return () => controller.abort();
  }, [panelActive]);

  const handleClear = () => {
    setName("");
    setPhone("");
    setEmail("");
    setDate("");
    setSelectedSlot(null);
    setNote("");
    resetValidation();
  };

  const handleSubmit = () => {
    validateSubmit(() => {
      toast({
        title: "Appointment requested",
        description: "Our representative will get in touch with you soon.",
      });
      onClose?.();
    });
  };

  if (variant === "modal" && !open) {
    return null;
  }

  const formContent = (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto DrawerVerticleScrollbar">
        <div
          className={cn(
            variant === "page"
              ? "mx-auto w-full max-w-[480px] px-4 pt-8 lg:px-8 lg:pt-10"
              : RIGHT_PANEL_HEADER_PADDING_CLASS,
          )}
        >
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-2">
                {showBack ? (
                  <button
                    type="button"
                    onClick={onBack ?? onClose}
                    aria-label="Go back"
                    className="inline-flex size-6 shrink-0 items-center justify-center"
                  >
                    <ChevronLeft size={24} strokeWidth={1.25} aria-hidden className="text-darkblack" />
                  </button>
                ) : null}
                <h1 className="font-larken text-2xl font-light leading-110 text-darkblack">
                  Book an Appointment
                </h1>
              </div>
              {showClose ? (
                <RightPanelCloseButton
                  onClick={() => onClose?.()}
                  aria-label="Close"
                />
              ) : null}
            </div>
            <div className="h-px w-full bg-neutral300" aria-hidden />
          </div>

          <div className="mt-[22px] flex flex-col gap-6 pb-72">
            <AppointmentContactFields
              idPrefix="appointment"
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
              labelClassName={labelClassName}
              fieldClassName={fieldClassName}
              selectedSlotStyle="gold"
              namePlaceholder={cmsForm?.namePlaceholder}
              phonePlaceholder={cmsForm?.phonePlaceholder}
              emailPlaceholder={cmsForm?.emailPlaceholder ?? ""}
              dateRequired
              datePlaceholder="Select"
              timeSlotRequired
              notePlaceholder="I am looking for an engagement ring"
              noteTextareaClassName="font-gill text-sm leading-110"
            />
          </div>
        </div>
      </div>

      <PanelFooter
        contentClassName={cn(
          "flex flex-col items-center gap-4",
          variant === "page" && "mx-auto w-full max-w-[480px]",
        )}
      >
        <p className="text-center font-gill text-sm font-light leading-normal tracking-[0.252px] text-neutral500">
          Our representative will get in touch with you soon
        </p>
        <div className="flex w-full flex-col items-center gap-4 md:flex-row md:items-stretch md:gap-6">
          <button
            type="button"
            onClick={handleClear}
            className="btn-border-slide order-2 flex h-14 w-full min-w-0 items-center justify-center border border-neutral300 px-7 py-5 font-gill text-sm font-normal uppercase leading-110 text-darkblack md:order-1 md:flex-1 md:whitespace-nowrap"
          >
            Clear All
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitted && !isValid}
            className="order-1 flex h-14 w-full max-w-[343px] min-w-0 items-center justify-center bg-darkblack px-7 py-5 font-gill text-sm font-normal uppercase leading-110 text-white disabled:cursor-not-allowed disabled:opacity-50 md:order-2 md:max-w-none md:flex-[1.35] md:whitespace-nowrap"
          >
            Book an Appointment
          </button>
        </div>
      </PanelFooter>
    </>
  );

  if (variant === "embedded") {
    return (
      <div
        className="absolute inset-0 flex flex-col bg-white"
        role="dialog"
        aria-modal="true"
        aria-label="Book an appointment"
      >
        {formContent}
      </div>
    );
  }

  if (variant === "page") {
    return (
      <div className="flex min-h-[calc(100vh-64px)] flex-col bg-white pb-8">
        {formContent}
      </div>
    );
  }

  return (
    <ProductDetailSidePanelShell
      open={open}
      onClose={onClose ?? (() => undefined)}
      overlayAriaLabel="Close book an appointment"
      dialogAriaLabel="Book an appointment"
      overlayClassName="bg-[rgba(0,0,0,0.3)] backdrop-blur-[9px]"
    >
      {formContent}
    </ProductDetailSidePanelShell>
  );
};

export default BookAnAppointmentPanel;
