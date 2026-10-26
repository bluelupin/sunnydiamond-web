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
import AboutLazyInView from "./AboutLazyInView";
import SeoSectionFallback from "@/shared/ui/SeoSectionFallback";

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
      <AboutLazyInView fallback={<SeoSectionFallback title={legacy.title} description={legacy.story} />}>
        <AboutSince1997Section {...legacy} />
      </AboutLazyInView>
    ) : null}
    {team ? (
      <AboutLazyInView fallback={<SeoSectionFallback title={team.title} description={team.description} />}>
        <AboutFacesSection {...team} />
      </AboutLazyInView>
    ) : null}
    {craft ? (
      <AboutLazyInView fallback={<SeoSectionFallback title={craft.title} />}>
        <AboutHandcraftedSection
          {...craft}
          showTimelineScrollLine={Boolean(timeline)}
        />
      </AboutLazyInView>
    ) : null}
    {timeline ? (
      <AboutLazyInView fallback={<SeoSectionFallback
        title="Sunny Diamonds timeline"
        description={timeline.milestones.map((milestone) => `${milestone.year}: ${milestone.title}`).join(" · ")}
      />}>
        <AboutTimelineSection {...timeline} />
      </AboutLazyInView>
    ) : null}
  </>
);

export default AboutBelowFoldLazy;
