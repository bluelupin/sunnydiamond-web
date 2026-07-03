"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import { cn } from "@/shared/utils/cn";
import {
  educationLearnMoreContent,
  educationLearnMoreSpec,
  educationLearnTabs,
  educationPageImages,
  type EducationLearnCareTip,
  type EducationLearnAnatomyDetail,
  type EducationLearnTab,
} from "../data/content";

type CarouselSlot = keyof typeof educationLearnMoreSpec.carousel.slots;

const spec = educationLearnMoreSpec;
const headerSpec = spec.header;
const tabsSpec = spec.tabs;
const slotSpecs = spec.carousel.slots;
const mobileCarousel = spec.carousel.mobile;
const desktopCarousel = spec.carousel.desktop;
const ctaSpec = spec.cta;
const careSpec = spec.careGrid;
const anatomySpec = spec.anatomyDetail;

const LearnCarouselImage = ({
  src,
  alt,
  slot,
  sizes,
}: {
  src: string;
  alt: string;
  slot: CarouselSlot;
  sizes: string;
}) => {
  const slotSpec = slotSpecs[slot];

  const image = (
    <div
      className="relative overflow-hidden mix-blend-darken lg:w-[350px] lg:h-[300px] w-[200px] h-[180px] imageTestContainer"
    // style={{ width: slotSpec.width, height: slotSpec.height }}
    >
      <Image
        src={src}
        alt={alt}
        width={slotSpec.width}
        height={slotSpec.height}
        className="w-full h-full object-cover"
        sizes={sizes}
        style={{
          height: slotSpec.cropHeight,
          width: slotSpec.cropWidth,
          left: slotSpec.cropLeft,
          top: slotSpec.cropTop,
        }}
      />
    </div>
  );

  if (slotSpec.flip) {
    return <div className="-scale-y-100 rotate-180">{image}</div>;
  }

  return image;
};

const LearnNavArrow = ({
  direction,
  onClick,
  className,
}: {
  direction: "left" | "right";
  onClick: () => void;
  className?: string;
}) => (
  <button
    type="button"
    aria-label={direction === "left" ? "Previous slide" : "Next slide"}
    onClick={onClick}
    className={className}
  >
    <Image
      src={
        direction === "left"
          ? educationPageImages.learnArrowLeftMobile
          : educationPageImages.learnArrowRightMobile
      }
      alt=""
      width={spec.carousel.navIconWidth}
      height={spec.carousel.navIconWidth}
      aria-hidden
      className="h-6 w-auto md:hidden"
    />
    <Image
      src={
        direction === "left"
          ? educationPageImages.learnArrowLeft
          : educationPageImages.learnArrowRight
      }
      alt=""
      width={spec.carousel.navIconWidth}
      height={spec.carousel.navIconWidth}
      aria-hidden
      className="hidden h-6 w-auto md:block"
    />
  </button>
);

