"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { useToast } from "@/shared/hooks/use-toast";
import { useAppointmentFormValidation } from "@/shared/hooks/use-appointment-form-validation";
import AppointmentContactFields from "@/shared/ui/AppointmentContactFields";
import { PanelFooter, PanelFooterDualActions } from "@/shared/ui/PanelFooter";

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
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const formValues = useMemo(
    () => ({ name, countryCode, phone, email, date, note }),
    [name, countryCode, phone, email, date, note],
  );

  const { isValid, submitted, errors, markTouched, showError, validateSubmit, resetValidation } =
    useAppointmentFormValidation(formValues);

  useEffect(() => {
    if (variant !== "modal" || !open) return;

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
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className={cn(variant === "page" ? "mx-auto w-full max-w-[480px] px-4 pt-8 lg:px-8 lg:pt-10" : "px-4 pt-6")}>
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
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="inline-flex size-6 shrink-0 items-center justify-center"
                >
                  <Image
                    src="/images/icons/menu-close.svg"
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
        <PanelFooterDualActions>
          <button
            type="button"
            onClick={handleClear}
            className="btn-border-slide flex h-14 min-w-0 flex-1 items-center justify-center border border-neutral300 font-gill text-sm uppercase leading-110 text-darkblack"
          >
            Clear All
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitted && !isValid}
            className="flex h-14 min-w-0 flex-1 items-center justify-center bg-darkblack font-gill text-sm uppercase leading-110 text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Apply Filters
          </button>
        </PanelFooterDualActions>
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
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Close book an appointment"
        className="absolute inset-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-[9px] animate-in fade-in duration-300"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Book an appointment"
        className={cn(
          "absolute flex flex-col overflow-hidden bg-white shadow-2xl",
          "inset-x-0 bottom-0 top-12 max-md:animate-in max-md:slide-in-from-bottom max-md:duration-300",
          "md:inset-x-auto md:inset-y-0 md:right-0 md:top-0 md:w-full md:max-w-[480px] md:animate-in md:slide-in-from-right md:duration-300",
        )}
      >
        {formContent}
      </aside>
    </div>
  );
};

export default BookAnAppointmentPanel;
