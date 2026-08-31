"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";
import { useAppointmentFormValidation } from "@/shared/hooks/use-appointment-form-validation";
import AppointmentContactFields from "@/shared/ui/AppointmentContactFields";
import {
  appointmentFieldClassName,
  appointmentLabelClassName,
} from "@/shared/constants/appointmentForm";
import {
  DELIVERY_STORE_ICONS,
  DELIVERY_STORE_LOCATIONS,
} from "@/features/products/data/deliveryStoreContent";
import { DetailDarkButton, DetailTextLink } from "./shared";
import { PanelFooter } from "@/shared/ui/PanelFooter";
import { RIGHT_PANEL_HEADER_PADDING_CLASS } from "@/shared/ui/rightPanel";
import { RightPanelCloseButton } from "@/shared/ui/RightPanelCloseButton";
import { cn } from "@/shared/utils/cn";
import { ProductDetailSidePanelShell } from "./ProductDetailSidePanelShell";
import StoreVisitMapBlock from "./StoreVisitMapBlock";

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
    }
  }, [open]);

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

  return (
    <ProductDetailSidePanelShell
      open={open}
      onClose={handleClose}
      overlayAriaLabel="Close store availability"
      dialogAriaLabel={step === "availability" ? "In store availability" : "Book your store visit"}
    >
      {step === "availability" ? (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className={cn(RIGHT_PANEL_HEADER_PADDING_CLASS)}>
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">
                      In Store Availabilty
                    </h2>
                    <RightPanelCloseButton
                      onClick={handleClose}
                      aria-label="Close store availability"
                    />
                  </div>
                  <div className="h-px w-full bg-neutral300" aria-hidden />
                </div>

                <div className="mt-6 flex flex-col gap-3 pb-72">
                  <div className="flex flex-wrap items-center gap-2">
                    <Image
                      src={DELIVERY_STORE_ICONS.store}
                      alt=""
                      width={24}
                      height={24}
                      aria-hidden
                      className="shrink-0"
                    />
                    <p className="font-gill text-base font-light leading-110 text-darkblack">
                      Available now at nearest store
                    </p>
                    <span className="text-link-underline inline-flex border-b-[1.5px] border-darkblack pb-1 font-gill text-sm leading-110 text-darkblack">
                      {store.cityLabel}
                    </span>
                  </div>

                  <StoreVisitMapBlock variant="availability">
                    <div className="flex flex-col gap-4">
                      <div className="flex gap-3 items-center">
                        <Image
                          src={DELIVERY_STORE_ICONS.address}
                          alt=""
                          width={20}
                          height={20}
                          aria-hidden
                          className="mt-0.5 shrink-0"
                        />
                        <p className="min-w-0 flex-1 font-gill text-base font-light leading-110 text-darkblack">
                          {store.address}
                        </p>
                      </div>
                      <div className="flex gap-3 items-center">
                        <Image
                          src={DELIVERY_STORE_ICONS.phone}
                          alt=""
                          width={20}
                          height={20}
                          aria-hidden
                          className="mt-0.5 shrink-0"
                        />
                        <p className="min-w-0 flex-1 font-gill text-base font-light leading-110 text-darkblack">
                          {store.phone}
                        </p>
                      </div>
                    </div>
                    <DetailTextLink href={store.collectionHref}>VIEW COLLECTION</DetailTextLink>
                  </StoreVisitMapBlock>
                </div>
              </div>
            </div>

            <PanelFooter>
              <DetailDarkButton onClick={() => setStep("booking")}>BOOK YOUR VISIT</DetailDarkButton>
            </PanelFooter>
          </>
        ) : (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className={cn(RIGHT_PANEL_HEADER_PADDING_CLASS)}>
                <div className="flex flex-col gap-6">
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
                      <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">
                        Book Your Store Visit
                      </h2>
                    </div>
                    <RightPanelCloseButton
                      onClick={handleClose}
                      aria-label="Close book your store visit"
                    />
                  </div>
                  <div className="h-px w-full bg-neutral300" aria-hidden />
                </div>

                <div className="mt-6 flex flex-col gap-6 pb-72">
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

            <PanelFooter contentClassName="flex flex-col items-center gap-4">
              <p className="text-center font-gill text-sm font-light leading-normal tracking-normal text-neutral500">
                Our representative will get in touch with you soon
              </p>
              <DetailDarkButton
                onClick={handleConfirmVisit}
                disabled={submitted && !isValid}
                className="disabled:cursor-not-allowed disabled:opacity-50"
              >
                CONFIRM VISIT
              </DetailDarkButton>
            </PanelFooter>
          </>
        )}
    </ProductDetailSidePanelShell>
  );
};

export default DeliveryStoreJourneyPanel;
