"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/features/auth/context/AuthContext";
import { diamondsForEveryonePageContent } from "../../data/content";
import { useDfeInvestFlow } from "../../context/DfeInvestFlowContext";
import { formatInr } from "../../utils/formatInr";
import { maskIdNumber } from "../../utils/maskIdNumber";

const DIVIDER_SRC = "/images/diamonds-for-everyone/invest-review-divider.svg";
const INFO_ICON_SRC = "/images/diamonds-for-everyone/invest-review-info.svg";
const DOCUMENT_ICON_SRC = "/images/diamonds-for-everyone/invest-review-document.svg";

function ReviewDivider() {
  return (
    <div className="h-px w-full shrink-0" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={DIVIDER_SRC} alt="" className="block h-px w-full max-w-none" />
    </div>
  );
}

function ReviewField({
  label,
  value,
  mutedLabel = false,
}: {
  label: string;
  value: string;
  mutedLabel?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p
        className={
          mutedLabel
            ? "font-gill text-base font-normal leading-110 text-[#2B2B2B]"
            : "font-gill text-base font-normal leading-110 text-darkblack"
        }
      >
        {label}
      </p>
      <p className="font-gill text-base font-normal leading-110 text-darkblack">
        {value}
      </p>
    </div>
  );
}

function SectionEditHeader({
  title,
  onEdit,
  editLabel,
}: {
  title: string;
  onEdit: () => void;
  editLabel: string;
}) {
  return (
    <div className="flex w-full items-center justify-between gap-4">
      <h3 className="font-gill text-xl font-normal leading-110 text-darkblack">
        {title}
      </h3>
      <button
        type="button"
        onClick={onEdit}
        className="shrink-0 border-b border-darkblack pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
      >
        {editLabel}
      </button>
    </div>
  );
}

