"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, MapPin, Phone, SlidersHorizontal, Store } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { useToast } from "@/shared/hooks/use-toast";
import { useAppointmentFormValidation } from "@/shared/hooks/use-appointment-form-validation";
import AppointmentContactFields from "@/shared/ui/AppointmentContactFields";
import {
  appointmentFieldClassName,
  appointmentLabelClassName,
} from "@/shared/constants/appointmentForm";
import {
  DELIVERY_STORE_LOCATIONS,
  DELIVERY_STORE_MAP_IMAGES,
} from "@/features/products/data/deliveryStoreContent";
import { DetailDarkButton, DetailTextLink } from "./shared";

type DeliveryStoreJourneyPanelProps = {
  open: boolean;
  onClose: () => void;
  city?: string;
};

type JourneyStep = "availability" | "booking";

const DeliveryStoreJourneyPanel = ({
  open,
  onClose,
  city = "Coimbatore",
}: DeliveryStoreJourneyPanelProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<JourneyStep>("availability");
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const store = DELIVERY_STORE_LOCATIONS[city] ?? DELIVERY_STORE_LOCATIONS.Coimbatore;

  useEffect(() => {
    if (!open) {
      setStep("availability");
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

  const formValues = useMemo(
    () => ({ name, countryCode, phone, email, date, note }),
    [name, countryCode, phone, email, date, note],
  );

  const { isValid, submitted, errors, markTouched, showError, validateSubmit } =
    useAppointmentFormValidation(formValues);

  const handleClose = () => {
    setStep("availability");
    onClose();
  };

  const handleConfirmVisit = () => {
    validateSubmit(() => {
      toast({
        title: "Visit confirmed",
        description: "Our representative will get in touch with you soon.",
      });
      handleClose();
    });
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Close store availability"
        className="absolute inset-0 bg-[rgba(30,30,30,0.3)] backdrop-blur-[10px] animate-in fade-in duration-300"
        onClick={handleClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={step === "availability" ? "In store availability" : "Book your store visit"}
        className={cn(
          "absolute flex flex-col overflow-hidden bg-white shadow-2xl",
          "inset-x-0 bottom-0 top-12 max-lg:animate-in max-lg:slide-in-from-bottom max-lg:duration-300",
          "lg:inset-x-auto lg:inset-y-0 lg:right-0 lg:top-0 lg:w-full lg:max-w-[480px] lg:animate-in lg:slide-in-from-right lg:duration-300",
        )}
      >
        {step === "availability" ? (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="px-4 pt-6 lg:px-8">
                <div className="flex flex-col gap-7">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="font-larken text-24 font-light leading-110 text-darkblack">
                      In Store Availabilty
                    </h2>
                    <SlidersHorizontal size={32} strokeWidth={1.25} aria-hidden className="shrink-0 text-darkblack" />
                  </div>
                  <div className="h-px w-full bg-neutral300" aria-hidden />
                </div>

                <div className="mt-[22px] flex flex-col gap-3 pb-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <Store size={24} strokeWidth={1.25} aria-hidden className="shrink-0 text-darkblack" />
                    <p className="font-gill text-base font-light leading-110 text-darkblack">
                      Available now at nearest store
                    </p>
                    <span className="inline-flex border-b-[1.5px] border-darkblack pb-1 font-gill text-sm leading-110 text-darkblack">
                      {store.cityLabel}
                    </span>
                  </div>

                  <div className="relative h-[400px] w-full shrink-0 overflow-hidden">
                    <div className="absolute left-[calc(50%+55.5px)] top-[calc(50%+13.76px)] h-[518px] w-[720px] -translate-x-1/2 -translate-y-1/2">
                      <div className="relative size-full">
                      <Image
                        src={DELIVERY_STORE_MAP_IMAGES.base}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="720px"
                      />
                      <Image
                        src={DELIVERY_STORE_MAP_IMAGES.overlay1}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="720px"
                      />
                      <Image
                        src={DELIVERY_STORE_MAP_IMAGES.overlay2}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="720px"
                      />
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-1/2 flex w-[311px] -translate-x-1/2 flex-col gap-6 bg-gray300 px-4 py-6">
                      <div className="flex flex-col gap-4">
                        <div className="flex gap-3">
                          <MapPin size={20} strokeWidth={1.25} aria-hidden className="mt-0.5 shrink-0 text-darkblack" />
                          <p className="font-gill text-base font-light leading-110 text-darkblack">{store.address}</p>
                        </div>
                        <div className="flex gap-3">
                          <Phone size={20} strokeWidth={1.25} aria-hidden className="mt-0.5 shrink-0 text-darkblack" />
                          <p className="font-gill text-base font-light leading-110 text-darkblack">{store.phone}</p>
                        </div>
                      </div>
                      <DetailTextLink href={store.collectionHref}>VIEW COLLECTION</DetailTextLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="shrink-0">
              <div className="pointer-events-none h-[71px] bg-gradient-to-b from-transparent to-white" aria-hidden />
              <div className="border-t border-neutral300/50 bg-white px-4 py-6 lg:px-8">
                <DetailDarkButton onClick={() => setStep("booking")}>BOOK YOUR VISIT</DetailDarkButton>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="px-4 pt-6 lg:px-8">
                <div className="flex flex-col gap-7">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setStep("availability")}
                        aria-label="Back to store availability"
                        className="inline-flex size-6 shrink-0 items-center justify-center"
                      >
                        <ChevronLeft size={24} strokeWidth={1.25} aria-hidden className="text-darkblack" />
                      </button>
                      <h2 className="font-larken text-24 font-light leading-110 text-darkblack">
                        Book Your Store Visit
                      </h2>
                    </div>
                    <SlidersHorizontal size={32} strokeWidth={1.25} aria-hidden className="shrink-0 text-darkblack" />
                  </div>
                  <div className="h-px w-full bg-neutral300" aria-hidden />
                </div>

                <div className="mt-[22px] flex flex-col gap-6 pb-6">
                  <AppointmentContactFields
                    idPrefix="store-visit"
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
                    labelClassName={appointmentLabelClassName}
                    fieldClassName={appointmentFieldClassName}
                    selectedSlotStyle="gold"
                  />
                </div>
              </div>
            </div>

            <div className="shrink-0">
              <div className="pointer-events-none h-[71px] bg-gradient-to-b from-transparent to-white" aria-hidden />
              <div className="flex flex-col items-center gap-4 border-t border-neutral300/50 bg-white px-4 py-6 lg:px-8">
                <p className="text-center font-gill text-sm font-light leading-normal tracking-[0.252px] text-neutral500">
                  Our representative will get in touch with you soon
                </p>
                <DetailDarkButton
                  onClick={handleConfirmVisit}
                  disabled={submitted && !isValid}
                  className="disabled:cursor-not-allowed disabled:opacity-50"
                >
                  CONFIRM VISIT
                </DetailDarkButton>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
};

export default DeliveryStoreJourneyPanel;
