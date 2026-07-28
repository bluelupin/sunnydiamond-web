"use client";

import { useState } from "react";
import Image from "next/image";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import FeaturedProductsCarousel, {
  type FeaturedCarouselItem,
} from "@/features/cms/components/home/FeaturedProductsCarousel";
import { cn } from "@/shared/utils/cn";
import type {
  NormalizedEducationLearnAnatomyDetail,
  NormalizedEducationLearnCareTip,
  NormalizedEducationLearnMoreSection,
  NormalizedEducationLearnTab,
} from "@/services/education/learn-about-diamonds-page.types";
import {
  educationLearnMoreSpec,
  educationPageImages,
} from "../data/content";

const tabsSpec = educationLearnMoreSpec.tabs;
const careSpec = educationLearnMoreSpec.careGrid;

function mapSlidesToCarouselItems(
  tab: NormalizedEducationLearnTab,
  slides: NonNullable<NormalizedEducationLearnTab["slides"]>,
): FeaturedCarouselItem[] {
  return slides.map((slide, index) => ({
    id: `${tab.id}-${index}`,
    name: slide.alt?.trim() ?? "",
    price: null,
    image: slide.src,
    href: tab.ctaHref ?? "",
  }));
}

const LearnTabDescription = ({
  tab,
  animate = true,
}: {
  tab: NormalizedEducationLearnTab;
  animate?: boolean;
}) => {
  const isSingleParagraph =
    tab.layout === "care-grid" || tab.layout === "anatomy-detail" || tab.description.length === 1;

  const content = isSingleParagraph ? (
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
  );

  const className =
    "lg:max-w-[700px] max-w-[500px] mx-auto text-center font-gill font-light leading-110 lg:text-xl md:text-base text-sm max-md:text-darkblack md:text-neutral500";

  if (!animate) {
    return (
      <div key={tab.id} className={className}>
        {content}
      </div>
    );
  }

  return (
    <ScrollReveal key={tab.id} delayMs={180} className={className}>
      {content}
    </ScrollReveal>
  );
};

const LearnCarouselPanel = ({
  tab,
  items,
}: {
  tab: NormalizedEducationLearnTab;
  items: FeaturedCarouselItem[];
}) => (
  <div className="flex w-full max-w-full min-w-0 flex-col items-center overflow-x-clip">
    <FeaturedProductsCarousel
      items={items}
      ctaLabel={tab.ctaLabel ?? ""}
      sectionLabel={tab.label}
      showCta={Boolean(tab.ctaLabel && tab.ctaHref)}
    />
  </div>
);

