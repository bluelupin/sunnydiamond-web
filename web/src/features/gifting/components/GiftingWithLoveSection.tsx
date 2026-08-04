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
      className="relative left-1/2 min-h-[280px] w-screen max-w-none -translate-x-1/2 overflow-hidden px-4 py-16 md:min-h-[321px] md:px-10 md:py-100"
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
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(244,243,238,0)_0%,rgba(251,250,246,1)_100%)]"
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-[640px] flex-col items-center gap-4 text-center">
        <Reveal
          as="h2"
          id="gifting-with-love-title"
          direction="up"
          className="font-larken text-5xl font-light leading-110 text-darkblack"
        >
          {intro.title}
        </Reveal>
        {intro.description ? (
          <Reveal
            as="p"
            direction="up"
            className="font-gill text-xl font-light leading-110 text-darkblack"
          >
            {intro.description}
          </Reveal>
        ) : null}
      </div>
    </section>
  );
};

export default GiftingWithLoveSection;
