import { formatInr } from "@/features/diamonds-for-everyone/utils/formatInr";

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
    <div className="flex md:bg-white md:p-4 flex-col gap-6">
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
      <div className="h-px w-full bg-neutral300" aria-hidden />
      <div className="flex w-full items-start justify-between gap-4 font-gill text-base font-normal leading-110 text-darkblack">
        <span>{totalValueLabel}</span>
        <span>{formatInr(totalValue)}</span>
      </div>
    </div>
  );
}
