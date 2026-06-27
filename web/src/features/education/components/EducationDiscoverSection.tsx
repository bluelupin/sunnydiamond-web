import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import {
  educationDiscoverContent,
  educationDiscoverSpec,
  educationPageImages,
} from "../data/content";

const spec = educationDiscoverSpec;

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
      fill
      className="max-w-none object-cover"
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

      {/* Figma 692:28767 — px-16 py-64, gap-32 between content block and CTA */}
      <div className="relative z-10 flex h-full flex-col gap-8 px-4 py-16 lg:absolute lg:inset-y-0 lg:left-[calc(50%+294.5px)] lg:top-1/2 lg:h-auto lg:w-[585px] lg:-translate-x-1/2 lg:-translate-y-1/2 lg:justify-center lg:gap-10 lg:px-0 lg:py-0">
        {/* Figma 692:28768 — header + steps, gap-32 */}
        <div className="flex w-full flex-col gap-8 lg:gap-10">
          <ScrollReveal delayMs={0}>
            {/* Figma 692:28769 — title block, gap-12 */}
            <div className="flex w-full flex-col gap-3 lg:gap-4">
              <h2
                id="education-discover-title"
                className="font-larken text-[32px] font-light leading-110 text-darkblack lg:text-[48px]"
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
          </ScrollReveal>

          <ScrollReveal delayMs={120}>
            {/* Figma 692:28772 — steps row, gap-16, h-162 on mobile */}
            <div className="flex h-[162px] gap-4 lg:h-auto">
              {/* Figma 692:28773 — number column, w-14, gap-48 */}
              <div className="relative flex w-[14px] shrink-0 flex-col gap-12 lg:w-4 lg:gap-10">
                <div
                  aria-hidden
                  className="absolute left-1/2 top-1/2 h-[125.86px] w-px -translate-x-1/2 -translate-y-1/2 bg-neutral500 lg:left-2 lg:h-[158px] lg:translate-x-0"
                />
                {educationDiscoverContent.steps.map((_, index) => (
                  <div
                    key={index}
                    className="relative z-10 flex h-[22px] w-[14px] shrink-0 items-center justify-center rounded-full border-[0.4px] border-darkblack bg-white p-1 lg:h-[26px] lg:w-4"
                  >
                    <span className="font-gill text-xs font-light leading-none tracking-[0.12px] text-darkblack lg:text-[14px] lg:tracking-[0.14px]">
                      {index + 1}
                    </span>
                  </div>
                ))}
              </div>

              {/* Figma 692:28781 — step labels, justify-between, 16px */}
              <ol className="flex flex-col justify-between font-gill text-base font-light leading-110 text-darkblack lg:text-[20px]">
                {educationDiscoverContent.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          </ScrollReveal>
        </div>

        {/* Figma 692:28785 — CTA, 199×56 */}
        <ScrollReveal delayMs={220}>
          <Link
            href={educationDiscoverContent.ctaHref}
            className="btn-border-slide inline-flex h-14 w-[199px] items-center justify-center border border-neutral300 px-7 py-5 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
          >
            {educationDiscoverContent.ctaLabel}
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default EducationDiscoverSection;
