"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Info } from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";
import { useAppointmentFormValidation } from "@/shared/hooks/use-appointment-form-validation";
import AppointmentContactFields from "@/shared/ui/AppointmentContactFields";
import {
  appointmentFieldClassName,
  appointmentLabelClassName,
} from "@/shared/constants/appointmentForm";
import { PanelFooter } from "@/shared/ui/PanelFooter";
import { ProductDetailSidePanelShell } from "@/features/products/components/detail/ProductDetailSidePanelShell";
import { bespokePageContent } from "@/features/bespoke/data/content";

type BespokeShareVisionPanelProps = {
  open: boolean;
  onClose: () => void;
};

const panelConfig = bespokePageContent.story.shareVisionPanel;

const BespokeShareVisionPanel = ({ open, onClose }: BespokeShareVisionPanelProps) => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [referenceImageName, setReferenceImageName] = useState<string | null>(null);
  const referenceImageInputRef = useRef<HTMLInputElement>(null);

  const formValues = useMemo(
    () => ({ name, countryCode, phone, email, date: "", note }),
    [name, countryCode, phone, email, note],
  );

  const validationOptions = useMemo(
    () => ({ noteRequired: true, emailRequired: true }),
    [],
  );

  const { isValid, submitted, errors, markTouched, showError, validateSubmit } =
    useAppointmentFormValidation(formValues, validationOptions);

  const handleSubmit = () => {
    validateSubmit(() => {
      toast(panelConfig.successToast);
      onClose();
    });
  };

  const handleReferenceImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setReferenceImageName(file?.name ?? null);
  };

  return (
    <ProductDetailSidePanelShell
      open={open}
      onClose={onClose}
      overlayAriaLabel={panelConfig.closeAriaLabel}
      dialogAriaLabel={panelConfig.dialogAriaLabel}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="flex flex-col gap-6 px-4 pt-6 lg:px-6 lg:pt-10">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">
                {panelConfig.title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label={panelConfig.closeAriaLabel}
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

          <div className="flex flex-col gap-6 pb-72">
            <AppointmentContactFields
              idPrefix="bespoke-share-vision"
              name={name}
              countryCode={countryCode}
              phone={phone}
              email={email}
              date=""
              note={note}
              onNameChange={setName}
              onCountryCodeChange={setCountryCode}
              onPhoneChange={setPhone}
              onEmailChange={setEmail}
              onDateChange={() => undefined}
              onNoteChange={setNote}
              errors={errors}
              showError={showError}
              markTouched={markTouched}
              showDate={false}
              showTimeSlots={false}
              nameLabel={panelConfig.nameLabel}
              emailLabel={panelConfig.emailLabel}
              noteLabel={panelConfig.noteLabel}
              notePlaceholder="Enter"
              noteLabelClassName={appointmentLabelClassName}
              noteTextareaClassName="font-gill text-base leading-110"
              labelClassName={appointmentLabelClassName}
              fieldClassName={appointmentFieldClassName}
            />

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
                className="text-link-underline inline-flex w-fit border-b-[1.5px] border-darkblack pb-1 font-gill text-sm uppercase leading-110 text-darkblack"
              >
                {referenceImageName ?? "Attach Image"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <PanelFooter contentClassName="flex flex-col items-center gap-4">
        <p className="text-center font-gill text-sm font-light leading-normal tracking-normal text-neutral500">
          Our representative will get in touch with you soon
        </p>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitted && !isValid}
          className="btn-dark-slide inline-flex h-14 w-full items-center justify-center px-7 font-gill text-sm uppercase leading-110 text-white disabled:cursor-not-allowed disabled:opacity-50 border border-darkblack"
        >
          {panelConfig.submitLabel}
        </button>
      </PanelFooter>
    </ProductDetailSidePanelShell>
  );
};

export default BespokeShareVisionPanel;
