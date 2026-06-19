"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useFadeIn } from "@/shared/hooks/use-fade-in";
import { useHomepageEditorialBlocks } from "@/hooks/homepage/useHomepageEditorialBlocks";
import type { SavingsPlanStep } from "@/types/homepage/diamondsForEveryoneSection";
import { isSectionActive } from "@/shared/utils/cmsSection";

interface DiamondsForEveryoneSectionProps {
  id?: string;
}

const BACKGROUND_TEXTURE = "/images/home/diamonds-for-everyone-bg.png";
const STEPS_LINE = "/images/home/savings-plan-line.svg";

const DEFAULT_STEPS: SavingsPlanStep[] = [
  {
    stepNumber: 1,
    description: "Save at your own pace, starting ",
    highlightedText: "from ₹1000/ month",
  },
  {
    stepNumber: 2,
    description: "Choose the piece that speaks to you",
  },
  {
    stepNumber: 3,
    description: "Take it home when you're ready",
  },
];

const StepCircle = ({ number }: { number: number }) => (
  <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-[#0a0a0a] bg-[#EBDFC6]">
    <span className="font-gill text-xl font-light leading-none tracking-[0.2px] text-[#0a0a0a]">
      {number}
    </span>
  </div>
);

const StepDescription = ({
  step,
  className,
}: {
  step: SavingsPlanStep;
  className?: string;
}) => (
  <p className={className}>
    <span className="font-light">{step.description}</span>
    {step.highlightedText ? (
      <span className="font-normal">{step.highlightedText}</span>
    ) : null}
  </p>
);

const DiamondsForEveryoneSection = ({ id }: DiamondsForEveryoneSectionProps) => {
  const contentRef = useFadeIn(200);
  const { data: editorialData, isLoading } = useHomepageEditorialBlocks();

  const sectionData = editorialData?.diamondsForEveryoneSection ?? null;

  const eyebrow = sectionData?.eyebrow?.trim() || "Flexible Savings Plan";
  const sectionTitle = sectionData?.sectionTitle?.trim() || "Diamonds for Everyone";
  const subtitle =
    sectionData?.subtitle?.trim() ||
    sectionData?.description?.trim() ||
    "Save monthly towards fine jewellery within reach";
  const ctaUrl = sectionData?.cta?.url || sectionData?.cta?.to || "/monthly-plans";
  const ctaLabel = sectionData?.cta?.label?.trim() || "Explore Plans";

  const steps = useMemo(() => {
    const cmsSteps = (sectionData?.steps ?? []) as SavingsPlanStep[];
    const activeSteps = cmsSteps
      .filter((step) => step?.isActive !== false)
      .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0));

    if (!activeSteps.length) return DEFAULT_STEPS;

    return activeSteps.map((step, index) => ({
      ...step,
      stepNumber: step.stepNumber ?? index + 1,
    }));
  }, [sectionData?.steps]);

  if (!isSectionActive(sectionData?.isActive)) return null;

  if (isLoading) {
    return (
      <section
        id={id}
        className="relative overflow-hidden bg-[#F8F4EC] px-4 py-16 md:bg-[#F4F3EE] md:px-10 md:py-[104px]"
        aria-busy="true"
        aria-label="Diamonds for Everyone"
      >
        <div className="mx-auto flex max-w-[510px] flex-col items-center gap-6">
          <div className="h-4 w-40 rounded bg-black/10" aria-hidden />
          <div className="h-10 w-72 rounded bg-black/10" aria-hidden />
          <div className="h-5 w-64 rounded bg-black/10" aria-hidden />
        </div>
      </section>
    );
  }

  return (
    <section
      id={id}
      aria-label={sectionTitle}
      className="relative overflow-hidden bg-[#F8F4EC] px-4 py-16 md:bg-[#F4F3EE] md:px-10 md:py-[104px]"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 flex h-[651px] w-[1339px] -translate-x-1/2 items-center justify-center mix-blend-color-burn md:top-1/2 md:h-[700px] md:w-[1440px] md:-translate-y-1/2">
          <div className="rotate-90">
            <Image
              src={BACKGROUND_TEXTURE}
              alt=""
              width={651}
              height={1339}
              className="h-[1339px] w-[651px] object-bottom md:h-[1440px] md:w-[700px]"
            />
          </div>
        </div>
      </div>

      <div
        ref={contentRef as React.RefObject<HTMLDivElement>}
        className="relative mx-auto flex w-full max-w-[1360px] flex-col items-center gap-8 md:gap-10"
      >
        <div className="flex w-full max-w-[510px] flex-col items-center gap-6 text-center md:gap-6">
          <p className="font-gill text-sm font-semibold uppercase leading-[110%] text-[#AB863B] md:text-base md:font-normal">
            {eyebrow}
          </p>
          <div className="flex w-full flex-col items-center gap-3 md:gap-4">
            <h2 className="w-full font-larken text-[32px] font-light leading-[110%] text-[#0a0a0a] md:text-[48px]">
              {sectionTitle}
            </h2>
            <p className="w-full font-gill text-base font-light leading-[110%] text-[#4D4D4D] md:text-[20px]">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Desktop steps */}
        <div className="hidden w-full flex-col items-center gap-6 md:flex">
          <div className="relative h-10 w-full max-w-[784px]">
            <div className="absolute left-1/2 top-1/2 h-px w-full max-w-[784px] -translate-x-1/2 -translate-y-1/2">
              <Image src={STEPS_LINE} alt="" width={784} height={1} className="w-full" aria-hidden />
            </div>
            <div className="relative flex items-center justify-between">
              {steps.map((step) => (
                <StepCircle key={step.stepNumber} number={step.stepNumber ?? 0} />
              ))}
            </div>
          </div>

          <div className="flex w-full max-w-[920px] justify-center gap-[140px]">
            {steps.map((step) => (
              <StepDescription
                key={step.stepNumber}
                step={step}
                className="w-[250px] text-center font-gill text-[20px] leading-[110%] text-[#0a0a0a]"
              />
            ))}
          </div>
        </div>

        {/* Mobile steps */}
        <div className="flex w-full flex-col items-center gap-12 md:hidden">
          {steps.map((step) => (
            <div key={step.stepNumber} className="flex flex-col items-center gap-4">
              <StepCircle number={step.stepNumber ?? 0} />
              <StepDescription
                step={step}
                className="max-w-[250px] text-center font-gill text-base leading-[110%] text-[#0a0a0a]"
              />
            </div>
          ))}
        </div>

        {ctaUrl ? (
          <Link
            href={ctaUrl}
            className="inline-flex items-center justify-center border-b-[1.5px] border-[#0a0a0a] pb-1 font-gill text-sm font-normal uppercase leading-[110%] text-[#0a0a0a] transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0a0a] focus-visible:ring-offset-2"
          >
            {ctaLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
};

export default DiamondsForEveryoneSection;
