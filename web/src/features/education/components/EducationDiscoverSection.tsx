import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { cn } from "@/shared/utils/cn";
import type { NormalizedEducationCtaBanner } from "@/services/education/learn-about-diamonds-page.types";
import {
  educationDiscoverContent,
  educationDiscoverSpec,
} from "../data/content";

const spec = educationDiscoverSpec;
const stepsSpec = spec.steps;

const DiscoverStaticImage = ({
  width,
  height,
  crop,
  sizes,
  src,
}: {
  width: number;
  height: number;
  crop: {
    cropHeight: string;
    cropWidth: string;
    cropLeft: string;
    cropTop: string;
  };
  sizes: string;
  src: string;
}) => (
  <div className="relative overflow-hidden" style={{ width, height }}>
    <Image
      src={src}
      alt=""
      width={width}
      height={height}
      className="absolute max-w-none object-cover"
      sizes={sizes}
      style={{
        height: crop.cropHeight,
        width: crop.cropWidth,
        left: crop.cropLeft,
        top: crop.cropTop,
      }}
    />
  </div>
);

const DiscoverCmsImage = ({
  width,
  height,
  sizes,
  desktopSrc,
  mobileSrc,
  alt,
}: {
  width: number;
  height: number;
  sizes: string;
  desktopSrc: string;
  mobileSrc: string;
  alt: string;
}) => (
  <div className="relative overflow-hidden" style={{ width, height }}>
    <ResponsiveImage
      desktopSrc={desktopSrc}
      mobileSrc={mobileSrc}
      alt={alt}
      width={width}
      height={height}
      quality={85}
      sizes={sizes}
      className="absolute inset-0 h-full w-full object-cover object-center"
    />
  </div>
);

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

