"use client";

import { Suspense, lazy } from "react";
import { homeContent } from "@/features/cms/data/content";
import { LazyAnimatedSection } from "@/shared/ui/LazyAnimatedSection";
import { cn } from "@/shared/utils/cn";

const DiamondSourcingSection = lazy(
  () => import("@/features/cms/components/home/DiamondSourcingSection"),
);
const FeaturedCollectionSection = lazy(
  () => import("@/features/cms/components/home/FeaturedCollectionSection"),
);
const OccasionsTeaserSection = lazy(
  () => import("@/features/cms/components/home/OccasionsTeaserSection"),
);
const FeaturedProductsSection = lazy(
  () => import("@/features/cms/components/home/FeaturedProductsSection"),
);
const ForYourValentineSection = lazy(
  () => import("@/features/cms/components/home/ForYourValentineSection"),
);
const SunnyPromiseSection = lazy(
  () => import("@/features/cms/components/home/SunnyPromiseSection"),
);
const BespokeForYouSection = lazy(
  () => import("@/features/cms/components/home/BespokeForYouSection"),
);
const DiamondsForEveryoneSection = lazy(
  () => import("@/features/cms/components/home/DiamondsForEveryoneSection"),
);
const CraftsmanshipProcess = lazy(
  () => import("@/features/cms/components/home/CraftsmanshipProcess"),
);
const ShowroomsSection = lazy(
  () => import("@/features/stores/components/ShowroomsSection"),
);

function SectionFallback({ minHeight = "min-h-24" }: { minHeight?: string }) {
  return (
    <div
      className={cn(minHeight, "w-full animate-pulse bg-transparent")}
      aria-hidden
    />
  );
}

type LazyHomeSectionProps = {
  minHeight: string;
  animate?: boolean;
  children: React.ReactNode;
};

function LazyHomeSection({ minHeight, animate = false, children }: LazyHomeSectionProps) {
  return (
    <LazyAnimatedSection
      animate={animate}
      fallback={<SectionFallback minHeight={minHeight} />}
      className={minHeight}
    >
      <Suspense fallback={<SectionFallback minHeight={minHeight} />}>{children}</Suspense>
    </LazyAnimatedSection>
  );
}

export default function HomeBelowFoldSections() {
  return (
    <>
      <LazyHomeSection minHeight="min-h-[520px] bg-white">
        <DiamondSourcingSection id="flawless" />
      </LazyHomeSection>

      <LazyHomeSection minHeight="xl:min-h-[800px] min-h-[700px]">
        <FeaturedCollectionSection
          id="alankara"
          description={homeContent.alankara.collection.description}
        />
      </LazyHomeSection>

      <LazyHomeSection minHeight="md:min-h-[700px] h-auto">
        <OccasionsTeaserSection id="categories" />
      </LazyHomeSection>

      <LazyHomeSection minHeight="md:min-h-[600px] min-h-auto">
        <FeaturedProductsSection id="diamond-awaits" />
      </LazyHomeSection>

      <LazyHomeSection minHeight="md:min-h-[700px] h-auto">
        <ForYourValentineSection id="valentine" />
      </LazyHomeSection>

      <LazyHomeSection minHeight="min-h-[480px]">
        <SunnyPromiseSection id="promise" />
      </LazyHomeSection>

      <LazyHomeSection minHeight="md:min-h-[700px] h-auto">
        <BespokeForYouSection id="bespoke-for-you" />
      </LazyHomeSection>

      <LazyHomeSection minHeight="md:min-h-[550px] min-h-auto">
        <DiamondsForEveryoneSection id="diamonds-for-everyone" />
      </LazyHomeSection>

      <LazyHomeSection minHeight="min-h-[520px]">
        <CraftsmanshipProcess id="craftsmanship" />
      </LazyHomeSection>

      <LazyHomeSection minHeight="min-h-[480px]">
        <ShowroomsSection id="showrooms" />
      </LazyHomeSection>
    </>
  );
}
