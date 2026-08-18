"use client";

import { Suspense } from "react";
import { cn } from "@/shared/utils/cn";
import { FeatureErrorBoundary } from "@/shared/ui/FeatureErrorBoundary";
import { LazyAnimatedSection } from "@/shared/ui/LazyAnimatedSection";
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
  children: React.ReactNode;
};

function LazyHomeSection({ featureName, minHeight, animate = false, children }: LazyHomeSectionProps) {
  return (
    <LazyAnimatedSection
      animate={animate}
      fallback={<SectionFallback minHeight={minHeight} />}
      className={minHeight}
    >
      <FeatureErrorBoundary featureName={featureName}>
        <Suspense fallback={<SectionFallback minHeight={minHeight} />}>{children}</Suspense>
      </FeatureErrorBoundary>
    </LazyAnimatedSection>
  );
}

export default function HomeBelowFoldSections() {
  return (
    <>
      <LazyHomeSection featureName="DiamondSourcingSection" minHeight="min-h-[520px] bg-white">
        <DiamondSourcingSection id="flawless" />
      </LazyHomeSection>

      <LazyHomeSection featureName="FeaturedCollectionSection" minHeight="bg-white">
        <FeaturedCollectionSection id="alankara" />
      </LazyHomeSection>

      <LazyHomeSection featureName="OccasionsTeaserSection" minHeight="md:min-h-[700px] h-auto">
        <OccasionsTeaserSection id="categories" />
      </LazyHomeSection>

      <LazyHomeSection featureName="FeaturedProductsSection" minHeight="md:min-h-[600px] min-h-auto">
        <FeaturedProductsSection id="diamond-awaits" />
      </LazyHomeSection>

      <LazyHomeSection featureName="ForYourValentineSection" minHeight="md:min-h-[700px] h-auto">
        <ForYourValentineSection id="valentine" />
      </LazyHomeSection>

      <LazyHomeSection featureName="SunnyPromiseSection" minHeight="min-h-[480px]">
        <SunnyPromiseSection id="promise" />
      </LazyHomeSection>

      <LazyHomeSection featureName="BespokeForYouSection" minHeight="md:min-h-[700px] h-auto">
        <BespokeForYouSection id="bespoke-for-you" />
      </LazyHomeSection>

      <LazyHomeSection featureName="DiamondsForEveryoneSection" minHeight="md:min-h-[550px] min-h-auto">
        <DiamondsForEveryoneSection id="diamonds-for-everyone" />
      </LazyHomeSection>

      <LazyHomeSection featureName="CraftsmanshipProcess" minHeight="min-h-[520px]">
        <CraftsmanshipProcess id="craftsmanship" />
      </LazyHomeSection>

      <LazyHomeSection featureName="ShowroomsSection" minHeight="min-h-[480px]">
        <ShowroomsSection id="showrooms" />
      </LazyHomeSection>
    </>
  );
}
