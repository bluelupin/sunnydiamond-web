"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import { useHomepageEditorialBlocks } from "@/hooks/homepage/useHomepageEditorialBlocks";
import type { SavingsPlanStep } from "@/types/homepage/diamondsForEveryoneSection";
import { isSectionActive } from "@/shared/utils/cmsSection";
import { resolveDiamondsForEveryoneSection } from "@/shared/utils/resolveDiamondsForEveryoneSection";
import Reveal from "@/shared/Animation/Reveal";

interface DiamondsForEveryoneSectionProps {
  id?: string;
}

const StepCircle = ({ number }: { number: number }) => (
  <div className="relative z-10 box-border flex size-10 shrink-0 items-center justify-center rounded-full border-[0.571px] border-solid border-darkblack bg-lightGold">
    <span className="font-gill text-xl font-light leading-none tracking-[0.2px] text-darkblack">
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
    {step.highlightedText ? (
      <>
        <span className="font-light">{step.description}</span>
        <span className="font-normal">{step.highlightedText}</span>
      </>
    ) : (
      <span className="font-light">{step.description}</span>
    )}
  </p>
);

const DiamondsForEveryoneSection = ({ id }: DiamondsForEveryoneSectionProps) => {
  const { data: editorialData, isLoading } = useHomepageEditorialBlocks();

  const sectionData = useMemo(
    () => resolveDiamondsForEveryoneSection(editorialData),
    [editorialData],
  );

  const eyebrow = sectionData.eyebrow?.trim() || "";
  const sectionTitle = sectionData.sectionTitle?.trim() || "";
  const subtitle = sectionData.subtitle?.trim() || "";
  const ctaUrl = sectionData.cta?.url || sectionData.cta?.to || "";
  const ctaLabel = sectionData.cta?.label?.trim() || "";
  const backgroundDesktopSrc =
    sectionData.backgroundDesktopUrl || sectionData.backgroundMobileUrl || "";
  const backgroundMobileSrc =
    sectionData.backgroundMobileUrl || sectionData.backgroundDesktopUrl || "";
  const backgroundDesktopAlt = sectionData.backgroundDesktopAlt;
  const backgroundMobileAlt = sectionData.backgroundMobileAlt;
  const backgroundAlt = sectionData.backgroundAlt;
  const hasBackgroundTexture = Boolean(backgroundDesktopSrc || backgroundMobileSrc);

  const steps = useMemo(() => {
    const cmsSteps = (sectionData.steps ?? []) as SavingsPlanStep[];
    return cmsSteps
      .filter((step) => step?.isActive !== false && step?.description?.trim())
      .map((step, index) => ({
        ...step,
        stepNumber: step.stepNumber ?? index + 1,
      }));
  }, [sectionData.steps]);

  if (!isSectionActive(sectionData.isActive)) return null;

  if (isLoading) {
    return (
      <section
        id={id}
        className="relative w-full overflow-hidden bg-chalkCard py-16 md:bg-gray300 md:py-104"
        aria-busy="true"
        aria-label="Diamonds for Everyone"
      >
        <div className="relative mx-auto flex w-full max-w-[1360px] flex-col items-center gap-8 px-4 md:gap-10 md:px-10">
          <div className="flex w-full flex-col items-center gap-6 md:max-w-[510px]">
            <div className="h-4 w-40 rounded bg-black/10" aria-hidden />
            <div className="flex w-full flex-col items-center gap-3 md:gap-4">
              <div className="h-10 w-full max-w-[320px] rounded bg-black/10" aria-hidden />
              <div className="h-5 w-full max-w-[280px] rounded bg-black/10" aria-hidden />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!sectionData.fromCms || !sectionTitle || steps.length === 0) {
    return null;
  }

  return (
    <section
      id={id}
      aria-label={sectionTitle}
      className="relative w-full overflow-hidden bg-chalkCard py-16 md:bg-gray300 md:py-104 md:min-h-[550px] min-h-auto"
    >
      {hasBackgroundTexture ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 flex h-[651px] w-[max(100vw,1339px)] -translate-x-1/2 items-center justify-center mix-blend-color-burn md:hidden">
            <div className="rotate-90">
              <Image
                src={backgroundMobileSrc}
                alt={backgroundMobileAlt}
                width={651}
                height={1339}
                className="h-[max(100vw,1339px)] w-[651px] object-bottom"
              />
            </div>
          </div>
          <div className="absolute left-1/2 top-1/2 hidden h-[700px] w-[max(100vw,1440px)] -translate-x-1/2 -translate-y-1/2 items-center justify-center mix-blend-color-burn md:flex">
            <div className="rotate-90">
              <Image
                src={backgroundDesktopSrc}
                alt={backgroundDesktopAlt}
                width={700}
                height={1440}
                className="h-[max(100vw,1440px)] w-[700px] object-bottom"
              />
            </div>
          </div>
        </div>
      ) : null}

      <div className="relative mx-auto flex w-full max-w-[1360px] flex-col items-center gap-8 px-4 md:gap-10 md:px-10">
        <div className="flex w-full flex-col items-center gap-6 text-center md:max-w-[510px]">
          {eyebrow ? (
            <Reveal as="p" direction="up" className="font-gill text-sm font-semibold leading-110 text-linkGold md:text-base md:font-normal">
              {eyebrow}
            </Reveal>
          ) : null}
          <div className="flex w-full flex-col items-center gap-3 md:gap-4">
            <Reveal as="h2" direction="up" className="w-full whitespace-nowrap font-larken font-light leading-110 text-darkblack lg:text-5xl md:text-4xl text-32">
              {sectionTitle}
            </Reveal>
            {subtitle ? (
              <Reveal direction="up" className="w-full font-gill text-base font-light leading-110 text-neutral500 lg:text-xl md:text-lg">
                {subtitle}
              </Reveal>
            ) : null}
          </div>
        </div>
        <div className="hidden w-full flex-col items-center gap-6 md:flex">
          <ScrollReveal delayMs={200} className="relative h-10 w-full lg:w-[740px] w-[700px] mx-auto">
            <div className="pointer-events-none absolute left-1/2 top-[calc(50%+1px)] w-full lg:w-[740px] md:w-[510px] w-[530px] mx-auto -translate-x-1/2 -translate-y-1/2">
              <div className="w-full border-[0.5px] border-dashed border-neutral500"></div>
            </div>
            <div className="relative flex h-10 items-center justify-between lg:w-[740px] md:w-[510px] w-[700px] mx-auto px-0">
              {steps.map((step) => (
                <StepCircle key={step.stepNumber} number={step.stepNumber ?? 0} />
              ))}
            </div>
          </ScrollReveal>
          <div className="flex xl:w-[980px] justify-between gap-10">
            {steps.map((step, index) => (
              <ScrollReveal key={step.stepNumber} delayMs={280 + index * 80} className="lg:w-[250px] w-[200px]">
                <StepDescription
                  step={step}
                  className="text-center font-gill lg:text-xl text-base font-light leading-110 text-darkblack"
                />
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
              <StepCircle number={step.stepNumber ?? 0} />
              <StepDescription
                step={step}
                className="w-[250px] text-center font-gill text-base font-light leading-110 text-darkblack"
              />
            </ScrollReveal>
          ))}
        </div>
        {ctaUrl && ctaLabel ? (
          <Link href={ctaUrl} className="relative after:bg-darkMagenta after:absolute after:h-0.5 after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer border-b-[1.5px] border-darkblack hover:border-darkMagenta sm:pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack hover:text-darkMagenta">
            {ctaLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
};

export default DiamondsForEveryoneSection;
