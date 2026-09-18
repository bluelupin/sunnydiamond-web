"use client";

import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import { diamondsForEveryonePageContent } from "../../data/content";
import { useDfeInvestFlow, type DfeInvestStep } from "../../context/DfeInvestFlowContext";
import { useUiPlatform } from "@/shared/hooks/use-ui-platform";

const STEP_IDS: DfeInvestStep[] = ["kyc", "nominee", "review"];

function InvestStepConnector() {
  return (
    <div className="flex min-w-0 flex-1 items-center justify-center">
      <div
        aria-hidden
        className="h-0 w-full border-t border-dashed border-neutral500 [border-top-width:0.5px]"
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
  const { windows } = useUiPlatform();
  return (
    <div
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-full border border-solid font-gill text-sm leading-110",
        state === "completed" &&
        "border-darkblack bg-[#EBDFC6] font-normal text-darkblack",
        state === "active" && "border-darkblack bg-white font-normal text-darkblack",
        state === "future" && "border-neutral500 bg-white font-light text-neutral500",
      )}
    >
      <span className={cn(!windows && "translate-y-0.5", "block leading-none")}>{number}</span>
    </div>
  );
}

const DfeInvestStepper = () => {
  const { step } = useDfeInvestFlow();
  const { steps } = diamondsForEveryonePageContent.investFlow;
  const activeIndex = STEP_IDS.indexOf(step);

  return (
    <div className="flex w-full flex-col items-center gap-3 lg:gap-6 lg:px-10">
      <div
        className={cn(
          "flex w-full items-center justify-between px-7",
          (step === "nominee" || step === "review") && "lg:px-10",
        )}
      >
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

      <div className="flex w-full items-start justify-between whitespace-nowrap text-center font-gill text-base leading-110 text-darkblack lg:text-xl">
        {steps.map((stepItem, index) => {
          const isCompleted = index < activeIndex;
          const isActive = index === activeIndex;
          const isFuture = index > activeIndex;

          const isFinalStep = activeIndex === steps.length - 1;

          return (
            <p
              key={stepItem.id}
              className={cn(
                "w-[104px] shrink-0 lg:w-auto",
                isActive && "font-normal text-darkblack",
                isCompleted &&
                  (isFinalStep
                    ? "font-light text-darkblack"
                    : "font-light text-darkblack lg:font-normal"),
                isFuture && "font-light text-neutral500",
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
  const { intro, backLabel } = diamondsForEveryonePageContent.investFlow;
  const { goBack } = useDfeInvestFlow();

  return (
    <div className="flex w-full items-center gap-2 lg:justify-center lg:gap-3">
      <button
        type="button"
        onClick={goBack}
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
      </button>
      <h1 className="font-larken text-2xl font-light leading-110 text-darkblack lg:text-32">
        {intro.title}
      </h1>
      <div className="hidden size-10 shrink-0 lg:block" aria-hidden />
    </div>
  );
};

export { DfeInvestHeader, DfeInvestStepper };
