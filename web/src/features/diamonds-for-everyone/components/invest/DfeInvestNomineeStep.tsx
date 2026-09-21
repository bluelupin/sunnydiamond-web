"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/shared/utils/cn";
import CareersSelectField from "@/features/careers/components/shared/CareersSelectField";
import FormFieldError from "@/shared/ui/FormFieldError";
import {
  invalidFieldClassName,
  validateOptionalEmail,
  validatePhone,
} from "@/shared/utils/formValidation";
import { diamondsForEveryonePageContent } from "../../data/content";
import { useDfeInvestFlow } from "../../context/DfeInvestFlowContext";

const fieldLabelClass = "font-gill text-base font-normal leading-110 text-darkblack";
const fieldInputClass =
  "h-14 w-full bg-aboutInactive p-3 font-gill text-base font-normal leading-110 text-darkblack outline-none placeholder:font-normal placeholder:text-gray600";

const DfeInvestNomineeStep = () => {
  const { nominee } = diamondsForEveryonePageContent.investFlow;
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
    cancelButtonLabel,
  } = useDfeInvestFlow();

  const [touched, setTouched] = useState(false);

  const phoneValidation = useMemo(
    () => validatePhone(nomineePhone, "+91"),
    [nomineePhone],
  );

  const emailValidation = useMemo(
    () => validateOptionalEmail(nomineeEmail),
    [nomineeEmail],
  );

  const phoneError = useMemo(() => {
    if (!touched) return undefined;
    return phoneValidation.valid ? undefined : nominee.phoneError;
  }, [nominee.phoneError, phoneValidation.valid, touched]);

  const emailError = useMemo(() => {
    if (!touched) return undefined;
    return emailValidation.valid ? undefined : nominee.emailError;
  }, [emailValidation.valid, nominee.emailError, touched]);

  const canProceed =
    nomineeName.trim().length > 0 &&
    nomineeRelationship.length > 0 &&
    phoneValidation.valid &&
    emailValidation.valid;

  const handleNext = () => {
    setTouched(true);
    if (!canProceed) return;
    goNext();
  };

  return (
    <div className="mx-auto flex w-full max-w-[600px] flex-col gap-6 border border-linkGold bg-gray200 p-4 lg:gap-10 lg:p-10">
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-col gap-3 lg:gap-6">
          <h2 className="font-gill text-xl font-normal leading-110 text-darkblack lg:font-larken lg:text-2xl lg:font-light">
            <span className="lg:hidden">{nominee.mobileTitle}</span>
            <span className="hidden lg:inline">{nominee.title}</span>
          </h2>
          <p className="font-gill text-sm font-normal leading-110 text-neutral500 lg:hidden">
            {nominee.subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-4">
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
              placeholder={nominee.namePlaceholder}
              className={fieldInputClass}
            />
          </div>

          <CareersSelectField
            id="dfe-nominee-relationship"
            label={nominee.relationshipLabel}
            value={nomineeRelationship}
            onChange={setNomineeRelationship}
            onBlur={() => setTouched(true)}
            options={nominee.relationshipOptions}
            placeholder={nominee.relationshipPlaceholder}
            labelClassName={fieldLabelClass}
          />

          <div className="flex flex-col gap-2">
            <label className={fieldLabelClass} htmlFor="dfe-nominee-phone">
              {nominee.phoneLabel}
            </label>
            <input
              id="dfe-nominee-phone"
              type="tel"
              inputMode="numeric"
              value={nomineePhone}
              onChange={(event) =>
                setNomineePhone(event.target.value.replace(/\D/g, "").slice(0, 10))
              }
              onBlur={() => setTouched(true)}
              placeholder={nominee.phonePlaceholder}
              className={cn(fieldInputClass, phoneError && invalidFieldClassName)}
            />
            <FormFieldError message={phoneError} />
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
              onBlur={() => setTouched(true)}
              placeholder={nominee.emailPlaceholder}
              className={cn(fieldInputClass, emailError && invalidFieldClassName)}
            />
            <FormFieldError message={emailError} />
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
          {canProceed ? (
            <span className="relative z-10">{nominee.reviewAndPayLabel}</span>
          ) : (
            nominee.reviewAndPayLabel
          )}
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

export default DfeInvestNomineeStep;
