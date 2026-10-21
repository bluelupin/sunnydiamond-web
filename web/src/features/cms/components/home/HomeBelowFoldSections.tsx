"use client";

import { Suspense } from "react";
import { cn } from "@/shared/utils/cn";
import type {
  NormalizedBespokeFeaturedStories,
  NormalizedBespokePastCreations,
} from "@/services/bespoke/contact-bespoke-page.types";
import { FeatureErrorBoundary } from "@/shared/ui/FeatureErrorBoundary";
import { LazyAnimatedSection } from "@/shared/ui/LazyAnimatedSection";
import { FeaturedCarouselSkeleton } from "@/features/cms/components/home/FeaturedProductsSection";
import { lazyImportWithRetry } from "@/shared/utils/lazyImportWithRetry";

const DiamondSourcingSection = lazyImportWithRetry(
  () => import("@/features/cms/components/home/DiamondSourcingSection"),
);
const FeaturedCollectionSection = lazyImportWithRetry(
  () => import("@/features/cms/components/home/FeaturedCollectionSection"),
);
const OccasionsTeaserSection = lazyImportWithRetry(
  () => import("@/features/cms/components/home/OccasionsTeaserSection"),
);
const FeaturedProductsSection = lazyImportWithRetry(
  () => import("@/features/cms/components/home/FeaturedProductsSection"),
);
const ForYourValentineSection = lazyImportWithRetry(
  () => import("@/features/cms/components/home/ForYourValentineSection"),
);
const SunnyPromiseSection = lazyImportWithRetry(
  () => import("@/features/cms/components/home/SunnyPromiseSection"),
);
const BespokeForYouSection = lazyImportWithRetry(
  () => import("@/features/cms/components/home/BespokeForYouSection"),
);
const DiamondsForEveryoneSection = lazyImportWithRetry(
  () => import("@/features/cms/components/home/DiamondsForEveryoneSection"),
);
const CraftsmanshipProcess = lazyImportWithRetry(
  () => import("@/features/cms/components/home/CraftsmanshipProcess"),
);
const ShowroomsSection = lazyImportWithRetry(
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
  featureName: string;
  minHeight: string;
  animate?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
};

function LazyHomeSection({
  featureName,
  minHeight,
  animate = false,
  fallback,
  children,
}: LazyHomeSectionProps) {
  const sectionFallback = fallback ?? <SectionFallback minHeight={minHeight} />;

  return (
    <LazyAnimatedSection
      animate={animate}
      fallback={sectionFallback}
      className={minHeight}
    >
      <FeatureErrorBoundary featureName={featureName}>
        <Suspense fallback={sectionFallback}>{children}</Suspense>
      </FeatureErrorBoundary>
    </LazyAnimatedSection>
  );
}

type HomeBelowFoldSectionsProps = {
  pastCreations?: NormalizedBespokePastCreations | null;
  featuredStories?: Pick<
    NormalizedBespokeFeaturedStories,
    "slides" | "defaultSlideIndex" | "modalCtaLabel"
  > | null;
};

export default function HomeBelowFoldSections({
  pastCreations = null,
  featuredStories = null,
}: HomeBelowFoldSectionsProps) {
  return (
    <>
      <LazyHomeSection featureName="DiamondSourcingSection" minHeight="bg-white">
        <DiamondSourcingSection id="flawless" />
      </LazyHomeSection>

      <LazyHomeSection featureName="FeaturedCollectionSection" minHeight="bg-white">
        <FeaturedCollectionSection id="alankara" />
      </LazyHomeSection>

      <LazyHomeSection featureName="OccasionsTeaserSection" minHeight="">
        <OccasionsTeaserSection id="categories" />
      </LazyHomeSection>

      <LazyHomeSection
        featureName="FeaturedProductsSection"
        minHeight="min-h-[480px]"
        fallback={<FeaturedCarouselSkeleton />}
      >
        <FeaturedProductsSection id="diamond-awaits" />
      </LazyHomeSection>

      <LazyHomeSection featureName="ForYourValentineSection" minHeight="">
        <ForYourValentineSection id="valentine" />
      </LazyHomeSection>

      <LazyHomeSection featureName="SunnyPromiseSection" minHeight="">
        <SunnyPromiseSection id="promise" />
      </LazyHomeSection>

      <LazyHomeSection featureName="BespokeForYouSection" minHeight="">
        <BespokeForYouSection
          id="bespoke-for-you"
          pastCreations={pastCreations}
          featuredStories={featuredStories}
        />
      </LazyHomeSection>

      <LazyHomeSection featureName="DiamondsForEveryoneSection" minHeight="">
        <DiamondsForEveryoneSection id="diamonds-for-everyone" />
      </LazyHomeSection>

      {/* ScrollReveal transform on the wrapper breaks sticky + scroll-scrub in this section. */}
      <LazyHomeSection featureName="CraftsmanshipProcess" minHeight="min-h-[750px]" animate={false}>
        <CraftsmanshipProcess id="craftsmanship" />
      </LazyHomeSection>

      <LazyHomeSection featureName="ShowroomsSection" minHeight="">
        <ShowroomsSection id="showrooms" />
      </LazyHomeSection>
    </>
  );
}
