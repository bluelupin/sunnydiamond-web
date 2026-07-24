"use client";

import Link from "next/link";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import Reveal from "@/shared/Animation/Reveal";
import { careersPageContent } from "../data/content";

const ctaFocusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0a0a] focus-visible:ring-offset-2";

const CareersBespokeInspirationsSection = () => {
  const { bespokeInspirations } = careersPageContent;

  return (
    <section
      id="bespoke-inspirations"
      aria-labelledby="careers-bespoke-title"
      className="relative w-full overflow-hidden"
    >
      <ResponsiveImage
        desktopSrc={bespokeInspirations.image.desktopUrl}
        mobileSrc={bespokeInspirations.image.mobileUrl}
        alt={bespokeInspirations.image.alt}
        width={1440}
        height={560}
        sizes="100vw"
        className="absolute inset-0 size-full object-cover object-center"
      />
      <div aria-hidden className="absolute inset-0 bg-black/55" />

      <div className="relative flex min-h-[420px] flex-col items-center justify-center px-4 py-16 text-center md:min-h-[520px] md:px-10 md:py-100">
        <div className="flex max-w-[720px] flex-col items-center gap-6 md:gap-10">
          <Reveal
            as="h2"
            id="careers-bespoke-title"
            direction="up"
            className="font-larken text-32 font-light leading-110 text-white md:text-4xl lg:text-5xl"
          >
            {bespokeInspirations.title}
          </Reveal>
          <Reveal
            as="p"
            direction="up"
            className="font-gill text-base font-light leading-110 text-white/90 md:text-lg lg:text-xl"
          >
            {bespokeInspirations.description}
          </Reveal>
          <Reveal
            direction="up"
            className="flex flex-col items-center gap-6 md:flex-row md:gap-8"
          >
            <Link
              href={bespokeInspirations.primaryCta.href}
              className={`inline-flex h-14 items-center justify-center bg-white px-8 font-gill text-sm font-normal uppercase leading-110 text-darkblack transition-opacity hover:opacity-90 ${ctaFocusClass}`}
            >
              {bespokeInspirations.primaryCta.label}
            </Link>
            <Link
              href={bespokeInspirations.secondaryCta.href}
              className={`relative cursor-pointer border-b-[1.5px] border-white pb-1 font-gill text-sm font-normal uppercase leading-110 text-white after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full ${ctaFocusClass}`}
            >
              {bespokeInspirations.secondaryCta.label}
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default CareersBespokeInspirationsSection;
