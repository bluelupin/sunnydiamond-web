"use client";

import Image from "next/image";
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
      className="md:bg-gray300"
    >
      <div className="flex w-full 2xl:max-w-1920 mx-auto max-w-1440 2xl:px-[60px] lg:px-10 md:px-8 px-4 md:pt-104 pt-10 md:pb-104 mt-0 pb-16 flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)_minmax(0,1fr)] lg:items-stretch lg:gap-10">
        <div className="flex w-full min-w-0 flex-col gap-6 max-w-[300px] lg:max-w-none lg:gap-10">
          <Reveal direction="up">
            <h2
              id="careers-life-title"
              className="w-full whitespace-pre-wrap font-larken text-32 font-light leading-110 text-darkblack md:text-5xl max-w-[300px]"
            >
              {lifeAt.title}
            </h2>
          </Reveal>
          <Reveal direction="up" className="relative hidden aspect-[474/496] w-full overflow-hidden lg:block">
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
          {lifeAt.additionalDescription ? (
            <p className="w-full font-gill text-sm font-light leading-110 text-neutral500 md:text-xl md:font-normal md:text-darkblack">
              {lifeAt.additionalDescription}
            </p>
          ) : null}
          {lifeAt.quote ? (
            <div className="flex w-full min-w-0 gap-2 items-center">
              <span
                className="h-9 w-px shrink-0 bg-darkMagenta md:h-[38px] md:w-[1.5px]"
                aria-hidden
              />
              <p className="min-w-0 max-w-full font-gill text-sm font-light leading-110 text-[#696969] lg:max-w-[292px] md:text-base md:text-darkblack">
                &ldquo;{lifeAt.quote}&rdquo;
              </p>
            </div>
          ) : null}
        </Reveal>

        <Reveal direction="up" className="grid grid-cols-2 w-full items-center gap-4 lg:hidden">
          <div className="relative aspect-[474/496] w-full overflow-hidden">
            <Image
              src={lifeAt.leftImage.mobileUrl || lifeAt.leftImage.desktopUrl}
              alt={lifeAt.leftImage.alt}
              width={310}
              height={226}
              className={!lifeAt.leftImage.mobileUrl || lifeAt.leftImage.mobileUrl === lifeAt.leftImage.desktopUrl
                ? "absolute top-0 left-[-15.45%] h-full w-[143.63%] max-w-none object-cover"
                : "h-full w-full object-cover"}
            />
          </div>
          <div className="relative aspect-[474/496] w-full overflow-hidden">
            <Image
              src={lifeAt.rightImage.mobileUrl || lifeAt.rightImage.desktopUrl}
              alt={lifeAt.rightImage.alt}
              width={344}
              height={251}
              className={!lifeAt.rightImage.mobileUrl || lifeAt.rightImage.mobileUrl === lifeAt.rightImage.desktopUrl
                ? "absolute top-[-29.32%] left-[-140.28%] h-[179.11%] w-[257.26%] max-w-none object-fill"
                : "h-full w-full object-cover"}
            />
          </div>
        </Reveal>
        <Reveal
          direction="up"
          className="relative hidden aspect-[474/496] w-full overflow-hidden lg:block lg:self-start"
        >
          <Image
            src={lifeAt.rightImage.desktopUrl}
            alt={lifeAt.rightImage.alt}
            width={474}
            height={496}
            className="absolute top-[-29.32%] left-[-140.28%] h-[179.11%] w-[257.26%] max-w-none object-fill"
          />
        </Reveal>
      </div>
    </section>
  );
};

export default CareersLifeSection;
