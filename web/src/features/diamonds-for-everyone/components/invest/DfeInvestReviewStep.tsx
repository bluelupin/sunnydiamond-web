"use client";

import Link from "next/link";
import { diamondsForEveryonePageContent } from "../../data/content";
import { useDfeInvestFlow } from "../../context/DfeInvestFlowContext";
import { formatInr } from "../../utils/formatInr";

const DfeInvestReviewStep = () => {
  const { review, cancelLabel, payLabel } = diamondsForEveryonePageContent.investFlow;
  const { monthlyAmount, contribution, totalValue, goBack } = useDfeInvestFlow();

  return (
    <div className="w-full max-w-[553px] border border-linkGold bg-gray200 p-6 md:p-10">
      <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">
        {review.title}
      </h2>

      <div className="mt-6 bg-gray200 p-4">
        <div className="flex flex-col gap-6 font-gill text-base leading-110 text-darkblack">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <span className="font-light">{review.monthlyLabel}</span>
              <span className="font-normal">{formatInr(monthlyAmount)}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="font-light">{review.contributionLabel}</span>
              <span className="font-normal">{formatInr(contribution)}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="font-light">{review.freeInstallmentLabel}</span>
              <span className="font-normal">{review.freeInstallmentValue}</span>
            </div>
          </div>
          <div className="h-px w-full bg-neutral300" aria-hidden />
          <div className="flex items-center justify-between gap-4">
            <span className="font-normal">{review.totalLabel}</span>
            <span className="font-normal">{formatInr(totalValue)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-4">
        <button
          type="button"
          className="inline-flex h-14 w-full items-center justify-center bg-darkblack px-7 font-gill text-sm font-normal uppercase leading-110 text-white transition-opacity hover:opacity-90"
        >
          {payLabel}
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

export default DfeInvestReviewStep;
