"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import { Calendar, ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { useToast } from "@/shared/hooks/use-toast";
import {
  APPOINTMENT_COUNTRY_CODES,
  APPOINTMENT_TIME_SLOTS,
  appointmentFieldClassName,
  appointmentLabelClassName,
} from "@/shared/constants/appointmentForm";
import type { Product } from "@/features/products/data/products";

type ScheduleVideoCallPanelProps = {
  open: boolean;
  onClose: () => void;
  product: Product;
};

type ScheduleVideoCallFormProps = {
  productName: string;
  productImage: string | StaticImageData;
  onClose: () => void;
  onSubmit: () => void;
};

const ScheduleVideoCallForm = ({
  productName,
  productImage,
  onClose,
  onSubmit,
}: ScheduleVideoCallFormProps) => {
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim()) {
      return;
    }
    onSubmit();
  };

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="flex flex-col gap-7 px-4 pt-6 lg:px-8 lg:pt-8">
          <div className="flex flex-col gap-7">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-larken text-24 font-light leading-110 text-darkblack">
                Schedule a Video call
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close schedule video call panel"
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
            <div className="relative h-[133px] w-[206px]">
              <Image
                src={productImage}
                alt={productName}
                fill
                className="object-contain"
                sizes="206px"
              />
            </div>
            <p className="font-gill text-base leading-110 text-darkblack">{productName}</p>
          </div>

          <div className="flex flex-col gap-6 pb-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="video-call-name" className={appointmentLabelClassName}>
                Your Name*
              </label>
              <input
                id="video-call-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                className={cn(
                  appointmentFieldClassName,
                  "border border-transparent focus:border-darkblack",
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="video-call-phone" className={appointmentLabelClassName}>
                Phone No.*
              </label>
              <div className="flex h-14 w-full items-center gap-2 bg-[#F2F2F2] px-3">
                <div className="relative flex shrink-0 items-center">
                  <select
                    value={countryCode}
                    onChange={(event) => setCountryCode(event.target.value)}
                    aria-label="Country code"
                    className="appearance-none bg-transparent pr-5 font-gill text-base leading-110 text-darkblack outline-none"
                  >
                    {APPOINTMENT_COUNTRY_CODES.map((entry) => (
                      <option key={entry.code} value={entry.code}>
                        {entry.code}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    strokeWidth={1.5}
                    aria-hidden
                    className="pointer-events-none absolute right-0 text-darkblack"
                  />
                </div>
                <input
                  id="video-call-phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  autoComplete="tel-national"
                  className="min-w-0 flex-1 bg-transparent font-gill text-base leading-110 text-darkblack outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="video-call-email" className={appointmentLabelClassName}>
                Email
              </label>
              <input
                id="video-call-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter"
                autoComplete="email"
                className={appointmentFieldClassName}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="video-call-date" className={appointmentLabelClassName}>
                Date
              </label>
              <div className="relative flex h-14 w-full items-center bg-[#F2F2F2] px-3">
                <input
                  id="video-call-date"
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className={cn(
                    "min-w-0 flex-1 bg-transparent font-gill text-base leading-110 outline-none [color-scheme:light]",
                    date ? "text-darkblack" : "text-neutral400",
                  )}
                />
                <Calendar size={20} strokeWidth={1.25} aria-hidden className="shrink-0 text-darkblack" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className={appointmentLabelClassName}>Time Slots</span>
              <div className="flex flex-col gap-3">
                {Array.from({ length: APPOINTMENT_TIME_SLOTS.length / 2 }, (_, row) => (
                  <div key={row} className="flex gap-2">
                    {[APPOINTMENT_TIME_SLOTS[row * 2], APPOINTMENT_TIME_SLOTS[row * 2 + 1]].map(
                      (slot) => {
                        const isSelected = selectedSlot === slot;

                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedSlot(isSelected ? null : slot)}
                            className={cn(
                              "flex h-14 min-w-0 flex-1 items-center justify-center px-3 font-gill text-base leading-110",
                              isSelected
                                ? "bg-darkblack font-normal text-white"
                                : "bg-[#F2F2F2] font-light text-darkblack",
                            )}
                          >
                            {slot}
                          </button>
                        );
                      },
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="video-call-note" className="font-gill text-sm leading-110 text-darkblack">
                Describe more about your visit
              </label>
              <textarea
                id="video-call-note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Eg: I am looking for an engagement ring"
                rows={4}
                className="h-[100px] w-full resize-none bg-[#F2F2F2] p-3 font-gill text-sm leading-110 text-darkblack placeholder:text-[#999999] outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="shrink-0">
        <div className="pointer-events-none h-[71px] bg-gradient-to-b from-transparent to-white" aria-hidden />
        <div className="flex flex-col items-center gap-4 border-t border-neutral300/50 bg-white px-4 py-6 lg:px-8">
          <p className="text-center font-gill text-sm font-light leading-110 tracking-[0.252px] text-neutral500">
            Our representative will get in touch with you soon
          </p>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!name.trim() || !phone.trim()}
            className="btn-slide-up inline-flex h-14 w-full items-center justify-center bg-darkblack px-7 font-gill text-sm uppercase leading-110 text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Schedule a Videocall
          </button>
        </div>
      </div>
    </>
  );
};

const ScheduleVideoCallPanel = ({ open, onClose, product }: ScheduleVideoCallPanelProps) => {
  const { toast } = useToast();
  const productImage = product.images[0] ?? product.image;

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const handleSubmit = () => {
    toast({
      title: "Video call scheduled",
      description: "Our team will confirm your appointment shortly.",
    });
    onClose();
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Close schedule video call panel"
        className="absolute inset-0 bg-[rgba(30,30,30,0.3)] backdrop-blur-[10px] animate-in fade-in duration-300"
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Schedule a Video call"
        className={cn(
          "absolute flex flex-col bg-white shadow-2xl",
          "inset-x-0 bottom-0 top-12 max-lg:animate-in max-lg:slide-in-from-bottom max-lg:duration-300",
          "lg:inset-x-auto lg:inset-y-0 lg:right-0 lg:top-0 lg:w-full lg:max-w-[480px] lg:animate-in lg:slide-in-from-right lg:duration-300",
        )}
      >
        <ScheduleVideoCallForm
          productName={product.name}
          productImage={productImage}
          onClose={onClose}
          onSubmit={handleSubmit}
        />
      </aside>
    </div>
  );
};

export default ScheduleVideoCallPanel;
