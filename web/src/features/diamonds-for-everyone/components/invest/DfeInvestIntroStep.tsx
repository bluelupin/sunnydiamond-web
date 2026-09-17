"use client";

import Link from "next/link";
import { diamondsForEveryonePageContent } from "../../data/content";
import { useDfeInvestFlow } from "../../context/DfeInvestFlowContext";
import { cn } from "@/shared/utils/cn";
import { useUiPlatform } from "@/shared/hooks/use-ui-platform";

const introStepCircleClassName =
  "relative z-10 flex h-[26px] w-4 shrink-0 flex-col items-center justify-center rounded-[1000px] border border-solid border-darkblack bg-white p-1 [border-width:0.4px]";

const introStepNumberClassName =
  "font-gill text-sm font-light leading-normal tracking-[0.14px] text-darkblack";

const introStepConnectorClassName =
  "pointer-events-none absolute top-[26px] left-1/2 bottom-[-2rem] -translate-x-1/2 border-l border-neutral500 [border-left-width:0.31px] lg:bottom-[-2.5rem]";

const DfeInvestIntroStep = () => {
  const { intro, cancelLabel } = diamondsForEveryonePageContent.investFlow;
  const { goNext } = useDfeInvestFlow();
  const lastStepIndex = intro.steps.length - 1;
  const { windows } = useUiPlatform();
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex w-full flex-col items-center gap-4 text-center">
        <h1 className="font-larken text-32 font-light leading-110 text-darkblack lg:text-5xl">
          {intro.title}
        </h1>
        <p className="font-gill text-base font-light leading-110 text-neutral500 lg:text-xl">
          {intro.subtitle}
        </p>
      </div>

      <div className="flex w-full max-w-[600px] items-center justify-center bg-gray200 p-3 lg:p-6">
        <div className="flex w-full flex-col items-center gap-6 border border-linkGold p-4 lg:gap-10 lg:p-10">
          <div className="flex w-full flex-col gap-8 lg:gap-10">
            {intro.steps.map((stepItem, index) => (
              <div key={stepItem.label} className="flex items-start gap-4">
                <div className="relative w-4 shrink-0 self-stretch">
                  {index < lastStepIndex ? (
                    <div aria-hidden className={introStepConnectorClassName} />
                  ) : null}
                  <div className={introStepCircleClassName}>
                    <span className={cn(!windows && "translate-y-0.5", introStepNumberClassName)}>{index + 1}</span>
                  </div>
                </div>

                <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
                  <p className="font-gill text-sm font-light leading-110 text-darkblack lg:text-base">
                    {stepItem.label}
                  </p>
                  <p className="font-gill text-base font-normal leading-110 text-darkblack lg:text-xl">
                    {stepItem.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex w-full flex-col items-center gap-4 lg:max-w-[413px]">
            <button
              type="button"
              onClick={goNext}
              className="btn-dark-slide inline-flex h-14 w-full items-center justify-center border border-darkblack px-7 font-gill text-sm font-normal uppercase leading-110 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
            >
              <span className="relative z-10">{intro.openAccountLabel}</span>
            </button>
            <Link
              href="/diamonds-for-everyone"
              className="text-tertiary-cta-underline cursor-pointer pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
            >
              {cancelLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DfeInvestIntroStep;
