"use client";

import dynamic from "next/dynamic";
import type {
  NormalizedBrandTagline,
  NormalizedTrustBadge,
} from "@/services/about/about-page.types";
import AboutGuaranteesSkeleton from "./skeletons/AboutGuaranteesSkeleton";
import AboutHeirloomSkeleton from "./skeletons/AboutHeirloomSkeleton";
import AboutLazyInView from "./AboutLazyInView";

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
      <AboutLazyInView fallback={<AboutGuaranteesSkeleton />}>
        <AboutGuaranteesBar badges={trustBadges} />
      </AboutLazyInView>
    ) : null}
    {brandTagline ? (
      <AboutLazyInView fallback={<AboutHeirloomSkeleton />}>
        <AboutHeirloomQuoteSection {...brandTagline} />
      </AboutLazyInView>
    ) : null}
  </>
);

export default AboutFooterLazy;
