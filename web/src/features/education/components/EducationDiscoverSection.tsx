import Link from "next/link";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { cn } from "@/shared/utils/cn";
import type { NormalizedEducationCtaBanner } from "@/services/education/learn-about-diamonds-page.types";
import { educationDiscoverSpec } from "../data/content";
import Reveal from "@/shared/Animation/Reveal";

const spec = educationDiscoverSpec;
const stepsSpec = spec.steps;

const StepConnectorLine = ({ className }: { className?: string }) => (
  <div
    aria-hidden
    className={cn(
      "pointer-events-none absolute top-1/2 w-px -translate-y-1/2 bg-neutral500",
      className,
    )}
    style={{ height: stepsSpec.desktop.lineHeight }}
  />
);

const DiscoverSteps = ({ steps }: { steps: string[] }) => (
  <div className="lg:mb-10 mb-8 w-full items-start gap-4 flex">
    <div className="relative flex shrink-0 flex-col items-start gap-10">
      <StepConnectorLine className="left-2" />
      {steps.map((_, index) => (
        <div
          key={index}
          className="relative z-10 flex h-[26px] w-4 shrink-0 items-center justify-center rounded-full border-[0.4px] border-darkblack bg-white p-1"
        >
          <span className="font-gill text-sm font-light leading-none tracking-[0.14px] text-darkblack">
            {index + 1}
          </span>
        </div>
      ))}
    </div>
    <ol className="flex flex-col justify-between self-stretch font-gill lg:text-xl md:text-lg text-base font-light leading-110 text-darkblack">
      {steps.map((step) => (
        <li key={step} className="whitespace-nowrap">
          {step}
        </li>
      ))}
    </ol>
  </div>
);

type DiscoverContentProps = Pick<
  NormalizedEducationCtaBanner,
  "heading" | "subheading" | "ctaLabel" | "ctaHref" | "steps"
>;

const DiscoverContent = ({
  heading,
  subheading,
  ctaLabel,
  ctaHref,
  steps,
}: DiscoverContentProps) => (
  <>
    <h2
      id="education-discover-title"
      className="lg:mb-4 mb-3 w-full font-larken font-light leading-110 text-darkblack lg:text-5xl md:text-4xl sm:text-3xl text-32"
    >
      {heading}
    </h2>
    <p className="lg:mb-10 mb-8 font-gill font-light leading-110 lg:text-xl md:text-lg text-base lg:text-neutral500 text-darkblack">
      {subheading}
    </p>
    {steps.length > 0 ? <DiscoverSteps steps={steps} /> : null}
    {ctaLabel && ctaHref ? (
      <Link
        href={ctaHref}
        className="btn-border-slide inline-flex h-14 min-w-[199px] shrink-0 items-center justify-center whitespace-nowrap border border-neutral300 px-7 py-5 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
      >
        {ctaLabel}
      </Link>
    ) : null}
  </>
);

type EducationDiscoverSectionProps = {
  ctaBanner: NormalizedEducationCtaBanner;
};

const EducationDiscoverSection = ({ ctaBanner }: EducationDiscoverSectionProps) => {
  const hasImage = ctaBanner.hasCmsBackgroundImage && Boolean(ctaBanner.imageDesktopUrl);

  return (
    <section aria-labelledby="education-discover-title" className="bg-gray300">
      <div className="flex w-full flex-col md:grid md:grid-cols-2 md:items-end lg:gap-20 md:gap-8">
        {hasImage ? (
          <Reveal direction="up" className="flex w-full mix-blend-darken md:order-1 order-2 lg:justify-start justify-end">
            <ResponsiveImage
              desktopSrc={ctaBanner.imageDesktopUrl}
              mobileSrc={ctaBanner.imageMobileUrl}
              alt={ctaBanner.imageAlt || ctaBanner.heading}
              width={621}
              height={585}
              quality={85}
              className="h-full w-full object-cover object-center"
            />
          </Reveal>
        ) : null}
        <Reveal
          direction="up"
          className={cn(
            "md:order-2 order-1 w-full max-w-640 lg:justify-start justify-center lg:pt-100 lg:pb-100 pt-16 lg:px-0 px-4 md:mx-0 mx-auto py-10",
            !hasImage && "md:col-span-2",
          )}
        >
          <DiscoverContent
            heading={ctaBanner.heading}
            subheading={ctaBanner.subheading}
            ctaLabel={ctaBanner.ctaLabel}
            ctaHref={ctaBanner.ctaHref}
            steps={ctaBanner.steps}
          />
        </Reveal>
      </div>
    </section>
  );
};

export default EducationDiscoverSection;
