"use client";

import Image from "next/image";
import Reveal from "@/shared/Animation/Reveal";
import { useGiftCardFlow } from "@/features/gift-card/context/GiftCardFlowContext";
import type { NormalizedGiftingGiftCard } from "@/services/gifting/gifting-page.types";

type GiftingGiftCardSectionProps = {
  giftCard: NormalizedGiftingGiftCard;
};

const giftCardCtaClassName =
  "btn-border-slide inline-flex h-14 w-[192px] items-center justify-center border border-neutral300 hover:!border-neutral300 px-0 font-gill text-sm font-normal uppercase leading-110 text-darkblack focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2 md:w-auto md:px-7";

const GiftCardCta = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button type="button" onClick={onClick} className={giftCardCtaClassName}>
    <span className="relative z-10">{label}</span>
  </button>
);

const GiftingGiftCardSection = ({ giftCard }: GiftingGiftCardSectionProps) => {
  const { openPanel } = useGiftCardFlow();
  const cutoutSrc = giftCard.image?.desktopUrl ?? giftCard.image?.mobileUrl;
  const cutoutAlt = giftCard.image?.alt?.trim() || giftCard.title;
  const buttonLabel = giftCard.buttonLabel?.trim() || "SEND A GIFT CARD";

  return (
    <section
      id="gift-card"
      aria-labelledby="gifting-gift-card-title"
      className="relative z-0 left-1/2 w-screen max-w-none -translate-x-1/2 overflow-hidden"
    >
      <div className="relative z-0 w-full lg:h-[520px] md:h-[350px] md:py-0 py-16">
        {giftCard.background &&
          <Image
            src={giftCard.background.desktopUrl ?? giftCard.background.mobileUrl}
            alt={giftCard.background.alt?.trim() || giftCard.title}
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
        <div className="relative z-10 mx-auto flex flex-col items-center lg:h-[475px] md:h-[330px] 2xl:max-w-1920 max-w-1440 px-4 md:flex-row md:items-center md:px-10">
          <div className="w-full max-md:mx-auto max-md:text-center xl:w-[490px] lg:w-[400px] md:w-[450px] xl:ml-28 md:ml-10">
            {giftCard.title &&
              <Reveal
                as="h2"
                id="gifting-gift-card-title"
                direction="up"
                className="font-larken lg:text-5xl md:text-4xl text-32 font-light leading-110 text-darkblack md:text-left text-center"
              >
                {giftCard.title}
              </Reveal>
            }
            {giftCard.description &&
              <Reveal
                as="p"
                direction="up"
                className="md:mt-4 mt-3 font-gill lg:text-xl md:text-lg text-base font-light leading-110 md:text-neutral500 text-darkblack md:text-left text-center"
              >
                {giftCard.description}
              </Reveal>
            }
            <Reveal direction="up" className="md:mt-10 mt-8 md:block hidden">
              <GiftCardCta label={buttonLabel} onClick={openPanel} />
            </Reveal>
          </div>
        </div>

        {cutoutSrc &&
          <Reveal
            direction="up"
            className="pointer-events-none relative mx-auto mt-6 aspect-[375/249] w-full max-w-[400px] overflow-hidden px-0 md:absolute md:bottom-0 md:right-0 md:mt-0 md:block md:aspect-auto md:min-h-[240px] md:w-[min(791px,58vw)] lg:h-[527px] lg:w-[791px] md:max-w-none md:px-0 md:overflow-visible"
          >
            <Image
              src={cutoutSrc}
              alt={cutoutAlt}
              fill
              className="scale-[1.2] object-contain object-center md:scale-100 md:object-right-bottom"
              sizes="(max-width: 768px) 100vw, 791px"
            />
          </Reveal>
        }
        <Reveal direction="up" className="md:mt-0 mt-6 md:hidden block relative flex items-center justify-center">
          <GiftCardCta label={buttonLabel} onClick={openPanel} />
        </Reveal>
      </div>
    </section>
  );
};

export default GiftingGiftCardSection;