const LearnCareTip = ({ tip, mobile = false }: { tip: NormalizedEducationLearnCareTip; mobile?: boolean }) => {
  const desktop = careSpec.desktop;
  const mobileSpec = careSpec.mobile;

  return (
    <div className="flex flex-col items-center text-center gap-4">
      <div
        className="relative shrink-0 w-20 h-20"
        style={{
          width: mobile ? mobileSpec.iconSize : desktop.iconSize,
          height: mobile ? mobileSpec.iconSize : desktop.iconSize,
        }}
      >
        <Image src={tip.icon} alt="" fill className="object-contain" aria-hidden />
      </div>
      <p
        className="font-gill font-light text-base leading-110 text-darkblack md:text-neutral500"
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

const LearnCareTipsGrid = ({ tips }: { tips: NormalizedEducationLearnCareTip[] }) => {
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

const LearnAnatomyDetailPanel = ({ detail }: { detail: NormalizedEducationLearnAnatomyDetail }) => {
  const [openSectionId, setOpenSectionId] = useState<string | null>(
    detail.sections[0]?.id ?? null,
  );

  return (
    <ScrollReveal delayMs={260} className="w-full max-w-1920 2xl:px[60px] lg:px-10 md:px-8 px-4">
      <div className="grid w-full items-start lg:gap-12 gap-6 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="relative mx-auto h-[200px] w-[200px] shrink-0 mix-blend-darken md:h-[300px] md:w-[300px]">
            <Image
              src={detail.image}
              alt={detail.imageAlt}
              fill
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="md:col-span-3 flex w-full max-w-full flex-col gap-3">
          <div className="lg:space-y-4 space-y-3">
            {detail.sections.map((section) => {
              const isOpen = openSectionId === section.id;
              return (
                <div key={section.id} className="bg-gray300 lg:max-w-[667px] md:max-w-[530px] max-w-full">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`anatomy-section-${section.id}`}
                    id={`anatomy-trigger-${section.id}`}
                    onClick={() =>
                      setOpenSectionId((current) =>
                        current === section.id ? null : section.id,
                      )
                    }
                    className="flex w-full items-center px-6 py-5 text-left"
                  >
                    <span className="font-larken text-xl font-light leading-110 text-darkblack md:text-2xl">
                      {section.title}
                    </span>
                  </button>

                  <div
                    id={`anatomy-section-${section.id}`}
                    role="region"
                    aria-labelledby={`anatomy-trigger-${section.id}`}
                    hidden={!isOpen}
                    className={cn(!isOpen && "hidden")}
                  >
                    <ul className="flex flex-col gap-5 px-6 pb-6 md:gap-4">
                      {section.traits.map((trait) => (
                        <li key={trait.id} className="flex items-start gap-[10px]">
                          <div className="flex items-center gap-[10px]">
                            <Image
                              src={educationPageImages.anatomySparkle}
                              alt=""
                              width={16}
                              height={16}
                              aria-hidden
                              className="size-4 shrink-0"
                            />
                            <p className="font-gill text-sm font-normal leading-130 text-darkblack md:text-xl md:leading-110">
                              {trait.term}:
                            </p>
                          </div>
                          <p className="font-gill text-sm font-light leading-130 text-neutral500 md:text-xl md:leading-110">
                            {trait.definition}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

type EducationLearnMoreSectionProps = {
  learnMore: NormalizedEducationLearnMoreSection;
};

const EducationLearnMoreSection = ({ learnMore }: EducationLearnMoreSectionProps) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const tabs = learnMore.tabs;
  const activeTab = tabs[activeTabIndex]!;
  const isCarousel = activeTab.layout === "carousel";
  const isCareGrid = activeTab.layout === "care-grid";
  const isAnatomyDetail = activeTab.layout === "anatomy-detail";
  const slides = activeTab.slides ?? [];
  const carouselItems = isCarousel ? mapSlidesToCarouselItems(activeTab, slides) : [];

  const handleTabChange = (index: number) => {
    setActiveTabIndex(index);
  };

  return (
    <section
      aria-labelledby="education-learn-more-title"
      className={cn("bg-white py-16 md:py-100", isCarousel && "overflow-x-clip")}
    >
      <div className="flex w-full max-w-full flex-col items-center overflow-x-clip max-md:gap-6 md:gap-10">
        <div className="flex w-full flex-col items-center mx-auto max-w-[1360px] md:px-10 px-4">
          <ScrollReveal delayMs={0}>
            <h2
              id="education-learn-more-title"
              className="text-center font-larken text-32 font-light leading-110 text-darkblack mb-10 md:text-5xl"
            >
              {learnMore.title}
            </h2>
          </ScrollReveal>

          <ScrollReveal delayMs={100} className="w-full lg:max-w-[1200px]">
            <div className="w-full overflow-x-auto border-y-[0.4px] border-black/30 md:overflow-visible horizontalScrollbar">
              <div
                className="flex min-w-max items-center md:w-full md:min-w-0 py-5"
                role="tablist"
                aria-label="Learn more topics"
                style={{
                  gap: tabsSpec.mobile.gap,
                }}
              >
                {tabs.map((tab, index) => {
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
                          "pb-2 !w-fit relative shrink-0 cursor-pointer whitespace-nowrap font-gill text-sm font-normal uppercase leading-110 transition-colors md:flex md:items-center md:justify-center md:text-center",
                          "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-linkGold after:transition-all after:duration-300 hover:text-linkGold hover:after:w-full",
                          isActive
                            ? "border-b-[1.5px] border-linkGold pb-2 text-linkGold"
                            : "pb-2 text-darkblack",
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
            "flex w-full max-w-full min-w-0 flex-col items-center self-stretch overflow-x-clip",
            isCareGrid && "gap-10",
            isAnatomyDetail && "gap-10",
            isCarousel && "gap-10",
          )}
        >
          <div className={cn(isCarousel && "w-full px-4 md:px-10")}>
            <LearnTabDescription tab={activeTab} animate={!isCarousel} />
          </div>

          {isCareGrid && activeTab.careTips ? (
            <LearnCareTipsGrid tips={activeTab.careTips} />
          ) : isAnatomyDetail && activeTab.anatomyDetail ? (
            <LearnAnatomyDetailPanel detail={activeTab.anatomyDetail} />
          ) : (
            <LearnCarouselPanel tab={activeTab} items={carouselItems} />
          )}
        </div>
      </div>
    </section>
  );
};

export default EducationLearnMoreSection;
