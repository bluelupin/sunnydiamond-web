"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/shared/utils/cn";
import CareersChevronDownIcon from "@/features/careers/components/shared/CareersChevronDownIcon";
import { careersFormSelectChevronClassName } from "@/features/careers/constants/careersApplicationForm";
import { diamondsForEveryonePageContent } from "../../data/content";
import { useDfeInvestFlow } from "../../context/DfeInvestFlowContext";

const fieldLabelClass = "font-gill text-base font-normal leading-110 text-darkblack";
const fieldInputClass =
  "h-14 w-full bg-aboutInactive p-3 font-gill text-base font-normal leading-110 text-darkblack outline-none placeholder:font-normal placeholder:text-gray600";

const DfeInvestNomineeStep = () => {
  const { nominee, cancelLabel } = diamondsForEveryonePageContent.investFlow;
  const {
    nomineeName,
    nomineeRelationship,
    nomineePhone,
    nomineeEmail,
    setNomineeName,
    setNomineeRelationship,
    setNomineePhone,
    setNomineeEmail,
    goNext,
  } = useDfeInvestFlow();

  const [touched, setTouched] = useState(false);

  const canProceed =
    nomineeName.trim().length > 0 &&
    nomineeRelationship.length > 0 &&
    nomineePhone.trim().length >= 10;

  const handleNext = () => {
    setTouched(true);
    if (!canProceed) return;
    goNext();
  };

  return (
    <div className="w-full max-w-[553px] border border-linkGold bg-gray200 p-6 md:p-10">
      <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">
        {nominee.title}
      </h2>

      <div className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className={fieldLabelClass} htmlFor="dfe-nominee-name">
            {nominee.nameLabel}
          </label>
          <input
            id="dfe-nominee-name"
            type="text"
            value={nomineeName}
            onChange={(event) => setNomineeName(event.target.value)}
            onBlur={() => setTouched(true)}
            className={fieldInputClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className={fieldLabelClass} htmlFor="dfe-nominee-relationship">
            {nominee.relationshipLabel}
          </label>
          <div className="relative">
            <select
              id="dfe-nominee-relationship"
              value={nomineeRelationship}
              onChange={(event) => setNomineeRelationship(event.target.value)}
              onBlur={() => setTouched(true)}
              className={cn(
                fieldInputClass,
                "appearance-none pr-10",
                !nomineeRelationship && "text-gray600",
              )}
            >
              <option value="" disabled>Select</option>
              {nominee.relationshipOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <CareersChevronDownIcon className={careersFormSelectChevronClassName} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className={fieldLabelClass} htmlFor="dfe-nominee-phone">
            {nominee.phoneLabel}
          </label>
          <input
            id="dfe-nominee-phone"
            type="tel"
            value={nomineePhone}
            onChange={(event) =>
              setNomineePhone(event.target.value.replace(/\D/g, "").slice(0, 10))
            }
            onBlur={() => setTouched(true)}
            className={fieldInputClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className={fieldLabelClass} htmlFor="dfe-nominee-email">
            {nominee.emailLabel}
          </label>
          <input
            id="dfe-nominee-email"
            type="email"
            value={nomineeEmail}
            onChange={(event) => setNomineeEmail(event.target.value)}
            className={fieldInputClass}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed && touched}
          className={cn(
            "inline-flex h-14 w-full items-center justify-center px-7 font-gill text-sm font-normal uppercase leading-110 text-white transition-opacity",
            canProceed
              ? "bg-darkblack hover:opacity-90"
              : "bg-neutral500 opacity-50",
          )}
        >
          {nominee.reviewAndPayLabel}
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

export default DfeInvestNomineeStep;
