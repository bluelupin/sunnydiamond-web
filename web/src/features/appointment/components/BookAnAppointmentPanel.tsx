"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Calendar, ChevronDown, ChevronLeft } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { useToast } from "@/shared/hooks/use-toast";
import {
  APPOINTMENT_COUNTRY_CODES,
  APPOINTMENT_TIME_SLOTS,
} from "@/shared/constants/appointmentForm";

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
  };

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim()) {
      return;
    }

    toast({
      title: "Appointment requested",
      description: "Our representative will get in touch with you soon.",
    });
    onClose?.();
  };

  if (variant === "modal" && !open) {
    return null;
  }

  const formContent = (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className={cn(variant === "page" ? "mx-auto w-full max-w-[480px] px-4 pt-8 lg:px-8 lg:pt-10" : "px-4 pt-6")}>
          <div className="flex flex-col gap-7">
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
                <h1 className="font-larken text-24 font-light leading-110 text-darkblack">
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
                    src="/images/navigation/menu-close.svg"
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

          <div className="mt-[22px] flex flex-col gap-6 pb-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="appointment-name" className={labelClassName}>
                Your Name*
              </label>
              <input
                id="appointment-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                className={fieldClassName}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="appointment-phone" className={labelClassName}>
                Phone No.*
              </label>
              <div className="flex h-14 w-full items-center gap-3 bg-[#F2F2F2] px-3">
                <div className="relative flex shrink-0 items-center gap-2">
                  <select
                    value={countryCode}
                    onChange={(event) => setCountryCode(event.target.value)}
                    aria-label="Country code"
                    className="appearance-none bg-transparent pr-5 font-gill text-sm leading-110 text-darkblack outline-none"
                  >
                    {APPOINTMENT_COUNTRY_CODES.map((entry) => (
                      <option key={entry.code} value={entry.code}>
                        {entry.code}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={20}
                    strokeWidth={1.5}
                    aria-hidden
                    className="pointer-events-none absolute right-0 text-darkblack"
                  />
                </div>
                <input
                  id="appointment-phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  autoComplete="tel-national"
                  className="min-w-0 flex-1 bg-transparent font-gill text-sm leading-110 text-darkblack outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="appointment-email" className={labelClassName}>
                Email
              </label>
              <input
                id="appointment-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter"
                autoComplete="email"
                className={fieldClassName}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="appointment-date" className={labelClassName}>
                Date
              </label>
              <div className="relative flex h-14 w-full items-center bg-[#F2F2F2] px-3">
                <input
                  id="appointment-date"
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className={cn(
                    "min-w-0 flex-1 bg-transparent font-gill text-sm leading-110 outline-none [color-scheme:light]",
                    date ? "text-darkblack" : "text-neutral400",
                  )}
                />
                <Calendar size={24} strokeWidth={1.25} aria-hidden className="shrink-0 text-darkblack" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className={labelClassName}>Time Slots</span>
              <div className="flex flex-col gap-3">
                {Array.from({ length: APPOINTMENT_TIME_SLOTS.length / 2 }, (_, row) => (
                  <div key={row} className="flex gap-2">
                    {[APPOINTMENT_TIME_SLOTS[row * 2], APPOINTMENT_TIME_SLOTS[row * 2 + 1]].map((slot) => {
                      const isSelected = selectedSlot === slot;

                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(isSelected ? null : slot)}
                          className={cn(
                            "flex h-14 min-w-0 flex-1 items-center justify-center px-6 py-3 font-gill text-base leading-110",
                            isSelected
                              ? "bg-[#DECAA0] font-normal text-darkblack"
                              : "bg-[#F2F2F2] font-light text-darkblack",
                          )}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="appointment-note" className={labelClassName}>
                Describe more about your visit
              </label>
              <textarea
                id="appointment-note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Enter"
                rows={4}
                className="h-[100px] w-full resize-none bg-[#F2F2F2] p-3 font-gill text-sm leading-110 text-darkblack placeholder:text-[#999999] outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="shrink-0">
        <div className="pointer-events-none h-[71px] bg-gradient-to-b from-transparent to-white" aria-hidden />
        <div
          className={cn(
            "flex flex-col items-center gap-4 border-t border-neutral300/50 bg-white px-4 py-6",
            variant === "page" && "mx-auto w-full max-w-[480px] lg:px-8",
          )}
        >
          <p className="text-center font-gill text-sm font-light leading-normal tracking-[0.252px] text-[#4D4D4D]">
            Our representative will get in touch with you soon
          </p>
          <div className="flex w-full items-center gap-0">
            <button
              type="button"
              onClick={handleClear}
              className="flex h-14 flex-1 items-center justify-center border border-neutral300 font-gill text-sm uppercase leading-110 text-darkblack"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!name.trim() || !phone.trim()}
              className="flex h-14 flex-1 items-center justify-center bg-darkblack font-gill text-sm uppercase leading-110 text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
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
        className="absolute inset-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-[10px] animate-in fade-in duration-300"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Book an appointment"
        className={cn(
          "absolute flex flex-col overflow-hidden bg-white shadow-2xl",
          "inset-x-0 bottom-0 top-12 max-lg:animate-in max-lg:slide-in-from-bottom max-lg:duration-300",
          "lg:inset-x-auto lg:inset-y-0 lg:right-0 lg:top-0 lg:w-full lg:max-w-[480px] lg:animate-in lg:slide-in-from-right lg:duration-300",
        )}
      >
        {formContent}
      </aside>
    </div>
  );
};

export default BookAnAppointmentPanel;
