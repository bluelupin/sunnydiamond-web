"use client";

import Link from "next/link";
import { diamondsForEveryonePageContent } from "../../data/content";
import { useDfeInvestFlow } from "../../context/DfeInvestFlowContext";

const INTRO_STEP_LINE_SRC = "/images/diamonds-for-everyone/invest-intro-step-line.svg";

const DfeInvestIntroStep = () => {
  const { intro, cancelLabel } = diamondsForEveryonePageContent.investFlow;
  const { goNext } = useDfeInvestFlow();

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex w-full flex-col items-center gap-4 text-center">
        <h1 className="font-larken text-5xl font-light leading-110 text-darkblack">
          {intro.title}
        </h1>
        <p className="font-gill text-xl font-light leading-110 text-neutral500">
          {intro.subtitle}
        </p>
      </div>

      <div className="w-full max-w-[600px] bg-gray200 p-6">
        <div className="flex min-h-[472px] flex-col justify-between border border-linkGold p-10">
          <div className="flex gap-4">
            <div className="relative flex h-[202px] shrink-0 flex-col items-center justify-between">
              <div
                className="pointer-events-none absolute left-2 top-1/2 flex h-[158px] w-0 -translate-y-1/2 items-center justify-center"
                aria-hidden
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={INTRO_STEP_LINE_SRC}
                  alt=""
                  className="block h-[158px] w-[0.31px] max-w-none -rotate-90"
                />
              </div>
              {intro.steps.map((_, index) => (
                <div
                  key={index}
                  className="flex h-[26px] w-4 shrink-0 items-center justify-center rounded-full border border-darkblack bg-white p-1"
                >
                  <span className="font-gill text-sm font-light leading-normal tracking-[0.14px] text-darkblack">
                    {index + 1}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-10">
              {intro.steps.map((stepItem) => (
                <div key={stepItem.label} className="flex flex-col gap-2">
                  <p className="font-gill text-base font-light leading-110 text-darkblack">
                    {stepItem.label}
                  </p>
                  <p className="font-gill text-xl font-normal leading-110 text-darkblack">
                    {stepItem.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-[413px] flex-col items-center gap-4">
            <button
              type="button"
              onClick={goNext}
              className="inline-flex h-14 w-full items-center justify-center bg-darkblack px-7 font-gill text-sm font-normal uppercase leading-110 text-white transition-opacity hover:opacity-90"
            >
              {intro.openAccountLabel}
            </button>
            <Link
              href="/diamonds-for-everyone"
              className="border-b border-darkblack pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
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
