"use client";

import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import Reveal from "@/shared/Animation/Reveal";
import { careersPageContent } from "../data/content";

const CareersLifeSection = () => {
  const { lifeAt } = careersPageContent;

  return (
    <section
      id="life-at-sunny"
      aria-labelledby="careers-life-title"
      className="bg-white px-4 py-16 md:px-10 md:py-100"
    >
      <div className="mx-auto flex w-full max-w-1360 flex-col gap-10">
        <div className="flex max-w-[640px] flex-col gap-4">
          <Reveal
            as="h2"
            id="careers-life-title"
            direction="up"
            className="font-larken text-32 font-light leading-110 text-darkblack md:text-4xl lg:text-5xl"
          >
            {lifeAt.title}
          </Reveal>
          <Reveal
            as="p"
            direction="up"
            className="font-gill text-base font-light leading-110 text-neutral500 md:text-lg lg:text-xl"
          >
            {lifeAt.description}
          </Reveal>
        </div>

        <div className="grid gap-8 md:grid-cols-3 md:gap-6">
          {lifeAt.highlights.map((highlight) => (
            <Reveal key={highlight.id} direction="up" className="flex flex-col gap-4">
              <div className="relative h-[240px] w-full overflow-hidden md:h-[320px]">
                <ResponsiveImage
                  desktopSrc={highlight.image.desktopUrl}
                  mobileSrc={highlight.image.mobileUrl}
                  alt={highlight.image.alt}
                  width={440}
                  height={320}
                  className="size-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-larken text-2xl font-light leading-110 text-darkblack">
                  {highlight.title}
                </h3>
                <p className="font-gill text-base font-light leading-110 text-neutral500">
                  {highlight.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CareersLifeSection;
