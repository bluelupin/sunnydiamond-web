"use client";

import { useMemo } from "react";
import { cn } from "@/shared/utils/cn";
import { diamondsForEveryonePageContent } from "../data/content";
import { formatInr } from "../utils/formatInr";
import {
  clampDfeMonthlyAmount,
  computeDfeInvestmentSummary,
  type DfeInvestmentConfig,
} from "../utils/investmentConfig";

type DfeInvestmentCalculatorProps = {
  investment: DfeInvestmentConfig;
  monthlyAmount: number;
  onMonthlyAmountChange: (value: number) => void;
  monthlyDescription?: string;
  monthlySummary?: string;
  className?: string;
};

const DfeInvestmentCalculator = ({
  investment,
  monthlyAmount,
  onMonthlyAmountChange,
  monthlyDescription,
  monthlySummary,
  className,
}: DfeInvestmentCalculatorProps) => {
  const labels = diamondsForEveryonePageContent.investment;
  const { contribution, bonus, totalValue } = computeDfeInvestmentSummary(monthlyAmount, investment);

  const sliderFillPercent = useMemo(() => {
    const range = investment.maxMonthly - investment.minMonthly;
    if (range <= 0) return 0;
    return ((monthlyAmount - investment.minMonthly) / range) * 100;
  }, [investment.maxMonthly, investment.minMonthly, monthlyAmount]);

  const clampAmount = (value: number) => clampDfeMonthlyAmount(value, investment);

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex flex-col gap-6">
        {monthlyDescription ? (
          <p className="font-gill text-base font-normal leading-110 text-[#2B2B2B]">
            {monthlyDescription}
          </p>
        ) : null}
        <div className="flex flex-col gap-6">
          <div className="relative h-[6px] w-full bg-neutral300">
            <div
              className="absolute left-0 top-0 h-[6px] bg-neutral500"
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
              onChange={(event) => onMonthlyAmountChange(Number(event.target.value))}
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
                onMonthlyAmountChange(clampAmount(next));
              }}
              className="min-w-0 flex-1 bg-transparent pl-1 font-gill text-base font-normal leading-110 text-darkblack outline-none"
              aria-label="Monthly amount in rupees"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {monthlySummary ? (
          <p className="font-gill text-base font-normal leading-110 text-[#2B2B2B]">
            {monthlySummary}
          </p>
        ) : null}
        <div className="bg-gray300 p-4 lg:bg-gray200">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 font-gill text-base leading-110 text-darkblack">
              <div className="flex items-center justify-between gap-4">
                <span className="font-light">{labels.contributionLabel}</span>
                <span className="font-normal">{formatInr(contribution)}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="font-light">{labels.freeInstallmentLabel}</span>
                <span className="font-normal">{formatInr(bonus)}</span>
              </div>
            </div>
            <div className="h-px w-full bg-neutral300" aria-hidden />
            <div className="flex items-center justify-between gap-4 font-gill text-base font-normal leading-110 text-darkblack">
              <span>{labels.totalLabel}</span>
              <span>{formatInr(totalValue)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DfeInvestmentCalculator;
