"use client";

import Link from "next/link";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import Reveal from "@/shared/Animation/Reveal";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { StepCircle } from "@/shared/ui/StepCircle";
import type {
  NormalizedDfeBenefitStep,
  NormalizedDfeBenefits,
} from "@/services/diamonds-for-everyone/diamonds-for-everyone-page.types";
import { cn } from "@/shared/utils/cn";
import { useUiPlatform } from "@/shared/hooks/use-ui-platform";

const SAVINGS_PLAN_DESKTOP_VIGNETTE =
  "radial-gradient(ellipse 90% 80% at 62% 58%, rgba(244,243,238,0) 0%, rgba(244,243,238,1) 100%)";

/** Figma 4453:39478 — rotated silk texture (not the CMS bangles photo). */
const SAVINGS_PLAN_HORIZONTAL_TEXTURE = "/images/horizontal-texture.png";

const StepContent = ({
  step,
  variant,
}: {
  step: NormalizedDfeBenefitStep;
  variant: "mobile" | "desktop";
}) => (
  <div
    className={
      variant === "mobile"
        ? "flex w-full flex-col items-center gap-3 text-center"
        : "flex flex-col gap-3 text-center"
    }
  >
    {step.title ? (
      <p
        className={
          variant === "mobile"
            ? "font-larken text-xl font-light leading-110 text-darkblack"
            : "font-larken text-xl font-light leading-110 text-darkblack lg:text-2xl"
        }
      >
        {step.title}
      </p>
    ) : null}
    <p
      className={
        variant === "mobile"
          ? "w-full font-gill text-sm font-normal leading-110 text-darkblack"
          : "font-gill text-base font-light leading-110 text-darkblack lg:text-xl"
      }
    >
      {step.highlightedText ? (
        <>
          <span className="font-light">{step.description}</span>
          <span className="font-normal">{step.highlightedText}</span>
        </>
      ) : (
        <span className={variant === "mobile" ? "font-normal" : "font-light"}>
          {step.description}
        </span>
      )}
    </p>
  </div>
);

type DfeSavingsPlanSectionProps = {
  benefits: NormalizedDfeBenefits;
};

