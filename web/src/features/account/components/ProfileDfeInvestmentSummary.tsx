import { formatInr } from "@/features/diamonds-for-everyone/utils/formatInr";

const SUMMARY_DIVIDER_SRC = "/images/diamonds-for-everyone/invest-review-divider.svg";

type ProfileDfeInvestmentSummaryProps = {
  contributionLabel: string;
  contributionAmount: number;
  freeInstallmentLabel: string;
  freeInstallmentAmount: number;
  totalValueLabel: string;
  totalValue: number;
};

/** Figma node 1480:39128 — 12-month investment summary card */
export function ProfileDfeInvestmentSummary({
  contributionLabel,
  contributionAmount,
  freeInstallmentLabel,
  freeInstallmentAmount,
  totalValueLabel,
  totalValue,
}: ProfileDfeInvestmentSummaryProps) {
  return (
    <div className="w-full bg-gray200 p-4">
      <div className="flex w-full flex-col gap-6">
        <div className="flex w-full flex-col gap-3 font-gill text-base leading-110 text-darkblack">
          <div className="flex w-full items-center justify-between gap-4">
            <span className="font-light">{contributionLabel}</span>
            <span className="font-normal">{formatInr(contributionAmount)}</span>
          </div>
          <div className="flex w-full items-start justify-between gap-4">
            <span className="font-light">{freeInstallmentLabel}</span>
            <span className="font-normal">{formatInr(freeInstallmentAmount)}</span>
          </div>
        </div>

        <div className="h-px w-full shrink-0" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={SUMMARY_DIVIDER_SRC} alt="" className="block h-px w-full max-w-none" />
        </div>

        <div className="flex w-full items-start justify-between gap-4 font-gill text-base font-normal leading-110 text-darkblack">
          <span>{totalValueLabel}</span>
          <span>{formatInr(totalValue)}</span>
        </div>
      </div>
    </div>
  );
}
