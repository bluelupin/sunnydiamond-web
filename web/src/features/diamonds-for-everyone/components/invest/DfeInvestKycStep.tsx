"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/shared/utils/cn";
import CareersChevronDownIcon from "@/features/careers/components/shared/CareersChevronDownIcon";
import { careersFormSelectChevronClassName } from "@/features/careers/constants/careersApplicationForm";
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
  const {
    idType,
    idNumber,
    idFile,
    setIdType,
    setIdNumber,
    setIdFile,
    goNext,
    goBack,
  } = useDfeInvestFlow();

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
    <div className="w-full max-w-[553px] border border-linkGold bg-gray200 p-6 md:p-10">
      <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">
        {kyc.title}
      </h2>

      <div className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className={fieldLabelClass} htmlFor="dfe-id-type">{kyc.idTypeLabel}</label>
          <div className="relative">
            <select
              id="dfe-id-type"
              value={idType}
              onChange={(event) => setIdType(event.target.value)}
              className={cn(fieldInputClass, "appearance-none pr-10")}
            >
              {kyc.idTypeOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <CareersChevronDownIcon className={careersFormSelectChevronClassName} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className={fieldLabelClass} htmlFor="dfe-id-number">{kyc.idNumberLabel}</label>
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

        <div className="flex flex-col gap-2">
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
                className="border-b border-darkblack pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
              >
                {kyc.removeFileLabel}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex h-14 items-center justify-center border border-neutral300 bg-white px-7 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
            >
              {kyc.uploadButtonLabel}
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed}
          className={cn(
            "inline-flex h-14 w-full items-center justify-center px-7 font-gill text-sm font-normal uppercase leading-110 text-white transition-opacity",
            canProceed
              ? "bg-darkblack hover:opacity-90"
              : "bg-neutral500 opacity-50",
          )}
        >
          {nextLabel}
        </button>
        <button
          type="button"
          onClick={goBack}
          className="border-b border-darkblack pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
        >
          BACK
        </button>
        <Link
          href="/diamonds-for-everyone"
          className="border-b border-darkblack pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
        >
          {cancelLabel}
        </Link>
      </div>
    </div>
  );
};

export default DfeInvestKycStep;
