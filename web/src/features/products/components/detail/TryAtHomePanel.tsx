"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import { Calendar, ChevronDown, ChevronLeft, SlidersHorizontal } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { useToast } from "@/shared/hooks/use-toast";
import {
  APPOINTMENT_COUNTRY_CODES,
  APPOINTMENT_TIME_SLOTS,
  appointmentFieldClassName,
  appointmentLabelClassName,
} from "@/shared/constants/appointmentForm";
import type { Product } from "@/features/products/data/products";
import { TRY_AT_HOME_INDIAN_STATES } from "@/features/products/data/tryAtHomeContent";
import { useCurrentLocationAddress } from "@/shared/hooks/use-current-location-address";
import { DetailDarkButton } from "./shared";

type TryAtHomePanelProps = {
  open: boolean;
  onClose: () => void;
  product: Product;
};

type TryAtHomeStep = "details" | "address";

type TryAtHomeDetailsStepProps = {
  productName: string;
  productImage: string | StaticImageData;
  onClose: () => void;
  onProceed: () => void;
};

const TryAtHomeDetailsStep = ({
  productName,
  productImage,
  onClose,
  onProceed,
}: TryAtHomeDetailsStepProps) => {
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const handleProceed = () => {
    if (!name.trim() || !phone.trim()) {
      return;
    }
    onProceed();
  };

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="flex flex-col gap-7 px-4 pt-6 lg:px-8 lg:pt-8">
          <div className="flex flex-col gap-7">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-larken text-24 font-light leading-110 text-darkblack">Try At Home</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close try at home panel"
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
              <label htmlFor="try-at-home-name" className={appointmentLabelClassName}>
                Your Name*
              </label>
              <input
                id="try-at-home-name"
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
              <label htmlFor="try-at-home-phone" className={appointmentLabelClassName}>
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
                  id="try-at-home-phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  autoComplete="tel-national"
                  className="min-w-0 flex-1 bg-transparent font-gill text-base leading-110 text-darkblack outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="try-at-home-email" className={appointmentLabelClassName}>
                Email
              </label>
              <input
                id="try-at-home-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter"
                autoComplete="email"
                className={appointmentFieldClassName}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="try-at-home-date" className={appointmentLabelClassName}>
                Date
              </label>
              <div className="relative flex h-14 w-full items-center bg-[#F2F2F2] px-3">
                <input
                  id="try-at-home-date"
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
              <label htmlFor="try-at-home-note" className={appointmentLabelClassName}>
                What are you looking for?
              </label>
              <textarea
                id="try-at-home-note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Eg: I am looking for an engagement ring"
                rows={4}
                className="h-[100px] w-full resize-none bg-[#F2F2F2] p-3 font-gill text-base leading-110 text-darkblack placeholder:text-[#999999] outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="shrink-0">
        <div className="pointer-events-none h-[71px] bg-gradient-to-b from-transparent to-white" aria-hidden />
        <div className="flex flex-col items-center gap-4 border-t border-neutral300/50 bg-white px-4 py-6 lg:px-8">
          <p className="text-center font-gill text-sm font-light leading-normal tracking-[0.252px] text-[#4D4D4D]">
            Our representative will get in touch with you soon
          </p>
          <DetailDarkButton onClick={handleProceed} disabled={!name.trim() || !phone.trim()}>
            Add Address
          </DetailDarkButton>
        </div>
      </div>
    </>
  );
};

type TryAtHomeAddressStepProps = {
  onBack: () => void;
  onSubmit: () => void;
};

