"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "@/shared/Animation/Reveal";
import type { NormalizedGiftingGiftCard } from "@/services/gifting/gifting-page.types";

type GiftingGiftCardSectionProps = {
  giftCard: NormalizedGiftingGiftCard;
};

const GiftingGiftCardSection = ({ giftCard }: GiftingGiftCardSectionProps) => {
  const cutoutSrc = giftCard.image?.desktopUrl;
  const cutoutAlt = giftCard.image?.alt ?? "";

  return (
    <section
      id="gift-card"
      aria-labelledby="gifting-gift-card-title"
      className="relative z-0 left-1/2 w-screen max-w-none -translate-x-1/2 overflow-hidden"
    >
      <div className="relative z-0 w-full py-16 md:h-[520px] md:py-0">
        {giftCard.background &&
          <Image
            src={giftCard.background.desktopUrl}
            alt={giftCard.background.alt}
            fill
            className="object-cover object-center"
            sizes="100vw"
            aria-hidden
          />
        }
        <div
          className="section-radial absolute inset-0"
          aria-hidden
        />
        <div
          className="absolute inset-x-0 top-0 h-[104px] bg-gradient-to-b from-white to-transparent md:hidden"
          aria-hidden
        />

        {/* Mobile — Figma 1049:57978 */}
        <div className="relative flex flex-col items-center gap-6 px-4 md:hidden">
          <div className="flex w-full flex-col items-center gap-3 text-center text-darkblack">
            <h2 className="font-larken text-[32px] font-light leading-110">
              {giftCard.title}
            </h2>
            {giftCard.description ? (
              <p className="font-gill text-base font-light leading-110 text-darkblack">
                {giftCard.description}
              </p>
            ) : null}
          </div>

          {cutoutSrc ? (
            <div className="relative aspect-[319/212] w-full">
              <Image
                src={cutoutSrc}
                alt={cutoutAlt}
                fill
                className="object-contain object-center"
                sizes="100vw"
              />
            </div>
          ) : null}

          <Link
            href={giftCard.cta.url}
            className="inline-flex h-14 items-center justify-center border border-neutral300 px-7 font-gill text-sm font-normal uppercase leading-110 text-darkblack transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
          >
            {giftCard.cta.label}
          </Link>
        </div>

        {/* Desktop */}
        <div className="relative mx-auto hidden h-[475px] 2xl:max-w-1920 max-w-1440 flex-col items-center px-4 md:flex md:flex-row md:items-center md:px-10">
          <div className="w-full md:max-w-[619px] pl-28">
            {giftCard.title &&
              <Reveal
                as="h2"
                id="gifting-gift-card-title"
                direction="up"
                className="font-larken lg:text-5xl md:text-4xl text-32 font-light leading-110 text-darkblack"
              >
                {giftCard.title}
              </Reveal>
            }
            {giftCard.description &&
              <Reveal
                as="p"
                direction="up"
                className="md:mt-4 mt-3 font-gill lg:text-xl md:text-lg text-base font-light leading-110 md:text-neutral500 text-darkblack"
              >
                {giftCard.description}
              </Reveal>
            }
            <Reveal direction="up" className="md:mt-10 mt-8">
              <Link
                href={giftCard.cta.url}
                className="inline-flex h-14 items-center justify-center border border-neutral300 px-7 font-gill text-sm font-normal uppercase leading-110 text-darkblack transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
              >
                {giftCard.cta.label}
              </Link>
            </Reveal>
          </div>
        </div>

        {cutoutSrc ? (
          <Reveal
            direction="up"
            className="relative mx-auto mt-6 hidden h-[240px] w-full max-w-[400px] px-4 md:absolute md:bottom-0 md:right-0 md:mt-0 md:block md:h-[527px] md:w-[791px] md:max-w-none md:px-0"
          >
            <Image
              src={cutoutSrc}
              alt={cutoutAlt}
              fill
              className="object-contain object-center md:object-right-bottom"
              sizes="(max-width: 768px) 100vw, 791px"
            />
          </Reveal>
        ) : null}
      </div>
    </section>
  );
};

export default GiftingGiftCardSection;