const DfeSavingsPlanSection = ({ benefits }: DfeSavingsPlanSectionProps) => {
  const { steps } = benefits;
  const backgroundImage = benefits.backgroundImage;
  const desktopBg =
    backgroundImage?.desktopUrl?.trim() || backgroundImage?.mobileUrl?.trim() || "";
  const mobileBg =
    backgroundImage?.mobileUrl?.trim() || backgroundImage?.desktopUrl?.trim() || "";
  const backgroundAlt =
    backgroundImage?.desktopAlt?.trim() || backgroundImage?.mobileAlt?.trim() || "";
  const hasBackground = Boolean(desktopBg || mobileBg);
  const ctaLabel = benefits.cta?.label?.trim();
  const ctaUrl = benefits.cta?.url?.trim();
  const { windows } = useUiPlatform();
  return (
    <section
      aria-labelledby="dfe-savings-plan-title"
      className="relative w-full overflow-hidden bg-chalkCard py-16 md:bg-transparent md:py-[89px]"
    >
      {hasBackground ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {/* Mobile — Figma 4453:39477 */}
          {mobileBg ? (
            <>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 md:hidden"
              >
                <div className="absolute inset-0 overflow-hidden">
                  <ResponsiveImage
                    desktopSrc={mobileBg}
                    mobileSrc={mobileBg}
                    alt=""
                    width={634}
                    height={1304}
                    sizes="100vw"
                    className="absolute top-[0.01%] left-[-276.26%] h-full max-w-none w-[523.2%] object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-[rgba(244,243,238,0.8)]" />
              </div>
              <div className="absolute top-[-4px] left-1/2 flex h-[634px] w-[1304px] -translate-x-1/2 items-center justify-center mix-blend-color-burn md:hidden">
                <div className="flex-none rotate-90">
                  <div className="relative h-[1304px] w-[634px]">
                    <ResponsiveImage
                      desktopSrc={SAVINGS_PLAN_HORIZONTAL_TEXTURE}
                      mobileSrc={SAVINGS_PLAN_HORIZONTAL_TEXTURE}
                      alt=""
                      width={634}
                      height={1304}
                      sizes="100vw"
                      className="pointer-events-none absolute inset-0 size-full max-w-none object-bottom object-cover"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : null}
          {/* Desktop — Figma 4453:34199 */}
          {desktopBg ? (
            <div className="absolute inset-0 hidden overflow-hidden md:block">
              <div className="relative size-full">
                <ResponsiveImage
                  desktopSrc={desktopBg}
                  mobileSrc={mobileBg || desktopBg}
                  alt={backgroundAlt}
                  desktopAlt={backgroundImage?.desktopAlt}
                  mobileAlt={backgroundImage?.mobileAlt}
                  fill
                  sizes="100vw"
                  className="max-w-none object-cover top-0 left-[-7.34%] h-[102.42%] w-[115.38%]"
                />
              </div>
              <div
                className="absolute inset-0 opacity-70"
                style={{ background: SAVINGS_PLAN_DESKTOP_VIGNETTE }}
              />
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="relative mx-auto flex w-full max-w-[1360px] flex-col items-center gap-8 px-4 md:gap-10 md:px-10">
        <div className="flex w-full max-w-[620px] flex-col items-center gap-6 text-center md:max-w-[510px]">
          {benefits.eyebrow ? (
            <Reveal
              as="p"
              direction="up"
              className="font-gill text-sm font-semibold leading-110 text-linkGold md:text-base md:font-normal"
            >
              {benefits.eyebrow}
            </Reveal>
          ) : null}
          <div className="flex w-full flex-col items-center gap-4 md:gap-4">
            <Reveal
              as="h2"
              id="dfe-savings-plan-title"
              direction="up"
              className="w-full font-larken text-32 font-light leading-110 text-darkblack md:text-4xl lg:text-5xl"
            >
              {benefits.title}
            </Reveal>
            {benefits.subtitle ? (
              <Reveal
                as="p"
                direction="up"
                className="w-full font-gill text-sm font-normal leading-110 text-neutral500 md:text-lg md:font-light lg:text-xl"
              >
                {benefits.subtitle}
              </Reveal>
            ) : null}
          </div>
        </div>

        {steps.length > 0 ? (
          <>
            <div className="hidden w-full flex-col items-center gap-6 md:flex">
              <ScrollReveal delayMs={200} className="relative mx-auto h-10 w-full max-w-[700px] lg:max-w-[740px]">
                <div className="pointer-events-none absolute top-[calc(50%+1px)] left-1/2 mx-auto w-full max-w-[530px] -translate-x-1/2 -translate-y-1/2 lg:max-w-[740px] md:max-w-[510px]">
                  <div className="w-full border-[0.5px] border-dashed border-neutral500" />
                </div>
                <div className="relative mx-auto flex h-10 w-full max-w-[700px] items-center justify-between px-0 lg:max-w-[740px] md:max-w-[510px]">
                  {steps.map((step) => (
                    <StepCircle
                      key={step.id}
                      number={step.stepNumber}
                      className="relative z-10 box-border flex size-10 shrink-0 items-center justify-center rounded-full border-[0.571px] border-solid border-darkblack bg-lightGold"
                      numberClassName={cn(!windows && "translate-y-0.5", "font-gill text-xl font-light tracking-[0.2px] text-darkblack")}
                    />
                  ))}
                </div>
              </ScrollReveal>
              <div className="flex w-full max-w-[770px] justify-between gap-6 lg:max-w-[980px] lg:gap-10">
                {steps.map((step, index) => (
                  <ScrollReveal
                    key={step.id}
                    delayMs={280 + index * 80}
                    className="w-[200px] text-center lg:w-[250px]"
                  >
                    <StepContent step={step} variant="desktop" />
                  </ScrollReveal>
                ))}
              </div>
            </div>

            <div className="flex w-full flex-col items-center gap-12 md:hidden px-4">
              {steps.map((step, index) => (
                <ScrollReveal
                  key={step.id}
                  delayMs={240 + index * 80}
                  className="flex w-full flex-col items-center gap-4"
                >
                  <StepCircle
                    number={step.stepNumber}
                    className="relative z-10 box-border flex size-10 shrink-0 items-center justify-center rounded-full border-[0.571px] border-solid border-darkblack bg-lightGold"
                    numberClassName={cn(!windows && "translate-y-0.5", "font-gill text-xl font-light tracking-[0.2px] text-darkblack")}
                  />
                  <StepContent step={step} variant="mobile" />
                </ScrollReveal>
              ))}
            </div>
          </>
        ) : null}

        {ctaUrl && ctaLabel ? (
          <Link
            href={ctaUrl}
            className="relative cursor-pointer font-gill text-sm font-normal uppercase leading-110 text-darkblack sm:pb-1 text-tertiary-cta-underline"
          >
            {ctaLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
};

export default DfeSavingsPlanSection;
