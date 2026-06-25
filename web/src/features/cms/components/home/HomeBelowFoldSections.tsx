"use client";

import { Suspense, lazy } from "react";

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
  return <div className={minHeight} aria-hidden />;
}

export default function HomeBelowFoldSections() {
  return (
    <>
      <Suspense fallback={<SectionFallback minHeight="min-h-[520px]" />}>
        <DiamondSourcingSection id="flawless" />
      </Suspense>
      <Suspense fallback={<SectionFallback minHeight="min-h-[800px]" />}>
        <FeaturedCollectionSection id="alankara" />
      </Suspense>
      <Suspense fallback={<SectionFallback minHeight="min-h-[700px]" />}>
        <OccasionsTeaserSection id="categories" />
      </Suspense>
      <Suspense fallback={<SectionFallback minHeight="min-h-[600px]" />}>
        <FeaturedProductsSection id="diamond-awaits" />
      </Suspense>
      <Suspense fallback={<SectionFallback minHeight="min-h-[700px]" />}>
        <ForYourValentineSection id="valentine" />
      </Suspense>
      <Suspense fallback={<SectionFallback minHeight="min-h-[480px]" />}>
        <SunnyPromiseSection id="promise" />
      </Suspense>
      <Suspense fallback={<SectionFallback minHeight="min-h-[700px]" />}>
        <BespokeForYouSection id="bespoke-for-you" />
      </Suspense>
      <Suspense fallback={<SectionFallback minHeight="min-h-[600px]" />}>
        <DiamondsForEveryoneSection id="diamonds-for-everyone" />
      </Suspense>
      <Suspense fallback={<SectionFallback minHeight="min-h-[520px]" />}>
        <CraftsmanshipProcess id="craftsmanship" />
      </Suspense>
      <Suspense fallback={<SectionFallback minHeight="min-h-[480px]" />}>
        <ShowroomsSection id="showrooms" />
      </Suspense>
    </>
  );
}
