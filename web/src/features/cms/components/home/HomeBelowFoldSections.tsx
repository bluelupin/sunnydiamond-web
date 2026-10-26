"use client";

import { Suspense } from "react";
import { cn } from "@/shared/utils/cn";
import type {
  NormalizedBespokeFeaturedStories,
  NormalizedBespokePastCreations,
} from "@/services/bespoke/contact-bespoke-page.types";
import { FeatureErrorBoundary } from "@/shared/ui/FeatureErrorBoundary";
import { LazyAnimatedSection } from "@/shared/ui/LazyAnimatedSection";
import FeaturedCarouselSkeleton from "@/features/cms/components/home/FeaturedCarouselSkeleton";
import { lazyImportWithRetry } from "@/shared/utils/lazyImportWithRetry";
import { useHomepageCmsPrefetched } from "@/shared/lib/providers/HomepageCmsProvider";
import { isSectionActive } from "@/shared/utils/cmsSection";
import { buildOccasionCardHref } from "@/features/jewellery-product/utils/occasionListing";
import { resolveAlankaraCollectionSection } from "@/shared/utils/resolveAlankaraCollectionSection";
import SeoSectionFallback from "@/shared/ui/SeoSectionFallback";

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
  const cms = useHomepageCmsPrefetched();
  const editorial = cms?.editorial;
  const shopping = cms?.shopping;
  const collectionData = shopping?.homepage?.featuredCollectionSection ?? shopping?.featuredCollectionSection;
  const collection = resolveAlankaraCollectionSection(collectionData);
  const occasions = editorial?.occasionSection;
  const featuredProducts = shopping?.homepage?.featuredProductsSection ?? shopping?.featuredProductsSection;
  const occasionLinks = (occasions?.occasions ?? []).flatMap((card) => {
    if (card.isActive === false || card.showField === false || !card.title?.trim()) return [];
    const href = buildOccasionCardHref({ ctaUrl: card.cta?.url ?? card.cta?.to });
    return href ? [{ href, label: card.title.trim() }] : [];
  });

  return (
    <>
      <LazyHomeSection
        featureName="DiamondSourcingSection"
        minHeight="bg-white"
        fallback={editorial?.diamondSourcingSection?.showField !== false && isSectionActive(editorial?.diamondSourcingSection?.isActive) ? (
          <SeoSectionFallback id="flawless" title={editorial?.diamondSourcingSection?.sectionTitle} />
        ) : undefined}
      >
        <DiamondSourcingSection id="flawless" />
      </LazyHomeSection>

      <LazyHomeSection
        featureName="FeaturedCollectionSection"
        minHeight="bg-white"
        fallback={collectionData && isSectionActive(collectionData.isActive) ? (
          <SeoSectionFallback
            id="alankara"
            title={collection.title}
            description={collection.description}
            links={collection.collectionCta ? [{ href: collection.collectionCta.href, label: collection.collectionCta.label }] : []}
          />
        ) : undefined}
      >
        <FeaturedCollectionSection id="alankara" />
      </LazyHomeSection>

      <LazyHomeSection
        featureName="OccasionsTeaserSection"
        minHeight=""
        fallback={occasions && occasions.showField !== false && isSectionActive(occasions.isActive) ? (
          <SeoSectionFallback id="categories" title={occasions.sectionTitle} links={occasionLinks} />
        ) : undefined}
      >
        <OccasionsTeaserSection id="categories" />
      </LazyHomeSection>

      <LazyHomeSection
        featureName="FeaturedProductsSection"
        minHeight="min-h-[480px]"
        fallback={featuredProducts && featuredProducts.showField !== false && isSectionActive(featuredProducts.isActive) ? (
          <SeoSectionFallback
            id="diamond-awaits"
            title={featuredProducts.sectionTitle}
            description={featuredProducts.description}
            links={featuredProducts.cta?.url || featuredProducts.cta?.to ? [{
              href: featuredProducts.cta.url ?? featuredProducts.cta.to ?? "",
              label: featuredProducts.cta.label?.trim() || "Explore jewellery",
            }] : []}
          />
        ) : <FeaturedCarouselSkeleton />}
      >
        <FeaturedProductsSection id="diamond-awaits" />
      </LazyHomeSection>

      <LazyHomeSection featureName="ForYourValentineSection" minHeight="">
        <ForYourValentineSection id="valentine" />
      </LazyHomeSection>

      <LazyHomeSection
        featureName="SunnyPromiseSection"
        minHeight=""
        fallback={editorial?.sunnyPromiseSection?.showField !== false && isSectionActive(editorial?.sunnyPromiseSection?.isActive) ? (
          <SeoSectionFallback
            id="promise"
            title={editorial?.sunnyPromiseSection?.sectionTitle}
            description={editorial?.sunnyPromiseSection?.description}
            links={editorial?.sunnyPromiseSection?.cta?.url || editorial?.sunnyPromiseSection?.cta?.to ? [{
              href: editorial.sunnyPromiseSection.cta.url ?? editorial.sunnyPromiseSection.cta.to ?? "",
              label: editorial.sunnyPromiseSection.cta.label?.trim() || "Learn more",
            }] : []}
          />
        ) : undefined}
      >
        <SunnyPromiseSection id="promise" />
      </LazyHomeSection>

      <LazyHomeSection
        featureName="BespokeForYouSection"
        minHeight=""
        fallback={editorial?.bespokeForYouSection?.showField !== false && isSectionActive(editorial?.bespokeForYouSection?.isActive) ? (
          <SeoSectionFallback
            id="bespoke-for-you"
            title={editorial?.bespokeForYouSection?.sectionTitle}
            description={editorial?.bespokeForYouSection?.description}
            links={[editorial?.bespokeForYouSection?.primaryCta, editorial?.bespokeForYouSection?.secondaryCta].flatMap((cta) => {
              const href = cta?.url || cta?.to;
              return href ? [{ href, label: cta?.label?.trim() || "Explore bespoke jewellery" }] : [];
            })}
          />
        ) : undefined}
      >
        <BespokeForYouSection
          id="bespoke-for-you"
          pastCreations={pastCreations}
          featuredStories={featuredStories}
        />
      </LazyHomeSection>

      <LazyHomeSection
        featureName="DiamondsForEveryoneSection"
        minHeight=""
        fallback={editorial?.diamondsForEveryoneSection?.showField !== false && isSectionActive(editorial?.diamondsForEveryoneSection?.isActive) ? (
          <SeoSectionFallback
            id="diamonds-for-everyone"
            title={editorial?.diamondsForEveryoneSection?.sectionTitle}
            description={editorial?.diamondsForEveryoneSection?.description}
            links={editorial?.diamondsForEveryoneSection?.cta?.url || editorial?.diamondsForEveryoneSection?.cta?.to ? [{
              href: editorial.diamondsForEveryoneSection.cta.url ?? editorial.diamondsForEveryoneSection.cta.to ?? "",
              label: editorial.diamondsForEveryoneSection.cta.label?.trim() || "Learn more",
            }] : []}
          />
        ) : undefined}
      >
        <DiamondsForEveryoneSection id="diamonds-for-everyone" />
      </LazyHomeSection>

      {/* ScrollReveal transform on the wrapper breaks sticky + scroll-scrub in this section. */}
      <LazyHomeSection
        featureName="CraftsmanshipProcess"
        minHeight="min-h-[750px]"
        animate={false}
        fallback={editorial?.craftsmanshipSection?.showField !== false && isSectionActive(editorial?.craftsmanshipSection?.isActive) ? (
          <SeoSectionFallback id="craftsmanship" title={editorial?.craftsmanshipSection?.sectionTitle} />
        ) : undefined}
      >
        <CraftsmanshipProcess id="craftsmanship" />
      </LazyHomeSection>

      <LazyHomeSection
        featureName="ShowroomsSection"
        minHeight=""
        fallback={editorial?.showroomSection?.showField !== false && isSectionActive(editorial?.showroomSection?.isActive) ? (
          <SeoSectionFallback
            id="showrooms"
            title={editorial?.showroomSection?.sectionTitle}
            description={editorial?.showroomSection?.description}
            links={[{ href: "/store-locator", label: "Find a showroom" }]}
          />
        ) : undefined}
      >
        <ShowroomsSection id="showrooms" />
      </LazyHomeSection>
    </>
  );
}
