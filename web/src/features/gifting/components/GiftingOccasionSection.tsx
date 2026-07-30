"use client";

import Link from "next/link";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import Reveal from "@/shared/Animation/Reveal";
import { giftingPageContent } from "../data/content";

const { viewCollectionLabel } = giftingPageContent.occasions;

function OccasionCard({
  card,
}: {
  card: typeof giftingPageContent.occasions.cards[number];
}) {
  return (
    <Link
      href={card.href}
      className="group relative block h-[400px] w-full overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2 md:h-[500px] lg:h-[700px]"
    >
      <ResponsiveImage
        desktopSrc={card.image.desktopUrl}
        mobileSrc={card.image.mobileUrl}
        alt={card.image.alt}
        width={718}
        height={700}
        quality={75}
        className="size-full object-cover"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[342px] bg-gradient-to-b from-transparent to-black backdrop-blur-[5px]"
      />

      <div className="absolute bottom-16 left-10 z-10 flex max-w-[418px] flex-col-reverse items-start text-white">
        <div className="inline-flex max-h-0 w-fit flex-col items-start overflow-hidden pb-0 pt-0 opacity-0 motion-safe:transition-[max-height,padding,opacity] motion-safe:duration-500 motion-safe:ease-out group-hover:max-h-[72px] group-hover:pb-16 group-hover:opacity-100 group-focus-visible:max-h-[72px] group-focus-visible:pb-16 group-focus-visible:opacity-100">
          <span className="border-b border-white pb-1 font-gill text-sm font-normal uppercase leading-110 text-white">
            {viewCollectionLabel}
          </span>
        </div>
        <div className="mb-16 flex w-full flex-col items-start gap-3 group-hover:mb-6">
          <h3 className="font-larken text-32 font-light leading-110">{card.title}</h3>
          <p className="font-gill text-xl font-light leading-110">{card.description}</p>
        </div>
      </div>
    </Link>
  );
}

const GiftingOccasionSection = () => {
  const { cards } = giftingPageContent.occasions;

  return (
    <section
      id="occasion-led-gifts"
      aria-label="Gifting occasions"
      className="relative left-1/2 w-screen max-w-none -translate-x-1/2 overflow-hidden bg-white"
    >
      <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
        {cards.map((card) => (
          <Reveal key={card.id} direction="up">
            <OccasionCard card={card} />
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default GiftingOccasionSection;
