"use client";

import Image from "next/image";
import Reveal from "@/shared/Animation/Reveal";
import type { NormalizedGiftingIntro } from "@/services/gifting/gifting-page.types";

type GiftingWithLoveSectionProps = {
  intro: NormalizedGiftingIntro;
};

const GiftingWithLoveSection = ({ intro }: GiftingWithLoveSectionProps) => {
  return (
    <section
      aria-labelledby="gifting-with-love-title"
      className="relative left-1/2 md:min-h-[280px] min-h-[200px] w-screen max-w-none -translate-x-1/2 overflow-hidden px-4 py-16 md:min-h-[321px] md:px-10 md:py-100"
    >
      {intro.background ? (
        <Image
          src={intro.background.desktopUrl}
          alt={intro.background.alt}
          fill
          className="object-cover object-center"
          sizes="100vw"
          aria-hidden
        />
      ) : null}
      <div
        className="section-radial absolute inset-0"
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-[640px] flex-col items-center md:gap-4 gap-3 text-center">
        <Reveal
          as="h2"
          id="gifting-with-love-title"
          direction="up"
          className="font-larken lg:text-5xl md:text-4xl text-32 font-light leading-110 text-darkblack"
        >
          {intro.title}
        </Reveal>
        {intro.description ? (
          <Reveal
            as="p"
            direction="up"
            className="font-gill lg:text-xl md:text-lg text-base font-light leading-110 text-darkblack"
          >
            {intro.description}
          </Reveal>
        ) : null}
      </div>
    </section>
  );
};

export default GiftingWithLoveSection;