/** Figma 692:29082 (desktop) + 692:28772 (mobile) */
const DiscoverSteps = () => {
  const { steps: stepLabels } = educationDiscoverContent;
  const pillGap = stepsSpec.desktop.pillGap;
  const pillStackHeight =
    stepsSpec.desktop.pillHeight * stepLabels.length +
    pillGap * (stepLabels.length - 1);

  return (
    <>
      {/* Mobile — items-center per Figma 692:28772 */}
      <div className="flex items-center gap-4 md:hidden">
        <div className="relative flex shrink-0 flex-col items-start gap-40">
          <StepConnectorLine className="left-1/2 -translate-x-1/2" />

          {stepLabels.map((_, index) => (
            <div
              key={index}
              className="relative z-10 flex h-[26px] w-4 shrink-0 items-center justify-center rounded-full border-[0.4px] border-darkblack bg-white p-1"
            >
              <span className="font-gill text-xs font-light leading-none tracking-[0.12px] text-darkblack">
                {index + 1}
              </span>
            </div>
          ))}
        </div>

        <div
          className="flex flex-1 items-center self-stretch"
          style={{ minHeight: pillStackHeight }}
        >
          <ol className="flex h-full w-full flex-col justify-between font-gill text-base font-light leading-110 text-darkblack">
            {stepLabels.map((step) => (
              <li key={step} className="whitespace-nowrap">
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Desktop — items-start per Figma 692:29082 */}
      <div className="hidden w-full items-start gap-4 md:flex">
        <div className="relative flex shrink-0 flex-col items-start gap-40">
          <StepConnectorLine className="left-2" />

          {stepLabels.map((_, index) => (
            <div
              key={index}
              className="relative z-10 flex h-[26px] w-4 shrink-0 items-center justify-center rounded-full border-[0.4px] border-darkblack bg-white p-1"
            >
              <span className="font-gill text-[14px] font-light leading-none tracking-[0.14px] text-darkblack">
                {index + 1}
              </span>
            </div>
          ))}
        </div>

        <ol
          className="flex flex-col justify-between self-stretch font-gill text-[20px] font-light leading-110 text-darkblack"
          style={{ minHeight: pillStackHeight }}
        >
          {stepLabels.map((step) => (
            <li key={step} className="whitespace-nowrap">
              {step}
            </li>
          ))}
        </ol>
      </div>
    </>
  );
};

type DiscoverContentProps = Pick<
  NormalizedEducationCtaBanner,
  "heading" | "subheading" | "ctaLabel" | "ctaHref"
>;

/** Figma 692:29077 (desktop) + 692:28767 (mobile) content stack */
const DiscoverContent = ({ heading, subheading, ctaLabel, ctaHref }: DiscoverContentProps) => (
  <div className="flex w-full flex-col items-start gap-8 lg:gap-40">
    <div className="flex w-full flex-col items-start gap-8 lg:gap-40">
      <div className="flex w-full flex-col items-start gap-3 lg:gap-4">
        <h2
          id="education-discover-title"
          className="w-full font-larken text-[32px] font-light leading-110 text-darkblack lg:text-[48px]"
        >
          {heading}
        </h2>
        <p className="w-full font-gill text-base font-light leading-110 text-darkblack lg:max-w-[531px] lg:text-[20px] lg:text-neutral500">
          {subheading}
        </p>
      </div>

      <DiscoverSteps />
    </div>

    <Link
      href={ctaHref}
      className="btn-border-slide inline-flex h-14 min-w-[199px] shrink-0 items-center justify-center whitespace-nowrap border border-neutral300 px-7 py-5 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
    >
      {ctaLabel}
    </Link>
  </div>
);

type EducationDiscoverSectionProps = {
  ctaBanner: NormalizedEducationCtaBanner;
};

const EducationDiscoverSection = ({ ctaBanner }: EducationDiscoverSectionProps) => {
  const desktopImage = spec.image.desktop;
  const mobileImage = spec.image.mobile;

  const renderDesktopImage = () => {
    if (ctaBanner.hasCmsBackgroundImage) {
      return (
        <DiscoverCmsImage
          width={desktopImage.width}
          height={desktopImage.height}
          sizes={`${desktopImage.width}px`}
          desktopSrc={ctaBanner.imageDesktopUrl}
          mobileSrc={ctaBanner.imageMobileUrl}
          alt={ctaBanner.imageAlt}
        />
      );
    }

    return (
      <DiscoverStaticImage
        width={desktopImage.width}
        height={desktopImage.height}
        crop={desktopImage}
        sizes={`${desktopImage.width}px`}
        src={ctaBanner.imageDesktopUrl}
      />
    );
  };

  const renderMobileImage = () => {
    if (ctaBanner.hasCmsBackgroundImage) {
      return (
        <DiscoverCmsImage
          width={mobileImage.width}
          height={mobileImage.height}
          sizes={`${mobileImage.width}px`}
          desktopSrc={ctaBanner.imageDesktopUrl}
          mobileSrc={ctaBanner.imageMobileUrl}
          alt={ctaBanner.imageAlt}
        />
      );
    }

    return (
      <DiscoverStaticImage
        width={mobileImage.width}
        height={mobileImage.height}
        crop={mobileImage}
        sizes={`${mobileImage.width}px`}
        src={ctaBanner.imageMobileUrl}
      />
    );
  };

  return (
    <section
      aria-labelledby="education-discover-title"
      className="relative h-[743px] overflow-hidden bg-gray300 md:h-[615px]"
    >
      <div
        className="absolute bottom-0 left-0 hidden mix-blend-darken md:block"
        style={{ width: desktopImage.width, height: desktopImage.height }}
      >
        <ScrollReveal delayMs={180} className="relative h-full w-full">
          {renderDesktopImage()}
        </ScrollReveal>
      </div>

      <div
        className="pointer-events-none absolute mix-blend-darken md:hidden"
        style={{
          left: mobileImage.left,
          top: mobileImage.top,
          width: mobileImage.width,
          height: mobileImage.height,
        }}
      >
        <ScrollReveal delayMs={140} className="h-full w-full">
          <div className="-scale-y-100 rotate-180">{renderMobileImage()}</div>
        </ScrollReveal>
      </div>

      <div className="relative z-10 flex h-full flex-col px-4 py-16 lg:absolute lg:inset-y-0 lg:left-[calc(50%+294.5px)] lg:top-1/2 lg:h-auto lg:w-[585px] lg:-translate-x-1/2 lg:-translate-y-1/2 lg:justify-center lg:px-0 lg:py-0">
        <ScrollReveal delayMs={0} className="w-full">
          <DiscoverContent
            heading={ctaBanner.heading}
            subheading={ctaBanner.subheading}
            ctaLabel={ctaBanner.ctaLabel}
            ctaHref={ctaBanner.ctaHref}
          />
        </ScrollReveal>
      </div>
    </section>
  );
};

export default EducationDiscoverSection;
