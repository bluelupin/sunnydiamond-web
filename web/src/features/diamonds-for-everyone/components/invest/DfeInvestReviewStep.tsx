"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/features/auth/context/AuthContext";
import { formatCustomerFullName } from "@/shared/utils/customerName";
import { diamondsForEveryonePageContent } from "../../data/content";
import { useDfeInvestFlow } from "../../context/DfeInvestFlowContext";
import { formatInr } from "../../utils/formatInr";
import { maskIdNumber } from "../../utils/maskIdNumber";
import { useUiPlatform } from "@/shared/hooks/use-ui-platform";
import { cn } from "@/shared/utils/cn";

const DIVIDER_SRC = "/icons/invest-review-divider.svg";
const INFO_ICON_SRC = "/images/diamonds-for-everyone/invest-review-info.svg";

function ReviewDivider() {
  return (
    <div className="h-px w-full shrink-0 self-stretch" aria-hidden>
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
        className="text-tertiary-cta-underline shrink-0 cursor-pointer pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
      >
        {editLabel}
      </button>
    </div>
  );
}

const DfeInvestReviewStep = () => {
  const { investment } = diamondsForEveryonePageContent;
  const { review, payLabel } = diamondsForEveryonePageContent.investFlow;
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
    cancelButtonLabel,
  } = useDfeInvestFlow();

  const bonus = monthlyAmount;

  const sliderFillPercent = useMemo(() => {
    const range = investment.maxMonthly - investment.minMonthly;
    if (range <= 0) return 0;
    return ((monthlyAmount - investment.minMonthly) / range) * 100;
  }, [investment.maxMonthly, investment.minMonthly, monthlyAmount]);

  const clampAmount = (value: number) =>
    Math.min(investment.maxMonthly, Math.max(investment.minMonthly, value));

  const accountFullName = customer
    ? formatCustomerFullName(customer.firstname, customer.lastname)
    : "";
  const accountEmail = customer?.email ?? "";
  const accountPhone = "—";

  const displayValue = (value: string) => (value.trim().length > 0 ? value : "—");
  const { windows } = useUiPlatform();
  return (
    <div className="mx-auto flex w-full max-w-[600px] flex-col gap-6 border border-linkGold bg-gray200 p-4 lg:items-center lg:gap-10 lg:p-10">
      <h2 className="w-full self-stretch font-larken text-2xl font-light leading-110 text-darkblack lg:text-center lg:text-32">
        {review.title}
      </h2>

      <div className="flex w-full flex-col gap-6 self-stretch">
        <h3 className="font-gill text-xl font-normal leading-110 text-darkblack">
          {review.accountHolderTitle}
        </h3>
        <div className="flex flex-col gap-6">
          <ReviewField label={review.fullNameLabel} value={displayValue(accountFullName)} mutedLabel />
          <ReviewField label={review.phoneLabel} value={accountPhone} />
          <ReviewField label={review.emailLabel} value={displayValue(accountEmail)} />
        </div>
      </div>

      <ReviewDivider />

      <div className="flex w-full flex-col gap-6 self-stretch lg:min-h-[366px] lg:justify-between">
        <h3 className="font-gill text-xl font-normal leading-110 text-darkblack">
          <span className="lg:hidden">{review.instalmentAmountTitle}</span>
          <span className="hidden lg:inline">{review.summarySectionTitle}</span>
        </h3>

        <div className="flex flex-col gap-4">
          <div className="relative h-[6px] w-full bg-[#AEAEAE] lg:bg-neutral300">
            <div
              className="absolute left-0 top-0 h-[6px] bg-[#666666] lg:bg-neutral500"
              style={{ width: `${sliderFillPercent}%` }}
            >
              <div
                className="pointer-events-none absolute right-0 top-1/2 size-4 translate-x-1/2 -translate-y-1/2 rounded-full bg-darkblack"
                aria-hidden
              />
            </div>
            <input
              type="range"
              min={investment.minMonthly}
              max={investment.maxMonthly}
              step={investment.step}
              value={monthlyAmount}
              onChange={(event) => setMonthlyAmount(Number(event.target.value))}
              aria-label="Monthly savings amount"
              aria-valuemin={investment.minMonthly}
              aria-valuemax={investment.maxMonthly}
              aria-valuenow={monthlyAmount}
              className="absolute inset-0 size-full cursor-pointer opacity-0"
            />
          </div>
          <div className="flex h-14 items-center bg-aboutInactive p-3">
            <span className="font-gill text-base font-normal leading-110 text-darkblack">
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
              className="min-w-0 flex-1 bg-transparent pl-1 font-gill text-base font-normal leading-110 text-darkblack outline-none"
              aria-label="Monthly amount in rupees"
            />
          </div>
        </div>

        <div className="flex items-start gap-2 lg:items-center">
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
            {review.summarySectionTitle}
          </p>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 font-gill text-base leading-110 text-darkblack">
              <div className="flex items-center justify-between gap-4">
                <span className="font-light">{review.contributionLabel}</span>
                <span className="font-normal">{formatInr(contribution)}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="font-light">{review.bonusLabel}</span>
                <span className="font-normal">{formatInr(bonus)}</span>
              </div>
            </div>
            <ReviewDivider />
            <div className="flex items-center justify-between gap-4 font-gill text-base font-normal leading-110 text-darkblack">
              <span>{review.totalLabel}</span>
              <span>{formatInr(totalValue)}</span>
            </div>
          </div>
        </div>
      </div>

      <ReviewDivider />

      <section className="flex w-full flex-col gap-6 self-stretch">
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
              <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(!windows && "-translate-y-0.5", "shrink-0")}>
                <path d="M16.4585 4.10254H3.9585C3.61332 4.10254 3.3335 4.37806 3.3335 4.71792V17.0256C3.3335 17.3655 3.61332 17.641 3.9585 17.641H16.4585C16.8037 17.641 17.0835 17.3655 17.0835 17.0256V4.71792C17.0835 4.37806 16.8037 4.10254 16.4585 4.10254Z" stroke="#0A0A0A" strokeWidth="0.9375" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7.7085 9.64025C8.39885 9.64025 8.9585 9.08922 8.9585 8.40948C8.9585 7.72975 8.39885 7.17871 7.7085 7.17871C7.01814 7.17871 6.4585 7.72975 6.4585 8.40948C6.4585 9.08922 7.01814 9.64025 7.7085 9.64025Z" stroke="#0A0A0A" strokeWidth="0.9375" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4.63721 17.6403L13.2036 9.2049C13.2617 9.14768 13.3306 9.10229 13.4065 9.07132C13.4823 9.04035 13.5637 9.02441 13.6458 9.02441C13.7279 9.02441 13.8093 9.04035 13.8851 9.07132C13.961 9.10229 14.0299 9.14768 14.088 9.2049L17.0833 12.1549" stroke="#0A0A0A" strokeWidth="0.9375" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="border-b border-darkblack pb-1 font-gill text-base font-light leading-110 text-darkblack truncate-1 max-w-[200px] text-ellipsis overflow-hidden">
                {idFile?.name ?? "—"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <ReviewDivider />

      <section className="flex w-full flex-col gap-6 self-stretch">
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

      <div className="flex w-full flex-col items-center gap-4 self-stretch">
        <button
          type="button"
          onClick={completeEnrollment}
          className="btn-dark-slide inline-flex h-14 w-full items-center justify-center border border-darkblack px-7 font-gill text-sm font-normal uppercase leading-110 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
        >
          <span className="relative z-10">{payLabel}</span>
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

export default DfeInvestReviewStep;
