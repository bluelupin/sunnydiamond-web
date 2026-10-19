"use client";

import dynamic from "next/dynamic";
import type {
  NormalizedAboutCraft,
  NormalizedAboutLegacy,
  NormalizedAboutTeam,
  NormalizedAboutTimeline,
} from "@/services/about/about-page.types";
import AboutFacesSkeleton from "./skeletons/AboutFacesSkeleton";
import AboutHandcraftedSkeleton from "./skeletons/AboutHandcraftedSkeleton";
import AboutSince1997Skeleton from "./skeletons/AboutSince1997Skeleton";
import AboutTimelineSkeleton from "./skeletons/AboutTimelineSkeleton";
import { LazyInView } from "@/shared/ui/LazyInView";

const ABOUT_LAZY_ROOT_MARGIN = "240px 0px 240px 0px";

const AboutSince1997Section = dynamic(
  () => import("./AboutSince1997Section"),
  { loading: () => <AboutSince1997Skeleton /> },
);

const AboutFacesSection = dynamic(() => import("./AboutFacesSection"), {
  loading: () => <AboutFacesSkeleton />,
});

const AboutHandcraftedSection = dynamic(
  () => import("./AboutHandcraftedSection"),
  { loading: () => <AboutHandcraftedSkeleton /> },
);

const AboutTimelineSection = dynamic(
  () => import("./AboutTimelineSection"),
  { loading: () => <AboutTimelineSkeleton /> },
);

type AboutBelowFoldLazyProps = {
  legacy: NormalizedAboutLegacy | null;
  team: NormalizedAboutTeam | null;
  craft: NormalizedAboutCraft | null;
  timeline: NormalizedAboutTimeline | null;
};

const AboutBelowFoldLazy = ({
  legacy,
  team,
  craft,
  timeline,
}: AboutBelowFoldLazyProps) => (
  <>
    {legacy ? (
      <LazyInView fallback={<AboutSince1997Skeleton />} rootMargin={ABOUT_LAZY_ROOT_MARGIN}>
        <AboutSince1997Section {...legacy} />
      </LazyInView>
    ) : null}
    {team ? (
      <LazyInView fallback={<AboutFacesSkeleton />} rootMargin={ABOUT_LAZY_ROOT_MARGIN}>
        <AboutFacesSection {...team} />
      </LazyInView>
    ) : null}
    {craft ? (
      <LazyInView fallback={<AboutHandcraftedSkeleton />} rootMargin={ABOUT_LAZY_ROOT_MARGIN}>
        <AboutHandcraftedSection
          {...craft}
          showTimelineScrollLine={Boolean(timeline)}
        />
      </LazyInView>
    ) : null}
    {timeline ? (
      <LazyInView fallback={<AboutTimelineSkeleton />} rootMargin={ABOUT_LAZY_ROOT_MARGIN}>
        <AboutTimelineSection {...timeline} />
      </LazyInView>
    ) : null}
  </>
);

export default AboutBelowFoldLazy;
