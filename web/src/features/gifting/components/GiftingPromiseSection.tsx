import Image from "next/image";
import type { NormalizedGiftingFinishingItem, NormalizedGiftingFinishingTouch } from "@/services/gifting/gifting-page.types";

const FinishingTouchCard = ({ item }: { item: NormalizedGiftingFinishingItem }) => (
  <article className="flex w-[328px] shrink-0 snap-start flex-col items-start gap-3 md:w-full md:shrink md:snap-align-none md:items-center md:gap-4">
    <div className="relative h-[226px] w-full lg:h-[496px] md:h-[350px]">
      <Image
        src={item.image.desktopUrl}
        alt={item.image.alt}
        fill
        className="object-cover object-center"
        sizes="(max-width: 767px) 328px, (max-width: 1440px) 33vw, 474px"
      />
    </div>
    <div className="flex max-w-[296px] flex-col items-start gap-2 text-left text-darkblack md:max-w-none md:items-center md:gap-3 md:px-4 md:text-center">
      <h3 className="font-larken text-xl font-light leading-110">{item.title}</h3>
      {item.description ? (
        <p className="font-gill text-base font-light leading-normal md:leading-110">
          {item.description}
        </p>
      ) : null}
    </div>
  </article>
);

type GiftingPromiseSectionProps = {
  finishingTouch: NormalizedGiftingFinishingTouch;
};

const GiftingPromiseSection = ({ finishingTouch }: GiftingPromiseSectionProps) => {
  return (
    <section
      id="the-finishing-touch"
      aria-labelledby="gifting-finishing-title"
      className="relative z-30 isolate flex flex-col gap-6 bg-gray200 pt-16 pb-16 md:gap-10 md:py-100 md:px-0 px-2"
    >
      <div className="mx-auto flex w-full max-w-1440 flex-col items-center gap-6 px-0 md:gap-10 md:px-10">
        <div className="flex w-full flex-col items-center gap-4 text-center">
          <h2
            id="gifting-finishing-title"
            className="font-larken text-32 font-light leading-110 text-darkblack md:text-5xl"
          >
            {finishingTouch.title}
          </h2>
          {finishingTouch.description ? (
            <p className="hidden font-gill text-xl font-light leading-110 text-neutral500 md:block">
              {finishingTouch.description}
            </p>
          ) : null}
        </div>
      </div>

      <div
        className="scrollbar-none flex w-full snap-x snap-mandatory gap-3 overflow-x-auto px-2 pb-2 scroll-pr-4 md:grid md:grid-cols-3 md:gap-2 md:overflow-visible md:snap-none md:px-0 md:pb-0"
        role="list"
        aria-label={finishingTouch.title}
      >
        {finishingTouch.items.map((item) => (
          <FinishingTouchCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default GiftingPromiseSection;