"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/shared/utils/cn";
import CareersSelectField from "@/features/careers/components/shared/CareersSelectField";
import FormFieldError from "@/shared/ui/FormFieldError";
import { diamondsForEveryonePageContent } from "../../data/content";
import { useDfeInvestFlow } from "../../context/DfeInvestFlowContext";

const fieldLabelClass = "font-gill text-base font-normal leading-110 text-darkblack";
const fieldInputClass =
  "h-14 w-full bg-aboutInactive p-3 font-gill text-base font-normal leading-110 text-darkblack outline-none";
const fieldErrorClass = "border border-[#F91616] bg-[#FEDCDC]";

function isValidAadhaar(value: string): boolean {
  return /^\d{12}$/.test(value.replace(/\s/g, ""));
}

const DfeInvestKycStep = () => {
  const { kyc, cancelLabel, nextLabel } = diamondsForEveryonePageContent.investFlow;
  const { idType, idNumber, idFile, setIdType, setIdNumber, setIdFile, goNext } =
    useDfeInvestFlow();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [touched, setTouched] = useState(false);

  const idNumberError = useMemo(() => {
    if (!touched) return undefined;
    if (!idNumber.trim()) return "ID number is required";
    if (idType === "Aadhaar" && !isValidAadhaar(idNumber)) {
      return kyc.aadhaarError;
    }
    return undefined;
  }, [idNumber, idType, kyc.aadhaarError, touched]);

  const canProceed =
    idNumber.trim().length > 0 &&
    idFile !== null &&
    (idType !== "Aadhaar" || isValidAadhaar(idNumber)) &&
    !idNumberError;

  const handleNext = () => {
    setTouched(true);
    if (!canProceed) return;
    goNext();
  };

  return (
    <div className="mx-auto flex w-full max-w-[553px] flex-col gap-6 border border-linkGold bg-gray200 p-4 lg:gap-10 lg:p-10">
      <div className="flex w-full flex-col gap-6">
        <h2 className="font-gill text-xl font-normal leading-110 text-darkblack lg:font-larken lg:text-2xl lg:font-light">
          {kyc.title}
        </h2>

        <div className="flex flex-col gap-4">
          <CareersSelectField
            id="dfe-id-type"
            label={kyc.idTypeLabel}
            value={idType}
            onChange={setIdType}
            options={kyc.idTypeOptions}
            labelClassName={fieldLabelClass}
          />

          <div className="flex flex-col gap-2">
            <label className={fieldLabelClass} htmlFor="dfe-id-number">
              {kyc.idNumberLabel}
            </label>
            <input
              id="dfe-id-number"
              type="text"
              value={idNumber}
              onChange={(event) => setIdNumber(event.target.value)}
              onBlur={() => setTouched(true)}
              className={cn(fieldInputClass, idNumberError && fieldErrorClass)}
            />
            <FormFieldError message={idNumberError ?? undefined} />
          </div>

          <div className="flex flex-col gap-2 lg:gap-4">
            <span className={fieldLabelClass}>{kyc.idUploadLabel}</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                setIdFile(file ?? null);
                setTouched(true);
              }}
            />
            {idFile ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Image
                    src="/icons/icon-resume-document.svg"
                    alt=""
                    width={20}
                    height={22}
                    aria-hidden
                  />
                  <span className="font-gill text-base font-normal leading-110 text-darkblack">
                    {idFile.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIdFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="text-tertiary-cta-underline cursor-pointer pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
                >
                  {kyc.removeFileLabel}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-tertiary-cta-underline inline-flex w-fit cursor-pointer pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
              >
                {kyc.uploadButtonLabel}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed}
          className={cn(
            "inline-flex h-14 w-full items-center justify-center px-7 font-gill text-sm font-normal uppercase leading-110 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2",
            canProceed
              ? "btn-dark-slide border border-darkblack"
              : "cursor-not-allowed bg-neutral500 opacity-50",
          )}
        >
          {canProceed ? <span className="relative z-10">{nextLabel}</span> : nextLabel}
        </button>
        <Link
          href="/diamonds-for-everyone"
          className="text-tertiary-cta-underline cursor-pointer pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
        >
          {cancelLabel}
        </Link>
      </div>
    </div>
  );
};

export default DfeInvestKycStep;