const TryAtHomeAddressStep = ({ onBack, onSubmit }: TryAtHomeAddressStepProps) => {
  const { detectAddress, isLocating } = useCurrentLocationAddress();
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const handleUseCurrentLocation = async () => {
    const address = await detectAddress();
    if (!address) {
      return;
    }

    setAddressLine1(address.addressLine1);
    setAddressLine2(address.addressLine2);
    setPincode(address.pincode);
    setCity(address.city);
    setState(address.state);
  };

  const handleSubmit = () => {
    if (!addressLine1.trim() || !pincode.trim() || !city.trim() || !state) {
      return;
    }
    onSubmit();
  };

  const isValid =
    addressLine1.trim().length > 0 &&
    pincode.trim().length > 0 &&
    city.trim().length > 0 &&
    state.length > 0;

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="flex flex-col gap-6 px-4 pt-6 lg:px-8 lg:pt-8">
          <div className="flex flex-col gap-7">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-2">
                <button
                  type="button"
                  onClick={onBack}
                  aria-label="Back to try at home details"
                  className="inline-flex size-6 shrink-0 items-center justify-center"
                >
                  <ChevronLeft size={24} strokeWidth={1.25} aria-hidden className="text-darkblack" />
                </button>
                <h2 className="font-larken text-24 font-light leading-110 text-darkblack">Try At Home</h2>
              </div>
              <SlidersHorizontal size={32} strokeWidth={1.25} aria-hidden className="shrink-0 text-darkblack" />
            </div>
            <div className="h-px w-full bg-neutral300" aria-hidden />
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="inline-flex border-b-[1.5px] border-darkblack pb-1 font-gill text-sm leading-110 text-darkblack disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLocating ? "DETECTING LOCATION..." : "USE CURRENT LOCATION"}
            </button>
          </div>

          <div className="flex flex-col gap-6 pb-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="try-at-home-address-line-1" className={appointmentLabelClassName}>
                Address Line 1
              </label>
              <input
                id="try-at-home-address-line-1"
                type="text"
                value={addressLine1}
                onChange={(event) => setAddressLine1(event.target.value)}
                placeholder="Enter"
                autoComplete="address-line1"
                className={appointmentFieldClassName}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="try-at-home-address-line-2" className={appointmentLabelClassName}>
                Address Line 2 (Optional)
              </label>
              <input
                id="try-at-home-address-line-2"
                type="text"
                value={addressLine2}
                onChange={(event) => setAddressLine2(event.target.value)}
                placeholder="Enter"
                autoComplete="address-line2"
                className={appointmentFieldClassName}
              />
            </div>

            <div className="flex gap-6">
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <label htmlFor="try-at-home-pincode" className={appointmentLabelClassName}>
                  Pincode
                </label>
                <input
                  id="try-at-home-pincode"
                  type="text"
                  inputMode="numeric"
                  value={pincode}
                  onChange={(event) => setPincode(event.target.value)}
                  placeholder="Enter"
                  autoComplete="postal-code"
                  className={appointmentFieldClassName}
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <label htmlFor="try-at-home-city" className={appointmentLabelClassName}>
                  City
                </label>
                <input
                  id="try-at-home-city"
                  type="text"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  placeholder="Enter"
                  autoComplete="address-level2"
                  className={appointmentFieldClassName}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="try-at-home-state" className={appointmentLabelClassName}>
                State
              </label>
              <div className="relative flex h-14 w-full items-center bg-[#F2F2F2] px-3">
                <select
                  id="try-at-home-state"
                  value={state}
                  onChange={(event) => setState(event.target.value)}
                  className={cn(
                    "min-w-0 flex-1 appearance-none bg-transparent font-gill text-base leading-110 outline-none",
                    state ? "text-darkblack" : "text-neutral400",
                  )}
                >
                  <option value="">-select-</option>
                  {TRY_AT_HOME_INDIAN_STATES.map((entry) => (
                    <option key={entry} value={entry}>
                      {entry}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={20}
                  strokeWidth={1.5}
                  aria-hidden
                  className="pointer-events-none shrink-0 text-darkblack"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="shrink-0">
        <div className="pointer-events-none h-[71px] bg-gradient-to-b from-transparent to-white" aria-hidden />
        <div className="flex flex-col items-center gap-4 border-t border-neutral300/50 bg-white px-4 py-6 lg:px-8">
          <p className="text-center font-gill text-sm font-light leading-normal tracking-[0.252px] text-[#4D4D4D]">
            Our representative will get in touch with you soon
          </p>
          <DetailDarkButton onClick={handleSubmit} disabled={!isValid}>
            Schedule Try At Home
          </DetailDarkButton>
        </div>
      </div>
    </>
  );
};

const TryAtHomePanel = ({ open, onClose, product }: TryAtHomePanelProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<TryAtHomeStep>("details");
  const productImage = product.images[0] ?? product.image;

  useEffect(() => {
    if (!open) {
      setStep("details");
      return;
    }

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

  const handleClose = () => {
    setStep("details");
    onClose();
  };

  const handleSubmit = () => {
    toast({
      title: "Try at home request received",
      description: "Our representative will get in touch with you soon.",
    });
    handleClose();
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Close try at home panel"
        className="absolute inset-0 bg-[rgba(30,30,30,0.3)] backdrop-blur-[10px] animate-in fade-in duration-300"
        onClick={handleClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Try At Home"
        className={cn(
          "absolute flex flex-col overflow-hidden bg-white shadow-2xl",
          "inset-x-0 bottom-0 top-12 max-lg:animate-in max-lg:slide-in-from-bottom max-lg:duration-300",
          "lg:inset-x-auto lg:inset-y-0 lg:right-0 lg:top-0 lg:w-full lg:max-w-[480px] lg:animate-in lg:slide-in-from-right lg:duration-300",
        )}
      >
        {step === "details" ? (
          <TryAtHomeDetailsStep
            productName={product.name}
            productImage={productImage}
            onClose={handleClose}
            onProceed={() => setStep("address")}
          />
        ) : (
          <TryAtHomeAddressStep onBack={() => setStep("details")} onSubmit={handleSubmit} />
        )}
      </aside>
    </div>
  );
};

export default TryAtHomePanel;
