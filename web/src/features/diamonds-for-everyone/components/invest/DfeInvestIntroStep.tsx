"use client";

import Link from "next/link";
import { useDfeInvestFlow } from "../../context/DfeInvestFlowContext";
import type { NormalizedDfeAccountSetup } from "@/services/diamonds-for-everyone/diamonds-for-everyone-page.types";
import { cn } from "@/shared/utils/cn";
import { useUiPlatform } from "@/shared/hooks/use-ui-platform";

const introStepCircleClassName =
  "relative z-10 flex h-[26px] w-4 shrink-0 flex-col items-center justify-center rounded-[1000px] border border-solid border-darkblack bg-white p-1 [border-width:0.4px]";

const introStepNumberClassName =
  "font-gill text-sm font-light leading-normal tracking-[0.14px] text-darkblack";

const introStepConnectorClassName =
  "pointer-events-none absolute top-[26px] left-1/2 bottom-[-2rem] -translate-x-1/2 border-l border-neutral500 [border-left-width:0.31px] lg:bottom-[-2.5rem]";

type DfeInvestIntroStepProps = {
  accountSetup: NormalizedDfeAccountSetup;
};

const DfeInvestIntroStep = ({ accountSetup }: DfeInvestIntroStepProps) => {
  const { goNext } = useDfeInvestFlow();
  const lastStepIndex = accountSetup.steps.length - 1;
  const { windows } = useUiPlatform();

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex w-full flex-col items-center gap-4 text-center">
        <h1 className="font-larken text-32 font-light leading-110 text-darkblack lg:text-5xl">
          {accountSetup.heading}
        </h1>
        {accountSetup.description ? (
          <p className="font-gill text-base font-light leading-110 text-neutral500 lg:text-xl">
            {accountSetup.description}
          </p>
        ) : null}
      </div>

      <div className="flex w-full max-w-[600px] items-center justify-center bg-gray200 p-3 lg:p-6">
        <div className="flex w-full flex-col items-center gap-6 border border-linkGold p-4 lg:gap-10 lg:p-10">
          {accountSetup.steps.length > 0 ? (
            <div className="flex w-full flex-col gap-8 lg:gap-10">
              {accountSetup.steps.map((stepItem, index) => (
                <div key={stepItem.id} className="flex items-start gap-4">
                  <div className="relative w-4 shrink-0 self-stretch">
                    {index < lastStepIndex ? (
                      <div aria-hidden className={introStepConnectorClassName} />
                    ) : null}
                    <div className={introStepCircleClassName}>
                      <span className={cn(!windows && "translate-y-0.5", introStepNumberClassName)}>
                        {index + 1}
                      </span>
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
                    <p className="font-gill text-sm font-light leading-110 text-darkblack lg:text-base">
                      {stepItem.label}
                    </p>
                    <p className="font-gill text-base font-normal leading-110 text-darkblack lg:text-xl">
                      {stepItem.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          <div className="flex w-full flex-col items-center gap-4 lg:max-w-[413px]">
            {accountSetup.openAccountButtonLabel ? (
              <button
                type="button"
                onClick={goNext}
                className="btn-dark-slide inline-flex h-14 w-full items-center justify-center border border-darkblack px-7 font-gill text-sm font-normal uppercase leading-110 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
              >
                <span className="relative z-10">{accountSetup.openAccountButtonLabel}</span>
              </button>
            ) : null}
            {accountSetup.cancelButtonLabel ? (
              <Link
                href="/diamonds-for-everyone"
                className="text-tertiary-cta-underline cursor-pointer pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
              >
                {accountSetup.cancelButtonLabel}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DfeInvestIntroStep;
