import Image from "next/image";
import { giftingPageContent } from "../data/content";

type FinishingTouchItem = typeof giftingPageContent.finishingTouch.items[number];

const FinishingTouchCard = ({
  item,
  layout,
}: {
  item: FinishingTouchItem;
  layout: "mobile" | "desktop";
}) => {
  const isMobile = layout === "mobile";

  return (
    <article
      className={
        isMobile
          ? "flex w-[328px] shrink-0 snap-start flex-col items-start gap-3"
          : "flex flex-col items-center gap-4"
      }
    >
      <div
        className={
          isMobile
            ? "relative h-[226px] w-full"
            : "relative h-[496px] w-full"
        }
      >
        <Image
          src={item.image.src}
          alt={item.image.alt}
          fill
          className="object-cover object-center"
          sizes={
            isMobile
              ? "328px"
              : "(max-width: 1440px) 33vw, 474px"
          }
        />
      </div>
      <div
        className={
          isMobile
            ? "flex max-w-[296px] flex-col items-start gap-2 text-left text-darkblack"
            : "flex flex-col items-center gap-3 px-4 text-center text-darkblack"
        }
      >
        <h3 className="font-larken text-xl font-light leading-110">{item.title}</h3>
        <p
          className={
            isMobile
              ? "font-gill text-base font-light leading-normal"
              : "font-gill text-base font-light leading-110"
          }
        >
          {item.description}
        </p>
      </div>
    </article>
  );
};

const GiftingPromiseSection = () => {
  const { finishingTouch } = giftingPageContent;

  return (
    <section
      id="the-finishing-touch"
      aria-labelledby="gifting-finishing-title"
      className="relative z-30 isolate bg-gray200 pt-16 pb-16 md:py-100"
    >
      <div className="mx-auto flex w-full max-w-1440 flex-col items-center gap-6 md:gap-10">
        <div className="flex w-full flex-col items-center gap-4 px-4 text-center md:px-10">
          <h2
            id="gifting-finishing-title"
            className="font-larken text-[32px] font-light leading-110 text-darkblack md:text-5xl"
          >
            {finishingTouch.title}
          </h2>
          <p className="hidden font-gill text-xl font-light leading-110 text-neutral500 md:block">
            {finishingTouch.description}
          </p>
        </div>

        {/* Mobile — Figma 1049:57987 horizontal carousel */}
        <div
          className="scrollbar-none flex w-full snap-x snap-mandatory gap-3 overflow-x-auto scroll-pl-4 scroll-pr-4 pb-2 md:hidden"
          role="list"
          aria-label={finishingTouch.title}
        >
          {finishingTouch.items.map((item) => (
            <div key={item.id} className="shrink-0" role="listitem">
              <FinishingTouchCard item={item} layout="mobile" />
            </div>
          ))}
        </div>

        {/* Desktop — Figma 1049:51053 three-column grid */}
        <div
          className="hidden w-full grid-cols-3 gap-2 px-4 md:grid md:px-10"
          role="list"
          aria-label={finishingTouch.title}
        >
          {finishingTouch.items.map((item) => (
            <div key={item.id} role="listitem">
              <FinishingTouchCard item={item} layout="desktop" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GiftingPromiseSection;
