"use client";

import Image from "next/image";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import Reveal from "@/shared/Animation/Reveal";
import type { NormalizedDfeBenefits } from "@/services/diamonds-for-everyone/diamonds-for-everyone-page.types";

const StepCircle = ({ number }: { number: number }) => (
  <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-darkblack bg-[#EBDFC6]">
    <span className="font-gill text-xl font-light leading-none tracking-[0.2px] text-darkblack">
      {number}
    </span>
  </div>
);

type DfeSavingsPlanSectionProps = {
  benefits: NormalizedDfeBenefits;
};

const DfeSavingsPlanSection = ({ benefits }: DfeSavingsPlanSectionProps) => {
  const { steps } = benefits;
  const backgroundSrc =
    benefits.backgroundImage?.desktopUrl || benefits.backgroundImage?.mobileUrl;

  return (
    <section
      aria-labelledby="dfe-savings-plan-title"
      className="relative overflow-hidden bg-gray300 py-16 md:min-h-[550px] md:py-[104px]"
    >
      {backgroundSrc ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 hidden h-[700px] w-[max(100vw,1440px)] -translate-x-1/2 -translate-y-1/2 items-center justify-center mix-blend-color-burn md:flex">
            <div className="rotate-90">
              <Image
                src={backgroundSrc}
                alt=""
                width={700}
                height={1440}
                className="h-[max(100vw,1440px)] w-[700px] object-bottom"
              />
            </div>
          </div>
        </div>
      ) : null}

      <div className="relative mx-auto flex w-full max-w-[1360px] flex-col items-center gap-10 px-4 md:px-10">
        <div className="flex w-full max-w-[510px] flex-col items-center gap-6 text-center">
          {benefits.eyebrow ? (
            <Reveal as="p" direction="up" className="font-gill text-base font-normal leading-110 text-linkGold">
              {benefits.eyebrow}
            </Reveal>
          ) : null}
          <div className="flex flex-col items-center gap-4">
            <Reveal
              as="h2"
              id="dfe-savings-plan-title"
              direction="up"
              className="font-larken text-32 font-light leading-110 text-darkblack md:text-5xl"
            >
              {benefits.title}
            </Reveal>
            {benefits.subtitle ? (
              <Reveal
                as="p"
                direction="up"
                className="font-gill text-lg font-light leading-110 text-neutral500 md:text-xl"
              >
                {benefits.subtitle}
              </Reveal>
            ) : null}
          </div>
        </div>

        {steps.length > 0 ? (
          <>
            <div className="hidden w-full flex-col items-center gap-6 md:flex">
              <ScrollReveal delayMs={200} className="relative h-10 w-full max-w-[784px]">
                <div className="pointer-events-none absolute left-1/2 top-1/2 w-full max-w-[784px] -translate-x-1/2 -translate-y-1/2">
                  <div className="w-full border-[0.5px] border-dashed border-neutral500"></div>
                </div>
                <div className="relative flex h-10 items-center justify-between max-w-[784px] mx-auto px-0">
                  {steps.map((step) => (
                    <StepCircle key={step.id} number={step.stepNumber} />
                  ))}
                </div>
              </ScrollReveal>
              <div className="flex max-w-[980px] justify-between gap-10">
                {steps.map((step, index) => (
                  <ScrollReveal
                    key={step.id}
                    delayMs={280 + index * 80}
                    className="w-[250px] text-center font-gill text-xl font-light leading-110 text-darkblack"
                  >
                    {step.description}
                  </ScrollReveal>
                ))}
              </div>
            </div>

            <div className="flex w-full flex-col items-center gap-12 md:hidden">
              {steps.map((step, index) => (
                <ScrollReveal
                  key={step.id}
                  delayMs={240 + index * 80}
                  className="flex flex-col items-center gap-4"
                >
                  <StepCircle number={step.stepNumber} />
                  <p className="w-[250px] text-center font-gill text-base font-light leading-110 text-darkblack">
                    {step.description}
                  </p>
                </ScrollReveal>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
};

export default DfeSavingsPlanSection;
