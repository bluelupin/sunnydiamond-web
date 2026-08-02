"use client";

import Image from "next/image";
import { useMemo } from "react";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import { useHomepageEditorialBlocks } from "@/hooks/homepage/useHomepageEditorialBlocks";
import { resolveDiamondsForEveryoneSection } from "@/shared/utils/resolveDiamondsForEveryoneSection";
import Reveal from "@/shared/Animation/Reveal";
import { diamondsForEveryonePageContent } from "../data/content";

const BACKGROUND_TEXTURE =
  "https://d1gf9vo4d2b63b.cloudfront.net/cms/diamonds_for_everyone_bg_8acd81b417.png";
const STEPS_LINE = "/images/home/savings-plan-line.svg";

const StepCircle = ({ number }: { number: number }) => (
  <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-darkblack bg-[#EBDFC6]">
    <span className="font-gill text-xl font-light leading-none tracking-[0.2px] text-darkblack">
      {number}
    </span>
  </div>
);

const DfeSavingsPlanSection = () => {
  const { savingsPlan } = diamondsForEveryonePageContent;
  const { data: editorialData } = useHomepageEditorialBlocks();
  const cmsSection = useMemo(
    () => resolveDiamondsForEveryoneSection(editorialData),
    [editorialData],
  );

  const eyebrow = cmsSection.eyebrow?.trim() || savingsPlan.eyebrow;
  const title = cmsSection.sectionTitle?.trim() || savingsPlan.title;
  const subtitle = cmsSection.subtitle?.trim() || savingsPlan.subtitle;

  const steps = useMemo(() => {
    const cmsSteps = cmsSection.steps ?? [];
    if (cmsSteps.length > 0) {
      return cmsSteps
        .filter((step) => step?.isActive !== false)
        .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0))
        .map((step, index) => ({
          stepNumber: step.stepNumber ?? index + 1,
          description: [step.description, step.highlightedText].filter(Boolean).join(""),
        }));
    }
    return savingsPlan.steps;
  }, [cmsSection.steps, savingsPlan.steps]);

  return (
    <section
      aria-labelledby="dfe-savings-plan-title"
      className="relative overflow-hidden bg-gray300 py-16 md:min-h-[550px] md:py-[104px]"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 hidden h-[700px] w-[max(100vw,1440px)] -translate-x-1/2 -translate-y-1/2 items-center justify-center mix-blend-color-burn md:flex">
          <div className="rotate-90">
            <Image
              src={BACKGROUND_TEXTURE}
              alt=""
              width={700}
              height={1440}
              className="h-[max(100vw,1440px)] w-[700px] object-bottom"
            />
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex w-full max-w-[1360px] flex-col items-center gap-10 px-4 md:px-10">
        <div className="flex w-full max-w-[510px] flex-col items-center gap-6 text-center">
          <Reveal as="p" direction="up" className="font-gill text-base font-normal leading-110 text-linkGold">
            {eyebrow}
          </Reveal>
          <div className="flex flex-col items-center gap-4">
            <Reveal
              as="h2"
              id="dfe-savings-plan-title"
              direction="up"
              className="font-larken text-32 font-light leading-110 text-darkblack md:text-5xl"
            >
              {title}
            </Reveal>
            <Reveal
              as="p"
              direction="up"
              className="font-gill text-lg font-light leading-110 text-neutral500 md:text-xl"
            >
              {subtitle}
            </Reveal>
          </div>
        </div>

        <div className="hidden w-full flex-col items-center gap-6 md:flex">
          <ScrollReveal delayMs={200} className="relative h-10 w-full max-w-[784px]">
            <div className="pointer-events-none absolute left-1/2 top-1/2 w-full max-w-[784px] -translate-x-1/2 -translate-y-1/2">
              <Image src={STEPS_LINE} alt="" width={784} height={1} className="h-px w-full" aria-hidden />
            </div>
            <div className="relative flex h-10 items-center justify-between max-w-[784px] mx-auto px-0">
              {steps.map((step) => (
                <StepCircle key={step.stepNumber} number={step.stepNumber} />
              ))}
            </div>
          </ScrollReveal>
          <div className="flex max-w-[980px] justify-between gap-10">
            {steps.map((step, index) => (
              <ScrollReveal
                key={step.stepNumber}
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
              key={step.stepNumber}
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
      </div>
    </section>
  );
};

export default DfeSavingsPlanSection;
