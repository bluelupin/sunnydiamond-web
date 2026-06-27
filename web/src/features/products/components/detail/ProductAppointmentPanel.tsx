"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import { Info } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { useToast } from "@/shared/hooks/use-toast";
import { useAppointmentFormValidation } from "@/shared/hooks/use-appointment-form-validation";
import AppointmentContactFields from "@/shared/ui/AppointmentContactFields";
import {
  appointmentFieldClassName,
  appointmentLabelClassName,
} from "@/shared/constants/appointmentForm";
import type { Product } from "@/features/products/data/products";
import {
  PRODUCT_APPOINTMENT_PANEL_CONFIG,
  type ProductAppointmentVariant,
} from "./productAppointmentPanel.config";
import { PanelFooter } from "@/shared/ui/PanelFooter";

type ProductAppointmentPanelProps = {
  open: boolean;
  onClose: () => void;
  product: Product;
  variant: ProductAppointmentVariant;
};

type ProductAppointmentFormProps = {
  config: (typeof PRODUCT_APPOINTMENT_PANEL_CONFIG)[ProductAppointmentVariant];
  productName: string;
  productImage: string | StaticImageData;
  onClose: () => void;
  onSubmit: () => void;
};

const ProductAppointmentForm = ({
  config,
  productName,
  productImage,
  onClose,
  onSubmit,
}: ProductAppointmentFormProps) => {
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [referenceImageName, setReferenceImageName] = useState<string | null>(null);
  const referenceImageInputRef = useRef<HTMLInputElement>(null);

  const formValues = useMemo(
    () => ({ name, countryCode, phone, email, date, note }),
    [name, countryCode, phone, email, date, note],
  );

  const validationOptions = useMemo(
    () => ({ noteRequired: config.noteRequired }),
    [config.noteRequired],
  );

  const { isValid, submitted, errors, markTouched, showError, validateSubmit } =
    useAppointmentFormValidation(formValues, validationOptions);

  const handleSubmit = () => {
    validateSubmit(onSubmit);
  };

  const handleReferenceImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setReferenceImageName(file?.name ?? null);
  };

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="flex flex-col gap-7 px-4 pt-6 lg:px-8 lg:pt-8">
          <div className="flex flex-col gap-7">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-larken text-24 font-light leading-110 text-darkblack">
                {config.title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label={config.closeAriaLabel}
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
            <AppointmentContactFields
              idPrefix={config.idPrefix}
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
              onSelectedSlotChange={config.showTimeSlots ? setSelectedSlot : undefined}
              errors={errors}
              showError={showError}
              markTouched={markTouched}
              showTimeSlots={config.showTimeSlots}
              noteLabel={config.noteLabel}
              notePlaceholder={config.notePlaceholder}
              noteLabelClassName={config.noteLabelClassName}
              noteTextareaClassName={config.noteTextareaClassName}
              labelClassName={appointmentLabelClassName}
              fieldClassName={appointmentFieldClassName}
            />

            {config.showReferenceImage ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                  <Info size={24} strokeWidth={1.25} aria-hidden className="shrink-0 text-darkblack" />
                  <p className="font-gill text-base font-light leading-110 text-darkblack">
                    Do you have any reference image? (Optional)
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
                <button
                  type="button"
                  onClick={() => referenceImageInputRef.current?.click()}
                  className="text-link-underline inline-flex w-fit border-b-[1.5px] border-darkblack pb-1 font-gill text-sm leading-110 text-darkblack"
                >
                  {referenceImageName ?? "Attach Image"}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <PanelFooter contentClassName="flex flex-col items-center gap-4">
        <p className="text-center font-gill text-sm font-light leading-110 tracking-[0.252px] text-neutral500">
          Our representative will get in touch with you soon
        </p>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitted && !isValid}
          className="btn-slide-up inline-flex h-14 w-full items-center justify-center bg-darkblack px-7 font-gill text-sm uppercase leading-110 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {config.submitLabel}
        </button>
      </PanelFooter>
    </>
  );
};

const ProductAppointmentPanel = ({
  open,
  onClose,
  product,
  variant,
}: ProductAppointmentPanelProps) => {
  const { toast } = useToast();
  const config = PRODUCT_APPOINTMENT_PANEL_CONFIG[variant];
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
    toast(config.successToast);
    onClose();
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label={config.closeAriaLabel}
        className="absolute inset-0 bg-[#1E1E1E]/25 backdrop-blur-[10px] animate-in fade-in duration-300"
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={config.dialogAriaLabel}
        className={cn(
          "absolute flex flex-col bg-white shadow-2xl",
          "inset-x-0 bottom-0 top-12 max-lg:animate-in max-lg:slide-in-from-bottom max-lg:duration-300",
          "lg:inset-x-auto lg:inset-y-0 lg:right-0 lg:top-0 lg:w-full lg:max-w-[480px] lg:animate-in lg:slide-in-from-right lg:duration-300",
        )}
      >
        <ProductAppointmentForm
          config={config}
          productName={product.name}
          productImage={productImage}
          onClose={onClose}
          onSubmit={handleSubmit}
        />
      </aside>
    </div>
  );
};

export default ProductAppointmentPanel;
