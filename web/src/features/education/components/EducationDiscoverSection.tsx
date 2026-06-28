import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import { cn } from "@/shared/utils/cn";
import {
  educationDiscoverContent,
  educationDiscoverSpec,
  educationPageImages,
} from "../data/content";

const spec = educationDiscoverSpec;
const stepsSpec = spec.steps;

const DiscoverImage = ({
  width,
  height,
  crop,
  sizes,
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
}) => (
  <div className="relative overflow-hidden" style={{ width, height }}>
    <Image
      src={educationPageImages.discoverImage}
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
      <div className="flex items-center gap-4 lg:hidden">
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
      <div className="hidden w-full items-start gap-4 lg:flex">
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

/** Figma 692:29077 (desktop) + 692:28767 (mobile) content stack */
const DiscoverContent = () => (
  <div className="flex w-full flex-col items-start gap-8 lg:gap-40">
    <div className="flex w-full flex-col items-start gap-8 lg:gap-40">
      <div className="flex w-full flex-col items-start gap-3 lg:gap-4">
        <h2
          id="education-discover-title"
          className="w-full font-larken text-[32px] font-light leading-110 text-darkblack lg:text-[48px]"
        >
          <span className="lg:hidden">
            {educationDiscoverContent.mobileTitleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </span>
          <span className="hidden lg:inline">{educationDiscoverContent.title}</span>
        </h2>
        <p className="w-full font-gill text-base font-light leading-110 text-darkblack lg:max-w-[531px] lg:text-[20px] lg:text-neutral500">
          {educationDiscoverContent.description}
        </p>
      </div>

      <DiscoverSteps />
    </div>

    <Link
      href={educationDiscoverContent.ctaHref}
      className="btn-border-slide inline-flex h-14 min-w-[199px] shrink-0 items-center justify-center whitespace-nowrap border border-neutral300 px-7 py-5 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
    >
      {educationDiscoverContent.ctaLabel}
    </Link>
  </div>
);

const EducationDiscoverSection = () => {
  const desktopImage = spec.image.desktop;
  const mobileImage = spec.image.mobile;

  return (
    <section
      aria-labelledby="education-discover-title"
      className="relative h-[743px] overflow-hidden bg-gray300 lg:h-[615px]"
    >
      <div
        className="absolute bottom-0 left-0 hidden mix-blend-darken lg:block"
        style={{ width: desktopImage.width, height: desktopImage.height }}
      >
        <ScrollReveal delayMs={180} className="relative h-full w-full">
          <DiscoverImage
            width={desktopImage.width}
            height={desktopImage.height}
            crop={desktopImage}
            sizes={`${desktopImage.width}px`}
          />
        </ScrollReveal>
      </div>

      <div
        className="pointer-events-none absolute mix-blend-darken lg:hidden"
        style={{
          left: mobileImage.left,
          top: mobileImage.top,
          width: mobileImage.width,
          height: mobileImage.height,
        }}
      >
        <ScrollReveal delayMs={140} className="h-full w-full">
          <div className="-scale-y-100 rotate-180">
            <DiscoverImage
              width={mobileImage.width}
              height={mobileImage.height}
              crop={mobileImage}
              sizes={`${mobileImage.width}px`}
            />
          </div>
        </ScrollReveal>
      </div>

      <div className="relative z-10 flex h-full flex-col px-4 py-16 lg:absolute lg:inset-y-0 lg:left-[calc(50%+294.5px)] lg:top-1/2 lg:h-auto lg:w-[585px] lg:-translate-x-1/2 lg:-translate-y-1/2 lg:justify-center lg:px-0 lg:py-0">
        <ScrollReveal delayMs={0} className="w-full">
          <DiscoverContent />
        </ScrollReveal>
      </div>
    </section>
  );
};

export default EducationDiscoverSection;