const LearnTabDescription = ({ tab }: { tab: EducationLearnTab }) => {
  const isSingleParagraph =
    tab.layout === "care-grid" || tab.layout === "anatomy-detail" || tab.description.length === 1;

  return (
    <ScrollReveal
      key={tab.id}
      delayMs={180}
      className="max-w-[700px] text-center font-gill font-light leading-110 max-md:text-base max-md:text-darkblack md:text-xl md:text-neutral500"
    >
      {isSingleParagraph ? (
        <p>{tab.description.join(" ")}</p>
      ) : (
        <>
          <p className="md:hidden">{tab.description.join(" ")}</p>
          <div className="hidden md:block">
            {tab.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </>
      )}
    </ScrollReveal>
  );
};

const LearnCareTip = ({ tip, mobile = false }: { tip: EducationLearnCareTip; mobile?: boolean }) => {
  const desktop = careSpec.desktop;
  const mobileSpec = careSpec.mobile;

  return (
    <div className="flex flex-col items-center text-center">
      <div
        className="relative shrink-0"
        style={{
          width: mobile ? mobileSpec.iconSize : desktop.iconSize,
          height: mobile ? mobileSpec.iconSize : desktop.iconSize,
          marginBottom: mobile ? mobileSpec.labelGap : desktop.labelGap,
        }}
      >
        <Image src={tip.icon} alt="" fill className="object-contain" aria-hidden />
      </div>
      <p
        className="font-gill font-light uppercase md:text-lg text-base leading-110 text-darkblack md:text-neutral500"
      >
        {tip.labelLines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>
    </div>
  );
};

const LearnCareTipsGrid = ({ tips }: { tips: EducationLearnCareTip[] }) => {
  const topRow = tips.slice(0, 3);
  const bottomRow = tips.slice(3);
  const desktop = careSpec.desktop;

  return (
    <ScrollReveal delayMs={260} className="flex w-full flex-col items-center">
      <div className="flex w-full flex-col items-center gap-8 md:hidden">
        {tips.map((tip) => (
          <LearnCareTip key={tip.id} tip={tip} mobile />
        ))}
      </div>

      <div
        className="hidden w-full grid-cols-6 md:grid"
        style={{
          maxWidth: desktop.maxWidth,
          rowGap: desktop.rowGap,
        }}
      >
        {topRow.map((tip) => (
          <div key={tip.id} className="col-span-2 flex justify-center">
            <LearnCareTip tip={tip} />
          </div>
        ))}

        {bottomRow.map((tip, index) => (
          <div
            key={tip.id}
            className={cn("col-span-2 flex justify-center", index === 0 ? "col-start-2" : "col-start-4")}
          >
            <LearnCareTip tip={tip} />
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
};

const LearnAnatomyDetailPanel = ({ detail }: { detail: EducationLearnAnatomyDetail }) => (
  <ScrollReveal delayMs={260} className="w-full">
    <div className="grid md:grid-cols-2 gap-8 w-full items-center md:items-center">
      <div>
        <div className="relative mx-auto h-[280px] w-[280px] shrink-0 mix-blend-darken md:h-[350px] md:w-[350px]">
          <Image
            src={detail.image}
            alt={detail.imageAlt}
            fill
            className="object-cover w-full h-full"
          // sizes="(max-width: 768px) 280px, 350px"
          />
        </div>
      </div>
      <div className="flex w-full max-w-full flex-col lg:gap-6 gap-4 md:pt-2">
        <h3 className="w-fit font-larken text-2xl font-light leading-110 text-darkblack md:text-[32px] border-b-[1.5px] border-neutral300 pb-3">
          {detail.title}
        </h3>
        <ul className="flex flex-col gap-5 md:gap-6">
          {detail.traits.map((trait) => (
            <li key={trait.id} className="flex gap-3">
              <Image
                src={educationPageImages.anatomySparkle}
                alt=""
                width={16}
                height={16}
                aria-hidden
                className="mt-1 size-4 shrink-0"
              />
              <p className="font-gill text-base font-light leading-130 text-neutral500 md:text-xl md:leading-110">
                <span className="font-normal text-darkblack">{trait.term}:</span> {trait.definition}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </ScrollReveal>
);

const LearnCarouselPanel = ({
  tab,
  slides,
  activeSlideIndex,
  onPrev,
  onNext,
}: {
  tab: EducationLearnTab;
  slides: NonNullable<EducationLearnTab["slides"]>;
  activeSlideIndex: number;
  onPrev: () => void;
  onNext: () => void;
}) => {
  const prevSlide = slides[(activeSlideIndex + slides.length - 1) % slides.length];
  const currentSlide = slides[activeSlideIndex];
  const nextSlide = slides[(activeSlideIndex + 1) % slides.length];

  return (
    <ScrollReveal delayMs={260} className="flex w-full flex-col items-center">
      <div
        className="relative flex w-full items-start justify-center"
        style={{ gap: desktopCarousel.columnGap }}
      >
        <div className="hidden shrink-0 md:block">
          <LearnCarouselImage
            src={prevSlide.src}
            alt=""
            slot="left"
            sizes={`${slotSpecs.left.width}px`}
          />
        </div>

        <div
          className="relative flex w-full flex-col items-center max-md:justify-between md:justify-start"
          style={{
            maxWidth: desktopCarousel.centerColumnWidth,
            gap: desktopCarousel.centerButtonGap,
            minHeight: mobileCarousel.height,
          }}
        >
          <div className="relative mx-auto md:hidden">
            <LearnCarouselImage
              key={`${tab.id}-${activeSlideIndex}`}
              src={currentSlide.src}
              alt={currentSlide.alt}
              slot="center"
              sizes={`${Math.round(mobileCarousel.imageWidth)}px`}
            />
          </div>

          <div
            className="pointer-events-none absolute flex items-center justify-between md:hidden"
            style={{
              top: mobileCarousel.arrowTop,
              left: mobileCarousel.arrowLeft,
              width: mobileCarousel.arrowRowWidth,
            }}
          >
            <LearnNavArrow
              direction="left"
              onClick={onPrev}
              className="pointer-events-auto flex size-6 shrink-0 items-center justify-center text-darkblack"
            />
            <LearnNavArrow
              direction="right"
              onClick={onNext}
              className="pointer-events-auto flex size-6 shrink-0 items-center justify-center text-darkblack"
            />
          </div>

          <div
            className="relative hidden w-full items-center justify-center md:flex"
            style={{ gap: desktopCarousel.centerControlsGap }}
          >
            <LearnNavArrow
              direction="left"
              onClick={onPrev}
              className="flex size-6 shrink-0 items-center justify-center text-darkblack"
            />
            <LearnCarouselImage
              src={currentSlide.src}
              alt={currentSlide.alt}
              slot="center"
              sizes={`${slotSpecs.center.width}px`}
            />
            <LearnNavArrow
              direction="right"
              onClick={onNext}
              className="flex size-6 shrink-0 items-center justify-center text-darkblack"
            />
          </div>

          {tab.ctaLabel && tab.ctaHref ? (
            <Link
              href={tab.ctaHref}
              className="mt-2 btn-border-slide inline-flex h-14 min-w-[122px] items-center justify-center border-[0.8px] border-neutral300 px-7 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
            >
              {tab.ctaLabel}
            </Link>
          ) : null}
        </div>

        <div className="hidden shrink-0 md:block">
          <LearnCarouselImage
            src={nextSlide.src}
            alt=""
            slot="right"
            sizes={`${slotSpecs.right.width}px`}
          />
        </div>
      </div>
    </ScrollReveal>
  );
};

const EducationLearnMoreSection = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(1);

  const activeTab = educationLearnTabs[activeTabIndex];
  const isCarousel = activeTab.layout === "carousel";
  const isCareGrid = activeTab.layout === "care-grid";
  const isAnatomyDetail = activeTab.layout === "anatomy-detail";
  const slides = activeTab.slides ?? [];

  const goToPrevSlide = () => {
    if (!slides.length) return;
    setActiveSlideIndex((current) => (current === 0 ? slides.length - 1 : current - 1));
  };

  const goToNextSlide = () => {
    if (!slides.length) return;
    setActiveSlideIndex((current) => (current === slides.length - 1 ? 0 : current + 1));
  };

  const handleTabChange = (index: number) => {
    setActiveTabIndex(index);
    setActiveSlideIndex(1);
  };

  return (
    <section
      aria-labelledby="education-learn-more-title"
      className={cn(
        "bg-white px-4 py-16 md:px-10 md:py-100",
        isCarousel && "min-h-[681px]",
      )}
    >
      <div
        className="mx-auto flex max-w-[1360px] flex-col items-center max-md:gap-6 md:gap-16"
      >
        <div className="flex w-full flex-col items-center">
          <ScrollReveal delayMs={0}>
            <h2
              id="education-learn-more-title"
              className="mb-8 text-center font-larken text-32 font-light leading-110 text-darkblack md:mb-[40px] md:text-5xl"
            >
              {educationLearnMoreContent.title}
            </h2>
          </ScrollReveal>

          <ScrollReveal delayMs={100} className="w-full lg:max-w-[1200px]">
            <div className="w-full overflow-x-auto border-y-[0.4px] border-black/30 md:overflow-visible horizontalScrollbar">
              <div
                className="flex min-w-max items-center md:w-full md:min-w-0"
                role="tablist"
                aria-label="Learn more topics"
                style={{
                  height: tabsSpec.mobile.height,
                  gap: tabsSpec.mobile.gap,
                  paddingBlock: tabsSpec.desktop.paddingY,
                }}
              >
                {educationLearnTabs.map((tab, index) => {
                  const isActive = index === activeTabIndex;

                  return (
                    <div
                      key={tab.id}
                      className="flex shrink-0 flex-col items-center md:flex-1"
                      role="presentation"
                    >
                      <button
                        type="button"
                        id={`learn-tab-${tab.id}`}
                        role="tab"
                        aria-selected={isActive}
                        aria-controls={`learn-tabpanel-${tab.id}`}
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => handleTabChange(index)}
                        className={cn(
                          "!w-fit relative shrink-0 cursor-pointer whitespace-nowrap font-gill text-base font-normal uppercase leading-110 transition-colors md:flex md:items-center md:justify-center md:py-0 md:text-center lg:text-xl",
                          "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-linkGold after:transition-all after:duration-300 hover:text-linkGold hover:after:w-full",
                          isActive
                            ? "border-b-[1.5px] border-linkGold pb-2 text-linkGold"
                            : "pb-1 text-darkblack",
                        )}
                      >
                        {tab.label}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        </div>

        <div
          key={activeTab.id}
          role="tabpanel"
          id={`learn-tabpanel-${activeTab.id}`}
          aria-labelledby={`learn-tab-${activeTab.id}`}
          className={cn(
            "flex w-full flex-col items-center",
            isCareGrid && "gap-8 md:gap-16",
            isAnatomyDetail && "gap-8 md:gap-16",
            isCarousel && "max-md:gap-[49px] md:gap-16",
          )}
        >
          <LearnTabDescription tab={activeTab} />

          {isCareGrid && activeTab.careTips ? (
            <LearnCareTipsGrid tips={activeTab.careTips} />
          ) : isAnatomyDetail && activeTab.anatomyDetail ? (
            <LearnAnatomyDetailPanel detail={activeTab.anatomyDetail} />
          ) : (
            <LearnCarouselPanel
              tab={activeTab}
              slides={slides}
              activeSlideIndex={activeSlideIndex}
              onPrev={goToPrevSlide}
              onNext={goToNextSlide}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default EducationLearnMoreSection;
