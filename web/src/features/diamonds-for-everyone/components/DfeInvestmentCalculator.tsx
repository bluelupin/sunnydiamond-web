"use client";

import { useMemo } from "react";
import { cn } from "@/shared/utils/cn";
import { diamondsForEveryonePageContent } from "../data/content";
import { formatInr } from "../utils/formatInr";

type DfeInvestmentCalculatorProps = {
  monthlyAmount: number;
  onMonthlyAmountChange: (value: number) => void;
  className?: string;
};

const DfeInvestmentCalculator = ({
  monthlyAmount,
  onMonthlyAmountChange,
  className,
}: DfeInvestmentCalculatorProps) => {
  const { investment } = diamondsForEveryonePageContent;

  const contribution = monthlyAmount * investment.monthsPaid;
  const totalValue = monthlyAmount * investment.totalMonths;

  const sliderFillPercent = useMemo(() => {
    const range = investment.maxMonthly - investment.minMonthly;
    if (range <= 0) return 0;
    return ((monthlyAmount - investment.minMonthly) / range) * 100;
  }, [investment.maxMonthly, investment.minMonthly, monthlyAmount]);

  const clampAmount = (value: number) =>
    Math.min(investment.maxMonthly, Math.max(investment.minMonthly, value));

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <p className="font-gill text-base font-normal leading-110 text-[#2B2B2B]">
        {investment.monthlyLabel}
      </p>
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
            onChange={(event) => onMonthlyAmountChange(Number(event.target.value))}
            aria-label="Monthly savings amount"
            className="absolute inset-0 size-full cursor-pointer opacity-0"
          />
          <div
            className="pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-darkblack"
            style={{ left: `calc(${sliderFillPercent}% - 8px)` }}
            aria-hidden
          />
        </div>
        <div className="flex h-[50px] items-center gap-2 border border-darkblack px-3 py-2">
          <span className="font-gill text-lg font-light leading-110 text-darkblack">₹</span>
          <input
            type="number"
            min={investment.minMonthly}
            max={investment.maxMonthly}
            step={investment.step}
            value={monthlyAmount}
            onChange={(event) => {
              const next = Number(event.target.value);
              if (Number.isNaN(next)) return;
              onMonthlyAmountChange(clampAmount(next));
            }}
            className="min-w-0 flex-1 bg-transparent font-gill text-base font-normal leading-110 text-darkblack outline-none"
            aria-label="Monthly amount in rupees"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <p className="font-gill text-base font-normal leading-110 text-[#2B2B2B]">
          {investment.summaryTitle}
        </p>
        <div className="bg-gray200 p-4">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 font-gill text-base leading-110 text-darkblack">
              <div className="flex items-center justify-between gap-4">
                <span className="font-light">{investment.contributionLabel}</span>
                <span className="font-normal">{formatInr(contribution)}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="font-light">{investment.freeInstallmentLabel}</span>
                <span className="font-normal">{investment.freeInstallmentValue}</span>
              </div>
            </div>
            <div className="h-px w-full bg-neutral300" aria-hidden />
            <div className="flex items-center justify-between gap-4 font-gill text-base leading-110 text-darkblack">
              <span className="font-normal">{investment.totalLabel}</span>
              <span className="font-normal">{formatInr(totalValue)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DfeInvestmentCalculator;