const DfeInvestReviewStep = () => {
  const { investment } = diamondsForEveryonePageContent;
  const { review, cancelLabel, payLabel } = diamondsForEveryonePageContent.investFlow;
  const { customer } = useAuth();
  const {
    monthlyAmount,
    setMonthlyAmount,
    contribution,
    totalValue,
    idType,
    idNumber,
    idFile,
    nomineeName,
    nomineeRelationship,
    nomineePhone,
    nomineeEmail,
    goToStep,
    completeEnrollment,
  } = useDfeInvestFlow();

  const sunnyContribution = monthlyAmount;

  const sliderFillPercent = useMemo(() => {
    const range = investment.maxMonthly - investment.minMonthly;
    if (range <= 0) return 0;
    return ((monthlyAmount - investment.minMonthly) / range) * 100;
  }, [investment.maxMonthly, investment.minMonthly, monthlyAmount]);

  const clampAmount = (value: number) =>
    Math.min(investment.maxMonthly, Math.max(investment.minMonthly, value));

  const accountFullName = customer
    ? [customer.firstname, customer.lastname].filter(Boolean).join(" ").trim()
    : "";
  const accountEmail = customer?.email ?? "";
  const accountPhone = "—";

  const displayValue = (value: string) => (value.trim().length > 0 ? value : "—");

  return (
    <div className="flex w-full flex-col gap-10 border border-linkGold bg-gray200 p-6 md:p-10">
      <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">
        {review.title}
      </h2>

      <section className="flex w-full flex-col gap-6">
        <h3 className="font-gill text-xl font-normal leading-110 text-darkblack">
          {review.accountHolderTitle}
        </h3>
        <div className="flex flex-col gap-6">
          <ReviewField label={review.fullNameLabel} value={displayValue(accountFullName)} mutedLabel />
          <ReviewField label={review.phoneLabel} value={accountPhone} />
          <ReviewField label={review.emailLabel} value={displayValue(accountEmail)} />
        </div>
      </section>

      <ReviewDivider />

      <section className="flex w-full flex-col gap-6">
        <h3 className="font-gill text-xl font-normal leading-110 text-darkblack">
          {review.investmentDetailsTitle}
        </h3>

        <div className="flex flex-col gap-4">
          <div className="relative h-[6px] w-full bg-[#AEAEAE]">
            <div
              className="absolute left-0 top-0 h-[6px] bg-[#666666]"
              style={{ width: `${sliderFillPercent}%` }}
            />
            <input
              type="range"
              min={investment.minMonthly}
              max={investment.maxMonthly}
              step={investment.step}
              value={monthlyAmount}
              onChange={(event) => setMonthlyAmount(Number(event.target.value))}
              aria-label="Monthly savings amount"
              className="absolute inset-0 size-full cursor-pointer opacity-0"
            />
            <div
              className="pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-darkblack"
              style={{ left: `calc(${sliderFillPercent}% - 8px)` }}
              aria-hidden
            />
          </div>
          <div className="flex h-[50px] w-full items-center gap-2 border border-darkblack px-3 py-2">
            <span className="font-gill text-lg font-light leading-normal tracking-[0.18px] text-darkblack">
              ₹
            </span>
            <input
              type="number"
              min={investment.minMonthly}
              max={investment.maxMonthly}
              step={investment.step}
              value={monthlyAmount}
              onChange={(event) => {
                const next = Number(event.target.value);
                if (Number.isNaN(next)) return;
                setMonthlyAmount(clampAmount(next));
              }}
              className="min-w-0 flex-1 bg-transparent font-gill text-base font-normal leading-110 text-darkblack outline-none"
              aria-label="Monthly amount in rupees"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Image
            src={INFO_ICON_SRC}
            alt=""
            width={24}
            height={24}
            className="shrink-0"
            aria-hidden
          />
          <p className="font-gill text-base font-light leading-110 text-darkblack">
            {review.reminderText}
          </p>
        </div>

        <ReviewDivider />

        <div className="flex flex-col gap-4">
          <p className="font-gill text-base font-normal leading-110 text-[#2B2B2B]">
            {review.summaryTitle}
          </p>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 font-gill text-base leading-110 text-darkblack">
              <div className="flex items-center justify-between gap-4">
                <span className="font-light">{review.contributionLabel}</span>
                <span className="font-normal">{formatInr(contribution)}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="font-light">{review.sunnyContributionLabel}</span>
                <span className="font-normal">{formatInr(sunnyContribution)}</span>
              </div>
            </div>
            <ReviewDivider />
            <div className="flex items-center justify-between gap-4 font-gill text-base leading-110 text-darkblack">
              <span className="font-normal">{review.totalLabel}</span>
              <span className="font-normal">{formatInr(totalValue)}</span>
            </div>
          </div>
        </div>
      </section>

      <ReviewDivider />

      <section className="flex w-full flex-col gap-6">
        <SectionEditHeader
          title={review.idProofTitle}
          editLabel={review.editLabel}
          onEdit={() => goToStep("kyc")}
        />
        <div className="flex flex-col gap-6">
          <ReviewField label={review.idTypeLabel} value={idType} />
          <ReviewField label={review.idNumberLabel} value={maskIdNumber(idNumber)} />
          <div className="flex flex-col gap-2">
            <p className="font-gill text-base font-normal leading-110 text-darkblack">
              {review.idCardCopyLabel}
            </p>
            <div className="flex items-center gap-2">
              <Image
                src={DOCUMENT_ICON_SRC}
                alt=""
                width={24}
                height={24}
                className="shrink-0"
                aria-hidden
              />
              <p className="font-gill text-base font-light leading-110 text-darkblack">
                {idFile?.name ?? "—"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <ReviewDivider />

      <section className="flex w-full flex-col gap-6">
        <SectionEditHeader
          title={review.nomineeDetailsTitle}
          editLabel={review.editLabel}
          onEdit={() => goToStep("nominee")}
        />
        <div className="flex flex-col gap-6">
          <ReviewField
            label={review.nomineeNameLabel}
            value={displayValue(nomineeName)}
            mutedLabel
          />
          <ReviewField
            label={review.nomineeRelationshipLabel}
            value={displayValue(nomineeRelationship)}
            mutedLabel
          />
          <ReviewField label={review.nomineePhoneLabel} value={displayValue(nomineePhone)} />
          <ReviewField label={review.nomineeEmailLabel} value={displayValue(nomineeEmail)} />
        </div>
      </section>

      <div className="flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={completeEnrollment}
          className="inline-flex h-14 w-full items-center justify-center bg-darkblack px-7 font-gill text-sm font-normal uppercase leading-110 text-white transition-opacity hover:opacity-90"
        >
          {payLabel}
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

export default DfeInvestReviewStep;
