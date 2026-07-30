"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "@/shared/Animation/Reveal";
import { giftingPageContent } from "../data/content";

const GiftingGiftCardSection = () => {
  const { giftCard } = giftingPageContent;

  return (
    <section
      id="gift-card"
      aria-labelledby="gifting-gift-card-title"
      className="relative z-0 left-1/2 w-screen max-w-none -translate-x-1/2 overflow-hidden"
    >
      <div className="relative z-0 min-h-[475px] w-full pb-8 md:h-[520px] md:pb-0">
        <Image
          src={giftCard.background.src}
          alt={giftCard.background.alt}
          fill
          className="object-cover object-center"
          sizes="100vw"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(244,243,238,0)_0%,rgba(251,250,246,1)_100%)]"
          aria-hidden
        />

        <div className="relative mx-auto flex h-full max-w-1440 flex-col items-center px-4 md:flex-row md:items-center md:px-10">
          <div className="flex w-full flex-col gap-10 py-10 md:max-w-[619px] md:py-0">
            <div className="flex flex-col gap-4">
              <Reveal
                as="h2"
                id="gifting-gift-card-title"
                direction="up"
                className="font-larken text-5xl font-light leading-110 text-darkblack"
              >
                {giftCard.title}
              </Reveal>
              <Reveal
                as="p"
                direction="up"
                className="font-gill text-xl font-light leading-110 text-neutral500"
              >
                {giftCard.description}
              </Reveal>
            </div>
            <Reveal direction="up">
              <Link
                href={giftCard.cta.href}
                className="inline-flex h-14 items-center justify-center border border-neutral300 px-7 font-gill text-sm font-normal uppercase leading-110 text-darkblack transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
              >
                {giftCard.cta.label}
              </Link>
            </Reveal>
          </div>
        </div>

        <Reveal
          direction="up"
          className="relative mx-auto mt-6 h-[240px] w-full max-w-[400px] px-4 md:absolute md:bottom-0 md:right-0 md:mt-0 md:h-[527px] md:w-[791px] md:max-w-none md:px-0"
        >
          <Image
            src={giftCard.image.src}
            alt={giftCard.image.alt}
            fill
            className="object-contain object-center md:object-right-bottom"
            sizes="(max-width: 768px) 100vw, 791px"
          />
        </Reveal>
      </div>
    </section>
  );
};

export default GiftingGiftCardSection;
