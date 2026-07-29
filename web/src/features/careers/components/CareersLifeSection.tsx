"use client";

import Image from "next/image";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import Reveal from "@/shared/Animation/Reveal";
import { careersPageContent } from "@/features/careers/data/content";

const CareersLifeSection = () => {
  const { lifeAt } = careersPageContent;
  const titleLines = lifeAt.title.split("\n");

  return (
    <section
      id="life-at-sunny"
      aria-labelledby="careers-life-title"
      className="bg-gray300 px-4 py-16 md:px-10 md:py-104"
    >
      <div className="flex w-full flex-col gap-6 md:flex-row md:items-stretch md:gap-10">
        <div className="flex flex-col gap-6 md:min-w-0 md:max-w-[474px] md:flex-[0_1_474px] md:gap-10">
          <Reveal direction="up">
            <h2
              id="careers-life-title"
              className="font-larken text-32 font-light leading-110 text-darkblack md:text-5xl"
            >
              {titleLines.map((line, index) => (
                <span key={line}>
                  {line}
                  {index < titleLines.length - 1 ? <br /> : null}
                </span>
              ))}
            </h2>
          </Reveal>

          <Reveal
            direction="up"
            className="relative hidden h-[496px] overflow-hidden md:block"
          >
            <ResponsiveImage
              desktopSrc={lifeAt.leftImage.desktopUrl}
              mobileSrc={lifeAt.leftImage.mobileUrl}
              alt={lifeAt.leftImage.alt}
              width={474}
              height={496}
              className="size-full object-cover"
            />
          </Reveal>
        </div>

        <Reveal
          direction="up"
          className="flex flex-col gap-4 md:min-w-0 md:flex-1 md:justify-center md:gap-6 md:self-stretch"
        >
          <p className="font-gill text-sm font-light leading-110 text-neutral500 md:text-xl md:font-normal md:text-darkblack">
            {lifeAt.description}
          </p>
          <div className="flex items-end gap-2 md:items-center">
            <span
              className="h-9 w-px shrink-0 bg-darkMagenta md:h-[38px] md:w-[1.5px]"
              aria-hidden
            />
            <p className="max-w-[213px] font-gill text-sm font-light leading-110 text-[#696969] md:max-w-[292px] md:text-base md:text-darkblack">
              &ldquo;{lifeAt.quote}&rdquo;
            </p>
          </div>
        </Reveal>

        <Reveal direction="up" className="flex items-center gap-4 md:hidden">
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
          <ResponsiveImage
            desktopSrc={lifeAt.rightImage.desktopUrl}
            mobileSrc={lifeAt.rightImage.mobileUrl}
            alt={lifeAt.rightImage.alt}
            width={474}
            height={496}
            className="size-full object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
};

export default CareersLifeSection;
