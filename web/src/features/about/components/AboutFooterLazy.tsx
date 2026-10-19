"use client";

import dynamic from "next/dynamic";
import type {
  NormalizedBrandTagline,
  NormalizedTrustBadge,
} from "@/services/about/about-page.types";
import AboutGuaranteesSkeleton from "./skeletons/AboutGuaranteesSkeleton";
import AboutHeirloomSkeleton from "./skeletons/AboutHeirloomSkeleton";
import { LazyInView } from "@/shared/ui/LazyInView";

const ABOUT_LAZY_ROOT_MARGIN = "240px 0px 240px 0px";

const AboutGuaranteesBar = dynamic(() => import("./AboutGuaranteesBar"), {
  loading: () => <AboutGuaranteesSkeleton />,
});

const AboutHeirloomQuoteSection = dynamic(() => import("./AboutHeirloomQuoteSection"), {
  loading: () => <AboutHeirloomSkeleton />,
});

type AboutFooterLazyProps = {
  trustBadges: NormalizedTrustBadge[] | null;
  brandTagline: NormalizedBrandTagline | null;
};

/** Page-footer sections — below timeline/craft on /world-of-sunny. */
const AboutFooterLazy = ({ trustBadges, brandTagline }: AboutFooterLazyProps) => (
  <>
    {trustBadges ? (
      <LazyInView fallback={<AboutGuaranteesSkeleton />} rootMargin={ABOUT_LAZY_ROOT_MARGIN}>
        <AboutGuaranteesBar badges={trustBadges} />
      </LazyInView>
    ) : null}
    {brandTagline ? (
      <LazyInView fallback={<AboutHeirloomSkeleton />} rootMargin={ABOUT_LAZY_ROOT_MARGIN}>
        <AboutHeirloomQuoteSection {...brandTagline} />
      </LazyInView>
    ) : null}
  </>
);

export default AboutFooterLazy;
