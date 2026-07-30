"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/shared/utils/cn";
import { diamondsForEveryonePageContent } from "../../data/content";
import { useDfeInvestFlow, type DfeInvestStep } from "../../context/DfeInvestFlowContext";

const STEP_IDS: DfeInvestStep[] = ["kyc", "nominee", "review"];
const INVEST_STEP_LINE_SRC = "/images/diamonds-for-everyone/invest-step-line.svg";

function InvestStepConnector() {
  return (
    <div className="flex min-w-0 flex-1 items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={INVEST_STEP_LINE_SRC}
        alt=""
        className="block h-[0.5px] w-full max-w-none"
        aria-hidden
      />
    </div>
  );
}

function InvestStepCircle({
  number,
  state,
}: {
  number: number;
  state: "completed" | "active" | "future";
}) {
  return (
    <div
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-full border border-solid font-gill text-sm leading-110",
        state === "completed" &&
          "border-darkblack bg-[#EBDFC6] font-normal text-darkblack",
        state === "active" && "border-darkblack font-normal text-darkblack",
        state === "future" && "border-neutral500 font-light text-neutral500",
      )}
    >
      {number}
    </div>
  );
}

const DfeInvestStepper = () => {
  const { step } = useDfeInvestFlow();
  const { steps } = diamondsForEveryonePageContent.investFlow;
  const activeIndex = STEP_IDS.indexOf(step);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-6 px-10">
      <div className="flex w-full items-center justify-between px-7">
        {steps.map((stepItem, index) => {
          const isLast = index === steps.length - 1;
          const circleState =
            index < activeIndex
              ? "completed"
              : index === activeIndex
                ? "active"
                : "future";

          if (isLast) {
            return (
              <InvestStepCircle key={stepItem.id} number={index + 1} state={circleState} />
            );
          }

          return (
            <div key={stepItem.id} className="flex min-w-0 flex-1 items-center">
              <InvestStepCircle number={index + 1} state={circleState} />
              <InvestStepConnector />
            </div>
          );
        })}
      </div>

      <div
        className="flex w-full items-start justify-between whitespace-nowrap text-center font-gill text-xl leading-110 text-darkblack"
      >
        {steps.map((stepItem, index) => {
          const isActive = index === activeIndex;
          const isFuture = index > activeIndex;

          return (
            <p
              key={stepItem.id}
              className={cn(
                "shrink-0",
                isActive ? "font-normal" : "font-light",
                isFuture && "text-neutral500",
              )}
            >
              {stepItem.label}
            </p>
          );
        })}
      </div>
    </div>
  );
};

const DfeInvestHeader = () => {
  const { pageTitle, backLabel } = diamondsForEveryonePageContent.investFlow;

  return (
    <div className="flex w-full items-center justify-center gap-3">
      <Link
        href="/diamonds-for-everyone"
        className="inline-flex size-6 shrink-0 items-center justify-center"
        aria-label={backLabel}
      >
        <Image
          src="/images/diamonds-for-everyone/icon-back.svg"
          alt=""
          width={24}
          height={24}
          aria-hidden
        />
      </Link>
      <h1 className="font-larken text-32 font-light leading-110 text-darkblack">
        {pageTitle}
      </h1>
      <div className="size-10 shrink-0" aria-hidden />
    </div>
  );
};

export { DfeInvestHeader, DfeInvestStepper };
