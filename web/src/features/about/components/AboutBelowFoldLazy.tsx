"use client";

import dynamic from "next/dynamic";
import type {
  NormalizedAboutCraft,
  NormalizedAboutLegacy,
  NormalizedAboutTeam,
  NormalizedAboutTimeline,
  NormalizedBrillianceSection,
} from "@/services/about/about-page.types";
import AboutBrillianceSkeleton from "./skeletons/AboutBrillianceSkeleton";
import AboutFacesSkeleton from "./skeletons/AboutFacesSkeleton";
import AboutHandcraftedSkeleton from "./skeletons/AboutHandcraftedSkeleton";
import AboutSince1997Skeleton from "./skeletons/AboutSince1997Skeleton";
import AboutTimelineSkeleton from "./skeletons/AboutTimelineSkeleton";

const AboutBrillianceSection = dynamic(() => import("./AboutBrillianceSection"), {
  loading: () => <AboutBrillianceSkeleton />,
});

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
  brillianceSection: NormalizedBrillianceSection | null;
  legacy: NormalizedAboutLegacy | null;
  team: NormalizedAboutTeam | null;
  craft: NormalizedAboutCraft | null;
  timeline: NormalizedAboutTimeline | null;
};

const AboutBelowFoldLazy = ({
  brillianceSection,
  legacy,
  team,
  craft,
  timeline,
}: AboutBelowFoldLazyProps) => (
  <>
    {brillianceSection ? <AboutBrillianceSection {...brillianceSection} /> : null}
    {legacy ? <AboutSince1997Section {...legacy} /> : null}
    {team ? <AboutFacesSection {...team} /> : null}
    {craft ? <AboutHandcraftedSection {...craft} /> : null}
    {timeline ? <AboutTimelineSection {...timeline} /> : null}
  </>
);

export default AboutBelowFoldLazy;
