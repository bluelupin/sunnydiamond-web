"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/shared/utils/cn";
import CareersSelectField from "@/features/careers/components/shared/CareersSelectField";
import FormFieldError from "@/shared/ui/FormFieldError";
import { diamondsForEveryonePageContent } from "../../data/content";
import { useDfeInvestFlow } from "../../context/DfeInvestFlowContext";
import { useUiPlatform } from "@/shared/hooks/use-ui-platform";

const fieldLabelClass = "font-gill text-base font-normal leading-110 text-darkblack";
const fieldInputClass =
  "h-14 w-full bg-aboutInactive p-3 font-gill text-base font-normal leading-110 text-darkblack outline-none";
const fieldErrorClass = "border border-[#F91616] bg-[#FEDCDC]";

function isValidAadhaar(value: string): boolean {
  return /^\d{12}$/.test(value.replace(/\s/g, ""));
}

const DfeInvestKycStep = () => {
  const { kyc, nextLabel } = diamondsForEveryonePageContent.investFlow;
  const { idType, idNumber, idFile, setIdType, setIdNumber, setIdFile, goNext, cancelButtonLabel } =
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
  const { windows } = useUiPlatform();
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
                  <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(!windows && "-translate-y-0.5", "shrink-0")}>
                    <path d="M16.4585 4.10254H3.9585C3.61332 4.10254 3.3335 4.37806 3.3335 4.71792V17.0256C3.3335 17.3655 3.61332 17.641 3.9585 17.641H16.4585C16.8037 17.641 17.0835 17.3655 17.0835 17.0256V4.71792C17.0835 4.37806 16.8037 4.10254 16.4585 4.10254Z" stroke="#0A0A0A" strokeWidth="0.9375" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7.7085 9.64025C8.39885 9.64025 8.9585 9.08922 8.9585 8.40948C8.9585 7.72975 8.39885 7.17871 7.7085 7.17871C7.01814 7.17871 6.4585 7.72975 6.4585 8.40948C6.4585 9.08922 7.01814 9.64025 7.7085 9.64025Z" stroke="#0A0A0A" strokeWidth="0.9375" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4.63721 17.6403L13.2036 9.2049C13.2617 9.14768 13.3306 9.10229 13.4065 9.07132C13.4823 9.04035 13.5637 9.02441 13.6458 9.02441C13.7279 9.02441 13.8093 9.04035 13.8851 9.07132C13.961 9.10229 14.0299 9.14768 14.088 9.2049L17.0833 12.1549" stroke="#0A0A0A" strokeWidth="0.9375" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="font-gill text-base font-normal leading-110 text-darkblack truncate-1 md:max-w-[200px] max-w-[170px] text-ellipsis overflow-hidden whitespace-nowrap">
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
        {cancelButtonLabel ? (
          <Link
            href="/diamonds-for-everyone"
            className="text-tertiary-cta-underline cursor-pointer pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
          >
            {cancelButtonLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default DfeInvestKycStep;
