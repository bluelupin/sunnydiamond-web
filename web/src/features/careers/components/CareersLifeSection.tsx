"use client";

import Image from "next/image";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import Reveal from "@/shared/Animation/Reveal";
import type { NormalizedCareerLifeSection } from "@/services/careers/careers.types";

type CareersLifeSectionProps = {
  lifeAt: NormalizedCareerLifeSection;
};

const CareersLifeSection = ({ lifeAt }: CareersLifeSectionProps) => {
  return (
    <section
      id="life-at-sunny"
      aria-labelledby="careers-life-title"
      className="bg-gray300 px-4 py-16 md:px-10 md:py-104"
    >
      <div className="flex w-full flex-col gap-6 md:flex-row md:items-stretch md:gap-10">
        <div className="flex w-full flex-col gap-6 md:max-w-[474px] md:shrink-0 md:gap-10">
          <Reveal direction="up">
            <h2
              id="careers-life-title"
              className="w-full whitespace-pre-wrap font-larken text-32 font-light leading-110 text-darkblack md:text-5xl max-w-[300px]"
            >
              {lifeAt.title}
            </h2>
          </Reveal>

          <Reveal direction="up" className="relative hidden h-[496px] overflow-hidden md:block">
            <Image
              src={lifeAt.leftImage.desktopUrl}
              alt={lifeAt.leftImage.alt}
              width={474}
              height={496}
              className="absolute top-0 left-[-15.45%] h-full w-[143.63%] max-w-none object-cover"
            />
          </Reveal>
        </div>

        <Reveal
          direction="up"
          className="flex w-full flex-col gap-4 md:min-w-0 md:flex-1 md:justify-center md:gap-6 md:self-stretch"
        >
          <p className="w-full font-gill text-sm font-light leading-110 text-neutral500 md:text-xl md:font-normal md:text-darkblack">
            {lifeAt.description}
          </p>
          {lifeAt.quote ? (
            <div className="flex w-full items-end gap-2 md:items-center">
              <span
                className="h-9 w-px shrink-0 bg-darkMagenta md:h-[38px] md:w-[1.5px]"
                aria-hidden
              />
              <p className="max-w-[213px] shrink-0 font-gill text-sm font-light leading-110 text-[#696969] md:max-w-[292px] md:text-base md:text-darkblack">
                &ldquo;{lifeAt.quote}&rdquo;
              </p>
            </div>
          ) : null}
        </Reveal>

        <Reveal direction="up" className="flex w-full items-center gap-4 md:hidden">
          <div className="relative h-[226px] w-[165.5px] shrink-0 overflow-hidden">
            <Image
              src={lifeAt.leftImage.mobileUrl}
              alt={lifeAt.leftImage.alt}
              width={310}
              height={226}
              className="absolute top-0 left-[-20.07%] h-full w-[187.44%] max-w-none object-cover"
            />
          </div>
          <div className="relative h-[200px] w-[146px] shrink-0 overflow-hidden">
            <Image
              src={lifeAt.rightImage.mobileUrl}
              alt={lifeAt.rightImage.alt}
              width={344}
              height={251}
              className="absolute top-[-10.98%] left-[-121.93%] h-[125.59%] w-[235.4%] max-w-none object-cover"
            />
          </div>
        </Reveal>

        <Reveal
          direction="up"
          className="relative hidden h-[496px] w-[474px] shrink-0 overflow-hidden md:block md:self-start"
        >
          <Image
            src={lifeAt.rightImage.desktopUrl}
            alt={lifeAt.rightImage.alt}
            width={474}
            height={496}
            className="absolute top-[-29.32%] left-[-140.28%] h-[179.11%] w-[257.26%] max-w-none object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
};

export default CareersLifeSection;
